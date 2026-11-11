import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, RotateCcw, Trophy, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import { Organism, RoomId } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface FoodChainBuilderProps {
  roomOrganisms: Organism[];
  roomId: RoomId;
  roomTitle: string;
  onComplete: (xpGained: number) => void;
  onBackToRoom: () => void;
}

export const FoodChainBuilder: React.FC<FoodChainBuilderProps> = ({
  roomOrganisms,
  roomTitle,
  onComplete,
  onBackToRoom
}) => {
  // Correct ordering: Produsen -> Konsumen-1 -> Konsumen-2 (or 3) -> Pengurai
  const correctOrder = [...roomOrganisms].sort((a, b) => {
    const roleRank: Record<string, number> = {
      'produsen': 1,
      'konsumen-1': 2,
      'konsumen-2': 3,
      'konsumen-3': 4,
      'pengurai': 5
    };
    return (roleRank[a.role] || 99) - (roleRank[b.role] || 99);
  });

  const [availableItems, setAvailableItems] = useState<Organism[]>(() => {
    return [...roomOrganisms].sort(() => Math.random() - 0.5);
  });
  const [selectedChain, setSelectedChain] = useState<Organism[]>([]);
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleSelectOrganism = (item: Organism) => {
    audioManager.playClick();
    setSelectedChain([...selectedChain, item]);
    setAvailableItems(availableItems.filter((i) => i.id !== item.id));
    setValidationResult({ status: 'idle', message: '' });
  };

  const handleRemoveFromChain = (index: number) => {
    audioManager.playClick();
    const removedItem = selectedChain[index];
    const newChain = selectedChain.filter((_, idx) => idx !== index);
    setSelectedChain(newChain);
    setAvailableItems([...availableItems, removedItem]);
    setValidationResult({ status: 'idle', message: '' });
  };

  const handleReset = () => {
    audioManager.playClick();
    setSelectedChain([]);
    setAvailableItems([...roomOrganisms].sort(() => Math.random() - 0.5));
    setValidationResult({ status: 'idle', message: '' });
  };

  const handleVerifyChain = () => {
    if (selectedChain.length < correctOrder.length) {
      const msg = `Rantai makananmu belum lengkap! Masukkan semua ${correctOrder.length} makhluk hidup dari produsen hingga pengurai.`;
      setValidationResult({ status: 'error', message: msg });
      audioManager.playErrorSound();
      audioManager.speakNarration(msg);
      return;
    }

    const roleWeights: Record<string, number> = {
      'produsen': 1,
      'konsumen-1': 2,
      'konsumen-2': 3,
      'konsumen-3': 4,
      'pengurai': 5
    };

    let isCorrect = true;
    for (let i = 0; i < selectedChain.length; i++) {
      if (i > 0) {
        const prevWeight = roleWeights[selectedChain[i - 1].role] || 0;
        const currWeight = roleWeights[selectedChain[i].role] || 0;
        if (currWeight <= prevWeight) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      audioManager.playSuccessChime();
      const msg = 'Luar biasa! Urutan rantai makananmu benar! Energi berpindah dari produsen ke pemakan sampai pengurai.';
      setValidationResult({ status: 'success', message: msg });
      audioManager.speakNarration(msg);
      onComplete(75);
    } else {
      audioManager.playErrorSound();
      const msg = 'Urutan rantai makanan belum tepat. Ingat: Aliran energi selalu dimulai dari tumbuhan produsen!';
      setValidationResult({ status: 'error', message: msg });
      audioManager.speakNarration(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#1E7A50] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Laboratorium Rantai Makanan
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-[#1E7A50]">
            Susun Rantai Makanan – {roomTitle}
          </h2>
          <p className="text-base sm:text-lg text-[#1F2D3D] mt-1 max-w-xl font-medium">
            Ayo, susun urutan siapa memakan siapa! Klik hewan atau tumbuhan di bawah untuk memasukkannya ke dalam rantai.
          </p>
        </div>

        <button
          onClick={() => {
            audioManager.playClick();
            onBackToRoom();
          }}
          className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1F2D3D] text-base font-bold border-2 border-slate-300 cursor-pointer transition-colors min-h-[48px] flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-[#1E7A50]" />
          Kembali ke Diorama
        </button>
      </div>

      {/* Mandatory Science Rule Banner (Arah Panah Rantai Makanan) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50] text-[#1E7A50] flex items-start justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="font-['Outfit'] font-black text-base sm:text-lg flex items-center gap-2">
            <span>📌</span> Aturan Penting Arah Panah Rantai Makanan:
          </div>
          <p className="text-sm sm:text-base text-[#1F2D3D] font-medium leading-relaxed">
            Arah panah (<span className="font-bold text-[#1E7A50]">→</span>) selalu menunjuk dari yang <span className="font-bold">DIMAKAN</span> ke yang <span className="font-bold">MEMAKAN</span>. Artinya, <span className="underline">energi berpindah ke tubuh pemakannya!</span>
          </p>
        </div>
        <button
          onClick={() => {
            audioManager.speakNarration(
              'Ingat aturan sains: Arah panah selalu dari yang dimakan ke yang memakan, artinya energi berpindah ke pemakannya.'
            );
          }}
          className="p-2.5 rounded-xl bg-white border border-[#1E7A50] hover:scale-105 cursor-pointer shrink-0"
          title="Dengarkan Aturan"
        >
          <Volume2 className="w-5 h-5 text-[#1E7A50]" />
        </button>
      </div>

      {/* Assembly Canvas (Target Slot Chain) */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Urutan Aliran Energi:
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi
          </button>
        </div>

        {/* Chain Sequence Display */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[140px] p-5 rounded-2xl bg-[#F8FAF7] border-2 border-dashed border-emerald-300">
          {selectedChain.length === 0 ? (
            <div className="text-center text-sm sm:text-base text-slate-500 py-6 font-medium">
              Klik kartu makhluk hidup di bawah untuk mulai menyusun rantai makanan dari produsen!
            </div>
          ) : (
            selectedChain.map((organism, idx) => (
              <React.Fragment key={organism.id}>
                <div
                  onClick={() => handleRemoveFromChain(idx)}
                  className="group relative p-3 sm:p-4 rounded-2xl bg-white hover:bg-rose-50 border-2 border-emerald-300 hover:border-rose-400 text-center cursor-pointer transition-all hover:scale-105 shadow-md min-w-[100px]"
                  title="Klik untuk membatalkan pilihan ini"
                >
                  <span className="text-3xl sm:text-4xl block mb-1">{organism.icon}</span>
                  <div className="font-bold text-sm text-[#1F2D3D] max-w-[110px] truncate">
                    {organism.localName}
                  </div>
                  <div className="text-xs text-[#1E7A50] font-bold uppercase mt-0.5">
                    {organism.role.replace('-', ' ')}
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-300 group-hover:bg-rose-500 text-xs text-white flex items-center justify-center">
                    ✕
                  </div>
                </div>

                {idx < selectedChain.length - 1 && (
                  <div className="flex flex-col items-center justify-center text-[#1E7A50] shrink-0">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                    <span className="text-[10px] font-bold">dimakan</span>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Validation Result Notice */}
        {validationResult.status !== 'idle' && (
          <div
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 animate-in fade-in duration-200 ${
              validationResult.status === 'success'
                ? 'bg-[#EAF7EF] border-[#1E7A50] text-[#1E7A50]'
                : 'bg-[#FFF3E8] border-[#D45014] text-[#D45014]'
            }`}
          >
            {validationResult.status === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-[#1E7A50] shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#D45014] shrink-0" />
            )}
            <div className="text-sm sm:text-base font-bold leading-relaxed flex-1">
              {validationResult.message}
            </div>
            <button
              onClick={() => audioManager.speakNarration(validationResult.message)}
              className="p-2 rounded-xl bg-white border border-current hover:scale-105 cursor-pointer shrink-0"
              title="Dengarkan Umpan Balik"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Button (Min 48px) */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleVerifyChain}
            disabled={selectedChain.length === 0}
            className={`px-6 py-3.5 rounded-2xl text-base font-bold flex items-center gap-2 cursor-pointer transition-all min-h-[48px] ${
              selectedChain.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#1E7A50] hover:bg-[#16603F] text-white shadow-lg hover:scale-102 active:scale-98'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Periksa Rantai Makanan!
          </button>
        </div>
      </div>

      {/* Available Pool of Organisms */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md">
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          Pilihan Makhluk Hidup Tersedia ({availableItems.length}):
        </h4>
        
        {availableItems.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Semua makhluk hidup sudah masuk ke rantai! Klik tombol "Periksa Rantai Makanan" di atas.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectOrganism(item)}
                className="p-4 rounded-2xl bg-white hover:bg-[#EAF7EF] border-2 border-slate-200 hover:border-[#1E7A50] text-left transition-all hover:-translate-y-1 cursor-pointer shadow-sm min-h-[48px]"
              >
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="font-bold text-base text-[#1F2D3D] leading-tight">
                  {item.localName}
                </div>
                <div className="text-xs text-[#1E7A50] font-semibold mt-1 capitalize">
                  {item.role.replace('-', ' ')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
