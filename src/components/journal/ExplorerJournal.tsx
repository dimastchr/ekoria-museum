import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Search, 
  Filter, 
  Volume2, 
  Sparkles, 
  Trash2,
  BookOpen,
  Compass
} from 'lucide-react';
import { StudentProgress, ZoneId } from '../../types';
import { MUSEUM_ZONES } from '../../data/museumZonesData';
import { audioManager } from '../../utils/audioManager';
import { EkoZoneIcon } from '../common/EkoIcons';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface ExplorerJournalProps {
  progress: StudentProgress;
  onBack: () => void;
  onGoToZone: (zoneId: ZoneId) => void;
}

export const ExplorerJournal: React.FC<ExplorerJournalProps> = ({
  progress,
  onBack,
  onGoToZone,
}) => {
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const entries = progress.journalEntries || [];

  // Filter entries
  const filteredEntries = entries.filter((item) => {
    const matchesZone = selectedZoneFilter === 'all' || item.zoneId === selectedZoneFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const handleSpeak = (entry: typeof entries[0]) => {
    setActiveSpeechId(entry.id);
    const text = `${entry.name}. ${entry.role} di ${entry.zoneName}. ${entry.explanation}. Catatan Ozi: ${entry.thinkingQuestion || ''}`;
    audioManager.speak(text, () => setActiveSpeechId(null));
  };

  return (
    <div className="min-h-screen bg-[#F6F1E3] text-[#0F3D2E] p-4 md:p-8 flex flex-col font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DEC9]">
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
              <span className="text-2xl">📖</span>
              <h1 className="text-xl md:text-2xl font-heading font-black text-[#0F3D2E]">
                Jurnal Penjelajah EkoRia
              </h1>
            </div>
            <p className="text-xs text-[#52796F] font-semibold">
              Buku Catatan Lapangan • {entries.length} Temuan Disimpan
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari makhluk hidup atau catatan..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#E8DEC9] text-xs focus:outline-none focus:ring-2 focus:ring-[#3FA34D]"
          />
        </div>
      </div>

      {/* ZONE FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setSelectedZoneFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
            selectedZoneFilter === 'all'
              ? 'bg-[#0F3D2E] text-white shadow-md'
              : 'bg-white text-[#0F3D2E] border border-[#E8DEC9] hover:bg-emerald-50'
          }`}
        >
          Semua Zona ({entries.length})
        </button>

        {MUSEUM_ZONES.map((zone) => {
          const zoneCount = entries.filter((e) => e.zoneId === zone.id).length;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneFilter(zone.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                selectedZoneFilter === zone.id
                  ? 'bg-[#3FA34D] text-white shadow-md'
                  : 'bg-white text-[#0F3D2E] border border-[#E8DEC9] hover:bg-emerald-50'
              }`}
            >
              <EkoZoneIcon zoneId={zone.id} size="xs" />
              <span>{zone.title}</span>
              <span className="opacity-75">({zoneCount})</span>
            </button>
          );
        })}
      </div>

      {/* JOURNAL ENTRIES GRID */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Zone & Date */}
                <div className="flex items-center justify-between text-[10px] font-bold text-[#52796F] mb-3 pb-2 border-b border-[#F6F1E3]">
                  <span className="bg-[#F6F1E3] text-[#0F3D2E] px-2.5 py-0.5 rounded-full border border-[#E8DEC9]">
                    {entry.zoneName}
                  </span>
                  <span>{new Date(entry.discoveredAt).toLocaleDateString('id-ID')}</span>
                </div>

                {/* Main Subject */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F6F1E3] border border-[#3FA34D] flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {entry.icon}
                  </div>
                  <div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      entry.isBiotic ? 'bg-[#3FA34D] text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {entry.isBiotic ? 'Biotik' : 'Abiotik'} • {entry.role}
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-[#0F3D2E] leading-tight mt-1">
                      {entry.name}
                    </h3>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-[#2D3748] leading-relaxed mb-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8DEC9]">
                  {entry.explanation}
                </p>

                {/* Ozi Thinking Question if available */}
                {entry.thinkingQuestion && (
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-[#3FA34D]/30 mb-3 text-[11px] text-[#1B5E3F]">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <img src={oziAvatar} alt="Ozi" className="w-4 h-4 rounded-full" />
                      <span>Catatan Pertanyaan Ozi:</span>
                    </div>
                    <p className="italic">"{entry.thinkingQuestion}"</p>
                  </div>
                )}
              </div>

              {/* Card Footer: Voice button & Go to Zone */}
              <div className="pt-3 border-t border-[#F6F1E3] flex items-center justify-between">
                <button
                  onClick={() => handleSpeak(entry)}
                  className={`p-2 rounded-xl text-[#0F3D2E] hover:bg-[#F6F1E3] transition flex items-center gap-1.5 text-xs font-semibold ${
                    activeSpeechId === entry.id ? 'text-[#3FA34D] animate-pulse' : ''
                  }`}
                  title="Dengarkan Catatan"
                >
                  <Volume2 className="w-4 h-4 text-[#3FA34D]" />
                  <span>Dengarkan</span>
                </button>

                <button
                  onClick={() => onGoToZone(entry.zoneId)}
                  className="text-xs font-bold text-[#1B5E3F] hover:underline flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Kunjungi Zona</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-[#E8DEC9] max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#3FA34D] flex items-center justify-center text-4xl mb-4">
            📖
          </div>
          <h3 className="font-heading font-extrabold text-lg text-[#0F3D2E] mb-2">
            Belum Ada Catatan Jurnal
          </h3>
          <p className="text-xs text-[#52796F] max-w-sm mb-6 leading-relaxed">
            Masuklah ke salah satu zona ekosistem di museum, ketuk hewan atau tumbuhan yang kamu temui, lalu klik tombol <strong>"📖 Simpan ke Jurnal"</strong>!
          </p>
          <button
            onClick={() => onGoToZone('hutan')}
            className="bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold px-6 py-3 rounded-2xl shadow-md hover:bg-[#ffe066] transition text-xs cursor-pointer"
          >
            Mulai Eksplorasi Sekarang
          </button>
        </div>
      )}

    </div>
  );
};
