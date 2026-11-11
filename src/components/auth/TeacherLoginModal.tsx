import React, { useState } from 'react';
import { X, ShieldCheck, LogIn, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { StudentProfile } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (teacher: StudentProfile) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('guru_ipas');
  const [pin, setPin] = useState('9999');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const teacherProfile = StorageService.authenticate(username, pin, 'teacher');

    if (teacherProfile) {
      audioManager.playSuccessChime();
      StorageService.setActiveUser(teacherProfile);
      onSuccess(teacherProfile);
      onClose();
    } else {
      audioManager.playErrorSound();
      setErrorMsg('Nama pengguna atau PIN guru belum sesuai. Pastikan menggunakan PIN: 9999');
    }
  };

  const handleQuickTeacherLogin = () => {
    const profiles = StorageService.getProfiles();
    const teacher = profiles.find((p) => p.role === 'teacher') || {
      studentId: 'tch-001',
      username: 'guru_ipas',
      pin: '9999',
      fullName: 'Ibu Rahayu, S.Pd.',
      className: 'Guru Pembimbing IPAS',
      avatar: '👩‍🏫',
      role: 'teacher' as const
    };

    audioManager.playSuccessChime();
    StorageService.setActiveUser(teacher);
    onSuccess(teacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-3 border-amber-400 rounded-[2.5rem] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#0F2F57]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-sm">
              👩‍🏫
            </div>
            <div>
              <h3 className="font-['Fredoka'] font-black text-2xl text-[#0F2F57]">
                Portal Masuk Guru
              </h3>
              <p className="text-xs text-amber-800 font-bold">
                EkoRia Museum · Panel Pembimbing
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-[#0F2F57] mb-1.5 font-['Fredoka']">
                Nama Pengguna Guru
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#F4F8FC] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-sm text-[#0F2F57] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#0F2F57] mb-1.5 font-['Fredoka']">
                Kode Keamanan PIN Guru
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full bg-[#F4F8FC] border-2 border-slate-300 focus:border-[#1E7A50] rounded-2xl px-4 py-3 text-sm text-[#0F2F57] focus:outline-none font-bold"
              />
              <span className="text-[11px] text-slate-500 font-bold mt-1 block">
                PIN default demo guru: <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">9999</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-[#FB8500] hover:from-amber-600 hover:to-orange-600 text-white font-black font-['Fredoka'] text-base shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Masuk ke Panel Guru</span>
            </button>
          </form>

          {/* Quick Teacher Button */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-xs font-bold text-slate-400">atau klik langsung</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleQuickTeacherLogin}
              className="w-full p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-left flex items-center justify-between cursor-pointer transition-all hover:scale-101"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👩‍🏫</span>
                <div>
                  <div className="font-black text-sm text-[#0F2F57] font-['Fredoka']">
                    Ibu Rahayu, S.Pd.
                  </div>
                  <div className="text-xs text-amber-800 font-bold">
                    Guru Pembimbing IPAS
                  </div>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm">
                Masuk Cepat ✓
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
