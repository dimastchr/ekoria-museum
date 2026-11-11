import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface SoundToggleProps {
  /** Visual style: 'dark' for dark headers, 'light' for light headers. */
  variant?: 'dark' | 'light';
  className?: string;
  showLabel?: boolean;
  /** 'md' = 44px tap target (default), 'lg' = 56px wide button for menus. */
  size?: 'md' | 'lg';
}

/**
 * One global sound switch. Muting stops narration (Gemini TTS) immediately,
 * silences Ozi's auto-speech, ambience and sound effects. The state is saved in
 * localStorage by audioManager, and every SoundToggle on screen stays in sync.
 */
export const SoundToggle: React.FC<SoundToggleProps> = ({ variant = 'dark', className = '', showLabel = false, size = 'md' }) => {
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
      className={`${
        size === 'lg' ? 'min-h-[56px] px-4 gap-2 text-base rounded-2xl' : 'min-h-[44px] min-w-[44px] px-2.5 gap-1.5 text-xs rounded-xl'
      } flex items-center justify-center border font-bold transition cursor-pointer ${base} ${className}`}
    >
      {muted ? <VolumeX className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} /> : <Volume2 className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />}
      {showLabel && <span>{muted ? 'Suara Mati' : 'Suara Nyala'}</span>}
    </button>
  );
};
