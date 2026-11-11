import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, X, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

export type EcoBotPose = 'senang' | 'berpikir' | 'kagum' | 'menyemangati' | 'bicara';

interface EcoBotGuideProps {
  speechText: string;
  guidingQuestion?: string;
  pose?: EcoBotPose;
  locationName?: string;
  autoPlayAudio?: boolean;
  onAskEcoBot?: (question: string) => void;
}

export const EcoBotGuide: React.FC<EcoBotGuideProps> = ({
  speechText,
  guidingQuestion,
  pose = 'senang',
  locationName,
  autoPlayAudio = false,
  onAskEcoBot
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentPose, setCurrentPose] = useState<EcoBotPose>(pose);
  const [activeSpeakingText, setActiveSpeakingText] = useState('');

  useEffect(() => {
    setCurrentPose(pose);
  }, [pose]);

  useEffect(() => {
    const handleSpeech = (speaking: boolean, text?: string) => {
      setIsPlayingVoice(speaking);
      setActiveSpeakingText(speaking ? text || '' : '');
      if (speaking) {
        setCurrentPose('bicara');
      } else {
        setCurrentPose(pose);
      }
    };
    audioManager.addSpeechListener(handleSpeech);
    return () => {
      audioManager.removeSpeechListener(handleSpeech);
    };
  }, [pose]);

  // Autoplay narration if enabled in settings
  useEffect(() => {
    if (autoPlayAudio && speechText && audioManager.isAutoNarrate()) {
      const timer = setTimeout(() => {
        audioManager.speakNarration(speechText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [speechText, autoPlayAudio]);

  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      audioManager.stopNarration();
    } else {
      audioManager.speakNarration(speechText);
    }
  };

  const handleReplay = () => {
    audioManager.stopNarration();
    audioManager.speakNarration(speechText);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          audioManager.playClick();
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-full bg-[#1E7A50] hover:bg-[#16603F] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-emerald-300 cursor-pointer min-h-[48px]"
        title="Buka Pemandu Ozi"
      >
        <span className="text-2xl animate-bounce">🌱</span>
        <span className="text-base font-bold tracking-wide">Panggil Ozi</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 max-w-[94vw] sm:max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#FFFDF9] border-3 border-[#1E7A50] rounded-3xl shadow-2xl shadow-emerald-950/20 overflow-hidden text-[#1F2D3D]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#EAF7EF] border-b-2 border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-sm font-bold text-[#1E7A50] uppercase tracking-wider font-['Outfit']">
              Ozi · Robot Pemandu Sains
            </span>
            {locationName && (
              <span className="text-xs text-slate-600 font-medium">
                di {locationName}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              audioManager.playClick();
              setIsOpen(false);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-emerald-100 cursor-pointer transition-colors"
            title="Tutup Pemandu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot & Speech Bubble */}
        <div className="p-4 sm:p-5 flex gap-4 items-start">
          
          {/* Cute Sprout Leaf Robot Mascot (SVG) */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-b from-[#E8F8EE] to-[#C8EED7] border-2 border-[#1E7A50] p-1 flex items-center justify-center shadow-md">
              
              {/* Sprout Leaf Antenna */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl animate-leaf select-none">
                🌱
              </div>

              {/* Robot Face Screen */}
              <div className="w-full h-full rounded-2xl bg-[#0F291E] flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Big Round Anime Eyes with Highlights */}
                <div className="flex gap-2.5 items-center mb-1">
                  {currentPose === 'kagum' ? (
                    <>
                      <div className="text-amber-300 text-sm font-bold animate-spin">★</div>
                      <div className="text-amber-300 text-sm font-bold animate-spin">★</div>
                    </>
                  ) : currentPose === 'berpikir' ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-300 flex items-start justify-end p-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </>
                  ) : (
                    <>
                      <div className={`w-3.5 h-4 rounded-full bg-emerald-300 flex items-start justify-start p-0.5 ${isPlayingVoice ? 'animate-bounce' : ''}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div className={`w-3.5 h-4 rounded-full bg-emerald-300 flex items-start justify-start p-0.5 ${isPlayingVoice ? 'animate-bounce' : ''}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </>
                  )}
                </div>

                {/* Rosy Blush Cheeks */}
                <div className="flex justify-between w-9 px-0.5 -mt-0.5">
                  <div className="w-2 h-1 rounded-full bg-rose-400/80" />
                  <div className="w-2 h-1 rounded-full bg-rose-400/80" />
                </div>

                {/* Mouth Expression */}
                {isPlayingVoice ? (
                  <div className="w-4 h-2 bg-emerald-200 rounded-full animate-pulse mt-0.5" />
                ) : currentPose === 'senang' || currentPose === 'menyemangati' ? (
                  <div className="w-3.5 h-1.5 border-b-2 border-emerald-300 rounded-full mt-0.5" />
                ) : (
                  <div className="w-2.5 h-0.5 bg-emerald-300/80 rounded mt-0.5" />
                )}
              </div>
            </div>

            <span className="mt-1 text-[11px] font-bold text-[#1E7A50]">
              {isPlayingVoice ? 'Membacakan...' : 'Ozi'}
            </span>
          </div>

          {/* Speech Text Content */}
          <div className="flex-1 min-w-0">
            <div className={`text-base sm:text-lg leading-relaxed font-medium transition-colors ${
              isPlayingVoice ? 'text-[#1E7A50] font-semibold' : 'text-[#1F2D3D]'
            }`}>
              {speechText}
            </div>

            {guidingQuestion && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#EAF7EF] border border-[#1E7A50]/30 text-sm sm:text-base text-[#1E7A50] leading-normal font-semibold">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#16603F] mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Tantangan Pengamatan:
                </div>
                "{guidingQuestion}"
              </div>
            )}

            {/* Action Bar (Min 48px buttons) */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors min-h-[42px] ${
                    isPlayingVoice
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-[#1E7A50] text-white hover:bg-[#16603F]'
                  }`}
                  title="Dengarkan Suara Ozi"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingVoice ? 'Jeda Suara' : 'Dengarkan'}</span>
                </button>

                <button
                  onClick={handleReplay}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                  title="Ulangi Suara"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {onAskEcoBot && guidingQuestion && (
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onAskEcoBot(guidingQuestion);
                  }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1C5FC4] hover:underline cursor-pointer py-1"
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  Tanya Ozi
                </button>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
