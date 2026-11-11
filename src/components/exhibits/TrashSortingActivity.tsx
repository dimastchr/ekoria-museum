import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  Droplet, 
  TreePine, 
  ThumbsUp, 
  ThumbsDown,
  Award
} from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface TrashSortingActivityProps {
  onBack: () => void;
  onRewardXP: (xp: number) => void;
}

interface WasteItem {
  id: string;
  name: string;
  icon: string;
  category: 'organik' | 'anorganik' | 'b3';
  explanation: string;
}

const WASTE_ITEMS: WasteItem[] = [
  { id: 'w1', name: 'Kulit Pisang', icon: '🍌', category: 'organik', explanation: 'Sisa buah mudah membusuk dan bisa diolah menjadi kompos alami.' },
  { id: 'w2', name: 'Botol Plastik Air Mineral', icon: '🍾', category: 'anorganik', explanation: 'Plastik butuh ratusan tahun untuk terurai, harus didaur ulang (recycle).' },
  { id: 'w3', name: 'Baterai Bekas Jam', icon: '🔋', category: 'b3', explanation: 'Mengandung logam berat beracun, harus dibuang ke wadah khusus B3 (bahan berbahaya dan beracun).' },
  { id: 'w4', name: 'Daun Mangga Kering', icon: '🍂', category: 'organik', explanation: 'Sampah alami yang dapat diuraikan pengurai menjadi tanah subur.' },
  { id: 'w5', name: 'Kaleng Minuman Bekas', icon: '🥫', category: 'anorganik', explanation: 'Logam kaleng dapat dilebur kembali di pabrik daur ulang.' },
  { id: 'w6', name: 'Lampu Neon Pecah', icon: '💡', category: 'b3', explanation: 'Lampu neon mengandung merkuri beracun yang membahayakan tanah dan air.' },
  { id: 'w7', name: 'Sisa Sayur Kangkung', icon: '🥬', category: 'organik', explanation: 'Sampah dapur organik bernutrisi tinggi untuk cacing tanah dan pupuk.' },
  { id: 'w8', name: 'Kantong Plastik Kresek', icon: '🛍️', category: 'anorganik', explanation: 'Plastik sekali pakai mencemari tanah dan laut jika tidak dikelola.' },
];

const ECO_ACTIONS = [
  {
    id: 'a1',
    title: 'Menanam Bibit Pohon di Lahan Kering',
    icon: '🌱',
    isGood: true,
    impact: 'Pohon menyerap karbon dioksida, menghasilkan oksigen, dan akarnya menahan tanah serta menyimpan air.',
  },
  {
    id: 'a2',
    title: 'Membuang Puntung Rokok / Plastik ke Sungai',
    icon: '🥤',
    isGood: false,
    impact: 'Menyumbat aliran air, memicu banjir, dan meracuni ikan air tawar.',
  },
  {
    id: 'a3',
    title: 'Mematikan Keran Air saat Menggosok Gigi',
    icon: '🚰',
    isGood: true,
    impact: 'Menghemat hingga puluhan liter air bersih setiap hari untuk masa depan bumi.',
  },
  {
    id: 'a4',
    title: 'Menebang Hutan Lindung secara Liar',
    icon: '🪓',
    isGood: false,
    impact: 'Menghilangkan habitat satwa langka, memicu tanah longsor, dan memperparah pemanasan global.',
  },
];

export const TrashSortingActivity: React.FC<TrashSortingActivityProps> = ({
  onBack,
  onRewardXP,
}) => {
  const [activeTab, setActiveTab] = useState<'waste' | 'tree' | 'action'>('waste');
  
  // Waste Sorting State
  const [remainingWaste, setRemainingWaste] = useState<WasteItem[]>(WASTE_ITEMS);
  const [currentWasteIndex, setCurrentWasteIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Tree Planting State
  const [treeStage, setTreeStage] = useState(0); // 0: Bibit, 1: Siram air, 2: Tunas, 3: Pohon Rindang
  const [treeWaterCount, setTreeWaterCount] = useState(0);

  // Eco Action Choices State
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const currentItem = remainingWaste[currentWasteIndex];

  const handleClassify = (targetCategory: 'organik' | 'anorganik' | 'b3') => {
    if (!currentItem) return;

    if (currentItem.category === targetCategory) {
      audioManager.playSuccessChime();
      setScore(prev => prev + 10);
      setFeedback({
        isCorrect: true,
        text: `Tepat sekali! ${currentItem.name} adalah sampah ${targetCategory.toUpperCase()}. ${currentItem.explanation}`,
      });
      audioManager.speak(`Hebat! ${currentItem.name} masuk tempat sampah ${targetCategory}.`);
    } else {
      audioManager.playErrorSound();
      setFeedback({
        isCorrect: false,
        text: `Kurang tepat. ${currentItem.name} seharusnya masuk tempat sampah ${currentItem.category.toUpperCase()}. ${currentItem.explanation}`,
      });
      audioManager.speak(`Ups, ${currentItem.name} adalah sampah ${currentItem.category}.`);
    }

    // Move to next item after small delay or button
    setTimeout(() => {
      if (currentWasteIndex + 1 < remainingWaste.length) {
        setCurrentWasteIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        setIsCompleted(true);
        onRewardXP(100);
      }
    }, 2200);
  };

  const handleWaterTree = () => {
    audioManager.playClick();
    const newCount = treeWaterCount + 1;
    setTreeWaterCount(newCount);
    if (newCount >= 3 && treeStage < 3) {
      setTreeStage(prev => prev + 1);
      setTreeWaterCount(0);
      audioManager.playSuccessChime();
      if (treeStage === 2) {
        onRewardXP(50);
        audioManager.speak('Selamat! Pohonmu telah tumbuh besar dan memberi oksigen bagi hutan EkoRia!');
      }
    }
  };

  const handleResetWaste = () => {
    setRemainingWaste([...WASTE_ITEMS].sort(() => Math.random() - 0.5));
    setCurrentWasteIndex(0);
    setScore(0);
    setFeedback(null);
    setIsCompleted(false);
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
            <span>Kembali ke Zona</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h1 className="text-xl md:text-2xl font-heading font-black text-[#0F3D2E]">
                Laboratorium Pelestarian Lingkungan
              </h1>
            </div>
            <p className="text-xs text-[#52796F] font-semibold">
              Zona #8 • Menjaga Keharmonisan Alam Melalui Aksi Nyata
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E8DEC9] shadow-sm text-xs font-bold">
          <button
            onClick={() => setActiveTab('waste')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'waste' ? 'bg-[#3FA34D] text-white' : 'text-[#52796F] hover:bg-[#F6F1E3]'
            }`}
          >
            🗑️ Pilah Sampah
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'tree' ? 'bg-[#3FA34D] text-white' : 'text-[#52796F] hover:bg-[#F6F1E3]'
            }`}
          >
            🌳 Tanam Pohon
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'action' ? 'bg-[#3FA34D] text-white' : 'text-[#52796F] hover:bg-[#F6F1E3]'
            }`}
          >
            ⚖️ Aksi Baik vs Buruk
          </button>
        </div>
      </div>

      {/* TAB 1: PILAH SAMPAH (ORGANIK, ANORGANIK, B3) */}
      {activeTab === 'waste' && (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-sm text-center">
            <span className="inline-block bg-[#F5C518] text-[#0F3D2E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Misi 1: Pilah Sampah Sesuai Wadahnya
            </span>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-[#0F3D2E]">
              Masukkan Sampah ke Tempat yang Benar
            </h2>
            <p className="text-xs text-[#52796F] max-w-lg mx-auto mt-1">
              Kenali jenis sampah agar tidak mencemari tanah dan air di alam EkoRia.
            </p>
          </div>

          {!isCompleted && currentItem ? (
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* CURRENT ITEM CARD */}
              <div className="bg-gradient-to-br from-white to-[#F6F1E3] p-8 rounded-3xl border-2 border-[#3FA34D] shadow-xl text-center max-w-md w-full animate-in zoom-in-95 duration-200">
                <span className="text-xs text-[#52796F] font-bold block mb-1">
                  Sampah #{currentWasteIndex + 1} dari {remainingWaste.length}
                </span>
                <div className="text-7xl my-3 filter drop-shadow">
                  {currentItem.icon}
                </div>
                <h3 className="text-2xl font-heading font-black text-[#0F3D2E]">
                  {currentItem.name}
                </h3>
                <p className="text-xs text-[#52796F] mt-1 italic">
                  "Ke tempat sampah manakah benda ini harus dibuang?"
                </p>
              </div>

              {/* FEEDBACK BANNER */}
              {feedback && (
                <div className={`p-4 rounded-2xl max-w-lg w-full text-xs font-bold leading-relaxed border ${
                  feedback.isCorrect 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                    : 'bg-red-50 text-red-900 border-red-300'
                }`}>
                  {feedback.text}
                </div>
              )}

              {/* THREE RECYCLING BINS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                
                {/* 1. KOTAK ORGANIK (HIJAU) */}
                <button
                  onClick={() => handleClassify('organik')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-5 rounded-3xl shadow-lg border-2 border-emerald-400 flex flex-col items-center justify-between cursor-pointer transition transform hover:-translate-y-1 active:scale-95 group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🍃 🗑️</div>
                  <div className="font-heading font-black text-lg">ORGANIK</div>
                  <p className="text-[11px] text-emerald-100 text-center mt-1">
                    Sisa makanan, daun, ranting, kulit buah (bisa jadi kompos)
                  </p>
                </button>

                {/* 2. KOTAK ANORGANIK (KUNING) */}
                <button
                  onClick={() => handleClassify('anorganik')}
                  className="bg-[#F5C518] hover:bg-[#ffe066] text-[#0F3D2E] p-5 rounded-3xl shadow-lg border-2 border-amber-400 flex flex-col items-center justify-between cursor-pointer transition transform hover:-translate-y-1 active:scale-95 group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🥫 🗑️</div>
                  <div className="font-heading font-black text-lg text-[#0F3D2E]">ANORGANIK</div>
                  <p className="text-[11px] text-[#0F3D2E]/80 text-center mt-1 font-medium">
                    Plastik, kaleng, botol kaca, kardus (bisa didaur ulang)
                  </p>
                </button>

                {/* 3. KOTAK B3 / BAHAYA (MERAH) */}
                <button
                  onClick={() => handleClassify('b3')}
                  className="bg-rose-600 hover:bg-rose-700 text-white p-5 rounded-3xl shadow-lg border-2 border-rose-400 flex flex-col items-center justify-between cursor-pointer transition transform hover:-translate-y-1 active:scale-95 group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">☣️ 🗑️</div>
                  <div className="font-heading font-black text-lg">B3 / BERBAHAYA</div>
                  <p className="text-[11px] text-rose-100 text-center mt-1">
                    Baterai, obat kadaluarsa, lampu merkuri, botol racun
                  </p>
                </button>

              </div>

            </div>
          ) : (
            /* COMPLETION CARD */
            <div className="bg-white p-8 rounded-3xl border-2 border-[#3FA34D] shadow-xl text-center max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#1B5E3F] flex items-center justify-center mx-auto text-4xl">
                🏆
              </div>
              <h3 className="text-2xl font-heading font-black text-[#0F3D2E]">
                Hebat, Misi Pemilahan Selesai!
              </h3>
              <p className="text-xs text-[#52796F] leading-relaxed">
                Kamu telah memilah semua sampah dengan benar. {score} poin ditambahkan ke profilmu.
              </p>
              <button
                onClick={handleResetWaste}
                className="bg-[#F5C518] text-[#0F3D2E] font-heading font-black px-6 py-3 rounded-2xl shadow-md hover:bg-[#ffe066] transition text-sm cursor-pointer"
              >
                Ulangi Simulasi Pilah Sampah
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: TANAM POHON */}
      {activeTab === 'tree' && (
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-between bg-white p-8 rounded-3xl border border-[#E8DEC9] shadow-sm text-center">
          <div>
            <span className="inline-block bg-[#F5C518] text-[#0F3D2E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Misi 2: Penghijauan Hutan
            </span>
            <h2 className="text-xl font-heading font-extrabold text-[#0F3D2E]">
              Tanam Pohon & Siram dengan Kasih Sayang
            </h2>
            <p className="text-xs text-[#52796F] mt-1 max-w-md mx-auto">
              Setiap pohon yang kita tanam menghasilkan oksigen segar dan menjadi rumah bagi aneka burung dan serangga.
            </p>
          </div>

          {/* TREE STAGE VISUAL */}
          <div className="my-8 py-6 flex flex-col items-center justify-center">
            <div className="text-8xl md:text-9xl mb-4 transition-all duration-500 transform hover:scale-105 select-none">
              {treeStage === 0 && '🌰'}
              {treeStage === 1 && '🌱'}
              {treeStage === 2 && '🌿'}
              {treeStage === 3 && '🌳'}
            </div>

            <div className="font-heading font-extrabold text-lg text-[#0F3D2E]">
              {treeStage === 0 && 'Tahap 1: Bibit Biji di Bawah Tanah'}
              {treeStage === 1 && 'Tahap 2: Tunas Daun Muda Mulai Menyembul'}
              {treeStage === 2 && 'Tahap 3: Pohon Muda Tumbuh Tegak'}
              {treeStage === 3 && 'Tahap 4: Pohon Rindang Penghasil Oksigen!'}
            </div>

            <p className="text-xs text-[#52796F] max-w-sm mt-1">
              {treeStage < 3 
                ? `Siram bibit pohon ini (${treeWaterCount}/3 kali) agar bertumbuh subur.` 
                : 'Pohon ini kini melindungi satwa liar dan menyerap gas karbon!'}
            </p>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-center gap-3">
            {treeStage < 3 ? (
              <button
                onClick={handleWaterTree}
                className="bg-[#3FA34D] hover:bg-[#348840] text-white font-heading font-extrabold px-8 py-4 rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Droplet className="w-5 h-5 fill-current" />
                <span>Siram Air Bersih 💧 ({treeWaterCount}/3)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setTreeStage(0);
                  setTreeWaterCount(0);
                }}
                className="bg-[#F5C518] text-[#0F3D2E] font-heading font-black px-6 py-3 rounded-2xl shadow-md hover:bg-[#ffe066] transition text-sm cursor-pointer"
              >
                Tanam Pohon Baru Lagi
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AKSI BAIK VS BURUK */}
      {activeTab === 'action' && (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DEC9] shadow-sm text-center">
            <span className="inline-block bg-[#F5C518] text-[#0F3D2E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              Misi 3: Pilihan Bijak Sahabat Alam
            </span>
            <h2 className="text-lg md:text-xl font-heading font-extrabold text-[#0F3D2E]">
              Pilih Aksi dan Amati Dampaknya bagi Ekosistem
            </h2>
            <p className="text-xs text-[#52796F] max-w-lg mx-auto mt-1">
              Setiap tindakan manusia di bumi memiliki dampak berantai terhadap kelangsungan makhluk hidup lain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ECO_ACTIONS.map((action) => {
              const isSelected = selectedActionId === action.id;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    setSelectedActionId(action.id);
                    audioManager.playClick();
                    audioManager.speak(action.impact);
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? action.isGood 
                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                        : 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-300'
                      : 'bg-white border-[#E8DEC9] hover:border-[#3FA34D]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{action.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          action.isGood ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {action.isGood ? 'Aksi Hijau (Baik)' : 'Aksi Merusak (Buruk)'}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-sm text-[#0F3D2E]">
                        {action.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8DEC9]/60 text-xs text-[#2D3748] leading-relaxed">
                    <strong>Dampak Ekologis:</strong> {action.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
