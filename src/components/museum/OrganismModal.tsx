import React from 'react';
import { X, CheckCircle, Volume2, Sparkles, Shield, Heart } from 'lucide-react';
import { Organism } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface OrganismModalProps {
  organism: Organism;
  onClose: () => void;
  isDiscovered: boolean;
  onDiscover: (id: string) => void;
  onAskEcoBot?: (query: string) => void;
}

export const OrganismModal: React.FC<OrganismModalProps> = ({
  organism,
  onClose,
  isDiscovered,
  onDiscover,
  onAskEcoBot
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'produsen':
        return { label: 'Produsen (Pembuat Makanan)', color: 'bg-emerald-100 text-[#1E7A50] border-emerald-300' };
      case 'konsumen-1':
        return { label: 'Konsumen 1 (Herbivora)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'konsumen-2':
        return { label: 'Konsumen 2 (Karnivora/Omnivora)', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'konsumen-3':
        return { label: 'Konsumen Puncak (Pemangsa Tertinggi)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'pengurai':
        return { label: 'Pengurai (Dekomposer)', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: 'Makhluk Hidup (Biotik)', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const roleInfo = getRoleBadge(organism.role);

  const handleSpeakDetails = () => {
    audioManager.speakNarration(
      `${organism.name}. Peran: ${organism.trophicLevelName}. Makanan: ${organism.diet}. Fakta menarik: ${organism.funFact}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-[#1F2D3D]">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] border-4 border-[#1E7A50] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-emerald-100 bg-[#EAF7EF]">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm">
              {organism.icon}
            </span>
            <div>
              <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-[#1E7A50] leading-tight">
                {organism.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-bold">
                {organism.isBiotic ? 'Komponen Biotik (Makhluk Hidup)' : 'Komponen Abiotik'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakDetails}
              className="p-2.5 rounded-xl bg-white border-2 border-[#1E7A50] text-[#1E7A50] hover:scale-105 cursor-pointer shadow-sm"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
              }}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body (Text >= 18px / 16px child friendly) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-base sm:text-lg">
          
          {/* Role Badge */}
          <div className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${roleInfo.color}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-extrabold text-sm sm:text-base">{roleInfo.label}</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                🏠 Tempat Hidup
              </div>
              <div className="font-bold text-[#1F2D3D]">
                {organism.habitat}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                🍽️ Makanan
              </div>
              <div className="font-bold text-[#1F2D3D]">
                {organism.diet}
              </div>
            </div>
          </div>

          {/* Ecological Relationship */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Hubungan di Alam
            </div>
            <p className="text-sm sm:text-base text-[#1F2D3D] font-medium leading-relaxed">
              {organism.role === 'produsen' ? (
                <>Menjadi sumber energi bagi hewan pemakan tumbuhan (herbivora).</>
              ) : organism.role === 'pengurai' ? (
                <>Menguraikan sisa daun gugur dan bangkai menjadi tanah humus yang subur.</>
              ) : (
                <>
                  Dimangsa oleh: <span className="font-bold text-[#D45014]">{organism.predators.join(', ')}</span>.
                </>
              )}
            </p>
          </div>

          {/* Fun Fact Callout */}
          <div className="p-4 rounded-2xl bg-[#EAF7EF] border-2 border-[#1E7A50]">
            <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Fakta Sains Menarik:
            </div>
            <p className="text-sm sm:text-base text-[#1F2D3D] font-medium leading-relaxed">
              "{organism.funFact}"
            </p>
          </div>

        </div>

        {/* Modal Footer (Min 48px buttons) */}
        <div className="p-4 sm:p-5 border-t-2 border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {onAskEcoBot && (
            <button
              onClick={() => {
                audioManager.playClick();
                onAskEcoBot(`Ceritakan lebih banyak tentang cara hidup ${organism.name} di alam!`);
                onClose();
              }}
              className="text-xs sm:text-sm font-bold text-[#1C5FC4] hover:underline cursor-pointer"
            >
              Tanya Ozi tentang {organism.localName} ➔
            </button>
          )}

          <div>
            {!isDiscovered ? (
              <button
                onClick={() => {
                  audioManager.playDiscoveryChime();
                  onDiscover(organism.id);
                }}
                className="px-5 py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603F] text-white font-bold text-sm shadow flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 min-h-[48px]"
              >
                <CheckCircle className="w-5 h-5" />
                Catat di Buku Jurnal (+25 XP)
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1E7A50] font-bold px-4 py-2.5 rounded-xl bg-[#EAF7EF] border-2 border-[#1E7A50]">
                <CheckCircle className="w-4 h-4" />
                Sudah Tercatat di Jurnal
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
