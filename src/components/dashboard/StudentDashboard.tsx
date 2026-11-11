import React, { useState } from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Bookmark, 
  Home, 
  CheckCircle2, 
  Bell, 
  Sparkles, 
  LogOut,
  ChevronRight,
  Flame,
  ShieldAlert,
  Play,
  UserCircle2
} from 'lucide-react';
import { LogoutConfirmDialog } from '../common/AppNav';
import { StudentProgress, StudentProfile, ZoneId, ViewState } from '../../types';
import { MUSEUM_ZONES, MUSEUM_BADGES } from '../../data/museumZonesData';
import { EkoHeart, EkoZoneIcon, EkoLogoIcon } from '../common/EkoIcons';
import { SoundToggle } from '../common/SoundToggle';
import naraAvatar from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface StudentDashboardProps {
  progress: StudentProgress;
  profile: StudentProfile;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onSelectZone: (zoneId: ZoneId) => void;
  onLogout: () => void;
  onOpenOzi: () => void;
  onOpenProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  profile,
  currentView,
  onNavigate,
  onSelectZone,
  onLogout,
  onOpenOzi,
  onOpenProfile,
}) => {
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const completedCount = progress.completedRooms?.length || 0;
  const progressPercent = Math.min(100, Math.round((completedCount / 8) * 100));
  
  // Find last visited zone or default to hutan
  const lastZoneId = progress.lastVisitedZone || 'hutan';
  const lastZone = MUSEUM_ZONES.find(z => z.id === lastZoneId) || MUSEUM_ZONES[0];
  const lastZoneProgress = progress.roomProgress[lastZoneId] || 0;

  // Active missions count
  const totalMissions = MUSEUM_ZONES.reduce((acc, z) => acc + z.zoneMissions.length, 0);
  const estimatedCompletedMissions = Math.min(totalMissions, Math.floor((progress.discoveredOrganisms.length * 1.5)));

  // Navigation items for the sidebar & mobile bottom bar
  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Beranda', icon: Home },
    { id: 'museum-hub' as ViewState, label: 'Museum', icon: MapIcon },
    { id: 'zone-view' as ViewState, label: 'Misi Petualangan', icon: Compass },
    { id: 'journal' as ViewState, label: 'Jurnal Penjelajah', icon: Bookmark },
    { id: 'encyclopedia' as ViewState, label: 'Ensiklopedia', icon: BookOpen },
    { id: 'quiz' as ViewState, label: 'Kuis & Evaluasi', icon: HelpCircle },
    { id: 'achievements' as ViewState, label: 'Pencapaian', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E3] flex flex-col md:flex-row text-[#0F3D2E] font-sans selection:bg-[#F5C518] selection:text-[#0F3D2E]">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F3D2E] text-white p-5 justify-between shadow-xl z-20 shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#1B5E3F]">
            <EkoLogoIcon size={38} className="shrink-0 drop-shadow-md" />
            <div>
              <div className="font-heading font-extrabold text-lg text-white leading-tight">EkoRia</div>
              <div className="text-[10px] text-[#8BC34A] tracking-wider uppercase font-semibold">Museum Sains Virtual</div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'zone-view' && currentView === 'zone-view');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'zone-view') {
                      onSelectZone(lastZoneId);
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F5C518] text-[#0F3D2E] shadow-md font-bold'
                      : 'text-[#E0E7E2] hover:bg-[#1B5E3F] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-[#E0E7E2] hover:bg-[#1B5E3F] hover:text-white"
              >
                <UserCircle2 className="w-5 h-5 shrink-0" />
                <span>Profil Saya</span>
              </button>
            )}
          </nav>
        </div>

        {/* Ozi AI companion card in sidebar */}
        <div className="space-y-3 pt-4 border-t border-[#1B5E3F]">
          <button
            type="button"
            onClick={onOpenOzi}
            aria-label="Tanya Ozi"
            className="w-full text-left bg-[#1B5E3F] hover:bg-[#256f4d] p-3 rounded-2xl cursor-pointer transition-all border border-[#3FA34D]/30 flex items-center gap-3 group shadow"
          >
            <img 
              src={oziAvatar} 
              alt="Ozi Robot" 
              className="w-11 h-11 rounded-full border-2 border-[#F5C518] bg-white object-cover shrink-0 group-hover:scale-105 transition-transform" 
            />
            <div className="min-w-0">
              <div className="text-xs text-[#8BC34A] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F5C518]" /> Panduan Ozi
              </div>
              <div className="text-sm font-bold text-white truncate">Tanya Ozi</div>
              <div className="text-[11px] text-emerald-200 truncate">Siap membantumu 24/7!</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsConfirmLogoutOpen(true)}
            className="w-full min-h-[48px] flex items-center justify-center gap-2 py-2 px-3 text-sm font-bold text-emerald-100 hover:text-white hover:bg-rose-600/70 border border-white/15 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen pb-8">
        
        {/* HEADER */}
        <header className="bg-white border-b border-[#E8DEC9] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={naraAvatar} 
                alt="Avatar Nara" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#3FA34D] object-cover shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#3FA34D] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                V
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-base sm:text-lg md:text-xl font-heading font-extrabold text-[#0F3D2E] break-words">
                  Halo, {profile.fullName || profile.username}! 👋
                </h1>
                {/* Heart bar HUD */}
                <div className="flex items-center gap-1.5 bg-[#FFF0F0] px-2.5 py-1 rounded-full border border-red-200 shadow-xs" title="Nyawa Penjelajah">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <EkoHeart key={i} filled={i < (progress.hearts ?? 4)} size="sm" />
                  ))}
                </div>
              </div>
              <p className="hidden sm:block text-xs text-[#52796F] font-medium">
                Siap melanjutkan petualangan di EkoRia? Kelas {profile.className || '5 SD'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={() => onNavigate('pretest')}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 min-h-[44px] rounded-xl border transition ${
                progress.preTestCompleted 
                  ? 'bg-emerald-50 text-[#1B5E3F] border-[#3FA34D]/30' 
                  : 'bg-[#FFF9E6] text-[#0F3D2E] border-[#F5C518]'
              }`}
            >
              <span>{progress.preTestCompleted ? `Tes Awal: ${progress.preTestScore}%` : 'Mulai Tes Awal'}</span>
            </button>

            <button 
              onClick={() => onNavigate('posttest')}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-bold px-3 min-h-[44px] rounded-xl border transition ${
                progress.postTestCompleted 
                  ? 'bg-emerald-50 text-[#1B5E3F] border-[#3FA34D]/30' 
                  : 'bg-[#FFF9E6] text-[#0F3D2E] border-[#F5C518]'
              }`}
            >
              <span>{progress.postTestCompleted ? `Tes Akhir: ${progress.postTestScore}%` : 'Tes Akhir'}</span>
            </button>

            <SoundToggle variant="light" />

            <button 
              onClick={onOpenOzi}
              className="hidden sm:flex w-11 h-11 items-center justify-center rounded-xl text-[#0F3D2E] hover:bg-[#F6F1E3] transition relative"
              title="Pemberitahuan & Tips Ozi"
              aria-label="Tips dari Ozi"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-[#F5C518] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            {onOpenProfile && (
              <button 
                onClick={onOpenProfile}
                className="hidden md:flex min-h-[44px] items-center gap-1.5 px-3 rounded-xl border border-[#E8DEC9] text-[#0F3D2E] hover:bg-[#F6F1E3] text-xs font-bold transition"
                title="Profil Saya"
              >
                <UserCircle2 className="w-5 h-5" />
                <span>Profil</span>
              </button>
            )}
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* TOP HERO ROW: Continue Adventure & Progress Ring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* LARGE CARD: Lanjutkan Petualangan (Span 2) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3D2E] to-[#1B5E3F] text-white p-6 shadow-lg flex flex-col justify-between">
              {/* Background ambient illustration tint */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${lastZone.bgImage})` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-[#F5C518] text-[#0F3D2E] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
                    <Compass className="w-3.5 h-3.5" /> Zona Terakhir Dikunjungi
                  </span>
                  <span className="text-xs text-[#8BC34A] font-bold">
                    Zona #{lastZone.zoneNumber} dari 8
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2">
                  {lastZone.title}
                </h2>
                <p className="text-sm text-[#E0E7E2] max-w-xl mb-4 line-clamp-2">
                  {lastZone.welcomeSpeech || lastZone.tagline}
                </p>

                {/* Mini Zone Progress Bar */}
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm max-w-md border border-white/10 mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-emerald-100">
                    <span>Misi Aktif: Temukan organisme & faktor abiotik</span>
                    <span className="text-[#F5C518] font-bold">{lastZoneProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8BC34A] to-[#F5C518] transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(5, lastZoneProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectZone(lastZone.id)}
                  className="bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold px-6 py-3 rounded-2xl shadow-md hover:bg-[#ffe066] active:scale-95 transition-all flex items-center gap-2 text-sm md:text-base cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>▶ Lanjutkan Petualangan</span>
                </button>
                <button
                  onClick={() => onNavigate('museum-hub')}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-3 rounded-2xl border border-white/20 transition-all text-sm flex items-center gap-2"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Pilih Zona Lain (Hub)</span>
                </button>
              </div>
            </div>

            {/* CARD: Progres Belajar (Ring Progress) */}
            <div className="rounded-3xl bg-white border border-[#E8DEC9] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-[#0F3D2E] mb-1">
                  Progres Belajar
                </h3>
                <p className="text-xs text-[#52796F]">
                  Target Kurikulum Merdeka IPAS Bab 3
                </p>
              </div>

              {/* Circular progress visual */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#E8DEC9"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3FA34D"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-heading font-extrabold text-[#0F3D2E]">
                      {progressPercent}%
                    </span>
                    <span className="text-[10px] text-[#52796F] font-bold uppercase">Selesai</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm font-bold text-[#0F3D2E]">
                    <span className="text-[#3FA34D]">{completedCount}</span> dari 8 zona sudah dijelajahi
                  </p>
                  <p className="text-xs text-[#52796F] mt-0.5">
                    {progress.totalXP || 0} XP • {progress.totalStars || 0} Bintang
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('achievements')}
                className="w-full py-2.5 px-3 rounded-xl border border-[#3FA34D] text-[#1B5E3F] hover:bg-emerald-50 text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-[#3FA34D]" />
                <span>Lihat Sertifikat & Lencana</span>
              </button>
            </div>
          </div>

          {/* FOUR QUICK CARDS: Peta Museum, Misi Aktif, Koleksi, Lencana */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Card 1: Peta Museum */}
            <div 
              onClick={() => onNavigate('museum-hub')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (() => onNavigate('museum-hub'))(); } }}
              className="bg-white hover:bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B5E3F] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MapIcon className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F3D2E]">Peta Museum</h4>
                <p className="text-xs text-[#52796F] mt-0.5">8 Zona Eksplorasi</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#3FA34D]">
                <span>Buka Hub</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Misi Aktif */}
            <div 
              onClick={() => onSelectZone(lastZone.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (() => onSelectZone(lastZone.id))(); } }}
              className="bg-white hover:bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#0F3D2E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F3D2E]">Misi Aktif</h4>
                <p className="text-xs text-[#52796F] mt-0.5">{estimatedCompletedMissions} / {totalMissions} checklist</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Jalankan Misi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Koleksi Temuan */}
            <div 
              onClick={() => onNavigate('journal')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (() => onNavigate('journal'))(); } }}
              className="bg-white hover:bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F3D2E]">Koleksi</h4>
                <p className="text-xs text-[#52796F] mt-0.5">{progress.journalEntries?.length || progress.discoveredOrganisms?.length || 0} temuan dicatat</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>Buka Jurnal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Lencana & Prestasi */}
            <div 
              onClick={() => onNavigate('achievements')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (() => onNavigate('achievements'))(); } }}
              className="bg-white hover:bg-[#FFFDF7] p-5 rounded-2xl border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#0F3D2E]">Lencana</h4>
                <p className="text-xs text-[#52796F] mt-0.5">{progress.badges?.length || 0} dari {MUSEUM_BADGES.length} diraih</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Pencapaian</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

          {/* 8 ZONES GRID SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#0F3D2E]">
                  Peta 8 Zona Museum EkoRia
                </h3>
                <p className="text-xs text-[#52796F]">
                  Disusun berurutan sesuai Buku IPAS Kelas V Bab 3
                </p>
              </div>
              <button 
                onClick={() => onNavigate('museum-hub')}
                className="text-xs font-bold text-[#1B5E3F] hover:text-[#0F3D2E] underline flex items-center gap-1"
              >
                <span>Masuk Aula Pusat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MUSEUM_ZONES.map((zone) => {
                const zonePercent = progress.roomProgress[zone.id] || 0;
                const isCompleted = zonePercent >= 100 || progress.completedRooms.includes(zone.id);

                return (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (() => onSelectZone(zone.id))(); } }}
                    className="group bg-white rounded-2xl border border-[#E8DEC9] overflow-hidden shadow-sm hover:shadow-md hover:border-[#3FA34D] transition-all cursor-pointer flex flex-col"
                  >
                    {/* Zone Image */}
                    <div className="relative h-28 overflow-hidden bg-emerald-950">
                      <img 
                        src={zone.bgImage} 
                        alt={zone.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Badge zone number */}
                      <span className="absolute top-2 left-2 bg-[#0F3D2E]/80 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/20">
                        Zona #{zone.zoneNumber}
                      </span>

                      {/* Completed checkmark */}
                      {isCompleted && (
                        <span className="absolute top-2 right-2 bg-[#3FA34D] text-white text-xs p-1 rounded-full shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}

                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F5C518] line-clamp-1 mb-0.5">
                          <EkoZoneIcon zoneId={zone.id} size="xs" />
                          <span>{zone.theme}</span>
                        </div>
                        <h4 className="text-sm font-heading font-bold text-white line-clamp-1">
                          {zone.title}
                        </h4>
                      </div>
                    </div>

                    {/* Zone Info Footer */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="text-[11px] text-[#52796F] line-clamp-2 mb-2">
                        {zone.curriculumTopic}
                      </p>
                      
                      <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
                        <div className="text-[10px] text-[#52796F] font-semibold">
                          {zone.organisms.length} biota • {zone.abioticFactors.length} abiotik
                        </div>
                        <span className="text-xs font-bold text-[#3FA34D] group-hover:underline flex items-center gap-0.5">
                          Eksplor <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {isConfirmLogoutOpen && (
        <LogoutConfirmDialog
          onCancel={() => setIsConfirmLogoutOpen(false)}
          onConfirm={() => {
            setIsConfirmLogoutOpen(false);
            onLogout();
          }}
        />
      )}

    </div>
  );
};
