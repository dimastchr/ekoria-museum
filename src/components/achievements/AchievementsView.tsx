import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  Printer, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Lock,
  Compass,
  Bookmark,
  Share2
} from 'lucide-react';
import { StudentProgress, StudentProfile } from '../../types';
import { MUSEUM_BADGES, MUSEUM_ZONES } from '../../data/museumZonesData';
import { audioManager } from '../../utils/audioManager';
import naraAvatar from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface AchievementsViewProps {
  progress: StudentProgress;
  profile: StudentProfile;
  onBack: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  progress,
  profile,
  onBack,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  const earnedBadgeIds = progress.badges || [];
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    audioManager.playClick();
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F1E3] text-[#0F3D2E] p-4 md:p-8 flex flex-col font-sans select-none">
      
      {/* HEADER (hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DEC9]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white hover:bg-[#E8DEC9] text-[#0F3D2E] px-4 py-2 rounded-xl border border-[#E8DEC9] text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h1 className="text-xl md:text-2xl font-heading font-black text-[#0F3D2E]">
                Pencapaian & Piagam EkoRia
              </h1>
            </div>
            <p className="text-xs text-[#52796F] font-semibold">
              Koleksi Lencana Petualangan Sains & Piagam Kelulusan
            </p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] font-heading font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{showCertificate ? 'Lihat Galeri Lencana' : 'Buka Sertifikat Kelulusan 📜'}</span>
          </button>
        </div>
      </div>

      {!showCertificate ? (
        /* BADGES GALLERY & STATS */
        <div className="max-w-5xl mx-auto w-full space-y-6">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-sm text-center">
              <span className="text-2xl mb-1 block">⭐</span>
              <div className="text-2xl font-heading font-extrabold text-[#0F3D2E]">
                {progress.totalStars || 0}
              </div>
              <div className="text-[11px] text-[#52796F] font-semibold">Total Bintang</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-sm text-center">
              <span className="text-2xl mb-1 block">⚡</span>
              <div className="text-2xl font-heading font-extrabold text-[#0F3D2E]">
                {progress.totalXP || 0} XP
              </div>
              <div className="text-[11px] text-[#52796F] font-semibold">Poin Pengalaman (XP)</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-sm text-center">
              <span className="text-2xl mb-1 block">🧭</span>
              <div className="text-2xl font-heading font-extrabold text-[#0F3D2E]">
                {progress.completedRooms?.length || 0} / 8
              </div>
              <div className="text-[11px] text-[#52796F] font-semibold">Zona Dijelajahi</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-sm text-center">
              <span className="text-2xl mb-1 block">📖</span>
              <div className="text-2xl font-heading font-extrabold text-[#0F3D2E]">
                {progress.journalEntries?.length || 0}
              </div>
              <div className="text-[11px] text-[#52796F] font-semibold">Catatan Jurnal</div>
            </div>

          </div>

          {/* BADGES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-lg text-[#0F3D2E]">
                Daftar Lencana Kehormatan ({earnedBadgeIds.length} / {MUSEUM_BADGES.length} Diraih)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MUSEUM_BADGES.map((badge) => {
                const isEarned = earnedBadgeIds.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-3xl border-2 transition flex items-start gap-4 ${
                      isEarned
                        ? 'bg-white border-[#3FA34D] shadow-md ring-1 ring-[#3FA34D]/30'
                        : 'bg-gray-50/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm border ${
                      isEarned ? 'bg-[#F6F1E3] border-[#F5C518]' : 'bg-gray-100 border-gray-300'
                    }`}>
                      {isEarned ? badge.icon : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isEarned ? 'bg-[#3FA34D] text-white' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {isEarned ? 'Diraih ✓' : 'Terkunci'}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-[#0F3D2E] leading-snug">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-[#52796F] leading-relaxed mt-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* PRINTABLE CERTIFICATE VIEW */
        <div className="max-w-4xl mx-auto w-full space-y-4">
          
          <div className="print:hidden flex justify-end">
            <button
              onClick={handlePrint}
              className="bg-[#1B5E3F] hover:bg-[#0F3D2E] text-white font-heading font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF Piagam</span>
            </button>
          </div>

          {/* Certificate Canvas */}
          <div className="relative p-8 md:p-14 rounded-3xl bg-[#FFFDF9] text-[#0F3D2E] border-8 border-double border-[#1B5E3F] shadow-2xl overflow-hidden font-sans print:border-4 print:shadow-none print:m-0">
            
            {/* Corner Ornamental Flourishes */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#1B5E3F] rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#1B5E3F] rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#1B5E3F] rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#1B5E3F] rounded-br-lg pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="flex items-center justify-center gap-2 text-4xl mb-1">
                🍃 🏛️ 🌿
              </div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#3FA34D]">
                Museum Sains Virtual EkoRia • Kurikulum Merdeka IPAS
              </h2>
              <h1 className="text-2xl md:text-4xl font-heading font-black text-[#0F3D2E] uppercase tracking-wide">
                Piagam Sahabat Alam EkoRia
              </h1>
              <p className="text-xs md:text-sm text-[#52796F] max-w-xl mx-auto">
                Diberikan sebagai pengakuan atas ketekunan dan keberhasilan dalam menuntaskan penjelajahan 8 Zona Ekosistem.
              </p>
            </div>

            {/* Recipient Info */}
            <div className="text-center my-6 py-4 border-y border-[#E8DEC9] space-y-2">
              <span className="text-xs text-[#52796F] font-bold uppercase tracking-wider block">
                Dianugerahkan kepada Penjelajah Muda:
              </span>
              <div className="text-2xl md:text-4xl font-heading font-black text-[#1B5E3F]">
                {profile.fullName || profile.username}
              </div>
              <div className="text-xs md:text-sm font-semibold text-[#52796F]">
                {profile.className || 'Kelas V SD'} • ID Siswa: {profile.studentId || 'std-5'}
              </div>
            </div>

            {/* Achievement Highlights */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto my-6 text-center">
              <div className="bg-[#F6F1E3] p-3 rounded-2xl border border-[#E8DEC9]">
                <div className="text-lg font-black text-[#0F3D2E]">{progress.totalXP || 0}</div>
                <div className="text-[10px] text-[#52796F] font-semibold">Total XP</div>
              </div>
              <div className="bg-[#F6F1E3] p-3 rounded-2xl border border-[#E8DEC9]">
                <div className="text-lg font-black text-[#0F3D2E]">{progress.postTestScore || 85}%</div>
                <div className="text-[10px] text-[#52796F] font-semibold">Skor Tes Akhir</div>
              </div>
              <div className="bg-[#F6F1E3] p-3 rounded-2xl border border-[#E8DEC9]">
                <div className="text-lg font-black text-[#0F3D2E]">{progress.completedRooms?.length || 8}/8</div>
                <div className="text-[10px] text-[#52796F] font-semibold">Zona Tuntas</div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-10 pt-6 flex items-center justify-around text-center text-xs">
              
              {/* Ozi Signature */}
              <div className="flex flex-col items-center">
                <img src={oziAvatar} alt="Ozi" className="w-12 h-12 rounded-full border-2 border-[#F5C518] mb-1.5" />
                <div className="font-heading font-extrabold text-[#0F3D2E]">Ozi</div>
                <div className="text-[10px] text-[#52796F]">Robot Pemandu Sains</div>
              </div>

              {/* Gold Seal */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F5C518] to-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black uppercase text-center p-1 leading-tight">
                Sahabat Bumi
              </div>

              {/* Nara Signature */}
              <div className="flex flex-col items-center">
                <img src={naraAvatar} alt="Nara" className="w-12 h-12 rounded-full border-2 border-[#3FA34D] mb-1.5" />
                <div className="font-heading font-extrabold text-[#0F3D2E]">Nara</div>
                <div className="text-[10px] text-[#52796F]">Ketua Ekspedisi Alam</div>
              </div>

            </div>

            <div className="text-center text-[10px] text-gray-400 mt-6">
              Diterbitkan di Museum Sains EkoRia pada tanggal {currentDate}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
