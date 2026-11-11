import React, { useState } from 'react';
import { X, LogIn, UserPlus, LogOut, KeyRound, User, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { StudentProfile } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface LoginModalProps {
  onClose: () => void;
  activeUser: StudentProfile | null;
  onUserChange: (user: StudentProfile | null) => void;
  onResetProgress?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  activeUser,
  onUserChange,
  onResetProgress
}) => {
  const profiles = StorageService.getProfiles();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [resetStep, setResetStep] = useState<number>(0);

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

    const found = profiles.find(
      (p) => p.username.toLowerCase() === username.trim().toLowerCase() && p.pin === pin.trim()
    );

    if (found) {
      audioManager.playSuccessChime();
      StorageService.setActiveUser(found);
      onUserChange(found);
      onClose();
    } else {
      audioManager.playErrorSound();
      setErrorMsg('Nama akun atau PIN belum cocok. Periksa kembali atau pilih nama di bawah ya!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !pin.trim() || !fullName.trim()) {
      setErrorMsg('Harap isi semua kolom pendaftaran ya.');
      return;
    }

    const existing = profiles.find((p) => p.username.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      setErrorMsg('Nama akun ini sudah dipakai, coba nama panggilan lain ya!');
      return;
    }

    const newProfile: StudentProfile = {
      studentId: `std-${Date.now().toString().slice(-4)}`,
      username: username.trim().toLowerCase(),
      pin: pin.trim(),
      fullName: fullName.trim(),
      className,
      avatar: '🧑',
      role: 'student'
    };

    audioManager.playSuccessChime();
    StorageService.saveProfile(newProfile);
    StorageService.setActiveUser(newProfile);
    onUserChange(newProfile);
    onClose();
  };

  const handleQuickSwitch = (p: StudentProfile) => {
    audioManager.playClick();
    StorageService.setActiveUser(p);
    onUserChange(p);
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
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-[#1F2D3D] rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
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
                    <span>🔄 Mulai dari Awal (Ulang Petualangan)</span>
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
                        Hapus & Mulai Baru
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
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-base font-bold text-[#1F2D3D] mb-1.5">
                    Nama Akun (Username)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: budi5a"
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
                    placeholder="Contoh: Budi Santoso"
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
                      placeholder="budi5a"
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
                  setMode(mode === 'login' ? 'register' : 'login');
                }}
                className="text-base font-bold text-[#1E7A50] hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Belum punya akun? Klik untuk daftar' : 'Sudah punya akun? Klik untuk masuk'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t-2 border-slate-100">
          <div className="text-sm font-bold text-[#334E68] mb-2.5">
            Pilih Cepat Akun Contoh:
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {profiles.map((p) => (
              <button
                key={p.studentId}
                onClick={() => handleQuickSwitch(p)}
                className={`min-h-[50px] p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                  activeUser?.studentId === p.studentId
                    ? 'bg-[#EAF7EF] border-[#1E7A50] text-[#1E7A50] font-bold shadow-sm'
                    : 'bg-[#F8FAF8] hover:bg-slate-100 border-slate-200 text-[#1F2D3D]'
                }`}
              >
                <span className="text-2xl">{p.avatar}</span>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{p.fullName.split(' ')[0]}</div>
                  <div className="text-xs text-[#627D98] font-mono">PIN: {p.pin}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
