import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface SoundToggleProps {
  /** Visual style: 'dark' for dark headers, 'light' for light headers. */
  variant?: 'dark' | 'light';
  className?: string;
  showLabel?: boolean;
}

/**
 * One global sound switch. Muting stops narration (Gemini TTS) immediately,
 * silences Ozi's auto-speech, ambience and sound effects. The state is saved in
 * localStorage by audioManager, and every SoundToggle on screen stays in sync.
 */
export const SoundToggle: React.FC<SoundToggleProps> = ({ variant = 'dark', className = '', showLabel = false }) => {
  const [muted, setMuted] = useState<boolean>(audioManager.getIsMuted());

  useEffect(() => {
    const onChange = (m: boolean) => setMuted(m);
    audioManager.addMuteListener(onChange);
    setMuted(audioManager.getIsMuted());
    return () => audioManager.removeMuteListener(onChange);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !audioManager.getIsMuted();
    audioManager.setMuted(nextMuted);
    if (!nextMuted) audioManager.playClick();
  };

  const base =
    variant === 'dark'
      ? muted
        ? 'bg-rose-500/90 text-white border-rose-300'
        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
      : muted
      ? 'bg-rose-50 text-rose-700 border-rose-300'
      : 'bg-white hover:bg-[#F6F1E3] text-[#0F3D2E] border-[#E8DEC9]';

  const label = muted ? 'Suara mati. Ketuk untuk menyalakan suara' : 'Suara menyala. Ketuk untuk mematikan suara';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={muted}
      title={muted ? 'Suara Mati' : 'Suara Menyala'}
      className={`min-h-[40px] min-w-[40px] px-2 flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${base} ${className}`}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {showLabel && <span>{muted ? 'Suara Mati' : 'Suara Nyala'}</span>}
    </button>
  );
};
