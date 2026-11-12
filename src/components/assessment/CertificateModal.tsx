import React from 'react';
import { Award, Printer, ArrowLeft, CheckCircle, ShieldCheck, Star, MapPin } from 'lucide-react';
import { StudentProfile, StudentProgress } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface CertificateModalProps {
  activeUser: StudentProfile | null;
  progress: StudentProgress;
  onBack: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  activeUser,
  progress,
  onBack
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    audioManager.playClick();
    window.print();
  };

  const studentName = activeUser?.fullName || 'Budi Santoso';
  const studentClass = activeUser?.className || 'Kelas V SD';
  const studentId = activeUser?.studentId || 'std-5a-01';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Action Bar (hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border-2 border-[#1E7A50]/30 shadow-md">
        <button
          onClick={() => {
            audioManager.playClick();
            onBack();
          }}
          className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1E7A50] font-bold text-base border-2 border-[#1E7A50] cursor-pointer transition-transform hover:scale-102 shadow-sm"
        >
          <MapPin className="w-5 h-5 text-[#1E7A50]" />
          Kembali ke Peta
        </button>

        <button
          onClick={handlePrint}
          className="min-h-[48px] flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-extrabold text-base shadow-lg shadow-emerald-900/20 cursor-pointer transition-all hover:scale-102"
        >
          <Printer className="w-5 h-5" /> Cetak / Simpan PDF Sertifikat
        </button>
      </div>

      {/* Printable Certificate Canvas */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-[#FFFDF9] text-[#1F2D3D] border-8 border-double border-[#1E7A50] shadow-xl overflow-hidden font-['Plus_Jakarta_Sans'] print:border-4 print:shadow-none print:m-0">
        
        {/* Corner Flourishes */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#1E7A50] rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#1E7A50] rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#1E7A50] rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#1E7A50] rounded-br-lg" />

        {/* Certificate Content */}
        <div className="relative z-10 text-center space-y-4 sm:space-y-6">
          
          {/* Header Seal */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#1E7A50] text-amber-300 flex items-center justify-center text-3xl shadow-md border-2 border-amber-400">
              🌱
            </div>
            <div className="text-left">
              <div className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight text-[#1E7A50] uppercase leading-none">
                EkoRia Museum
              </div>
              <div className="text-xs sm:text-sm tracking-widest text-[#334E68] uppercase font-bold mt-1">
                Museum Sains Virtual & Harmoni dalam Ekosistem
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="font-['Outfit'] font-black text-3xl sm:text-5xl text-[#1F2D3D] tracking-tight uppercase">
              Sertifikat Penjelajah Cilik
            </h1>
            <p className="text-sm sm:text-base text-[#627D98] uppercase tracking-widest font-bold mt-1">
              Diberikan dengan Bangga kepada:
            </p>
          </div>

          {/* Student Name Display */}
          <div className="py-2 sm:py-3 border-b-2 border-[#1E7A50]/30 max-w-lg mx-auto">
            <div className="font-['Outfit'] text-3xl sm:text-4xl font-black text-[#1E7A50] tracking-tight">
              {studentName}
            </div>
            <div className="text-sm sm:text-base text-[#334E68] font-bold mt-1">
              {studentClass} · ID Siswa: {studentId}
            </div>
          </div>

          {/* Citation / Achievement Body */}
          <p className="text-base sm:text-lg text-[#334E68] max-w-2xl mx-auto leading-relaxed font-medium">
            Telah berhasil menjelajahi 4 Ruang Habitat Alam (Hutan, Sungai, Laut, dan Sawah & Kebun), memahami aliran energi rantai makanan, serta merawat keseimbangan alam di Museum Virtual EkoRia dengan predikat:
          </p>

          {/* Score & Badge Metric strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
            <div className="text-center px-5 py-3 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]/30">
              <div className="text-xs uppercase font-extrabold text-[#1E7A50]">Skor Evaluasi</div>
              <div className="font-['Outfit'] font-black text-2xl text-[#1E7A50]">
                {progress.postTestScore > 0 ? progress.postTestScore : 100} / 100
              </div>
            </div>

            <div className="text-center px-5 py-3 rounded-2xl bg-[#FEF7EC] border-2 border-amber-300">
              <div className="text-xs uppercase font-extrabold text-[#D45014]">Total XP</div>
              <div className="font-['Outfit'] font-black text-2xl text-[#D45014]">
                {progress.totalXP} XP
              </div>
            </div>

            <div className="text-center px-5 py-3 rounded-2xl bg-[#EBF3FC] border-2 border-[#1C5FC4]/30">
              <div className="text-xs uppercase font-extrabold text-[#1C5FC4]">Lencana Diraih</div>
              <div className="font-['Outfit'] font-black text-2xl text-[#1C5FC4]">
                {progress.badges.length} / 6 Lencana
              </div>
            </div>
          </div>

          {/* Signatures & Official Seal Footer */}
          <div className="pt-6 sm:pt-8 flex items-center justify-between max-w-xl mx-auto text-sm text-[#1F2D3D]">
            <div className="text-center">
              <div className="font-['Outfit'] font-bold text-lg text-[#1E7A50] mb-1">
                Ozi 🤖🌱
              </div>
              <div className="w-36 border-t-2 border-[#1E7A50] mx-auto pt-1 font-bold">
                Robot Pemandu Sains
              </div>
              <div className="text-xs text-[#627D98]">Sahabat Ekosistem</div>
            </div>

            {/* Official Badge Graphic */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-300 shadow-md flex items-center justify-center text-white font-extrabold text-xs uppercase text-center p-2 leading-tight">
              Sahabat Ekosistem
            </div>

            <div className="text-center">
              <div className="font-['Outfit'] font-bold text-lg text-[#1E7A50] mb-1">
                Ibu Rahayu, S.Pd.
              </div>
              <div className="w-36 border-t-2 border-[#1E7A50] mx-auto pt-1 font-bold">
                Guru Pembimbing IPAS
              </div>
              <div className="text-xs text-[#627D98]">{currentDate}</div>
            </div>
          </div>

          {/* Kredit pengembang */}
          <p className="pt-2 text-[11px] sm:text-xs text-[#627D98] font-semibold">
            Pengembang: Dimas Yuli Rakasiwi, S.Pd
          </p>

        </div>

      </div>

    </div>
  );
};
