import React, { useEffect, useState } from 'react';
import {
  Home,
  Map as MapIcon,
  HelpCircle,
  Bookmark,
  UserCircle2,
  LogOut,
  MoreHorizontal,
  BookOpen,
  Award,
  X,
} from 'lucide-react';
import { ViewState } from '../../types';
import { SoundToggle } from './SoundToggle';
import { EkoLogoIcon } from './EkoIcons';
import { audioManager } from '../../utils/audioManager';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface AppNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenOzi: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  /** Hide the wide-screen top bar (the dashboard has its own sidebar). */
  hideTopOnDesktop?: boolean;
  isProfileOpen?: boolean;
}

type NavKey = 'dashboard' | 'museum' | 'ozi' | 'quiz' | 'journal' | 'profile';

const QUIZ_VIEWS: ViewState[] = ['quiz', 'pretest', 'posttest'];
const MUSEUM_VIEWS: ViewState[] = ['museum-hub', 'zone-view', 'food-chain', 'simulation', 'decomposer', 'trash-sorting'];

/**
 * Global touch-friendly navigation for pupils.
 * - Phones (< 768px): fixed bottom bar, 7 big buttons (min 56px tall) with icon + label.
 * - Tablets / Chromebooks / laptops (>= 768px): sticky top bar with the same items,
 *   plus Suara and Keluar.
 * "Keluar" always asks for confirmation so a child does not log out by accident.
 */
export const AppNav: React.FC<AppNavProps> = ({
  currentView,
  onNavigate,
  onOpenOzi,
  onOpenProfile,
  onLogout,
  hideTopOnDesktop = false,
  isProfileOpen = false,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  // Close the sheets with the Escape key (keyboard on Chromebooks)
  useEffect(() => {
    if (!isMoreOpen && !isConfirmLogoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
        setIsConfirmLogoutOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMoreOpen, isConfirmLogoutOpen]);

  const activeKey: NavKey | null = isProfileOpen
    ? 'profile'
    : currentView === 'dashboard'
    ? 'dashboard'
    : MUSEUM_VIEWS.includes(currentView)
    ? 'museum'
    : QUIZ_VIEWS.includes(currentView)
    ? 'quiz'
    : currentView === 'journal'
    ? 'journal'
    : null;

  const go = (view: ViewState) => {
    audioManager.playClick();
    setIsMoreOpen(false);
    onNavigate(view);
  };

  const items: { key: NavKey; label: string; ariaLabel: string; onClick: () => void; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Beranda', ariaLabel: 'Beranda', onClick: () => go('dashboard'), icon: <Home className="w-6 h-6" /> },
    { key: 'museum', label: 'Museum', ariaLabel: 'Aula Museum', onClick: () => go('museum-hub'), icon: <MapIcon className="w-6 h-6" /> },
    {
      key: 'ozi',
      label: 'Ozi',
      ariaLabel: 'Buka obrolan dengan Ozi',
      onClick: () => {
        setIsMoreOpen(false);
        onOpenOzi();
      },
      icon: <img src={oziAvatar} alt="" className="w-6 h-6 rounded-full border-2 border-[#F5C518] bg-white object-cover" />,
    },
    { key: 'quiz', label: 'Kuis', ariaLabel: 'Kuis dan evaluasi', onClick: () => go('quiz'), icon: <HelpCircle className="w-6 h-6" /> },
    { key: 'journal', label: 'Jurnal', ariaLabel: 'Jurnal penjelajah', onClick: () => go('journal'), icon: <Bookmark className="w-6 h-6" /> },
    {
      key: 'profile',
      label: 'Profil',
      ariaLabel: 'Profil saya',
      onClick: () => {
        audioManager.playClick();
        setIsMoreOpen(false);
        onOpenProfile();
      },
      icon: <UserCircle2 className="w-6 h-6" />,
    },
  ];

  const askLogout = () => {
    audioManager.playClick();
    setIsMoreOpen(false);
    setIsConfirmLogoutOpen(true);
  };

  return (
    <>
      {/* ---------------- TOP BAR (tablet / Chromebook / laptop) ---------------- */}
      {!hideTopOnDesktop && (
        <nav
          aria-label="Menu utama"
          className="hidden md:flex sticky top-0 z-40 h-16 items-center justify-between gap-2 px-3 lg:px-5 bg-[#0F3D2E] text-white border-b border-[#1B5E3F] shadow-lg"
        >
          <button
            type="button"
            onClick={() => go('dashboard')}
            className="flex items-center gap-2 shrink-0 rounded-xl px-1.5 min-h-[48px]"
            aria-label="EkoRia, kembali ke Beranda"
          >
            <EkoLogoIcon size={32} className="shrink-0" />
            <span className="hidden xl:block font-heading font-extrabold text-base">EkoRia</span>
          </button>

          <div className="flex items-center gap-1 lg:gap-1.5 min-w-0">
            {items.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-[48px] min-w-[48px] px-2.5 lg:px-3.5 rounded-xl flex flex-col lg:flex-row items-center justify-center gap-0.5 lg:gap-2 text-[11px] lg:text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#F5C518] text-[#0F3D2E] shadow-md'
                      : item.key === 'ozi'
                      ? 'bg-[#1B5E3F] text-[#F5C518] hover:bg-[#256f4d]'
                      : 'text-emerald-100 hover:bg-[#1B5E3F] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <SoundToggle variant="dark" showLabel />
            <button
              type="button"
              onClick={askLogout}
              className="min-h-[48px] px-3 rounded-xl flex items-center gap-1.5 text-xs lg:text-sm font-bold text-emerald-100 hover:bg-rose-600/80 hover:text-white border border-white/15 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </div>
        </nav>
      )}

      {/* ---------------- BOTTOM BAR (phones) ---------------- */}
      <nav
        aria-label="Menu utama"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0F3D2E] text-white border-t border-[#1B5E3F] shadow-[0_-6px_20px_rgba(0,0,0,0.25)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-7 h-[68px] px-0.5">
          {items.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={`h-full min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-xl transition ${
                  isActive ? 'text-[#F5C518]' : item.key === 'ozi' ? 'text-[#F5C518]' : 'text-emerald-100 active:text-white'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-11 h-8 rounded-full ${
                    isActive ? 'bg-[#F5C518]/20' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`text-[11px] leading-none ${isActive ? 'font-extrabold' : 'font-semibold'}`}>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              setIsMoreOpen(true);
            }}
            aria-label="Menu lainnya: suara, ensiklopedia, pencapaian, keluar"
            aria-expanded={isMoreOpen}
            className="h-full min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-xl text-emerald-100 active:text-white"
          >
            <span className="flex items-center justify-center w-11 h-8 rounded-full">
              <MoreHorizontal className="w-6 h-6" />
            </span>
            <span className="text-[11px] leading-none font-semibold">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* ---------------- "LAINNYA" SHEET (phones) ---------------- */}
      {isMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
          onClick={() => setIsMoreOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Menu lainnya"
        >
          <div
            className="w-full bg-[#F6F1E3] text-[#0F3D2E] rounded-t-3xl p-4 pb-6 shadow-2xl border-t-4 border-[#3FA34D] animate-pop-spring"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-extrabold text-lg">Menu Lainnya</h2>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-12 h-12 rounded-full bg-white border border-[#E8DEC9] flex items-center justify-center shadow-sm"
                aria-label="Tutup menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <SoundToggle variant="light" showLabel size="lg" className="w-full" />
              </div>
              <button
                type="button"
                onClick={() => go('encyclopedia')}
                className="min-h-[56px] rounded-2xl bg-white border border-[#E8DEC9] flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
              >
                <BookOpen className="w-5 h-5 text-[#1B5E3F]" />
                Ensiklopedia
              </button>
              <button
                type="button"
                onClick={() => go('achievements')}
                className="min-h-[56px] rounded-2xl bg-white border border-[#E8DEC9] flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
              >
                <Award className="w-5 h-5 text-purple-700" />
                Pencapaian
              </button>
              <button
                type="button"
                onClick={askLogout}
                className="col-span-2 min-h-[56px] rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 flex items-center justify-center gap-2 font-bold text-base"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- KONFIRMASI KELUAR ---------------- */}
      {isConfirmLogoutOpen && (
        <LogoutConfirmDialog
          onCancel={() => setIsConfirmLogoutOpen(false)}
          onConfirm={() => {
            setIsConfirmLogoutOpen(false);
            onLogout();
          }}
        />
      )}
    </>
  );
};

/** Child-safe "Keluar" confirmation (used by AppNav and the dashboard sidebar). */
export const LogoutConfirmDialog: React.FC<{ onCancel: () => void; onConfirm: () => void }> = ({ onCancel, onConfirm }) => (
  <div
    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="judul-keluar"
    onClick={onCancel}
  >
    <div
      className="w-full max-w-sm bg-[#F6F1E3] text-[#0F3D2E] rounded-3xl p-6 shadow-2xl border-2 border-[#3FA34D] animate-pop-spring text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-5xl mb-2" aria-hidden="true">👋</div>
      <h2 id="judul-keluar" className="font-heading font-extrabold text-xl mb-1">
        Mau keluar dulu?
      </h2>
      <p className="text-sm text-[#52796F] mb-5">
        Tenang, progres belajarmu sudah tersimpan. Kamu bisa masuk lagi kapan saja.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-h-[52px] rounded-2xl bg-white border-2 border-[#3FA34D] text-[#1B5E3F] font-bold text-base"
          autoFocus
        >
          Tidak, Lanjut Belajar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 min-h-[52px] rounded-2xl bg-rose-600 text-white font-bold text-base shadow-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Ya, Keluar
        </button>
      </div>
    </div>
  </div>
);
