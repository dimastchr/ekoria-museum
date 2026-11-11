import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Compass, 
  FlaskConical, 
  Gamepad2, 
  Award, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { StudentProfile, StudentProgress, ViewState } from '../../types';

interface TopNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  activeUser: StudentProfile | null;
  progress: StudentProgress;
  onOpenLogin: () => void;
  onOpenEcoBot: () => void;
  onOpenTeacherLogin?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  activeUser,
  progress,
  onOpenLogin,
  onOpenEcoBot,
  onOpenTeacherLogin
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.getIsMuted());
  const [autoNarrate, setAutoNarrate] = useState(audioManager.isAutoNarrate());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<string>('saved-cloud');

  useEffect(() => {
    const handleSpeechChange = (speaking: boolean) => {
      setIsSpeaking(speaking);
    };
    audioManager.addSpeechListener(handleSpeechChange);

    // Subscribe to cloud sync status
    let unsubscribeCloud: (() => void) | undefined;
    import('../../services/firestoreService').then(({ firestoreService }) => {
      unsubscribeCloud = firestoreService.subscribeStatus((st) => {
        setCloudStatus(st);
      });
    }).catch(() => {});

    return () => {
      audioManager.removeSpeechListener(handleSpeechChange);
      if (unsubscribeCloud) unsubscribeCloud();
    };
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleAutoNarrate = () => {
    const nextAuto = audioManager.toggleAutoNarrate();
    setAutoNarrate(nextAuto);
  };

  const isHomeActive = currentView === 'main-hall';
  const isExhibitsActive = currentView === 'room-view';
  const isLabActive = ['simulation', 'decomposer', 'food-web', 'terrarium'].includes(currentView);
  const isQuizActive = ['pretest', 'posttest'].includes(currentView);
  const isBadgesActive = currentView === 'certificate';

  return (
    <>
      {/* Top Floating Large Capsule Navbar */}
      <header className="sticky top-3 z-40 w-full px-3 sm:px-6 max-w-7xl mx-auto transition-all">
        <div className="bg-[#0F2F57] text-white rounded-full shadow-2xl border-3 border-[#1A4273] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo with Leaf/Book + Two-Color Text */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('main-hall');
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
              title="Ke Beranda EkoRia Museum"
            >
              {/* Icon Daun & Buku */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#1E7A50] to-[#2ECC71] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl sm:text-2xl drop-shadow select-none">🌱</span>
              </div>
              
              {/* Two-Color Bold Rounded Typography */}
              <div className="flex items-baseline font-['Fredoka'] tracking-tight">
                <span className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  EkoRia
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FB8500] ml-1">
                  Museum
                </span>
              </div>
            </button>
          </div>

          {/* Desktop/Tablet Capsule Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            
            {/* 1. Beranda */}
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('main-hall');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm xl:text-base cursor-pointer transition-all duration-200 min-h-[44px] ${
                isHomeActive
                  ? 'bg-[#FFC21A] text-[#0F2F57] shadow-md font-black scale-102'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className={`w-4 h-4 ${isHomeActive ? 'text-[#0F2F57]' : 'text-slate-300'}`} />
              <span>Beranda</span>
            </button>

            {/* 2. Ruang Pameran */}
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('room-view');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm xl:text-base cursor-pointer transition-all duration-200 min-h-[44px] ${
                isExhibitsActive
                  ? 'bg-[#FFC21A] text-[#0F2F57] shadow-md font-black scale-102'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className={`w-4 h-4 ${isExhibitsActive ? 'text-[#0F2F57]' : 'text-slate-300'}`} />
              <span>Ruang Pameran</span>
            </button>

            {/* 3. Laboratorium */}
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('simulation');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm xl:text-base cursor-pointer transition-all duration-200 min-h-[44px] ${
                isLabActive
                  ? 'bg-[#FFC21A] text-[#0F2F57] shadow-md font-black scale-102'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <FlaskConical className={`w-4 h-4 ${isLabActive ? 'text-[#0F2F57]' : 'text-slate-300'}`} />
              <span>Laboratorium</span>
            </button>

            {/* 4. Kuis */}
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('pretest');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm xl:text-base cursor-pointer transition-all duration-200 min-h-[44px] ${
                isQuizActive
                  ? 'bg-[#FFC21A] text-[#0F2F57] shadow-md font-black scale-102'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 className={`w-4 h-4 ${isQuizActive ? 'text-[#0F2F57]' : 'text-slate-300'}`} />
              <span>Kuis</span>
            </button>

            {/* 5. Pencapaian */}
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('certificate');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm xl:text-base cursor-pointer transition-all duration-200 min-h-[44px] ${
                isBadgesActive
                  ? 'bg-[#FFC21A] text-[#0F2F57] shadow-md font-black scale-102'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className={`w-4 h-4 ${isBadgesActive ? 'text-[#0F2F57]' : 'text-slate-300'}`} />
              <span>Pencapaian</span>
            </button>

            {activeUser?.role === 'teacher' && (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigate('teacher-dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer transition-all ${
                  currentView === 'teacher-dashboard'
                    ? 'bg-amber-400 text-[#0F2F57] font-black'
                    : 'bg-white/15 text-amber-200 hover:bg-white/25'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Panel Guru</span>
              </button>
            )}
          </nav>

          {/* Right Action Zone: Tools & Student Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* EcoBot Quick Button */}
            <button
              onClick={() => {
                audioManager.playClick();
                onOpenEcoBot();
              }}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs sm:text-sm font-black cursor-pointer transition-transform hover:scale-105 shadow min-h-[40px]"
              title="Tanya Robot Pintar EcoBot"
            >
              <span className="text-base animate-bounce">🤖</span>
              <span className="hidden sm:inline font-['Fredoka']">EcoBot</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
              className={`p-2 rounded-full border border-white/20 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                isMuted
                  ? 'bg-rose-500/80 text-white'
                  : isSpeaking
                  ? 'bg-emerald-400 text-[#0F2F57] animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isMuted ? 'Suara Mati' : 'Suara Menyala'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Auto Narrate Toggle */}
            <button
              onClick={handleToggleAutoNarrate}
              aria-label={autoNarrate ? 'Matikan Suara Otomatis' : 'Nyalakan Suara Otomatis'}
              className={`p-2 rounded-full border border-white/20 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                autoNarrate
                  ? 'bg-[#FFC21A] text-[#0F2F57]'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
              title={autoNarrate ? 'Narasi Suara: AKTIF' : 'Narasi Suara: NONAKTIF'}
            >
              {autoNarrate ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Cloud Sync Status Indicator (Requirement 8) */}
            <div
              className="hidden md:flex items-center text-xs font-bold transition-all"
              title={
                cloudStatus === 'saved-cloud'
                  ? 'Kemajuanmu tersimpan aman di internet'
                  : cloudStatus === 'waiting-internet'
                  ? 'Menunggu koneksi internet untuk sinkronisasi'
                  : 'Sedang menyimpan kemajuanmu ke internet...'
              }
            >
              {cloudStatus === 'saved-cloud' && (
                <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 border border-emerald-400/30 px-2.5 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden xl:inline">Tersimpan daring</span> ✓
                </span>
              )}
              {cloudStatus === 'waiting-internet' && (
                <span className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Menunggu internet
                </span>
              )}
              {cloudStatus === 'syncing' && (
                <span className="flex items-center gap-1.5 text-sky-300 bg-sky-950/60 border border-sky-400/30 px-2.5 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  Menyimpan...
                </span>
              )}
            </div>

            {/* Student Avatar Capsule (Avatar kartun bulat, nickname, "Kelas V", panah dropdown) */}
            <button
              onClick={() => {
                audioManager.playClick();
                onOpenLogin();
              }}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer transition-all min-h-[42px] group"
              title="Klik untuk mengganti profil atau mengatur akun"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFC21A] to-[#FB8500] text-slate-900 flex items-center justify-center text-lg font-bold shadow">
                {activeUser?.avatar || '👦'}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-black font-['Fredoka'] text-white group-hover:text-[#FFC21A] transition-colors truncate max-w-[90px]">
                  {activeUser ? activeUser.fullName.split(' ')[0] : 'Siswa'}
                </div>
                <div className="text-[10px] text-amber-200/90 font-bold">
                  {activeUser?.role === 'teacher' ? 'Guru' : 'Kelas V'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Requirement 9) */}
      <nav 
        aria-label="Menu Navigasi Ponsel" 
        className="lg:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#0F2F57]/95 backdrop-blur-md rounded-full shadow-2xl border-2 border-white/25 px-2 py-2 flex items-center justify-around"
      >
        {/* 1. Beranda */}
        <button
          onClick={() => {
            audioManager.playClick();
            onNavigate('main-hall');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all min-w-[58px] ${
            isHomeActive
              ? 'bg-[#FFC21A] text-[#0F2F57] font-black shadow-md scale-105'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Fredoka']">Beranda</span>
        </button>

        {/* 2. Ruang Pameran */}
        <button
          onClick={() => {
            audioManager.playClick();
            onNavigate('room-view');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all min-w-[58px] ${
            isExhibitsActive
              ? 'bg-[#FFC21A] text-[#0F2F57] font-black shadow-md scale-105'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Fredoka']">Pameran</span>
        </button>

        {/* 3. Laboratorium */}
        <button
          onClick={() => {
            audioManager.playClick();
            onNavigate('simulation');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all min-w-[58px] ${
            isLabActive
              ? 'bg-[#FFC21A] text-[#0F2F57] font-black shadow-md scale-105'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <FlaskConical className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Fredoka']">Lab</span>
        </button>

        {/* 4. Kuis */}
        <button
          onClick={() => {
            audioManager.playClick();
            onNavigate('pretest');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all min-w-[58px] ${
            isQuizActive
              ? 'bg-[#FFC21A] text-[#0F2F57] font-black shadow-md scale-105'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Fredoka']">Kuis</span>
        </button>

        {/* 5. Pencapaian */}
        <button
          onClick={() => {
            audioManager.playClick();
            onNavigate('certificate');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all min-w-[58px] ${
            isBadgesActive
              ? 'bg-[#FFC21A] text-[#0F2F57] font-black shadow-md scale-105'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Fredoka']">Prestasi</span>
        </button>
      </nav>
    </>
  );
};
