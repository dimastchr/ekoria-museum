import React, { useState } from 'react';
import { Volume2, Bookmark, Check, Sparkles, X, ArrowLeft } from 'lucide-react';
import { Organism, AbioticFactor } from '../../types';
import { audioManager } from '../../utils/audioManager';
import { EkoBiotaIcon } from '../common/EkoIcons';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface ObjectDetailModalProps {
  item: Organism | AbioticFactor;
  zoneTitle: string;
  isSavedToJournal: boolean;
  onSaveToJournal: (item: Organism | AbioticFactor) => void;
  onClose: () => void;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({
  item,
  zoneTitle,
  isSavedToJournal,
  onSaveToJournal,
  onClose,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedToJournal);

  const isOrganism = 'isBiotic' in item ? (item as Organism).isBiotic : false;
  const organism = 'trophicLevelName' in item ? (item as Organism) : null;
  const abiotic = !organism ? (item as AbioticFactor) : null;

  // Simple 2-3 sentence explanation
  const description = organism
    ? `${organism.name} (${organism.localName}) merupakan ${organism.trophicLevelName} dalam ekosistem ${zoneTitle}. Makhluk hidup ini memperoleh energi dari ${organism.energySource}. ${organism.funFact}`
    : abiotic
    ? `${abiotic.name} adalah komponen abiotik yang sangat penting di ekosistem ${zoneTitle}. Berperan penting dalam ${abiotic.role}. ${abiotic.effectOnEcosystem}`
    : '';

  // Ozi Thinking Prompt
  const thinkingQuestion = item.thinkingQuestion || (
    organism
      ? `Mengapa keberadaan ${organism.name} sangat memengaruhi keseimbangan rantai makanan di ${zoneTitle}?`
      : `Apa yang akan terjadi pada tumbuhan dan hewan jika ${item.name} berkurang atau tercemar?`
  );

  const handleSpeak = () => {
    const textToSpeak = `${item.name}. ${description}. Pertanyaan Ozi: ${thinkingQuestion}`;
    setIsSpeaking(true);
    audioManager.speak(textToSpeak, () => setIsSpeaking(false));
  };

  const handleSave = () => {
    onSaveToJournal(item);
    setIsSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      {/* Cream card with rounded corners, soft shadow, spring pop-up and glowing border */}
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" className="bg-[#F6F1E3] text-[#0F3D2E] rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border-2 border-[#3FA34D] relative animate-pop-spring animate-glow-ring">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white hover:bg-[#E8DEC9] text-[#0F3D2E] flex items-center justify-center border border-[#E8DEC9] shadow-sm transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: 3D Biota Icon, Name & Badges */}
        <div className="flex items-start gap-4 mb-4 pr-12">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#3FA34D] flex items-center justify-center shadow-md shrink-0 p-1">
            <EkoBiotaIcon
              id={item.id}
              name={item.name}
              role={organism?.role}
              category={organism ? organism.category : 'abiotik'}
              size="lg"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isOrganism ? 'bg-[#3FA34D] text-white' : 'bg-blue-600 text-white'
              }`}>
                {isOrganism ? 'Biotik' : 'Abiotik'}
              </span>

              {organism && (
                <span className="bg-[#1B5E3F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {organism.trophicLevelName}
                </span>
              )}

              <span className="bg-amber-100 text-[#0F3D2E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                {zoneTitle}
              </span>
            </div>

            <h3 className="text-xl font-heading font-extrabold text-[#0F3D2E] leading-tight">
              {item.name}
            </h3>
            {organism && (
              <p className="text-xs italic text-[#52796F]">
                {organism.scientificName} • "{organism.localName}"
              </p>
            )}
          </div>
        </div>

        {/* 2-3 Simple sentences explanation */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DEC9] shadow-sm mb-4 text-xs md:text-sm text-[#2D3748] leading-relaxed">
          {description}
        </div>

        {/* "Ayo Berpikir!" Ozi inquiry prompt box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-[#3FA34D]/40 mb-5 relative">
          <div className="flex items-center gap-2 mb-1.5">
            <img src={oziAvatar} alt="Ozi" className="w-6 h-6 rounded-full border border-[#F5C518]" />
            <span className="text-xs font-heading font-black text-[#1B5E3F] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" /> Ayo Berpikir Bersama Ozi!
            </span>
          </div>
          <p className="text-xs font-semibold text-[#0F3D2E] italic pl-8">
            "{thinkingQuestion}"
          </p>
        </div>

        {/* Action Buttons: Voice Narration & Save to Journal */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8DEC9]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 min-h-[48px] rounded-xl border border-[#E8DEC9] bg-white text-[#0F3D2E] hover:bg-[#E8DEC9] text-sm font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-4 min-h-[48px] rounded-xl border border-[#3FA34D] text-[#1B5E3F] hover:bg-emerald-50 text-xs font-bold transition ${
              isSpeaking ? 'bg-emerald-100 ring-2 ring-[#3FA34D]' : ''
            }`}
            title="Dengarkan penjelasan suara"
          >
            <Volume2 className="w-4 h-4 text-[#3FA34D]" />
            <span>{isSpeaking ? 'Membacakan...' : 'Suara Ozi'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-2 px-5 min-h-[48px] rounded-xl font-heading font-extrabold text-xs shadow-md transition cursor-pointer ${
              isSaved
                ? 'bg-[#3FA34D] text-white cursor-default'
                : 'bg-[#3FA34D] hover:bg-[#348840] text-white active:scale-95'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan di Jurnal</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Simpan ke Jurnal</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
