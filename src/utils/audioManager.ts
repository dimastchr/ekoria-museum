/**
 * Centralized Audio & Speech Manager for EkoRia Museum
 * Provides:
 * 1. Web Speech API narration in Bahasa Indonesia (rate: 0.9, pitch: 1.1)
 * 2. Auto-narration toggle and active text tracking
 * 3. Fallback notification if id-ID voice is missing without throwing error
 * 4. Procedural Web Audio API soundscapes for 4 habitats (Hutan, Sungai, Laut, Sawah)
 * 5. Light cheerful sound effects for children (Success chime, discovery, click, cheer)
 */

type HabitatType = 'hutan' | 'sungai' | 'laut' | 'sawah' | 'padang' | 'alam' | 'none';

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
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechListeners: Array<(speaking: boolean, text?: string) => void> = [];
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
      };
      // Load saved auto-narrate preference
      const savedAuto = localStorage.getItem('ekoria_auto_narrate');
      if (savedAuto !== null) {
        this.autoNarrate = savedAuto === 'true';
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
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
    if (this.isMuted && this.isSpeaking) {
      this.stopNarration();
    }
    return this.isMuted;
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

  public hasIndonesianVoice(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    const voices = window.speechSynthesis.getVoices();
    return voices.some((v) => v.lang.toLowerCase().includes('id'));
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

  // --- NARRATION SPEECH (NATURAL CHEERFUL INDONESIAN CHILD/MASCOT VOICE) ---
  public speakNarration(text: string, onEnd?: () => void) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Stop old narration immediately
    window.speechSynthesis.cancel();

    // Play cute mascot chime cue
    this.playBirdChirp();

    // Duck ambient sound slightly during narration
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    }

    // Clean text & expand abbreviations for natural Indonesian speech
    let cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/→/g, ' dimakan oleh ')
      .replace(/➔/g, ' dimakan oleh ')
      .replace(/IPAS/gi, 'Ipas')
      .replace(/SD/g, 'Sekolah Dasar')
      .replace(/XP/gi, 'poin pengalaman')
      .replace(/vs/gi, 'melawan')
      .replace(/Bab 3/gi, 'Bab Tiga')
      .replace(/\*/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Lively, clear speed for elementary students
    utterance.pitch = 1.25; // Cheerful, bright, cute mascot pitch

    // Prioritize high-quality Indonesian female/child/natural voices
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoices = voices.filter((v) => 
      v.lang.toLowerCase().includes('id') || v.lang.toLowerCase().includes('ind')
    );

    const friendlyVoice =
      indonesianVoices.find((v) =>
        /gadis|indah|natural|female|wita|google|microsoft/i.test(v.name)
      ) || indonesianVoices[0];

    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    this.currentUtterance = utterance;
    this.isSpeaking = true;
    this.activeSpeakingText = text;
    this.notifySpeechListeners(true, text);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.activeSpeakingText = '';
      this.currentUtterance = null;
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      }
      this.notifySpeechListeners(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.activeSpeakingText = '';
      this.currentUtterance = null;
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      }
      this.notifySpeechListeners(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.activeSpeakingText = '';
    this.currentUtterance = null;
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    }
    this.notifySpeechListeners(false);
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
