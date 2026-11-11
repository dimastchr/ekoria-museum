import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, Info, Check, HelpCircle } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface WebNode {
  id: string;
  name: string;
  role: 'produsen' | 'herbivora' | 'karnivora' | 'puncak' | 'pengurai';
  icon: string;
  energyFlowTo: string[]; // target node IDs who eat this
  funFact: string;
}

const FOREST_WEB_NODES: WebNode[] = [
  {
    id: 'pohon',
    name: 'Pohon & Buah Hutan',
    role: 'produsen',
    icon: '🌳',
    energyFlowTo: ['ulat', 'monyet', 'rusa'],
    funFact: 'Produsen utama yang membuat makanan dari cahaya matahari.'
  },
  {
    id: 'rumput',
    name: 'Rumput & Tanaman Kecil',
    role: 'produsen',
    icon: '🌿',
    energyFlowTo: ['ulat', 'rusa'],
    funFact: 'Makanan lezat untuk herbivora di lantai hutan.'
  },
  {
    id: 'ulat',
    name: 'Ulat Daun',
    role: 'herbivora',
    icon: '🐛',
    energyFlowTo: ['burung', 'katak'],
    funFact: 'Ulat memakan daun dan menjadi makanan burung pemakan serangga.'
  },
  {
    id: 'rusa',
    name: 'Rusa Hutan',
    role: 'herbivora',
    icon: '🦌',
    energyFlowTo: ['harimau'],
    funFact: 'Rusa herbivora makan rumput dan pucuk daun segar.'
  },
  {
    id: 'monyet',
    name: 'Monyet Ekor Panjang',
    role: 'herbivora',
    icon: '🐒',
    energyFlowTo: ['harimau', 'elang'],
    funFact: 'Monyet makan buah pohon dan biji hutan.'
  },
  {
    id: 'burung',
    name: 'Burung Prenjak',
    role: 'karnivora',
    icon: '🐦',
    energyFlowTo: ['elang', 'ular'],
    funFact: 'Burung prenjak memakan ulat sehingga daun pohon tidak habis.'
  },
  {
    id: 'katak',
    name: 'Katak Hutan',
    role: 'karnivora',
    icon: '🐸',
    energyFlowTo: ['ular'],
    funFact: 'Katak memakan serangga terbang di malam hari.'
  },
  {
    id: 'ular',
    name: 'Ular Hutan',
    role: 'karnivora',
    icon: '🐍',
    energyFlowTo: ['elang', 'harimau'],
    funFact: 'Ular memangsa katak dan tikus liar.'
  },
  {
    id: 'elang',
    name: 'Burung Elang',
    role: 'puncak',
    icon: '🦅',
    energyFlowTo: ['jamur'],
    funFact: 'Pemangsa puncak di udara yang memburu ular.'
  },
  {
    id: 'harimau',
    name: 'Harimau Sumatra',
    role: 'puncak',
    icon: '🐅',
    energyFlowTo: ['jamur'],
    funFact: 'Pemangsa puncak darat yang menjaga jumlah rusa tetap seimbang.'
  },
  {
    id: 'jamur',
    name: 'Jamur Pengurai',
    role: 'pengurai',
    icon: '🍄',
    energyFlowTo: ['pohon', 'rumput'],
    funFact: 'Mengembalikan zat hara dari daun gugur, kayu lapuk, dan bangkai ke tanah untuk diserap akar pohon!'
  }
];

interface FoodWebBuilderProps {
  onBack: () => void;
  onRewardXP: (xp: number) => void;
}

export const FoodWebBuilder: React.FC<FoodWebBuilderProps> = ({ onBack, onRewardXP }) => {
  const [selectedNode, setSelectedNode] = useState<WebNode>(FOREST_WEB_NODES[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'produsen' | 'herbivora' | 'karnivora' | 'pengurai'>('all');
  const [challengeSolved, setChallengeSolved] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const filteredNodes = FOREST_WEB_NODES.filter((node) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'karnivora') return node.role === 'karnivora' || node.role === 'puncak';
    return node.role === activeFilter;
  });

  const handleSelectNode = (node: WebNode) => {
    audioManager.playClick();
    setSelectedNode(node);
  };

  const handleAnswerChallenge = (index: number) => {
    audioManager.playClick();
    setSelectedAnswer(index);
    if (index === 1) {
      audioManager.playSuccessChime();
      setChallengeSolved(true);
      onRewardXP(50);
      audioManager.speakNarration('Benar sekali! Saat burung pemakan ulat habis, ulat bertambah banyak dan memakan habis daun pohon.');
    } else {
      audioManager.playErrorSound();
      audioManager.speakNarration('Kurang tepat. Coba pikirkan siapa yang memakan ulat jika burung tidak ada.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#1E7A50] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Jaring-Jaring Makanan
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-[#1E7A50]">
            Jaring-Jaring Kehidupan di Hutan
          </h2>
          <p className="text-base sm:text-lg text-[#1F2D3D] mt-1 max-w-xl font-medium">
            Di alam, satu hewan bisa memakan beberapa jenis makanan. Kumpulan rantai makanan yang saling terhubung disebut jaring-jaring makanan.
          </p>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onBack();
          }}
          className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1F2D3D] text-base font-bold border-2 border-slate-300 cursor-pointer transition-colors min-h-[48px] flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E7A50]" />
          Kembali ke Peta
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#FFFDF9] rounded-2xl border-2 border-slate-200">
        {[
          { id: 'all', label: 'Semua Makhluk Hidup' },
          { id: 'produsen', label: 'Produsen (Tumbuhan)' },
          { id: 'herbivora', label: 'Herbivora (Pemakan Tumbuhan)' },
          { id: 'karnivora', label: 'Karnivora (Pemakan Daging)' },
          { id: 'pengurai', label: 'Pengurai (Jamur)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              audioManager.playClick();
              setActiveFilter(tab.id as typeof activeFilter);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors min-h-[44px] ${
              activeFilter === tab.id
                ? 'bg-[#1E7A50] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Nodes & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Nodes Grid (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-4">
          <div className="text-sm font-bold text-slate-600">
            Klik kartu untuk melihat siapa yang memakannya:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isTargetOfSelected = selectedNode.energyFlowTo.includes(node.id);

              return (
                <button
                  key={node.id}
                  onClick={() => handleSelectNode(node)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative min-h-[48px] ${
                    isSelected
                      ? 'bg-[#EAF7EF] border-[#1E7A50] ring-3 ring-emerald-200 shadow-md'
                      : isTargetOfSelected
                      ? 'bg-amber-50 border-amber-500 animate-pulse'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-3xl">{node.icon}</span>
                    {isTargetOfSelected && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                        Memakannya ➔
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-base text-[#1F2D3D] leading-snug">
                    {node.name}
                  </div>
                  <div className="text-xs text-[#1E7A50] font-semibold capitalize mt-0.5">
                    {node.role}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Card & Challenge */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
              <span className="text-4xl p-2 rounded-2xl bg-[#EAF7EF] border border-emerald-300">
                {selectedNode.icon}
              </span>
              <div>
                <h4 className="font-['Outfit'] text-xl font-black text-[#1E7A50]">
                  {selectedNode.name}
                </h4>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Peran: {selectedNode.role}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Info className="w-4 h-4 text-[#1E7A50]" />
                Peran di Hutan:
              </div>
              <p className="text-base text-[#1F2D3D] leading-relaxed font-medium">
                {selectedNode.funFact}
              </p>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-2">
                Dimakan oleh:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.energyFlowTo.map((targetId) => {
                  const targetNode = FOREST_WEB_NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;
                  return (
                    <div
                      key={targetId}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF7EF] border border-[#1E7A50] text-[#1E7A50] text-sm font-bold"
                    >
                      <span>{targetNode.icon}</span>
                      <span>{targetNode.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Challenge */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              Teka-Teki Sains:
            </div>
            <p className="text-sm font-bold text-[#1F2D3D]">
              Jika burung pemakan ulat diburu habis oleh manusia, apa akibatnya?
            </p>

            <div className="space-y-2 pt-1">
              {[
                'Pohon akan tumbuh makin lebat.',
                'Jumlah ulat bertambah sangat banyak dan memakan habis daun pohon.',
                'Harimau mulai makan rumput.'
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChallenge(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all cursor-pointer min-h-[44px] ${
                    selectedAnswer === idx
                      ? idx === 1
                        ? 'bg-[#EAF7EF] border-[#1E7A50] text-[#1E7A50]'
                        : 'bg-[#FFF3E8] border-[#D45014] text-[#D45014]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-[#1F2D3D]'
                  }`}
                >
                  <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            {challengeSolved && (
              <div className="pt-2 flex items-center gap-1.5 text-sm font-bold text-[#1E7A50]">
                <Check className="w-5 h-5" /> Jawaban benar! +50 XP diperoleh!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
