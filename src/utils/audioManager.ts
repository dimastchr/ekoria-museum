/**
 * Centralized Audio & Speech Manager for EkoRia Museum
 * Provides:
 * 1. Narration with Gemini TTS (cheerful child voice) fetched from the server
 *    endpoint POST /api/tts. No device speechSynthesis fallback: if TTS fails,
 *    narration stays silent and the error is logged to the console.
 * 2. Auto-narration toggle and active text tracking
 * 3. One global mute switch (persisted in localStorage) that silences
 *    narration, Ozi auto-speech, ambience and sound effects at once
 * 4. Procedural Web Audio API soundscapes for 4 habitats (Hutan, Sungai, Laut, Sawah)
 * 5. Light cheerful sound effects for children (Success chime, discovery, click, cheer)
 */

const STORAGE_KEY_MUTED = 'ekoria_muted_v1';

type HabitatType = 'hutan' | 'sungai' | 'laut' | 'sawah' | 'padang' | 'alam' | 'none';

// 0.05 s of silence (8 kHz, 8-bit mono WAV) used to unlock audio playback on the first tap.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

class MuseumAudioManager {
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeGenerators: Array<{ stop: () => void }> = [];

  private currentHabitat: HabitatType = 'none';
  private isMuted: boolean = false;
  private autoNarrate: boolean = true;
  private volume: number = 0.85;
  private isSpeaking: boolean = false;
  private activeSpeakingText: string = '';
  private speechListeners: Array<(speaking: boolean, text?: string) => void> = [];
  private muteListeners: Array<(muted: boolean) => void> = [];

  // Gemini TTS playback state
  private currentAudio: HTMLAudioElement | null = null;
  // One reusable <audio> element for Ozi's voice. It is "unlocked" during the first
  // tap/click, so iPad/iPhone Safari and Chrome on Android allow it to play the TTS
  // answer later, after the (slow) network request has finished.
  private speechEl: HTMLAudioElement | null = null;
  private speechElUnlocked = false;
  private currentAbort: AbortController | null = null;
  private currentOnEnd: (() => void) | null = null;
  private speechToken: number = 0;
  private ttsUrlCache: Map<string, string> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // Load saved auto-narrate preference
        const savedAuto = localStorage.getItem('ekoria_auto_narrate');
        if (savedAuto !== null) {
          this.autoNarrate = savedAuto === 'true';
        }
        // Load saved global mute preference
        this.isMuted = localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
      } catch {
        // localStorage may be unavailable (private mode); keep defaults
      }
    }
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.masterGain = this.audioCtx.createGain();
        this.ambientGain = this.audioCtx.createGain();
        this.sfxGain = this.audioCtx.createGain();

        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
        this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);

        this.ambientGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.unlockSpeechElement();
  }

  /** Must run inside a user gesture (initAudio is called from playClick etc.). */
  private unlockSpeechElement() {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;
    if (!this.speechEl) {
      this.speechEl = new Audio();
      this.speechEl.preload = 'auto';
    }
    if (this.speechElUnlocked || this.isSpeaking) return;
    this.speechElUnlocked = true;
    try {
      const el = this.speechEl;
      el.muted = true;
      el.src = SILENT_WAV;
      const p = el.play();
      const done = () => {
        // Only stop the silent clip, never real speech that started in the meantime
        if (el.src === SILENT_WAV) {
          try { el.pause(); } catch {}
          el.muted = false;
        }
      };
      if (p && typeof p.then === 'function') p.then(done, () => { el.muted = false; this.speechElUnlocked = false; });
      else done();
    } catch {
      this.speechElUnlocked = false;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) this.currentAudio.volume = this.volume;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(muted));
    } catch {}
    if (this.masterGain && this.audioCtx) {
      // Silences ambience + SFX immediately (both run through masterGain)
      this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.audioCtx.currentTime);
    }
    if (muted) {
      // Stop any narration / Ozi speech right now, including a TTS request still loading
      this.stopNarration();
    } else {
      this.initAudio();
    }
    this.muteListeners.forEach((fn) => fn(muted));
  }

  public addMuteListener(fn: (muted: boolean) => void) {
    this.muteListeners.push(fn);
  }

  public removeMuteListener(fn: (muted: boolean) => void) {
    this.muteListeners = this.muteListeners.filter((l) => l !== fn);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isAutoNarrate(): boolean {
    return this.autoNarrate;
  }

  public toggleAutoNarrate(): boolean {
    this.autoNarrate = !this.autoNarrate;
    localStorage.setItem('ekoria_auto_narrate', String(this.autoNarrate));
    if (!this.autoNarrate) {
      this.stopNarration();
    }
    return this.autoNarrate;
  }

  /** Kept for API compatibility: narration now uses Gemini TTS (always Indonesian). */
  public hasIndonesianVoice(): boolean {
    return true;
  }

  // --- AMBIENT PROCEDURAL SOUNDSCAPES ---
  public playHabitatAmbient(habitat: HabitatType) {
    this.initAudio();
    if (this.currentHabitat === habitat) return;
    this.stopHabitatAmbient();
    this.currentHabitat = habitat;

    if (!this.audioCtx || !this.ambientGain || habitat === 'none') return;

    if (habitat === 'hutan' || habitat === 'alam') {
      this.startForestAmbient();
    } else if (habitat === 'sungai') {
      this.startRiverAmbient();
    } else if (habitat === 'laut') {
      this.startOceanAmbient();
    } else if (habitat === 'sawah' || habitat === 'padang') {
      this.startFieldAmbient();
    }
  }

  public playAmbient(habitat: HabitatType) {
    this.playHabitatAmbient(habitat);
  }

  public stopHabitatAmbient() {
    this.activeGenerators.forEach((g) => {
      try {
        g.stop();
      } catch {}
    });
    this.activeGenerators = [];
    this.currentHabitat = 'none';
  }

  public stopAmbient() {
    this.stopHabitatAmbient();
  }

  private startForestAmbient() {
    if (!this.audioCtx || !this.ambientGain) return;
    const ctx = this.audioCtx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);
    whiteNoise.start();

    const timer = window.setInterval(() => {
      if (this.currentHabitat !== 'hutan' || this.isMuted) return;
      this.playBirdChirp();
    }, 4500);

    this.activeGenerators.push({
      stop: () => {
        clearInterval(timer);
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch {}
      }
    });
  }

  private playBirdChirp() {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, now + 0.15);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  private startRiverAmbient() {
    if (!this.audioCtx || !this.ambientGain) return;
    const ctx = this.audioCtx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(550, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);

    noiseSource.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.ambientGain);
    noiseSource.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {}
      }
    });
  }

  private startOceanAmbient() {
    if (!this.audioCtx || !this.ambientGain) return;
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start();
    lfo.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          osc.stop();
          lfo.stop();
          osc.disconnect();
          lfo.disconnect();
        } catch {}
      }
    });
  }

  private startFieldAmbient() {
    if (!this.audioCtx || !this.ambientGain) return;
    const ctx = this.audioCtx;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4200, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(14, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.012, ctx.currentTime);

    lfo.connect(gain.gain);
    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start();
    lfo.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          osc.stop();
          lfo.stop();
          osc.disconnect();
          lfo.disconnect();
        } catch {}
      }
    });
  }

  // --- SOUND EFFECTS ---
  public playClick() {
    this.initAudio();
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playSuccessChime() {
    this.initAudio();
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const now = ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  public playDiscoveryChime() {
    this.initAudio();
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const now = ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.14, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  public playErrorSound() {
    this.initAudio();
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);

    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  // --- NARRATION SPEECH (GEMINI TTS, CHEERFUL CHILD VOICE) ---
  private cleanForSpeech(text: string): string {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/[→➔➜]/g, ' dimakan oleh ')
      .replace(/\bIPAS\b/gi, 'Ipas')
      .replace(/\bSD\b/g, 'Sekolah Dasar')
      .replace(/\bXP\b/gi, 'poin pengalaman')
      .replace(/\bvs\b/gi, 'melawan')
      .replace(/Bab 3/gi, 'Bab Tiga')
      .replace(/[*#_`]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private async fetchTtsUrl(cleanText: string, signal: AbortSignal): Promise<string> {
    const cached = this.ttsUrlCache.get(cleanText);
    if (cached) return cached;
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
      signal
    });
    if (!response.ok) {
      throw new Error(`TTS HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    this.ttsUrlCache.set(cleanText, url);
    // Keep the browser-side cache small
    if (this.ttsUrlCache.size > 60) {
      const oldestKey = this.ttsUrlCache.keys().next().value;
      if (oldestKey !== undefined) {
        const oldUrl = this.ttsUrlCache.get(oldestKey);
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        this.ttsUrlCache.delete(oldestKey);
      }
    }
    return url;
  }

  private restoreAmbient() {
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    }
  }

  private finishSpeech(token: number) {
    if (token !== this.speechToken) return;
    const onEnd = this.currentOnEnd;
    this.currentOnEnd = null;
    this.currentAudio = null;
    this.currentAbort = null;
    this.isSpeaking = false;
    this.activeSpeakingText = '';
    this.restoreAmbient();
    this.notifySpeechListeners(false);
    if (onEnd) onEnd();
  }

  public speakNarration(text: string, onEnd?: () => void) {
    // Cancel whatever is playing or loading first
    this.stopNarration();

    if (this.isMuted || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = this.cleanForSpeech(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    this.initAudio();
    const token = ++this.speechToken;
    const abort = new AbortController();
    this.currentAbort = abort;
    this.currentOnEnd = onEnd || null;
    this.isSpeaking = true;
    this.activeSpeakingText = text;
    this.notifySpeechListeners(true, text);

    // Duck ambient sound during narration
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    }

    this.fetchTtsUrl(cleanText, abort.signal)
      .then((url) => {
        if (token !== this.speechToken || this.isMuted) return;
        const audio = this.speechEl || new Audio();
        audio.muted = false;
        audio.src = url;
        audio.volume = this.volume;
        this.currentAudio = audio;
        audio.onended = () => this.finishSpeech(token);
        audio.onerror = () => {
          console.warn('[EkoRia TTS] Audio playback error');
          this.finishSpeech(token);
        };
        return audio.play().catch((err) => {
          console.warn('[EkoRia TTS] Browser blocked or failed audio playback:', err);
          this.finishSpeech(token);
        });
      })
      .catch((err) => {
        if (abort.signal.aborted) return;
        // No device speechSynthesis fallback on purpose: stay silent
        console.warn('[EkoRia TTS] Narration unavailable, staying silent:', err);
        this.finishSpeech(token);
      });
  }

  public stopNarration() {
    // Invalidate any pending request/playback
    this.speechToken++;
    if (this.currentAbort) {
      try {
        this.currentAbort.abort();
      } catch {}
      this.currentAbort = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    this.currentOnEnd = null;
    const wasSpeaking = this.isSpeaking;
    this.isSpeaking = false;
    this.activeSpeakingText = '';
    this.restoreAmbient();
    if (wasSpeaking) this.notifySpeechListeners(false);
  }

  // Ergonomic aliases
  public speak(text: string, onEnd?: () => void) {
    this.speakNarration(text, onEnd);
  }

  public stopSpeaking() {
    this.stopNarration();
  }

  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getActiveSpeakingText(): string {
    return this.activeSpeakingText;
  }

  public addSpeechListener(fn: (speaking: boolean, text?: string) => void) {
    this.speechListeners.push(fn);
  }

  public removeSpeechListener(fn: (speaking: boolean, text?: string) => void) {
    this.speechListeners = this.speechListeners.filter((l) => l !== fn);
  }

  private notifySpeechListeners(speaking: boolean, text?: string) {
    this.speechListeners.forEach((l) => l(speaking, text));
  }
}

export const audioManager = new MuseumAudioManager();
