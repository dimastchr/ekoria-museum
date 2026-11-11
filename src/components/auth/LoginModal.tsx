import React, { useState } from 'react';
import { X, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { StudentProfile } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface LoginModalProps {
  onClose: () => void;
  activeUser: StudentProfile | null;
  onUserChange: (user: StudentProfile | null) => void;
  onResetProgress?: () => void;
  /** Opens the teacher portal (teacher login stays separate from pupils). */
  onOpenTeacherLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  activeUser,
  onUserChange,
  onResetProgress,
  onOpenTeacherLogin
}) => {
  // First visit on this device (no pupil accounts yet): start on the register form
  const hasStudentAccounts = StorageService.getProfiles().some((p) => p.role === 'student' && p.username !== 'mode_demo');
  const [mode, setMode] = useState<'login' | 'register'>(hasStudentAccounts ? 'login' : 'register');
  const [resetStep, setResetStep] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState('');

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('Kelas 5A');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStudentReset = () => {
    if (!activeUser) return;
    audioManager.playSuccessChime();
    StorageService.resetStudentProgress(activeUser.studentId);
    if (onResetProgress) {
      onResetProgress();
    }
    setResetStep(0);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const found = StorageService.authenticate(username, pin, 'student');

    if (found) {
      audioManager.playSuccessChime();
      StorageService.setActiveUser(found);
      onUserChange(found);
      onClose();
    } else {
      audioManager.playErrorSound();
      const isTeacher = StorageService.authenticate(username, pin, 'teacher');
      setErrorMsg(
        isTeacher
          ? 'Ini akun guru. Silakan masuk lewat Portal Guru, ya!'
          : 'Nama akun atau PIN belum cocok. Periksa lagi, ya! Belum punya akun? Daftar dulu.'
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const result = StorageService.registerStudent({ username, pin, fullName, className });
    if (result.error || !result.profile) {
      audioManager.playErrorSound();
      setErrorMsg(result.error || 'Pendaftaran belum berhasil. Coba lagi, ya!');
      return;
    }

    // Registration does NOT log in automatically: the pupil now logs in with the new account
    audioManager.playSuccessChime();
    setSuccessMsg(`Akun "${result.profile.username}" berhasil dibuat! Sekarang masuk dengan nama akun dan PIN-mu, ya.`);
    setUsername(result.profile.username);
    setPin('');
    setFullName('');
    setMode('login');
  };

  const handleDemoMode = () => {
    audioManager.playClick();
    const demo = StorageService.getOrCreateDemoProfile();
    StorageService.setActiveUser(demo);
    onUserChange(demo);
    onClose();
  };

  const handleLogout = () => {
    audioManager.playClick();
    StorageService.setActiveUser(null);
    onUserChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] border-2 border-[#1E7A50] rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-[#1F2D3D]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]/30 flex items-center justify-center text-2xl">
              {activeUser ? activeUser.avatar : '🌱'}
            </div>
            <div>
              <h3 className="font-['Outfit'] font-black text-2xl text-[#1F2D3D]">
                {activeUser ? 'Profil Akun Siswa' : mode === 'login' ? 'Masuk ke Museum' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-sm text-[#334E68] font-medium">
                {activeUser ? activeUser.fullName : 'Aman untuk anak SD: Tidak butuh alamat email!'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center text-slate-400 hover:text-[#1F2D3D] rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* If user is already logged in, show profile summary & logout */}
        {activeUser ? (
          <div className="py-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border-2 border-slate-200 space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-[#627D98] font-medium">Nama Lengkap:</span>
                <span className="font-bold text-[#1F2D3D]">{activeUser.fullName}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#627D98] font-medium">Nama Akun:</span>
                <span className="font-mono font-bold text-[#1E7A50]">{activeUser.username}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#627D98] font-medium">Kelas:</span>
                <span className="font-bold text-[#1F2D3D]">{activeUser.className}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#627D98] font-medium">Peran:</span>
                <span className="font-bold text-[#1E7A50]">{activeUser.role === 'teacher' ? 'Guru Pembimbing' : 'Siswa Penjelajah'}</span>
              </div>
            </div>

            {/* Student Reset Option: Mulai dari Awal (2-Step Child-Friendly Confirmation) */}
            {activeUser.role === 'student' && (
              <div className="pt-2 border-t-2 border-slate-100">
                {resetStep === 0 && (
                  <button
                    onClick={() => {
                      audioManager.playClick();
                      setResetStep(1);
                    }}
                    className="min-h-[48px] w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-[#9C4221] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>🔄 Mulai dari Awal (Ulangi Petualangan)</span>
                  </button>
                )}

                {resetStep === 1 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3 animate-in fade-in duration-200">
                    <div className="text-sm font-bold text-[#9C4221] flex items-center gap-2">
                      <span>⚠️</span> Yakin? Semua bintang dan lencanamu akan hilang.
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          audioManager.playClick();
                          setResetStep(2);
                        }}
                        className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Ya, Lanjutkan
                      </button>
                      <button
                        onClick={() => setResetStep(0)}
                        className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-white border border-slate-300 text-[#1F2D3D] font-bold text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {resetStep === 2 && (
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-3 animate-in fade-in duration-200">
                    <div className="text-sm font-bold text-rose-800">
                      Konfirmasi Terakhir: Petualangan akan diulang dari awal (skor kuis & cloud dihapus).
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleStudentReset}
                        className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer"
                      >
                        Hapus dan Mulai Baru
                      </button>
                      <button
                        onClick={() => setResetStep(0)}
                        className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-white border border-slate-300 text-[#1F2D3D] font-bold text-xs cursor-pointer"
                      >
                        Kembali
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleLogout}
                className="min-h-[48px] flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700 font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-5 h-5" /> Keluar Akun
              </button>
              <button
                onClick={onClose}
                className="min-h-[48px] flex-1 py-3 px-4 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-bold text-base cursor-pointer transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          /* Login or Register Form */
          <div className="py-5 space-y-4">
            {errorMsg && (
              <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div role="status" className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-sm font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {!successMsg && (
              <div className="p-3 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]/20 text-[#1E5E3F] text-sm font-semibold">
                {mode === 'register'
                  ? 'Langkah 1: Daftar dulu. Setelah itu, masuk dengan nama akun dan PIN-mu.'
                  : 'Langkah 2: Masuk dengan nama akun dan PIN yang sudah kamu daftarkan.'}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                    Nama Akun
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    placeholder="Contoh: rina5a"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                    PIN 4-Angka
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="current-password"
                    maxLength={6}
                    placeholder="Contoh: 1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[48px] w-full py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-extrabold text-lg shadow-md cursor-pointer transition-transform hover:scale-101 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> Masuk Akun
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                    Nama Lengkap Siswa
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rina Lestari"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                      Nama Akun
                    </label>
                    <input
                      type="text"
                      autoCapitalize="none"
                      placeholder="rina5a"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                      PIN (4-Angka)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      autoComplete="new-password"
                      maxLength={6}
                      placeholder="1234"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                      className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                    Kelas
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-base text-[#1F2D3D] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Kelas 5A">Kelas 5A</option>
                    <option value="Kelas 5B">Kelas 5B</option>
                    <option value="Kelas 5C">Kelas 5C</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="min-h-[48px] w-full py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-extrabold text-lg shadow-md cursor-pointer transition-transform hover:scale-101 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" /> Daftarkan Akun Siswa
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setSuccessMsg('');
                  setMode(mode === 'login' ? 'register' : 'login');
                }}
                className="text-base font-bold text-[#1E7A50] hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Belum punya akun? Ketuk untuk mendaftar' : 'Sudah punya akun? Ketuk untuk masuk'}
              </button>
            </div>
          </div>
        )}

        {/* Explicit, separate options (never used automatically) */}
        {!activeUser && (
          <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row gap-2.5">
            {onOpenTeacherLogin && (
              <button
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  onClose();
                  onOpenTeacherLogin();
                }}
                className="min-h-[44px] flex-1 py-2 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 font-bold text-sm cursor-pointer transition-colors"
              >
                👩‍🏫 Saya Guru (Portal Guru)
              </button>
            )}
            <button
              type="button"
              onClick={handleDemoMode}
              className="min-h-[44px] flex-1 py-2 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 text-slate-600 font-bold text-sm cursor-pointer transition-colors"
              title="Untuk juri atau tamu yang hanya ingin mencoba. Siswa tetap mendaftar dan masuk dengan akunnya sendiri."
            >
              🧭 Mode Demo (untuk juri/tamu)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
