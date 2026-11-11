import React, { useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Volume2, Sparkles, CheckCircle2, Search } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface DecomposerLabProps {
  onBack: () => void;
  onRewardXP: (xp: number) => void;
}

export const DecomposerLab: React.FC<DecomposerLabProps> = ({ onBack, onRewardXP }) => {
  const [step, setStep] = useState<number>(1);
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [hasRewarded, setHasRewarded] = useState(false);

  const stepsData = [
    {
      step: 1,
      title: 'Tahap 1: Daun Segar Gugur ke Lantai Hutan',
      description: 'Ketika angin bertiup, daun-daun hijau tua jatuh menumpuk di atas tanah. Di alam liar, daun gugur bukanlah sampah kotor, melainkan awal dari kehidupan baru.',
      visualIcon: '🍃',
      subtitle: 'Daun hijau segar di atas tanah hutan',
      decomposerAction: 'Menunggu proses alami dimulai.',
      humusLevel: 10
    },
    {
      step: 2,
      title: 'Tahap 2: Daun Menjadi Kering dan Cokelat',
      description: 'Air di dalam daun mengering. Daun berubah warna menjadi cokelat rapuh dan menjadi makanan empuk bagi serangga dan jamur di tanah.',
      visualIcon: '🍂',
      subtitle: 'Daun cokelat kering di samping kayu lapuk',
      decomposerAction: 'Spora jamur mulai menempel.',
      humusLevel: 30
    },
    {
      step: 3,
      title: 'Tahap 3: Jamur dan Bakteri Mengurai Daun',
      description: 'Jamur mengeluarkan benang-benang halus, sementara bakteri mikroskopis bekerja melunakkan serat daun. Jamur dan bakteri adalah PENGURAI (dekomposer) sejati.',
      visualIcon: '🍄',
      subtitle: 'Benang jamur dan bakteri melunakkan daun',
      decomposerAction: 'Pengurai mengubah daun menjadi lembut.',
      humusLevel: 60
    },
    {
      step: 4,
      title: 'Tahap 4: Cacing dan Hewan Tanah Menghancurkan Daun',
      description: 'Cacing tanah, rayap, dan kaki seribu memakan serpihan daun yang sudah lunak. Mereka adalah hewan peremah tanah (detritivor) yang membuat tanah jadi gembur.',
      visualIcon: '🪱',
      subtitle: 'Cacing tanah dan rayap menggemburkan tanah',
      decomposerAction: 'Detritivor mencerna daun menjadi butiran tanah hitam.',
      humusLevel: 85
    },
    {
      step: 5,
      title: 'Tahap 5: Terbentuk Tanah Humus & Tunas Baru Tumbuh!',
      description: 'Seluruh daun gugur kini telah berubah menjadi tanah humus hitam yang kaya nutrisi. Biji-biji baru bisa tumbuh menjadi pohon besar berkat jasa pengurai.',
      visualIcon: '🌱',
      subtitle: 'Tanah humus hitam subur tempat tunas bertumbuh',
      decomposerAction: 'Daur ulang nutrisi sempurna!',
      humusLevel: 100
    }
  ];

  const current = stepsData[step - 1];

  const handleNextStep = () => {
    audioManager.playClick();
    if (step < 5) {
      setStep(step + 1);
    } else {
      setStep(1);
    }

    if (step === 4 && !hasRewarded) {
      setHasRewarded(true);
      onRewardXP(50);
      audioManager.playSuccessChime();
    }
  };

  const handleSpeakCurrentStep = () => {
    audioManager.speakNarration(`${current.title}. ${current.description}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#1E7A50] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Eksplorasi Alam Terbuka
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-[#1E7A50]">
            Pahlawan Pengurai di Lantai Hutan
          </h2>
          <p className="text-base sm:text-lg text-[#1F2D3D] mt-1 max-w-xl font-medium">
            Tanpa wadah kaca atau laboratorium! Amati langsung bagaimana jamur, bakteri, dan cacing tanah mendaur ulang daun gugur menjadi tanah humus yang subur.
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

      {/* Main Natural Forest Floor Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Natural Outdoor Floor Scene (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-gradient-to-b from-[#2D1F15] via-[#21160E] to-[#140D08] border-4 border-[#3D2817] shadow-xl flex flex-col items-center justify-between relative overflow-hidden text-white min-h-[380px]">
          
          {/* Top Stage Header */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-bold text-amber-200 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/40">
              Lantai Hutan Tropis Alami
            </span>
            <button
              onClick={() => {
                audioManager.playClick();
                setShowMagnifier(!showMagnifier);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-transform hover:scale-105 min-h-[40px] ${
                showMagnifier
                  ? 'bg-amber-400 text-slate-900 border-amber-300'
                  : 'bg-black/60 text-amber-300 border-amber-400/60'
              }`}
            >
              <Search className="w-4 h-4" />
              {showMagnifier ? 'Tutup Kaca Pembesar' : 'Gunakan Kaca Pembesar'}
            </button>
          </div>

          {/* Central Natural Scene Elements (NO GLASS CONTAINERS) */}
          <div className="relative my-6 text-center z-10 w-full flex flex-col items-center justify-center">
            
            {/* Main Stage Illustration */}
            <div className="text-6xl sm:text-7xl mb-3 animate-float drop-shadow-xl select-none">
              {current.visualIcon}
            </div>

            <div className="font-['Outfit'] font-black text-xl text-amber-200 drop-shadow">
              {current.subtitle}
            </div>

            {/* Natural Forest Floor Bed (Leaves, decaying log, wild mushrooms) */}
            <div className="mt-4 flex items-center justify-center gap-4 text-3xl select-none opacity-90">
              <span title="Batang Kayu Lapuk">🪵</span>
              <span title="Jamur Alami">🍄</span>
              <span title="Cacing Tanah">🪱</span>
              <span title="Daun Kering">🍂</span>
            </div>

            {/* Magnifying Glass Zoom View on Decaying Leaf (if toggled) */}
            {showMagnifier && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/90 border-2 border-amber-400 text-center animate-in zoom-in-75 duration-200 max-w-xs shadow-2xl">
                <div className="text-xs font-bold text-amber-300 uppercase mb-1">
                  🔍 Lensa Kaca Pembesar di Atas Daun:
                </div>
                <div className="flex justify-center gap-2 text-3xl my-1 animate-pulse">
                  🦠 🧬 🦠
                </div>
                <div className="text-xs text-amber-100 font-medium">
                  Bakteri kecil sedang memakan dan menguraikan serat daun yang membusuk.
                </div>
              </div>
            )}
          </div>

          {/* Step Dots Indicators */}
          <div className="flex items-center gap-2.5 z-10 pb-1">
            {stepsData.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  audioManager.playClick();
                  setStep(s.step);
                }}
                className={`h-3.5 rounded-full cursor-pointer transition-all ${
                  step === s.step
                    ? 'w-9 bg-emerald-400 ring-2 ring-emerald-300'
                    : 'w-3.5 bg-amber-800/80 hover:bg-amber-700'
                }`}
                title={`Lihat Tahap ${s.step}`}
              />
            ))}
          </div>

          {/* Soil gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Right Stage: Explanations & Next Step Controls (5 cols) */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider">
                Langkah {step} dari 5
              </span>
              <button
                onClick={handleSpeakCurrentStep}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Dengarkan Penjelasan Ini"
              >
                <Volume2 className="w-4 h-4 text-[#1E7A50]" />
                <span>Dengarkan</span>
              </button>
            </div>

            <h3 className="font-['Outfit'] font-black text-xl text-[#1E7A50] leading-tight">
              {current.title}
            </h3>

            <p className="text-base sm:text-lg text-[#1F2D3D] leading-relaxed font-medium">
              {current.description}
            </p>

            {/* Scientific Classification Clarification */}
            <div className="p-3.5 rounded-2xl bg-[#EAF7EF] border border-[#1E7A50]/30 space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-[#1E7A50]">Peran Makhluk Hidup:</div>
              <div className="text-[#1F2D3D]">
                • <span className="font-bold">Jamur & Bakteri:</span> Pengurai (Dekomposer).
              </div>
              <div className="text-[#1F2D3D]">
                • <span className="font-bold">Cacing Tanah & Rayap:</span> Hewan pemakan remah daun (detritivor).
              </div>
            </div>

            {/* Soil Humus Gauge */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600">Kesuburan Tanah Humus:</span>
                <span className="text-[#1E7A50] font-mono">{current.humusLevel}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-800 to-[#1E7A50] transition-all duration-500 rounded-full"
                  style={{ width: `${current.humusLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-3 flex gap-2.5">
            <button
              onClick={handleNextStep}
              className="flex-1 py-3 px-5 rounded-2xl bg-[#1E7A50] hover:bg-[#16603F] text-white font-bold text-base shadow-lg cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Play className="w-5 h-5 fill-white" />
              {step < 5 ? 'Lanjut ke Tahap Berikutnya' : 'Ulangi dari Daun Segar'}
            </button>
            <button
              onClick={() => {
                audioManager.playClick();
                setStep(1);
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-300 min-h-[48px] min-w-[48px] flex items-center justify-center"
              title="Kembali ke Tahap 1"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
