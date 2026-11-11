import React, { useRef, useState } from 'react';
import { 
  ArrowLeft, 
  Info, 
  Map as MapIcon, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  Award,
  BookOpen
} from 'lucide-react';
import { ZoneId, StudentProgress } from '../../types';
import { MUSEUM_ZONES } from '../../data/museumZonesData';
import { audioManager } from '../../utils/audioManager';
import { EkoZoneIcon, EkoLogoIcon } from '../common/EkoIcons';
import { SoundToggle } from '../common/SoundToggle';
import grandHallBg from '../../assets/images/ecoria_grand_hall_tree_1794244174588.jpg';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';
import naraAvatar from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';

interface MuseumHubProps {
  progress: StudentProgress;
  onSelectZone: (zoneId: ZoneId) => void;
  onBackToDashboard: () => void;
  onOpenOzi: () => void;
  onOpenEncyclopedia?: () => void;
}

export const MuseumHub: React.FC<MuseumHubProps> = ({
  progress,
  onSelectZone,
  onBackToDashboard,
  onOpenOzi,
  onOpenEncyclopedia,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const completedCount = progress.completedRooms?.length || 0;

  const handleSpeakWelcome = () => {
    if (isSpeaking) {
      audioManager.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const text = 'Selamat datang di Museum Sains Virtual EkoRia! Di aula tengah ini terdapat delapan portal penjelajahan ekosistem berdasarkan Bab 3 IPAS Kelas 5. Sentuh salah satu portal untuk memulai misi belajarmu!';
    setIsSpeaking(true);
    audioManager.speak(text, () => setIsSpeaking(false));
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F3D2E] text-white flex flex-col font-sans select-none">
      
      {/* BACKGROUND GRAND HALL IMAGE WITH SUNBEAMS AND DRIFTING MIST */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 pointer-events-none scale-105"
        style={{ backgroundImage: `url(${grandHallBg})` }}
      >
        {/* Soft vignette and contrast overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E]/90 via-[#0F3D2E]/30 to-[#0F3D2E]/80" />
        
        {/* Radiant Sunbeam / God Rays Light Effect */}
        <div className="absolute inset-0 sunbeam-rays-overlay" />

        {/* Soft Drifting Forest Mist Layer */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1B5E3F]/40 via-emerald-900/20 to-transparent pointer-events-none animate-mist-left opacity-60" />
      </div>

      {/* TOP HUD BAR */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-8 py-3.5 bg-[#0F3D2E]/85 backdrop-blur-md border-b border-[#1B5E3F]/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl border border-white/20 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dasbor Siswa</span>
          </button>

          <div className="flex items-center gap-2.5">
            <EkoLogoIcon size={30} className="shrink-0 drop-shadow" />
            <div>
              <h1 className="text-sm md:text-base font-heading font-extrabold text-white leading-tight">
                Aula Pusat Museum EkoRia
              </h1>
              <p className="text-[10px] text-[#8BC34A] font-semibold uppercase tracking-wider">
                Bab 3: Harmoni dalam Ekosistem (8 Zona)
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Controls: Info, Map, Ozi */}
        <div className="flex items-center gap-2">
          {onOpenEncyclopedia && (
            <button
              onClick={onOpenEncyclopedia}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/20 transition"
              title="Buka Ensiklopedia Istilah"
            >
              <BookOpen className="w-4 h-4 text-[#F5C518]" />
              <span className="hidden md:inline">Ensiklopedia</span>
            </button>
          )}

          <SoundToggle variant="dark" />

          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            title="Informasi Museum & Bab 3"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenOzi}
            className="flex items-center gap-2 bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            <img src={oziAvatar} alt="Ozi" className="w-4 h-4 rounded-full border border-[#0F3D2E]" />
            <span className="hidden sm:inline">Tanya Ozi</span>
          </button>
        </div>
      </header>

      {/* CENTRAL SCROLLABLE PORTALS AREA */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-12 py-4 overflow-hidden">
        
        {/* Title banner */}
        <div className="text-center mb-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#F5C518]/90 text-[#0F3D2E] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> 8 Gerbang Ekosistem
          </div>
          <h2 className="text-xl md:text-3xl font-heading font-black text-white drop-shadow-md">
            Pilih Portal Petualanganmu
          </h2>
          <p className="text-xs md:text-sm text-[#F6F1E3]/90 drop-shadow">
            Geser ke kiri atau kanan untuk memilih salah satu dari 8 gerbang ekosistem.
          </p>
        </div>

        {/* Scroll Left/Right floating buttons */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0F3D2E]/90 hover:bg-[#1B5E3F] text-white border border-[#3FA34D] shadow-xl items-center justify-center transition active:scale-95"
          aria-label="Geser ke kiri"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0F3D2E]/90 hover:bg-[#1B5E3F] text-white border border-[#3FA34D] shadow-xl items-center justify-center transition active:scale-95"
          aria-label="Geser ke kanan"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Horizontal scrollable carousel containing all 8 glowing arched portals */}
        <div 
          ref={containerRef}
          className="flex items-center gap-5 overflow-x-auto py-6 px-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MUSEUM_ZONES.map((zone) => {
            const isCompleted = progress.completedRooms.includes(zone.id);
            const zoneProgress = progress.roomProgress[zone.id] || 0;

            return (
              <div
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className="snap-center shrink-0 w-64 md:w-72 h-[390px] rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#1B5E3F]/90 to-[#0F3D2E]/95 border-2 border-[#8BC34A]/40 hover:border-[#F5C518] shadow-2xl hover:shadow-[#F5C518]/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-between p-4 group relative overflow-hidden backdrop-blur-md"
              >
                {/* Glowing portal arch background image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700 pointer-events-none"
                  style={{ backgroundImage: `url(${zone.bgImage})` }}
                />

                {/* Arched portal highlight glow */}
                <div className="absolute top-0 inset-x-8 h-24 bg-gradient-to-b from-[#F5C518]/25 to-transparent rounded-t-full pointer-events-none" />

                {/* Top Badge: Zone Number */}
                <div className="relative z-10 pt-4 flex flex-col items-center">
                  <span className="bg-[#0F3D2E]/90 text-[#F5C518] border border-[#F5C518]/60 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2 shadow">
                    Zona #{zone.zoneNumber}
                  </span>
                  
                  {/* Big Portal 3D Icon */}
                  <div className="relative z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    <EkoZoneIcon zoneId={zone.id} size="lg" />
                  </div>
                </div>

                {/* Middle Info */}
                <div className="relative z-10 text-center px-2">
                  <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-[#F5C518] transition-colors leading-tight mb-1">
                    {zone.title}
                  </h3>
                  <div className="text-xs text-[#8BC34A] font-bold mb-2">
                    {zone.theme}
                  </div>
                  <p className="text-[11px] text-[#F6F1E3]/80 line-clamp-3 leading-relaxed">
                    {zone.curriculumTopic}
                  </p>
                </div>

                {/* Bottom Card Footer: Button & Progress */}
                <div className="relative z-10 w-full pt-2 border-t border-white/15 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-200">
                    <span>Progres: {zoneProgress}%</span>
                    {isCompleted ? (
                      <span className="text-[#F5C518] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    ) : (
                      <span>{zone.organisms.length} biota</span>
                    )}
                  </div>

                  {/* Enter Button (Yellow with dark green text) */}
                  <button className="w-full py-2.5 rounded-xl bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md group-hover:bg-[#ffe066] transition cursor-pointer">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Masuk Portal Ini</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* BOTTOM FOOTER OVERLAY: Ozi Speech Bubble & Mission Card */}
      <footer className="relative z-20 px-4 md:px-8 py-3 bg-[#0F3D2E]/90 backdrop-blur-md border-t border-[#1B5E3F] flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Bottom Left: Mission Card (Misi: Jelajahi 8 zona x/8) */}
        <div className="flex items-center gap-3 bg-[#1B5E3F]/80 px-4 py-2 rounded-2xl border border-[#3FA34D]/40 shadow-sm shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#F5C518] text-[#0F3D2E] flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Misi Utama: Jelajahi 8 Zona
            </div>
            <div className="text-[11px] text-[#8BC34A] font-semibold">
              Status: {completedCount} dari 8 zona terselesaikan ({Math.round((completedCount / 8) * 100)}%)
            </div>
          </div>
        </div>

        {/* Bottom Center / Right: Ozi Speech Bubble */}
        <div className="flex items-center gap-3 bg-white text-[#0F3D2E] px-4 py-2.5 rounded-2xl border-2 border-[#F5C518] shadow-lg max-w-xl">
          <button
            type="button"
            onClick={onOpenOzi}
            aria-label="Buka obrolan dengan Ozi"
            title="Ketuk Ozi untuk bertanya"
            className="shrink-0 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5C518] hover:scale-110 transition-transform"
          >
            <img 
              src={oziAvatar} 
              alt="Ozi" 
              className="w-9 h-9 rounded-full border-2 border-[#3FA34D] animate-ozi-bounce pointer-events-none" 
            />
          </button>
          <div
            className="text-xs leading-relaxed flex-1 cursor-pointer"
            onClick={onOpenOzi}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenOzi(); }}
          >
            <span className="font-extrabold text-[#1B5E3F] block">Ozi Asisten Sains:</span>
            "Selamat datang di EkoRia! Pilih salah satu gerbang untuk menjelajahi berbagai ekosistem."
          </div>
          <button
            onClick={handleSpeakWelcome}
            className={`p-1.5 rounded-lg text-[#0F3D2E] hover:bg-[#F6F1E3] transition ${
              isSpeaking ? 'text-[#3FA34D] animate-pulse' : ''
            }`}
            title="Dengarkan Suara Ozi"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

      </footer>

      {/* INFO MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F6F1E3] text-[#0F3D2E] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#3FA34D] animate-pop-spring">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8DEC9]">
              <div className="flex items-center gap-2.5">
                <EkoLogoIcon size={32} className="shrink-0" />
                <h3 className="text-lg font-heading font-extrabold text-[#0F3D2E]">
                  Tentang Museum EkoRia
                </h3>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#2D3748]">
              <p>
                <strong>Museum Sains Virtual EkoRia</strong> dirancang khusus untuk pembelajaran <strong>IPAS Kelas V Kurikulum Merdeka – Bab 3: Harmoni dalam Ekosistem</strong>.
              </p>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8DEC9] space-y-1.5">
                <div className="font-bold text-[#1B5E3F]">8 Zona Pembelajaran:</div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#52796F]">
                  <li>Hutan – Komponen biotik, abiotik, dan peran pengurai</li>
                  <li>Padang Rumput – Savana Jawa Timur (Baluran) dan rantai herbivora</li>
                  <li>Sungai & Danau – Aliran air tawar dan jaring perairan</li>
                  <li>Laut – Ekosistem terumbu karang dan fitoplankton</li>
                  <li>Rantai Makanan – Aliran energi dari produsen hingga pemangsa puncak</li>
                  <li>Keseimbangan Ekosistem – Naik-turunnya jumlah makhluk hidup dan simulasi sains</li>
                  <li>Ekosistem Buatan – Sawah, kebun, dan kolam buatan manusia</li>
                  <li>Pelestarian Lingkungan – Memilah sampah, aksi hijau, peduli bumi</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8DEC9] flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold px-5 py-2 rounded-xl hover:bg-[#ffe066] transition text-xs"
              >
                Mengerti, Lanjutkan Petualangan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
