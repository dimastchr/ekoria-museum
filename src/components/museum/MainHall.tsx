import React from 'react';
import { 
  Play, 
  Volume2, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Award, 
  FlaskConical, 
  Gamepad2,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { MUSEUM_ROOMS, MUSEUM_BADGES } from '../../data/museumData';
import { RoomId, StudentProgress, ViewState } from '../../types';
import { audioManager } from '../../utils/audioManager';
import img_ecobot_safari_mascot_3d from '../../assets/images/ecobot_safari_mascot_3d_1794179931205.jpg';
import img_hero_background_3d from '../../assets/images/hero_background_3d_1794179861310.jpg';
import img_icon_achieve_medal_3d from '../../assets/images/icon_achieve_medal_3d_1794179978463.jpg';
import img_icon_exhibits_book_3d from '../../assets/images/icon_exhibits_book_3d_1794179945007.jpg';
import img_icon_lab_leaf_3d from '../../assets/images/icon_lab_leaf_3d_1794179955758.jpg';
import img_icon_quiz_gamepad_3d from '../../assets/images/icon_quiz_gamepad_3d_1794179967428.jpg';

interface MainHallProps {
  progress: StudentProgress;
  onEnterRoom: (roomId: RoomId) => void;
  onNavigate: (view: ViewState) => void;
  onOpenEcoBot: () => void;
}

export const MainHall: React.FC<MainHallProps> = ({
  progress,
  onEnterRoom,
  onNavigate,
  onOpenEcoBot
}) => {
  // Calculate overall learning progress percentage
  // 4 rooms (15% each = 60%), pretest (20%), posttest (20%)
  const roomsPercent = (progress.completedRooms.length / 4) * 60;
  const pretestPercent = progress.preTestCompleted ? 20 : 0;
  const posttestPercent = progress.postTestCompleted ? 20 : 0;
  const overallPercent = Math.min(100, Math.round(roomsPercent + pretestPercent + posttestPercent));

  const handleSpeakWelcome = () => {
    audioManager.speakNarration(
      'Ayo jelajahi ekosistem di EkoRia Museum! Bersama EcoBot, kita akan mengamati harmoni alam di hutan, sungai, laut, dan sawah.'
    );
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-300 text-[#0F2F57]">
      
      {/* 1. Full-Bleed 3D Cartoon Hero Landscape Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#0F2F57]/10 bg-slate-900 min-h-[460px] sm:min-h-[520px] flex items-center">
        
        {/* Full-bleed 3D background image */}
        <img
          src={img_hero_background_3d}
          alt="Pemandangan 3D Museum EkoRia"
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
        />

        {/* Soft Sunny Light Overlay for Text Readability & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100/90 via-sky-50/70 to-transparent sm:to-black/10 backdrop-blur-[1px]" />

        {/* Floating Progres Belajar Card (Requirement 5: Kanan atas hero) */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:p-5 shadow-xl border-3 border-emerald-100 max-w-[210px] sm:max-w-[240px] transition-all hover:scale-102">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#1E7A50]">
                <BarChart3 className="w-4 h-4 text-[#1E7A50]" />
                <span>Progres Belajar</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1E7A50]">
                Kelas V
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <div className="text-3xl sm:text-4xl font-black font-['Fredoka'] text-[#0F2F57] tracking-tight">
                {overallPercent}<span className="text-xl sm:text-2xl text-[#1E7A50]">%</span>
              </div>
              <div className="text-right text-[11px] font-bold text-slate-500">
                {progress.completedRooms.length}/4 Habitat
              </div>
            </div>

            {/* Thick Green Progress Bar */}
            <div className="w-full h-3 sm:h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#1E7A50] to-[#2ECC71] rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.max(8, overallPercent)}%` }}
              />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1 text-amber-600">
                ⭐ {progress.totalStars} Bintang
              </span>
              <span className="text-emerald-700 font-mono">
                {progress.totalXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Hero Content Container (EcoBot 3D Mascot on Left, Title in Center/Left) */}
        <div className="relative z-10 w-full px-6 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 sm:gap-10">
          
          {/* Left: EcoBot 3D Cartoon Mascot + Explorer Kid */}
          <div className="order-2 lg:order-1 flex items-center justify-center shrink-0 w-64 sm:w-80 lg:w-96">
            <div className="relative group cursor-pointer" onClick={() => onOpenEcoBot()}>
              {/* Mascot 3D Image */}
              <img
                src={img_ecobot_safari_mascot_3d}
                alt="Ozi dan Nara, petualang cilik"
                className="w-full h-auto drop-shadow-2xl rounded-3xl object-contain transform group-hover:scale-103 transition-transform duration-300 border-2 border-white/60 bg-white/30 backdrop-blur-xs"
              />

              {/* Cheerful Mascot Speech Bubble */}
              <div className="absolute -top-3 -right-2 bg-white rounded-2xl shadow-lg border-2 border-[#1E7A50] px-3.5 py-1.5 text-xs font-black text-[#0F2F57] flex items-center gap-1.5 animate-bounce">
                <span>🌱</span>
                <span>Ayo, Mulai di Sini!</span>
              </div>
            </div>
          </div>

          {/* Center/Right: Hero Title, Subtitle, and Action Buttons */}
          <div className="order-1 lg:order-2 flex-1 max-w-2xl text-center lg:text-left space-y-3.5">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-emerald-200">
              <span className="text-base select-none">🧭</span>
              <span className="text-xs sm:text-sm font-black text-[#0F2F57] font-['Fredoka'] tracking-wide">
                Museum Sains Virtual · IPAS Kelas V SD
              </span>
            </div>

            {/* Requirement 3: Judul Sangat Besar, Tebal, Rounded, Biru Tua */}
            <div>
              <h1 className="font-['Fredoka'] text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F2F57] tracking-tight leading-[1.1] drop-shadow-sm">
                Ayo Jelajahi Ekosistem!
              </h1>
              {/* Small Yellow Accent Line */}
              <div className="w-20 sm:w-28 h-2.5 bg-[#FFC21A] rounded-full mt-2 mx-auto lg:mx-0 shadow-sm" />
            </div>

            {/* 1–2 Baris Subjudul */}
            <p className="text-base sm:text-lg lg:text-xl text-[#0F2F57] font-bold leading-relaxed max-w-xl">
              Kunjungi habitat hutan, sungai, laut, dan sawah! Pecahkan teka-teki rantai makanan dan kumpulkan lencana petualang.
            </p>

            {/* Action Buttons: Tombol Pill Besar Gradasi Kuning–Oranye */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              
              <button
                onClick={() => {
                  audioManager.playClick();
                  onEnterRoom('hutan-harmoni');
                }}
                className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FFB703] to-[#FB8500] hover:from-[#FFA200] hover:to-[#E07600] text-[#0F2F57] font-black font-['Fredoka'] text-lg sm:text-xl shadow-xl shadow-orange-500/25 flex items-center gap-3 cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-white/60 min-h-[52px]"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F2F57] flex items-center justify-center text-white shadow-sm">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                <span>Mulai Petualangan</span>
              </button>

              <button
                onClick={handleSpeakWelcome}
                className="px-5 py-3.5 rounded-full bg-white/95 hover:bg-white text-[#0F2F57] font-black text-sm sm:text-base border-2 border-[#0F2F57]/20 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-103 min-h-[48px]"
                title="Dengarkan Petunjuk Suara"
              >
                <Volume2 className="w-5 h-5 text-[#FB8500]" />
                <span>Dengar Suara</span>
              </button>

              <button
                onClick={() => {
                  audioManager.playClick();
                  onOpenEcoBot();
                }}
                className="px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-103 min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-[#FFC21A]" />
                <span>Tanya EcoBot</span>
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* 6. Empat Kartu Menu Besar Sangat Rounded Bertema Pastel (Requirement 6 & 9) */}
      <section className="space-y-4">
        
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#0F2F57] flex items-center gap-2.5">
              <span>🌟</span>
              <span>Pilihan Petualangan EkoRia</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-bold">
              Pilih ruangan atau aktivitas yang ingin kamu selesaikan hari ini:
            </p>
          </div>
        </div>

        {/* 4 Pastel Cards (2x2 on Mobile, 4 columns on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Ruang Pameran (Pastel Blue #E2F1FF) */}
          <div
            onClick={() => {
              audioManager.playClick();
              // Scroll or jump into habitat exhibition
              const exhibitsElem = document.getElementById('exhibits-section');
              if (exhibitsElem) {
                exhibitsElem.scrollIntoView({ behavior: 'smooth' });
              } else {
                onEnterRoom('hutan-harmoni');
              }
            }}
            className="group relative rounded-[2.5rem] bg-[#E2F1FF] border-3 border-sky-200/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[220px] sm:min-h-[260px]"
          >
            {/* Top 3D Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-md border-2 border-white bg-white/70 group-hover:scale-108 transition-transform duration-300">
                <img
                  src={img_icon_exhibits_book_3d}
                  alt="Ruang Pameran"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#0F2F57] shadow-sm group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            {/* Label & Description */}
            <div className="relative z-10 mt-4 space-y-1">
              <div className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#0F2F57] group-hover:text-sky-900 transition-colors">
                Ruang Pameran
              </div>
              <p className="text-xs sm:text-sm font-bold text-sky-800 line-clamp-2">
                Empat habitat alam: hutan, sungai, laut, dan sawah.
              </p>
            </div>

            {/* Bukit Dekoratif di Dasar Kartu (SVG Hills) */}
            <div className="absolute -bottom-1 -left-2 -right-2 h-14 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full fill-sky-300">
                <path d="M0.00,49.98 C150.00,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
              </svg>
            </div>
          </div>

          {/* Card 2: Laboratorium Seru (Pastel Mint Green #E2F8EC) */}
          <div
            onClick={() => {
              audioManager.playClick();
              onNavigate('simulation');
            }}
            className="group relative rounded-[2.5rem] bg-[#E2F8EC] border-3 border-emerald-200/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[220px] sm:min-h-[260px]"
          >
            {/* Top 3D Icon: daun dengan kaca pembesar, tanpa gelas laboratorium */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-md border-2 border-white bg-white/70 group-hover:scale-108 transition-transform duration-300">
                <img
                  src={img_icon_lab_leaf_3d}
                  alt="Laboratorium Seru"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#0F2F57] shadow-sm group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            {/* Label & Description */}
            <div className="relative z-10 mt-4 space-y-1">
              <div className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#0F2F57] group-hover:text-emerald-900 transition-colors">
                Laboratorium Seru
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-800 line-clamp-2">
                Simulasi ekosistem dan jamur pengurai di lantai hutan.
              </p>
            </div>

            {/* Bukit Dekoratif di Dasar Kartu (SVG Hills) */}
            <div className="absolute -bottom-1 -left-2 -right-2 h-14 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full fill-emerald-300">
                <path d="M0.00,49.98 C190.00,140.00 310.81,-29.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
              </svg>
            </div>
          </div>

          {/* Card 3: Kuis Latihan (Pastel Light Purple #F1EAFF) */}
          <div
            onClick={() => {
              audioManager.playClick();
              onNavigate('pretest');
            }}
            className="group relative rounded-[2.5rem] bg-[#F1EAFF] border-3 border-purple-200/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[220px] sm:min-h-[260px]"
          >
            {/* Top 3D Icon: game controller */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-md border-2 border-white bg-white/70 group-hover:scale-108 transition-transform duration-300">
                <img
                  src={img_icon_quiz_gamepad_3d}
                  alt="Kuis Latihan"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#0F2F57] shadow-sm group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            {/* Label & Description */}
            <div className="relative z-10 mt-4 space-y-1">
              <div className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#0F2F57] group-hover:text-purple-900 transition-colors">
                Kuis Latihan
              </div>
              <p className="text-xs sm:text-sm font-bold text-purple-800 line-clamp-2">
                Tes Awal dan Tes Akhir, masing-masing 20 soal berhadiah XP.
              </p>
            </div>

            {/* Bukit Dekoratif di Dasar Kartu (SVG Hills) */}
            <div className="absolute -bottom-1 -left-2 -right-2 h-14 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full fill-purple-300">
                <path d="M0.00,49.98 C130.00,160.00 360.81,-39.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
              </svg>
            </div>
          </div>

          {/* Card 4: Pencapaian (Pastel Light Yellow #FFF6DB) */}
          <div
            onClick={() => {
              audioManager.playClick();
              onNavigate('certificate');
            }}
            className="group relative rounded-[2.5rem] bg-[#FFF6DB] border-3 border-amber-200/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer min-h-[220px] sm:min-h-[260px]"
          >
            {/* Top 3D Icon: medali emas */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-md border-2 border-white bg-white/70 group-hover:scale-108 transition-transform duration-300">
                <img
                  src={img_icon_achieve_medal_3d}
                  alt="Pencapaian"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#0F2F57] shadow-sm group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            {/* Label & Description - Dark text on yellow for WCAG AA compliance */}
            <div className="relative z-10 mt-4 space-y-1">
              <div className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#0F2F57] group-hover:text-amber-950 transition-colors">
                Pencapaian
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-950 line-clamp-2">
                Koleksi {progress.badges.length} lencana & cetak sertifikat resmi.
              </p>
            </div>

            {/* Bukit Dekoratif di Dasar Kartu (SVG Hills) */}
            <div className="absolute -bottom-1 -left-2 -right-2 h-14 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full fill-amber-300">
                <path d="M0.00,49.98 C170.00,130.00 320.81,-19.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
              </svg>
            </div>
          </div>

        </div>

      </section>

      {/* 4 Interactive Habitat Rooms Grid */}
      <section id="exhibits-section" className="space-y-4 pt-4">
        
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#0F2F57]">
              Pilih Ruang Habitat di Peta:
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-bold">
              Klik salah satu habitat untuk mengamati rantai makanan dan interaksi makhluk hidup:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MUSEUM_ROOMS.map((room) => {
            const isCompleted = progress.completedRooms.includes(room.id);
            const currentRoomProgress = progress.roomProgress[room.id] || 0;

            return (
              <div
                key={room.id}
                onClick={() => {
                  audioManager.playClick();
                  onEnterRoom(room.id);
                }}
                className="group rounded-[2rem] overflow-hidden border-3 border-slate-200/80 hover:border-[#1E7A50] bg-white transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={room.bgImage}
                    alt={room.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Room Number Badge */}
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 text-xs font-black text-[#0F2F57] shadow border border-slate-200 font-['Fredoka']">
                    Ruang {room.roomNumber ?? room.zoneNumber ?? 1}
                  </div>

                  {isCompleted && (
                    <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#1E7A50] text-white text-xs font-black flex items-center gap-1.5 shadow">
                      <CheckCircle2 className="w-4 h-4" /> Selesai!
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 text-white font-['Fredoka'] font-black text-2xl sm:text-3xl drop-shadow">
                    {room.title}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-black text-[#1E7A50] uppercase tracking-wider">
                      {room.theme}
                    </div>
                    <p className="text-base text-slate-700 font-bold leading-relaxed mt-1">
                      {room.tagline}
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-1.5 pt-2 border-t-2 border-slate-100">
                    <div className="flex justify-between text-xs font-black text-slate-500">
                      <span>Kemajuan Ruangan:</span>
                      <span className="text-[#1E7A50] font-mono">{currentRoomProgress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-[#1E7A50] to-[#2ECC71] transition-all duration-500 rounded-full"
                        style={{ width: `${currentRoomProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Child Friendly Pill Button */}
                  <div className="pt-1">
                    <button
                      className="w-full py-3 px-4 rounded-full bg-[#E2F8EC] group-hover:bg-[#1E7A50] text-[#1E7A50] group-hover:text-white font-black text-base transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <span>Ayo Masuk!</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* Badges Collection & Certificate Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Badges collection */}
        <div className="p-6 rounded-[2.5rem] bg-white border-3 border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Fredoka'] text-xl sm:text-2xl font-black text-[#0F2F57] flex items-center gap-2">
              <Award className="w-6 h-6 text-[#FB8500]" />
              <span>Lencana Petualang Cilik</span>
            </h3>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              {progress.badges.length} / {MUSEUM_BADGES.length} Diraih
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {MUSEUM_BADGES.map((b) => {
              const isEarned = progress.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
                    isEarned
                      ? 'bg-[#E2F8EC] border-[#1E7A50] shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
                  }`}
                  title={b.description}
                >
                  <div className="text-3xl mb-1">{b.icon}</div>
                  <div className="font-black text-xs text-[#0F2F57] leading-tight font-['Fredoka']">
                    {b.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Callout */}
        <div className="p-6 sm:p-7 rounded-[2.5rem] bg-gradient-to-br from-[#E2F8EC] via-white to-[#E2F1FF] border-3 border-emerald-300 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-black text-[#1E7A50] uppercase tracking-wider">
              Prestasi Kelulusan
            </span>
            <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-black text-[#0F2F57] mt-1">
              Sertifikat Penjelajah Cilik
            </h3>
            <p className="text-base text-slate-700 mt-2 font-bold leading-relaxed">
              Selesaikan tes akhir untuk menguji pengetahuanmu, lalu cetak sertifikat resmi berisi nama dan lencanamu!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('posttest');
              }}
              className="px-6 py-3.5 rounded-full bg-[#1E7A50] hover:bg-[#16603F] text-white font-black text-base shadow-md cursor-pointer transition-transform hover:scale-103 min-h-[48px]"
            >
              Uji Akhir (Post-Test)
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                onNavigate('certificate');
              }}
              className="px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0F2F57] font-black text-base border-2 border-slate-300 shadow-sm cursor-pointer transition-all hover:scale-103 min-h-[48px]"
            >
              Lihat Sertifikat
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
