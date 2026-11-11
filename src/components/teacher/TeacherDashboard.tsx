import React, { useState } from 'react';
import { Users, BookOpen, Download, Plus, CheckCircle, ShieldCheck, ArrowLeft, BarChart3, Clock, KeyRound, MapPin, RotateCcw, AlertTriangle, TrendingUp, Trophy } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { StudentProfile, StudentProgress } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<StudentProfile[]>(StorageService.getProfiles());
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>(StorageService.getAllStudentProgress());

  // Form state for creating a new student account
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newClass, setNewClass] = useState('Kelas 5A');
  const [newPin, setNewPin] = useState('1234');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Reset Modal state
  const [resetModalType, setResetModalType] = useState<'single' | 'all' | null>(null);
  const [targetStudentId, setTargetStudentId] = useState<string | null>(null);
  const [resetConfirmationInput, setResetConfirmationInput] = useState('');
  const [resetClass, setResetClass] = useState('Kelas 5A');

  const studentCount = profiles.filter((p) => p.role === 'student').length;
  const avgXP = Math.round(
    studentsProgress.reduce((acc, curr) => acc + curr.totalXP, 0) / (studentsProgress.length || 1)
  );
  const avgPreTest = Math.round(
    studentsProgress.reduce((acc, curr) => acc + curr.preTestScore, 0) / (studentsProgress.length || 1)
  );

  // Completed posttests count & avg
  const postTestStudents = studentsProgress.filter((s) => s.postTestCompleted || s.postTestScore > 0);
  const avgPostTest = postTestStudents.length > 0
    ? Math.round(postTestStudents.reduce((acc, curr) => acc + curr.postTestScore, 0) / postTestStudents.length)
    : 0;

  // Calculate N-Gain per student: g = (post - pre) / (100 - pre)
  const calculateNGain = (pre: number, post: number, completed: boolean) => {
    if (!completed && post === 0) return null;
    if (pre >= 100) return 1.0;
    const gain = (post - pre) / (100 - pre);
    return Math.max(0, Math.min(1, Math.round(gain * 100) / 100));
  };

  // Class avg N-Gain
  const validGains = studentsProgress
    .map((s) => calculateNGain(s.preTestScore, s.postTestScore, s.postTestCompleted))
    .filter((g): g is number => g !== null);

  const avgNGain = validGains.length > 0
    ? (validGains.reduce((a, b) => a + b, 0) / validGains.length).toFixed(2)
    : '0.00';

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullName.trim() || !newPin.trim()) return;

    audioManager.playClick();
    // Same rules as pupil self-registration (unique username, 4–6 digit PIN)
    const result = StorageService.registerStudent({
      username: newUsername,
      pin: newPin,
      fullName: newFullName,
      className: newClass
    });
    if (result.error || !result.profile) {
      audioManager.playErrorSound();
      setSuccessMsg(`⚠️ ${result.error || 'Akun belum berhasil dibuat.'}`);
      setTimeout(() => setSuccessMsg(''), 5000);
      return;
    }
    const created = result.profile;

    setProfiles(StorageService.getProfiles());
    setStudentsProgress(StorageService.getAllStudentProgress());

    setSuccessMsg(`Akun siswa ${created.fullName} (${created.username}) berhasil dibuat dengan PIN ${created.pin}. Catat PIN ini dan berikan kepada siswa.`);
    setNewUsername('');
    setNewFullName('');
    setShowAddForm(false);
    setTimeout(() => setSuccessMsg(''), 8000);
  };

  const handleConfirmReset = () => {
    if (resetConfirmationInput.trim().toUpperCase() !== 'RESET') return;
    audioManager.playSuccessChime();

    if (resetModalType === 'single' && targetStudentId) {
      StorageService.resetStudentProgress(targetStudentId);
      const student = profiles.find((p) => p.studentId === targetStudentId);
      setSuccessMsg(`Data belajar siswa ${student?.fullName || targetStudentId} berhasil direset ke awal.`);
    } else if (resetModalType === 'all') {
      StorageService.resetAllClass(resetClass);
      setSuccessMsg(`Semua nilai siswa di ${resetClass} berhasil dihapus dan dimulai dari awal.`);
    }

    setStudentsProgress(StorageService.getAllStudentProgress());
    setResetModalType(null);
    setTargetStudentId(null);
    setResetConfirmationInput('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleExportCSV = () => {
    audioManager.playClick();
    const headers = [
      'ID Siswa',
      'Nama Lengkap',
      'Username',
      'Kelas',
      'Ruang Selesai',
      'Total XP',
      'Total Bintang',
      'Lencana',
      'Skor Pre-Test (20 Soal)',
      'Skor Post-Test (20 Soal)',
      'N-Gain',
      'Kategori N-Gain',
      'Waktu Belajar (Menit)',
      'Aktivitas Terakhir'
    ];

    const rows = studentsProgress.map((sp) => {
      const prof = profiles.find((p) => p.studentId === sp.studentId);
      const nGainVal = calculateNGain(sp.preTestScore, sp.postTestScore, sp.postTestCompleted);
      const nGainText = nGainVal !== null ? nGainVal.toFixed(2) : '-';
      const nGainCategory =
        nGainVal === null ? '-' : nGainVal >= 0.7 ? 'Tinggi' : nGainVal >= 0.3 ? 'Sedang' : 'Rendah';

      return [
        sp.studentId,
        `"${prof?.fullName || sp.username}"`,
        sp.username,
        `"${sp.className}"`,
        sp.completedRooms.length,
        sp.totalXP,
        sp.totalStars,
        sp.badges.length,
        sp.preTestScore,
        sp.postTestCompleted ? sp.postTestScore : '-',
        nGainText,
        nGainCategory,
        sp.timeSpentMinutes,
        `"${new Date(sp.lastActive).toLocaleDateString('id-ID')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_belajar_ekoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Top Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#FEF7EC] via-[#EAF7EF] to-[#EBF3FC] border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold mb-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-100" />
            Portal Guru & Pendidik IPAS SD (Bab 3)
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-[#1F2D3D]">
            Dasbor Pemantauan & Analisis Kelas
          </h2>
          <p className="text-base text-[#334E68] mt-1 max-w-xl font-medium">
            Analisis perbandingan Pre-Test vs Post-Test (20 soal setara), nilai N-Gain efektivitas belajar, dan sinkronisasi Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              audioManager.playClick();
              setResetModalType('all');
              setResetConfirmationInput('');
            }}
            className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border-2 border-rose-300 cursor-pointer transition-colors"
            title="Hapus semua nilai siswa di kelas"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" /> Hapus Nilai Semua Siswa
          </button>
          
          <button
            onClick={handleExportCSV}
            className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-bold text-sm shadow cursor-pointer transition-transform hover:scale-102"
          >
            <Download className="w-4 h-4" /> Unduh CSV Nilai
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onBack();
            }}
            className="min-h-[48px] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1F2D3D] text-sm font-bold border-2 border-slate-300 cursor-pointer transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#1E7A50]" /> Kembali ke Peta
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]/40 text-[#1E7A50] text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-[#1E7A50] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Overview Strip (With N-Gain & Comparative Pre/Post) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-[#627D98] flex items-center gap-1.5 uppercase">
            <Users className="w-4 h-4 text-[#1E7A50]" /> Total Siswa
          </div>
          <div className="text-3xl font-black text-[#1F2D3D] mt-1.5 font-mono">
            {studentCount} Siswa
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-[#627D98] flex items-center gap-1.5 uppercase">
            <BookOpen className="w-4 h-4 text-amber-500" /> Rata-Rata Pre-Test
          </div>
          <div className="text-3xl font-black text-amber-600 mt-1.5 font-mono">
            {avgPreTest} / 100
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-[#627D98] flex items-center gap-1.5 uppercase">
            <Trophy className="w-4 h-4 text-[#1E7A50]" /> Rata-Rata Post-Test
          </div>
          <div className="text-3xl font-black text-[#1E7A50] mt-1.5 font-mono">
            {avgPostTest > 0 ? avgPostTest : '-'} / 100
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-[#627D98] flex items-center gap-1.5 uppercase">
            <TrendingUp className="w-4 h-4 text-[#1C5FC4]" /> Rata-Rata N-Gain
          </div>
          <div className="text-3xl font-black text-[#1C5FC4] mt-1.5 font-mono">
            {avgNGain}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-[#627D98] flex items-center gap-1.5 uppercase">
            <Clock className="w-4 h-4 text-purple-500" /> Cloud Firestore
          </div>
          <div className="text-sm font-black text-[#1E7A50] mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E7A50] animate-pulse" />
            Tersimpan di cloud ✓
          </div>
        </div>
      </div>

      {/* Student Management Form & Roster */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Outfit'] text-2xl font-black text-[#1F2D3D]">
              Evaluasi Nilai Siswa (Pre-Test, Post-Test, & N-Gain)
            </h3>
            <p className="text-sm text-[#334E68] font-medium">
              Data tersimpan otomatis di Cloud Firestore (koleksi: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-[#1E7A50]">classes/{'{kelas}'}/students/{'{username}'}</code>) tanpa menyimpan data pribadi.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EAF7EF] hover:bg-[#d8f1e2] text-[#1E7A50] text-sm font-bold border-2 border-[#1E7A50]/30 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Tutup Formulir' : 'Tambah Akun Siswa Baru'}
          </button>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateStudent}
            className="p-5 rounded-3xl bg-[#F8FAF8] border-2 border-slate-200 space-y-4 animate-in fade-in duration-200"
          >
            <div className="text-sm font-bold text-[#1E7A50] uppercase tracking-wider">
              Formulir Pembuatan Akun Siswa
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="block text-[#1F2D3D] font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Misal: Ahmad Zaki"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-[#1F2D3D] focus:outline-none focus:border-[#1E7A50]"
                />
              </div>

              <div>
                <label className="block text-[#1F2D3D] font-bold mb-1">Nama Akun (Username)</label>
                <input
                  type="text"
                  placeholder="Misal: zaki5a"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-[#1F2D3D] focus:outline-none focus:border-[#1E7A50]"
                />
              </div>

              <div>
                <label className="block text-[#1F2D3D] font-bold mb-1">Kelas</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-[#1F2D3D] focus:outline-none focus:border-[#1E7A50] cursor-pointer"
                >
                  <option value="Kelas 5A">Kelas 5A</option>
                  <option value="Kelas 5B">Kelas 5B</option>
                  <option value="Kelas 5C">Kelas 5C</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1F2D3D] font-bold mb-1">PIN 4-Angka</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-[#1F2D3D] focus:outline-none focus:border-[#1E7A50]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-[#1F2D3D] text-sm font-bold cursor-pointer hover:bg-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1E7A50] hover:bg-[#16603E] text-white text-sm font-bold cursor-pointer"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        )}

        {/* Student Table with N-Gain and Reset Button */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAF8] text-[#334E68] font-bold border-b-2 border-slate-200">
              <tr>
                <th className="p-3.5">Siswa</th>
                <th className="p-3.5">Akun / PIN</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Ruang Tuntas</th>
                <th className="p-3.5">Pre-Test</th>
                <th className="p-3.5">Post-Test</th>
                <th className="p-3.5">N-Gain</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {studentsProgress.map((sp) => {
                const profile = profiles.find((p) => p.studentId === sp.studentId);
                const nGainVal = calculateNGain(sp.preTestScore, sp.postTestScore, sp.postTestCompleted);
                const nGainCategory =
                  nGainVal === null
                    ? '-'
                    : nGainVal >= 0.7
                    ? 'Tinggi'
                    : nGainVal >= 0.3
                    ? 'Sedang'
                    : 'Rendah';

                const categoryBadgeColor =
                  nGainVal === null
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : nGainVal >= 0.7
                    ? 'bg-[#EAF7EF] text-[#1E7A50] border-[#1E7A50]/30 font-bold'
                    : nGainVal >= 0.3
                    ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                    : 'bg-amber-50 text-amber-700 border-amber-300 font-bold';

                return (
                  <tr key={sp.studentId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-[#1F2D3D] flex items-center gap-2">
                      <span className="text-xl">{profile?.avatar || '🧑'}</span>
                      <span>{profile?.fullName || sp.username}</span>
                    </td>
                    <td className="p-3.5 font-mono text-[#1E7A50] font-bold">
                      {sp.username} <span className="text-slate-400">/</span> {profile?.pin || '****'}
                    </td>
                    <td className="p-3.5 text-[#334E68]">{sp.className}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#EAF7EF] border border-[#1E7A50]/30 text-[#1E7A50] font-bold text-xs">
                        {sp.completedRooms.length} / 4 Ruang
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#334E68] font-bold text-base">
                      {sp.preTestScore}
                    </td>
                    <td className="p-3.5 font-mono text-[#1E7A50] font-black text-base">
                      {sp.postTestCompleted ? sp.postTestScore : '-'}
                    </td>
                    <td className="p-3.5 font-mono text-[#1C5FC4] font-black text-base">
                      {nGainVal !== null ? nGainVal.toFixed(2) : '-'}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border ${categoryBadgeColor}`}>
                        {nGainCategory}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          audioManager.playClick();
                          setResetModalType('single');
                          setTargetStudentId(sp.studentId);
                          setResetConfirmationInput('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold border border-slate-200 hover:border-rose-300 cursor-pointer transition-colors"
                        title="Hapus nilai siswa ini"
                      >
                        Hapus Nilai Siswa Ini
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Confirmation Reset Modal */}
      {resetModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-2 border-rose-500 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-7 h-7 shrink-0" />
              <h3 className="font-['Outfit'] font-black text-xl text-[#1F2D3D]">
                {resetModalType === 'all'
                  ? 'Konfirmasi Hapus Nilai Semua Siswa'
                  : 'Konfirmasi Hapus Nilai Satu Siswa'}
              </h3>
            </div>

            <p className="text-sm text-[#334E68] leading-relaxed font-medium">
              {resetModalType === 'all'
                ? `Semua nilai pre-test, post-test, XP, lencana, dan riwayat eksplorasi seluruh siswa kelas ${resetClass.replace(/^Kelas\s*/i, '')} akan dihapus permanen dari server dan perangkat ini.`
                : 'Nilai pre-test, post-test, XP, dan lencana siswa ini akan dikembalikan ke awal (0).'}
            </p>

            {resetModalType === 'all' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1F2D3D]">Pilih kelas:</label>
                <select
                  value={resetClass}
                  onChange={(e) => setResetClass(e.target.value)}
                  className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-rose-500 rounded-2xl px-4 py-2.5 text-sm font-bold text-[#1F2D3D] focus:outline-none cursor-pointer"
                >
                  <option value="Kelas 5A">Kelas 5A</option>
                  <option value="Kelas 5B">Kelas 5B</option>
                  <option value="Kelas 5C">Kelas 5C</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2D3D]">
                Ketik kata <span className="text-rose-600 font-mono font-black text-sm">RESET</span> untuk menyetujui:
              </label>
              <input
                type="text"
                placeholder="Ketik RESET"
                value={resetConfirmationInput}
                onChange={(e) => setResetConfirmationInput(e.target.value)}
                className="w-full bg-[#F8FAF8] border-2 border-slate-300 focus:border-rose-500 rounded-2xl px-4 py-2.5 text-base font-mono font-bold text-[#1F2D3D] uppercase focus:outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setResetModalType(null);
                  setTargetStudentId(null);
                  setResetConfirmationInput('');
                }}
                className="min-h-[44px] flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1F2D3D] font-bold text-sm cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleConfirmReset}
                disabled={resetConfirmationInput.trim().toUpperCase() !== 'RESET'}
                className="min-h-[44px] flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-black text-sm cursor-pointer transition-colors"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Concept Mastery Summary */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4">
        <h3 className="font-['Outfit'] text-xl font-black text-[#1F2D3D] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E7A50]" />
          Catatan Analisis Kurikulum Merdeka (Harmoni dalam Ekosistem)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]/30 space-y-1">
            <div className="font-bold text-[#1E7A50]">Rantai Makanan & Aliran Energi</div>
            <p className="text-[#334E68]">Anak memahami panah artinya 'dimakan oleh' dan energi berpindah dari produsen ke konsumen.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FEF7EC] border-2 border-amber-300 space-y-1">
            <div className="font-bold text-[#D45014]">Terumbu Karang adalah Hewan</div>
            <p className="text-[#334E68]">Karang hidup adalah koloni hewan laut kecil (biotik) yang bersimbiosis dengan alga bersel satu.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#EBF3FC] border-2 border-[#1C5FC4]/30 space-y-1">
            <div className="font-bold text-[#1C5FC4]">Pengurai & Detritivor</div>
            <p className="text-[#334E68]">Jamur & bakteri = pengurai zat organik; Cacing & rayap = detritivor pemakan sampah daun.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
