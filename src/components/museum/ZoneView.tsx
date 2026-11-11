import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Compass, 
  Map as MapIcon, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Bookmark, 
  Info,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  FlaskConical,
  Activity,
  Heart
} from 'lucide-react';
import { ZoneId, ZoneData, Organism, AbioticFactor, StudentProgress, StudentProfile } from '../../types';
import { MUSEUM_ZONES } from '../../data/museumZonesData';
import { audioManager } from '../../utils/audioManager';
import { ObjectDetailModal } from './ObjectDetailModal';
import { EkoHeart, EkoBiotaIcon } from '../common/EkoIcons';
import naraAvatar from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface ZoneViewProps {
  zoneId: ZoneId;
  progress: StudentProgress;
  profile: StudentProfile;
  onBackToHub: () => void;
  onOpenOzi: () => void;
  onSaveToJournal: (item: Organism | AbioticFactor, zone: ZoneData) => void;
  onLaunchInteractive?: (activityType: 'decomposer' | 'food-chain' | 'simulation' | 'trash-sorting') => void;
  onCompleteZone?: (zoneId: ZoneId) => void;
}

export const ZoneView: React.FC<ZoneViewProps> = ({
  zoneId,
  progress,
  profile,
  onBackToHub,
  onOpenOzi,
  onSaveToJournal,
  onLaunchInteractive,
  onCompleteZone,
}) => {
  const zone = MUSEUM_ZONES.find(z => z.id === zoneId) || MUSEUM_ZONES[0];
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedItem, setSelectedItem] = useState<Organism | AbioticFactor | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'biotik' | 'abiotik'>('all');
  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);
  const [showMissions, setShowMissions] = useState(true);

  // Mouse drag panning state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [panProgress, setPanProgress] = useState(0); // 0-100% for minimap

  // Track discovered items in this zone
  const discoveredInThisZone = zone.organisms.filter(o => 
    progress.discoveredOrganisms.includes(o.id)
  );

  const savedInJournalCount = (progress.journalEntries || []).filter(e => 
    e.zoneId === zone.id
  ).length;

  const totalBiotic = zone.organisms.length;
  const totalAbiotic = zone.abioticFactors.length;

  // Handle ambient speech
  useEffect(() => {
    // Play zone ambient sound
    audioManager.playAmbient(zone.ambientType);

    // Speak welcome message
    const speech = `${zone.title}. ${zone.welcomeSpeech}`;
    setIsSpeakingWelcome(true);
    audioManager.speak(speech, () => setIsSpeakingWelcome(false));

    return () => {
      audioManager.stopAmbient();
      audioManager.stopSpeaking();
    };
  }, [zone.id]);

  // Update pan progress for minimap
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setPanProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  // Drag to pan (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const panStep = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F3D2E] text-white flex flex-col font-sans select-none">
      
      {/* TOP HUD BAR */}
      <header className="relative z-30 flex items-center justify-between px-3 md:px-6 py-2.5 bg-[#0F3D2E]/90 backdrop-blur-md border-b border-[#1B5E3F]">
        
        {/* Top-Left: Nara Avatar + Hearts + Student Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1.5 rounded-xl border border-white/20 text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Aula Pusat</span>
          </button>

          <div className="flex items-center gap-2.5 bg-black/30 px-3 py-1 rounded-2xl border border-white/10">
            <img 
              src={naraAvatar} 
              alt="Nara" 
              className="w-8 h-8 rounded-full border border-[#3FA34D] object-cover" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white leading-none">
                  {profile.fullName || profile.username || 'Nara'}
                </span>
                {/* Heart bar HUD */}
                <div className="flex items-center gap-1" title="Nyawa Penjelajah">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <EkoHeart key={i} filled={i < (progress.hearts ?? 4)} size="sm" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-[#8BC34A] font-semibold">
                Zona #{zone.zoneNumber}: {zone.title}
              </span>
            </div>
          </div>
        </div>

        {/* Filter buttons (All, Biotik, Abiotik) */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg transition ${filterType === 'all' ? 'bg-[#F5C518] text-[#0F3D2E] font-bold' : 'text-gray-300 hover:text-white'}`}
          >
            Semua ({zone.organisms.length + zone.abioticFactors.length})
          </button>
          <button
            onClick={() => setFilterType('biotik')}
            className={`px-2.5 py-1 rounded-lg transition ${filterType === 'biotik' ? 'bg-[#3FA34D] text-white font-bold' : 'text-gray-300 hover:text-white'}`}
          >
            Biotik ({zone.organisms.length})
          </button>
          <button
            onClick={() => setFilterType('abiotik')}
            className={`px-2.5 py-1 rounded-lg transition ${filterType === 'abiotik' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:text-white'}`}
          >
            Abiotik ({zone.abioticFactors.length})
          </button>
        </div>

        {/* Top-Right Tools */}
        <div className="flex items-center gap-2">
          {/* Interactive Feature Launcher based on Zone */}
          {zone.id === 'hutan' && onLaunchInteractive && (
            <button
              onClick={() => onLaunchInteractive('decomposer')}
              className="flex items-center gap-1.5 bg-[#3FA34D] hover:bg-[#348840] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Lab Pengurai</span>
            </button>
          )}

          {zone.id === 'rantai-makanan' && onLaunchInteractive && (
            <button
              onClick={() => onLaunchInteractive('food-chain')}
              className="flex items-center gap-1.5 bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rakit Rantai</span>
            </button>
          )}

          {zone.id === 'keseimbangan-ekosistem' && onLaunchInteractive && (
            <button
              onClick={() => onLaunchInteractive('simulation')}
              className="flex items-center gap-1.5 bg-[#3FA34D] hover:bg-[#348840] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Simulasi Ekosistem</span>
            </button>
          )}

          {zone.id === 'pelestarian-lingkungan' && onLaunchInteractive && (
            <button
              onClick={() => onLaunchInteractive('trash-sorting')}
              className="flex items-center gap-1.5 bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aksi Pelestarian</span>
            </button>
          )}

          <button
            onClick={onOpenOzi}
            className="flex items-center gap-1.5 bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md transition"
          >
            <img src={oziAvatar} alt="Ozi" className="w-4 h-4 rounded-full border border-[#0F3D2E]" />
            <span className="hidden sm:inline">Tanya Ozi</span>
          </button>
        </div>
      </header>

      {/* PANORAMIC SCENE CONTAINER (TOUCH / MOUSE DRAGGABLE) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* WIDE PANORAMA CANVAS (250% screen width for immersive panning) */}
        <div 
          className="relative h-full min-w-[2400px] bg-cover bg-center pointer-events-auto"
          style={{ backgroundImage: `url(${zone.bgImage})` }}
        >
          {/* Subtle atmosphere gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
          
          {/* Sunbeams / God Rays Light Overlay */}
          <div className="absolute inset-0 sunbeam-rays-overlay opacity-60" />

          {/* Animated Soft Drifting Mist / Fog Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-950/40 via-green-900/20 to-transparent pointer-events-none animate-mist-left opacity-75" />

          {/* HOTSPOTS: ORGANISMS (BIOTIC) */}
          {(filterType === 'all' || filterType === 'biotik') && zone.organisms.map((org) => {
            const isDiscovered = progress.discoveredOrganisms.includes(org.id);
            return (
              <div
                key={org.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(org);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${org.x}%`, top: `${org.y}%` }}
              >
                {/* Pulsing ring animation */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-2 rounded-full bg-[#8BC34A] opacity-75 animate-ping pointer-events-none" />
                  
                  {/* Pin circle with 3D Biota Icon */}
                  <div className={`w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-300 transform group-hover:scale-125 ${
                    isDiscovered 
                      ? 'bg-[#3FA34D] border-[#F5C518] text-white' 
                      : 'bg-white/95 border-[#3FA34D] text-[#0F3D2E]'
                  }`}>
                    <EkoBiotaIcon id={org.id} name={org.name} role={org.role} category={org.category} size="md" />
                  </div>

                  {/* Floating Label */}
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#0F3D2E]/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg border border-[#3FA34D] whitespace-nowrap opacity-90 group-hover:opacity-100 flex items-center gap-1 pointer-events-none">
                    <Eye className="w-3 h-3 text-[#F5C518]" />
                    <span>{org.name}</span>
                    {isDiscovered && <CheckCircle2 className="w-3 h-3 text-[#8BC34A]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* HOTSPOTS: ABIOTIC FACTORS */}
          {(filterType === 'all' || filterType === 'abiotik') && zone.abioticFactors.map((abio) => {
            return (
              <div
                key={abio.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(abio);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ left: `${abio.x}%`, top: `${abio.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-2 rounded-full bg-blue-400 opacity-60 animate-ping pointer-events-none" />
                  
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-700/90 text-white border-2 border-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-125">
                    <EkoBiotaIcon id={abio.id} name={abio.name} category="abiotik" size="md" />
                  </div>

                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-blue-950/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-xl shadow-lg border border-blue-400 whitespace-nowrap flex items-center gap-1 pointer-events-none">
                    <Eye className="w-3 h-3 text-blue-300" />
                    <span>{abio.name} (Abiotik)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PANNING ARROW BUTTONS (LEFT / RIGHT) */}
      <button
        onClick={() => panStep('left')}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0F3D2E]/80 hover:bg-[#1B5E3F] text-white border border-[#3FA34D] flex items-center justify-center shadow-lg active:scale-95 transition"
        aria-label="Geser kiri"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => panStep('right')}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0F3D2E]/80 hover:bg-[#1B5E3F] text-white border border-[#3FA34D] flex items-center justify-center shadow-lg active:scale-95 transition"
        aria-label="Geser kanan"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* TOP-RIGHT FLOATING MISSION CARD: "Misi Zona [Nama]" */}
      {showMissions && (
        <div className="absolute top-16 right-4 z-20 w-72 bg-[#F6F1E3]/95 backdrop-blur-md text-[#0F3D2E] p-3.5 rounded-2xl border-2 border-[#3FA34D] shadow-xl animate-pop-spring">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E8DEC9]">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#1B5E3F]" />
              <h4 className="font-heading font-extrabold text-xs text-[#0F3D2E]">
                Misi Zona {zone.title}
              </h4>
            </div>
            <button
              onClick={() => setShowMissions(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Checklist item 1 */}
            <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-[#E8DEC9]">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                discoveredInThisZone.length >= 3 ? 'bg-[#3FA34D] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {discoveredInThisZone.length >= 3 ? '✓' : '1'}
              </span>
              <div>
                <p className="font-bold text-[11px] leading-tight">Temukan 3 komponen biotik</p>
                <p className="text-[10px] text-[#52796F]">
                  Ditemukan: {discoveredInThisZone.length} dari 3
                </p>
              </div>
            </div>

            {/* Checklist item 2 */}
            <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-[#E8DEC9]">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                savedInJournalCount >= 1 ? 'bg-[#3FA34D] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {savedInJournalCount >= 1 ? '✓' : '2'}
              </span>
              <div>
                <p className="font-bold text-[11px] leading-tight">Catat pengamatan ke jurnal</p>
                <p className="text-[10px] text-[#52796F]">
                  {savedInJournalCount} catatan tersimpan
                </p>
              </div>
            </div>

            {/* Checklist item 3 */}
            <div className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-[#E8DEC9]">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                discoveredInThisZone.length >= totalBiotic ? 'bg-[#3FA34D] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {discoveredInThisZone.length >= totalBiotic ? '✓' : '3'}
              </span>
              <div>
                <p className="font-bold text-[11px] leading-tight">Jelajahi seluruh zona ini</p>
                <p className="text-[10px] text-[#52796F]">
                  {discoveredInThisZone.length} / {totalBiotic} biota terdata
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOGGLE MISSIONS BUTTON IF HIDDEN */}
      {!showMissions && (
        <button
          onClick={() => setShowMissions(true)}
          className="absolute top-16 right-4 z-20 bg-[#F6F1E3] text-[#0F3D2E] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#3FA34D] shadow-md flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-[#1B5E3F]" />
          <span>Buka Misi Zona</span>
        </button>
      )}

      {/* BOTTOM OVERLAY: Minimap (Bottom-Right) & Navigation Hint */}
      <footer className="relative z-20 px-4 md:px-6 py-2.5 bg-[#0F3D2E]/90 backdrop-blur-md border-t border-[#1B5E3F] flex items-center justify-between text-xs text-[#E0E7E2]">
        
        {/* Left: Drag hint */}
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#F5C518]" />
          <span className="text-[11px] text-[#F6F1E3]/90">
            Geser panorama ke kiri atau ke kanan untuk menjelajah, lalu ketuk titik yang berkedip untuk mengamati.
          </span>
        </div>

        {/* Right: Interactive Minimap */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-[#8BC34A] block">Peta Mini Zona</span>
            <span className="text-[10px] text-gray-300">Panorama 360°</span>
          </div>

          <div className="relative w-32 h-7 bg-black/60 rounded-lg border border-[#3FA34D] overflow-hidden p-0.5">
            {/* Dots for all items in minimap */}
            {zone.organisms.map((o) => (
              <span
                key={o.id}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#8BC34A]"
                style={{ left: `${o.x}%` }}
              />
            ))}
            {/* Viewport indicator box */}
            <div 
              className="absolute top-0 bottom-0 border-2 border-[#F5C518] bg-[#F5C518]/25 rounded transition-all duration-75 pointer-events-none"
              style={{ 
                left: `${(panProgress * 0.7)}%`, 
                width: '30%' 
              }}
            />
          </div>
        </div>

      </footer>

      {/* OBJECT DETAIL MODAL */}
      {selectedItem && (
        <ObjectDetailModal
          item={selectedItem}
          zoneTitle={zone.title}
          isSavedToJournal={(progress.journalEntries || []).some(j => j.organismId === selectedItem.id)}
          onSaveToJournal={(item) => onSaveToJournal(item, zone)}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  );
};
