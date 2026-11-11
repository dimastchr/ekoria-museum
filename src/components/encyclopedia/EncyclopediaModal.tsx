import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Volume2, 
  Layers, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { MUSEUM_ZONES } from '../../data/museumZonesData';

interface EncyclopediaModalProps {
  onBack: () => void;
}

interface TermItem {
  id: string;
  term: string;
  category: 'Konsep Inti' | 'Tingkat Trofik' | 'Interaksi';
  definition: string;
  example: string;
  icon: string;
}

const GLOSSARY_TERMS: TermItem[] = [
  {
    id: 't1',
    term: 'Ekosistem',
    category: 'Konsep Inti',
    definition: 'Sistem interaksi timbal balik antara makhluk hidup (biotik) dengan lingkungan tak hidupnya (abiotik) yang saling memengaruhi.',
    example: 'Hutan hujan tropis, savana padang rumput, terumbu karang laut, dan sawah.',
    icon: '🌍'
  },
  {
    id: 't2',
    term: 'Komponen Biotik',
    category: 'Konsep Inti',
    definition: 'Semua makhluk hidup yang ada di dalam suatu ekosistem.',
    example: 'Tumbuhan, hewan herbivora/karnivora, jamur, cacing tanah, dan mikroorganisme.',
    icon: '🐾'
  },
  {
    id: 't3',
    term: 'Komponen Abiotik',
    category: 'Konsep Inti',
    definition: 'Semua benda tak hidup atau kondisi fisik dan kimia yang memengaruhi kehidupan di suatu ekosistem.',
    example: 'Cahaya matahari, air, udara/oksigen, tanah, suhu, dan bebatuan mineral.',
    icon: '☀️'
  },
  {
    id: 't4',
    term: 'Produsen',
    category: 'Tingkat Trofik',
    definition: 'Makhluk hidup autotrof yang mampu membuat makanannya sendiri melalui fotosintesis dengan bantuan sinar matahari.',
    example: 'Padi, rumput gajah, pohon jati, alga, fitoplankton, dan bunga teratai.',
    icon: '🌱'
  },
  {
    id: 't5',
    term: 'Konsumen I (Primer)',
    category: 'Tingkat Trofik',
    definition: 'Hewan pemakan tumbuhan langsung (herbivora) yang memperoleh energi pertama dari produsen.',
    example: 'Belalang, kelinci, sapi jawa, ulat, dan zooplankton di laut.',
    icon: '🦗'
  },
  {
    id: 't6',
    term: 'Konsumen II & III (Sekunder / Tersier)',
    category: 'Tingkat Trofik',
    definition: 'Hewan karnivora atau omnivora yang memakan konsumen di bawahnya dalam aliran rantai makanan.',
    example: 'Katak sawah (Konsumen II), ular sawah (Konsumen III), burung elang jawa (Konsumen Puncak).',
    icon: '🦅'
  },
  {
    id: 't7',
    term: 'Pengurai (Dekomposer)',
    category: 'Tingkat Trofik',
    definition: 'Organisme yang menguraikan bangkai makhluk hidup dan sisa organik menjadi zat hara sederhana untuk menyuburkan tanah.',
    example: 'Jamur kayu, jamur kuping, dan bakteri pembusuk.',
    icon: '🍄'
  },
  {
    id: 't8',
    term: 'Detritivor (Peremah)',
    category: 'Tingkat Trofik',
    definition: 'Hewan yang memakan hancuran materi organik (detritus) dari daun gugur dan bangkai.',
    example: 'Cacing tanah, rayap, dan kaki seribu.',
    icon: '🪱'
  },
  {
    id: 't9',
    term: 'Rantai Makanan',
    category: 'Interaksi',
    definition: 'Peristiwa makan dan dimakan antarmakhluk hidup dengan urutan satu arah tertentu dari produsen hingga pengurai.',
    example: 'Padi → Tikus → Ular → Elang → Jamur Pengurai.',
    icon: '🔗'
  },
  {
    id: 't10',
    term: 'Jaring-Jaring Makanan',
    category: 'Interaksi',
    definition: 'Kumpulan dari beberapa rantai makanan yang saling berhubungan dan tumpang tindih dalam satu ekosistem.',
    example: 'Tikus di sawah bisa dimakan oleh ular, tetapi juga bisa diburu burung hantu atau elang.',
    icon: '🕸️'
  },
  {
    id: 't11',
    term: 'Keseimbangan Ekosistem',
    category: 'Konsep Inti',
    definition: 'Keadaan ketika hubungan antarkomponen penyusun ekosistem berjalan selaras dan stabil sehingga tidak ada makhluk hidup yang punah.',
    example: 'Jumlah rumput cukup untuk rusa, dan pemangsa menjaga jumlah rusa agar rumput tidak habis.',
    icon: '⚖️'
  },
  {
    id: 't12',
    term: 'Ekosistem Buatan',
    category: 'Konsep Inti',
    definition: 'Ekosistem yang sengaja diciptakan dan dirawat oleh manusia untuk memenuhi kebutuhan hidup.',
    example: 'Sawah beririgasi, kebun apel, kolam budidaya ikan lele, dan bendungan air.',
    icon: '🌾'
  }
];

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'organisms'>('terms');
  const [search, setSearch] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filteredTerms = GLOSSARY_TERMS.filter(
    t => t.term.toLowerCase().includes(search.toLowerCase()) ||
         t.definition.toLowerCase().includes(search.toLowerCase()) ||
         t.example.toLowerCase().includes(search.toLowerCase())
  );

  // All organisms from the 8 zones
  const allOrganisms = MUSEUM_ZONES.flatMap(z => z.organisms.map(o => ({ ...o, zoneTitle: z.title })));
  const filteredOrganisms = allOrganisms.filter(
    o => o.name.toLowerCase().includes(search.toLowerCase()) ||
         o.localName.toLowerCase().includes(search.toLowerCase()) ||
         o.trophicLevelName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSpeakTerm = (term: TermItem) => {
    setSpeakingId(term.id);
    const speech = `${term.term}. ${term.definition}. Contohnya: ${term.example}.`;
    audioManager.speak(speech, () => setSpeakingId(null));
  };

  return (
    <div className="min-h-screen bg-[#F6F1E3] text-[#0F3D2E] p-4 md:p-8 flex flex-col font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DEC9]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white hover:bg-[#E8DEC9] text-[#0F3D2E] px-4 min-h-[48px] rounded-xl border border-[#E8DEC9] text-sm font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl md:text-2xl font-heading font-black text-[#0F3D2E]">
                Ensiklopedia Ekosistem EkoRia
              </h1>
            </div>
            <p className="text-xs text-[#52796F] font-semibold">
              Kamus Istilah & Katalog Biota • Kurikulum Merdeka IPAS Bab 3
            </p>
          </div>
        </div>

        {/* Tab switch + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E8DEC9] text-xs font-bold shadow-sm">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'terms' ? 'bg-[#3FA34D] text-white' : 'text-[#52796F] hover:bg-[#F6F1E3]'
              }`}
            >
              📖 Istilah Kunci ({GLOSSARY_TERMS.length})
            </button>
            <button
              onClick={() => setActiveTab('organisms')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === 'organisms' ? 'bg-[#3FA34D] text-white' : 'text-[#52796F] hover:bg-[#F6F1E3]'
              }`}
            >
              🐾 Katalog Biota ({allOrganisms.length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari materi..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#E8DEC9] text-xs focus:outline-none focus:ring-2 focus:ring-[#3FA34D]"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: GLOSSARY TERMS */}
      {activeTab === 'terms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTerms.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-[#E8DEC9] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-bold text-[#1B5E3F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-[#3FA34D]/30">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-extrabold text-[#0F3D2E] mb-2">
                  {item.term}
                </h3>

                <p className="text-xs text-[#2D3748] leading-relaxed mb-3">
                  {item.definition}
                </p>

                <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8DEC9] text-[11px] text-[#52796F]">
                  <strong className="text-[#0F3D2E] block mb-0.5">Contoh di Alam:</strong>
                  {item.example}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F6F1E3] flex justify-end">
                <button
                  onClick={() => handleSpeakTerm(item)}
                  className={`p-1.5 rounded-xl text-[#0F3D2E] hover:bg-[#F6F1E3] transition flex items-center gap-1.5 text-xs font-semibold ${
                    speakingId === item.id ? 'text-[#3FA34D] animate-pulse' : ''
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-[#3FA34D]" />
                  <span>Dengarkan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ORGANISMS CATALOG */}
      {activeTab === 'organisms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOrganisms.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-3xl p-4 border border-[#E8DEC9] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{org.icon}</span>
                  <span className="text-[9px] font-bold bg-[#F6F1E3] text-[#0F3D2E] px-2 py-0.5 rounded-full border border-[#E8DEC9]">
                    {org.zoneTitle}
                  </span>
                </div>

                <span className="text-[9px] font-extrabold text-white bg-[#3FA34D] px-2 py-0.5 rounded-full uppercase inline-block mb-1">
                  {org.trophicLevelName}
                </span>

                <h4 className="font-heading font-bold text-base text-[#0F3D2E] leading-tight">
                  {org.name}
                </h4>
                <p className="text-[11px] italic text-[#52796F] mb-2">
                  {org.scientificName} ("{org.localName}")
                </p>

                <p className="text-xs text-[#2D3748] leading-relaxed line-clamp-3 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8DEC9]">
                  {org.funFact}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F6F1E3] text-[10px] text-[#52796F]">
                <span>Energi: {org.energySource}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
