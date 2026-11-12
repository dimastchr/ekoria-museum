import React from 'react';
import { Sparkles, ArrowRight, Compass, BookOpen, ShieldCheck, Award, Heart, CheckCircle2, Trees, Droplets, Fish, Sun, Layers } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { SoundToggle } from '../common/SoundToggle';
import img_avatar_nara_explorer from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';
import img_avatar_ozi_robot from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';
import img_ecoria_hero_forest_museum from '../../assets/images/ecoria_hero_forest_museum_1794244173997.jpg';

interface LandingPageProps {
  onStartExploration: () => void;
  onOpenLogin: () => void;
  onOpenTeacherLogin?: () => void;
  onOpenTeacherPortal?: () => void;
  onOpenOzi?: () => void;
  /** Opens "Profil Saya" for the pupil who is logged in (never an account switcher). */
  onOpenProfile?: () => void;
  studentName?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartExploration,
  onOpenLogin,
  onOpenTeacherLogin,
  onOpenTeacherPortal,
  onOpenOzi,
  onOpenProfile,
  studentName
}) => {
  const handleTeacherPortal = onOpenTeacherPortal || onOpenTeacherLogin || onOpenLogin;
  const handleOpenOzi = () => {
    audioManager.playClick();
    if (onOpenOzi) onOpenOzi();
  };
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E3] text-[#0F3D2E] font-['Manrope',sans-serif] selection:bg-[#F5C518] selection:text-[#0F3D2E]">
      
      {/* 1. Rounded White Floating Navbar */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-[#1B5E3F]/15 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo with Leaf Icon & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-[#1B5E3F] to-[#3FA34D] flex items-center justify-center text-white shadow-sm">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-[#0F3D2E] leading-none flex items-center gap-1.5">
                <span>EkoRia</span>
                <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E2F8EC] text-[#1B5E3F] border border-[#3FA34D]/30">
                  SD Kelas V
                </span>
              </div>
              <div className="hidden sm:block text-[11px] font-bold text-[#3FA34D] tracking-wider uppercase">
                Museum Sains Virtual
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#0F3D2E]/80">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#1B5E3F] transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('museum-preview')}
              className="hover:text-[#1B5E3F] transition-colors cursor-pointer"
            >
              Museum
            </button>
            <button
              onClick={() => scrollToSection('fitur')}
              className="hover:text-[#1B5E3F] transition-colors cursor-pointer"
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('panduan')}
              className="hover:text-[#1B5E3F] transition-colors cursor-pointer"
            >
              Panduan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="hover:text-[#1B5E3F] transition-colors cursor-pointer"
            >
              Tentang
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <SoundToggle variant="light" className="rounded-full" />
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                if (studentName && onOpenProfile) onOpenProfile();
                else onOpenLogin();
              }}
              aria-label={studentName ? 'Profil saya' : 'Masuk'}
              className={`${studentName ? 'flex' : 'hidden sm:flex'} items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-full border-2 border-[#1B5E3F] text-[#1B5E3F] hover:bg-[#1B5E3F] hover:text-white font-bold text-xs sm:text-sm cursor-pointer transition-all`}
            >
              {studentName ? (
                <>
                  <span aria-hidden="true">👤</span>
                  <span className="hidden sm:inline">Profil ({studentName})</span>
                </>
              ) : (
                'Masuk'
              )}
            </button>

            <button
              onClick={() => {
                audioManager.playClick();
                onStartExploration();
              }}
              className="min-h-[44px] px-3 sm:px-5 rounded-full bg-[#1B5E3F] hover:bg-[#0F3D2E] text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center gap-1.5"
            >
              <span><span className="sm:hidden">Mulai</span><span className="hidden sm:inline">Mulai Eksplorasi</span></span>
              <span>▶</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Hero Section with Lush Forest, Dome Museum, Nara & Ozi Background */}
      <section className="relative px-4 pt-8 pb-16 sm:pb-24 max-w-6xl mx-auto">
        
        {/* Hero Card Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white min-h-[540px] flex flex-col justify-end p-6 sm:p-12 text-white">
          
          {/* Background Illustration */}
          <img
            src={img_ecoria_hero_forest_museum}
            alt="Museum Sains Virtual EkoRia - Hutan Tropis dan Karakter Nara & Ozi"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Gradient Scrim for WCAG AA Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E]/95 via-[#0F3D2E]/65 to-transparent pointer-events-none" />

          {/* Radiant Sunbeam Light Effect Overlay */}
          <div className="absolute inset-0 sunbeam-rays-overlay opacity-50" />

          {/* Animated Soft Forest Mist Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-950/40 via-green-900/20 to-transparent pointer-events-none animate-mist-left opacity-70" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            
            {/* Round Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/30 shadow-sm">
              <span className="text-[#F5C518]">★</span>
              <span>Museum Sains Virtual</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Jelajahi Alam. <br />
              <span className="text-[#F5C518]">Temukan Rahasia Kehidupan.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/95 font-medium leading-relaxed drop-shadow">
              Masuki dunia EkoRia dan pelajari harmoni dalam ekosistem melalui petualangan yang interaktif, seru, dan bermakna bersama Nara dan robot pemandu Ozi.
            </p>

            {/* Actions & Tag */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              
              {/* Primary CTA Yellow Button with Dark Green Text */}
              <button
                onClick={() => {
                  audioManager.playClick();
                  onStartExploration();
                }}
                className="px-7 py-3.5 rounded-full bg-[#F5C518] hover:bg-[#e4b514] text-[#0F3D2E] font-black text-base shadow-xl cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>▶</span>
                <span>Mulai Eksplorasi Sekarang</span>
              </button>

              <button
                onClick={() => {
                  audioManager.playClick();
                  scrollToSection('museum-preview');
                }}
                className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-sm border border-white/40 cursor-pointer transition-colors"
              >
                Lihat 8 Zona Ekosistem
              </button>
            </div>

            {/* Curriculum Tag */}
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-white/80 font-bold">
              <span>🏷️</span>
              <span>IPAS Kelas V SD Kurikulum Merdeka</span>
              <span>·</span>
              <span>Bab 3: Harmoni dalam Ekosistem</span>
            </div>

          </div>

          {/* Ozi Mascot Quick Callout badge in corner (tap to open Ozi's guide/chat) */}
          <button
            type="button"
            onClick={handleOpenOzi}
            aria-label="Ketuk Ozi untuk membuka obrolan pemandu"
            title="Ketuk Ozi untuk bertanya"
            className="flex absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-white shadow-lg items-center gap-3 text-slate-800 animate-float cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F5C518]"
          >
            <img
              src={img_avatar_ozi_robot}
              alt="Ozi Robot AI"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#F5C518] pointer-events-none"
            />
            <div className="text-left pr-2 pointer-events-none">
              <div className="font-extrabold text-xs text-[#0F3D2E]">Halo! Aku Ozi 🤖</div>
              <div className="hidden sm:block text-[11px] font-semibold text-[#1B5E3F]">Ketuk aku untuk bertanya!</div>
            </div>
          </button>

        </div>
      </section>

      {/* 3. Museum Hub Preview: 8 Zones Showcase */}
      <section id="museum-preview" className="py-12 px-4 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-[#3FA34D]">
            8 Zona Petualangan Interaktif
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">
            Jelajahi Ekosistem Nyata dari Hutan hingga Pelestarian
          </h2>
          <p className="text-sm sm:text-base text-[#0F3D2E]/80 font-medium">
            Setiap zona dirancang sebagai adegan ilustrasi kartun 3D cerah yang dapat digeser dan diketuk untuk mengamati makhluk hidup dan benda tak hidup.
          </p>
        </div>

        {/* 8 Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {[
            { id: 'hutan', num: 1, title: 'Hutan', icon: '🌲', topic: 'Pohon meranti, rusa, harimau, dan jamur pengurai.' },
            { id: 'padang-rumput', num: 2, title: 'Padang Rumput', icon: '🌾', topic: 'Savanna Baluran: rumput, belalang, kelinci, sapi, dan elang.' },
            { id: 'sungai-danau', num: 3, title: 'Sungai & Danau', icon: '💧', topic: 'Sungai & Danau — Ikan wader, batu kali, dan capung penanda air bersih.' },
            { id: 'laut', num: 4, title: 'Laut', icon: '🪸', topic: 'Hewan karang hidup, ikan badut, dan penyu bebas plastik.' },
            { id: 'rantai-makanan', num: 5, title: 'Rantai Makanan', icon: '🔗', topic: 'Rantai Makanan — Aliran energi dari produsen ke konsumen hingga pengurai.' },
            { id: 'keseimbangan-ekosistem', num: 6, title: 'Keseimbangan Ekosistem', icon: '⚖️', topic: 'Keseimbangan Ekosistem — Simulasi keseimbangan tiga kelompok makhluk hidup dan cara memperbaiki gangguan.' },
            { id: 'ekosistem-buatan', num: 7, title: 'Ekosistem Buatan', icon: '🏡', topic: 'Ekosistem Buatan — Sawah, mina padi (padi dan ikan), dan pemangsa alami hama.' },
            { id: 'pelestarian-lingkungan', num: 8, title: 'Pelestarian Lingkungan', icon: '🌱', topic: 'Pelestarian Lingkungan — Memilah sampah organik dan anorganik, menanam kembali hutan, dan menghemat air.' },
          ].map((z) => (
            <div
              key={z.id}
              onClick={() => {
                audioManager.playClick();
                onStartExploration();
              }}
              className="bg-white rounded-2xl p-5 border-2 border-[#1B5E3F]/15 hover:border-[#1B5E3F] shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{z.icon}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F6F1E3] text-[#1B5E3F] border border-[#1B5E3F]/20">
                  Zona 0{z.num}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-[#0F3D2E] group-hover:text-[#1B5E3F] transition-colors">
                {z.title}
              </h3>
              <p className="text-xs text-[#0F3D2E]/70 mt-1 font-medium leading-relaxed">
                {z.topic}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1B5E3F]">
                <span>Eksplorasi Zona</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* 4. Features Section */}
      <section id="fitur" className="py-12 bg-white/70 border-y border-[#1B5E3F]/15 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[#3FA34D]">
              Fitur Edukasi Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E]">
              Dirancang Khusus untuk Anak Kelas V SD
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#F6F1E3] border border-[#1B5E3F]/20 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E3F] text-white flex items-center justify-center text-2xl shadow-sm">
                🗣️
              </div>
              <h3 className="text-lg font-extrabold text-[#0F3D2E]">
                Narasi Suara Berbahasa Indonesia
              </h3>
              <p className="text-sm text-[#0F3D2E]/80 font-medium leading-relaxed">
                Setiap petunjuk, pertanyaan kuis, dan dialog Ozi dibacakan dengan suara ramah dan jelas, membantu anak belajar mandiri di Chromebook maupun HP.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F6F1E3] border border-[#1B5E3F]/20 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5C518] text-[#0F3D2E] flex items-center justify-center text-2xl shadow-sm">
                📖
              </div>
              <h3 className="text-lg font-extrabold text-[#0F3D2E]">
                Jurnal Penjelajah & Ensiklopedia
              </h3>
              <p className="text-sm text-[#0F3D2E]/80 font-medium leading-relaxed">
                Siswa dapat mengumpulkan temuan biotik dan abiotik di Jurnal Penjelajah pribadi, serta membuka kamus istilah sains ekosistem lengkap.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F6F1E3] border border-[#1B5E3F]/20 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3FA34D] text-white flex items-center justify-center text-2xl shadow-sm">
                ☁️
              </div>
              <h3 className="text-lg font-extrabold text-[#0F3D2E]">
                Penyimpanan Daring (Cloud) & Dasbor Guru
              </h3>
              <p className="text-sm text-[#0F3D2E]/80 font-medium leading-relaxed">
                Progres belajar, nilai pre-test dan post-test 20 soal tersimpan aman di Cloud Firestore. Guru dapat memantau capaian kelas dan analisis N-Gain.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Guide / Panduan Singkat */}
      <section id="panduan" className="py-12 px-4 max-w-6xl mx-auto space-y-8">
        <div className="bg-[#0F3D2E] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3.5 py-1 rounded-full bg-[#F5C518] text-[#0F3D2E] font-extrabold text-xs">
              Panduan Guru & Siswa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Akses Portal Pembelajaran & Kelola Kelas dengan Mudah
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed">
              Guru dapat membuat akun siswa tanpa memerlukan email pribadi anak, memantau kemajuan belajar di 8 zona, serta mengunduh rekap nilai asesmen dalam format CSV.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  audioManager.playClick();
                  handleTeacherPortal();
                }}
                className="px-6 py-3 rounded-full bg-[#F5C518] hover:bg-[#e4b514] text-[#0F3D2E] font-black text-sm cursor-pointer transition-transform hover:scale-105"
              >
                Buka Portal Guru 👩‍🏫
              </button>
              <button
                onClick={() => {
                  audioManager.playClick();
                  onStartExploration();
                }}
                className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 cursor-pointer"
              >
                Masuk sebagai Siswa 🎒
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <img
              src={img_avatar_nara_explorer}
              alt="Nara Penjelajah"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl"
            />
            <button
              type="button"
              onClick={handleOpenOzi}
              aria-label="Ketuk Ozi untuk membuka obrolan pemandu"
              title="Ketuk Ozi untuk bertanya"
              className="rounded-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F5C518] hover:scale-105 transition-transform"
            >
              <img
                src={img_avatar_ozi_robot}
                alt="Ozi Robot AI"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#F5C518] shadow-2xl animate-float pointer-events-none"
              />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="tentang" className="border-t border-[#1B5E3F]/15 bg-white/80 py-8 text-xs text-[#0F3D2E]/70">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0F3D2E] text-sm">Museum Sains Virtual EkoRia</span>
            <span>·</span>
            <span>IPAS Kelas V SD Kurikulum Merdeka</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <button
              onClick={() => {
                audioManager.playClick();
                handleTeacherPortal();
              }}
              className="hover:text-[#1B5E3F] cursor-pointer"
            >
              Portal Guru
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                onStartExploration();
              }}
              className="hover:text-[#1B5E3F] cursor-pointer"
            >
              Masuk Museum
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
