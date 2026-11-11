import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, AlertTriangle, Sparkles, Volume2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface EcosystemSimulationProps {
  onBack: () => void;
  onRewardXP: (xp: number) => void;
}

interface StepRecord {
  step: number;
  producers: number;
  herbivores: number;
  carnivores: number;
}

export const EcosystemSimulation: React.FC<EcosystemSimulationProps> = ({ onBack, onRewardXP }) => {
  // Balanced fixed point defaults: Tumbuhan = 60, Herbivora = 40, Karnivora = 15
  const [producers, setProducers] = useState<number>(60);
  const [herbivores, setHerbivores] = useState<number>(40);
  const [carnivores, setCarnivores] = useState<number>(15);

  const [activeScenario, setActiveScenario] = useState<'normal' | 'ular-diburu' | 'hutan-gundul' | 'pestisida'>('normal');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [history, setHistory] = useState<StepRecord[]>([
    { step: 0, producers: 60, herbivores: 40, carnivores: 15 }
  ]);
  const [hasRewarded, setHasRewarded] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Discrete 3-trophic level damped population dynamics
  const advanceStep = () => {
    setStepCount((prevStep) => {
      const nextStep = prevStep + 1;

      setProducers((prevP) => {
        // Logistic growth with carrying capacity K=100 minus herbivore feeding
        const growth = 0.20 * prevP * (1 - prevP / 100);
        const consumption = 0.12 * herbivores * (prevP / 60);
        const delta = growth - consumption;
        const newP = Math.max(5, Math.min(100, Math.round((prevP + delta) * 10) / 10));
        return newP;
      });

      setHerbivores((prevH) => {
        // Herbivore growth from plants, loss from predation, plus stabilizing damping
        const gain = 0.16 * prevH * (producers / 60);
        const predation = 0.16 * carnivores * (prevH / 40);
        const mortality = 0.10 * prevH;
        const damping = 0.10 * (prevH - 40);
        const delta = gain - predation - mortality - damping;
        const newH = Math.max(2, Math.min(100, Math.round((prevH + delta) * 10) / 10));
        return newH;
      });

      setCarnivores((prevC) => {
        // Carnivore growth from herbivores, natural death, plus stabilizing damping
        const gain = 0.12 * prevC * (herbivores / 40);
        const death = 0.12 * prevC;
        const damping = 0.10 * (prevC - 15);
        const delta = gain - death - damping;
        const newC = Math.max(1, Math.min(60, Math.round((prevC + delta) * 10) / 10));
        return newC;
      });

      return nextStep;
    });
  };

  // Sync history and reward progress
  useEffect(() => {
    setHistory((prev) => {
      const updated = [...prev, { step: stepCount, producers, herbivores, carnivores }];
      return updated.slice(-25); // Show last 25 steps
    });

    if (stepCount >= 20 && !hasRewarded) {
      setHasRewarded(true);
      onRewardXP(60);
      audioManager.playSuccessChime();
    }
  }, [stepCount, producers, herbivores, carnivores, hasRewarded, onRewardXP]);

  // Simulation timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        advanceStep();
      }, 850);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, producers, herbivores, carnivores]);

  // Equilibrium detection: check variance over recent steps
  const isEcosystemBalanced = () => {
    if (history.length < 3) return true; // default initial is balanced
    const recent = history.slice(-4);
    const pChange = Math.abs(recent[recent.length - 1].producers - recent[0].producers);
    const hChange = Math.abs(recent[recent.length - 1].herbivores - recent[0].herbivores);
    const cChange = Math.abs(recent[recent.length - 1].carnivores - recent[0].carnivores);

    const isStable = pChange <= 2.5 && hChange <= 2.5 && cChange <= 2.0;
    const isHealthyNumbers = producers >= 45 && producers <= 75 && herbivores >= 30 && herbivores <= 55 && carnivores >= 10;
    return isStable && isHealthyNumbers;
  };

  const balanced = isEcosystemBalanced();

  const handleApplyScenario = (scenario: typeof activeScenario) => {
    audioManager.playClick();
    setActiveScenario(scenario);
    setStepCount(0);

    if (scenario === 'normal') {
      setProducers(60);
      setHerbivores(40);
      setCarnivores(15);
      setHistory([{ step: 0, producers: 60, herbivores: 40, carnivores: 15 }]);
      audioManager.speakNarration('Skenario Seimbang: Semua makhluk hidup mendapatkan makanan cukup dan ekosistem tetap harmonis.');
    } else if (scenario === 'ular-diburu') {
      setProducers(25);
      setHerbivores(80);
      setCarnivores(2);
      setHistory([{ step: 0, producers: 25, herbivores: 80, carnivores: 2 }]);
      audioManager.speakNarration('Gawat! Ular diburu manusia. Jumlah tikus dan hama meledak, memakan habis padi dan tumbuhan.');
    } else if (scenario === 'hutan-gundul') {
      setProducers(15);
      setHerbivores(15);
      setCarnivores(4);
      setHistory([{ step: 0, producers: 15, herbivores: 15, carnivores: 4 }]);
      audioManager.speakNarration('Hutan ditebang! Tumbuhan sangat sedikit sehingga hewan-hewan kelaparan.');
    } else if (scenario === 'pestisida') {
      setProducers(40);
      setHerbivores(10);
      setCarnivores(3);
      setHistory([{ step: 0, producers: 40, herbivores: 10, carnivores: 3 }]);
      audioManager.speakNarration('Pestisida dipakai berlebihan! Banyak serangga baik dan hewan kecil ikut mati terkena racun.');
    }
  };

  // Restoration action: helps kids restore balance!
  const handleRestoreEcosystem = () => {
    audioManager.playDiscoveryChime();
    setProducers(58);
    setHerbivores(42);
    setCarnivores(14);
    setActiveScenario('normal');
    audioManager.speakNarration('Hebat! Ekosistem berhasil diperbaiki. Tumbuhan bertunas kembali, jumlah hewan terkendali, dan alam kembali seimbang.');
  };

  const handleReset = () => {
    audioManager.playClick();
    setIsRunning(false);
    setStepCount(0);
    setProducers(60);
    setHerbivores(40);
    setCarnivores(15);
    setActiveScenario('normal');
    setHistory([{ step: 0, producers: 60, herbivores: 40, carnivores: 15 }]);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#1E7A50] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Laboratorium Interaktif IPAS Kelas 5
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-black text-[#1E7A50]">
            Simulasi Keseimbangan Ekosistem
          </h2>
          <p className="text-base sm:text-lg text-[#1F2D3D] mt-1 max-w-2xl font-medium">
            Lihat bagaimana tumbuhan, hewan pemakan tumbuhan (herbivora), dan hewan pemangsa (karnivora) saling menjaga keseimbangan alam!
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

      {/* Main Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Dynamic Graph & Equilibrium Status (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Status Badge: Seimbang vs Tidak Seimbang */}
          <div className={`p-4 rounded-3xl border-3 flex items-center justify-between transition-colors ${
            balanced
              ? 'bg-[#EAF7EF] border-[#1E7A50] text-[#1E7A50]'
              : 'bg-[#FFF3E8] border-[#D45014] text-[#D45014]'
          }`}>
            <div className="flex items-center gap-3">
              {balanced ? (
                <CheckCircle2 className="w-7 h-7 text-[#1E7A50] shrink-0" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-[#D45014] shrink-0" />
              )}
              <div>
                <div className="font-['Outfit'] font-black text-lg sm:text-xl">
                  {balanced ? 'Ekosistem: SEIMBANG (Harmonis)' : 'Ekosistem: TIDAK SEIMBANG'}
                </div>
                <div className="text-sm font-medium opacity-90 mt-0.5">
                  {balanced
                    ? 'Tumbuhan cukup, jumlah hewan terkendali, dan alam seimbang.'
                    : 'Terjadi gangguan! Ada populasi yang meledak atau kekurangan makanan.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audioManager.speakNarration(
                  balanced
                    ? 'Ekosistem sedang seimbang! Semua makhluk hidup mendapatkan makanan cukup dan alam berjalan harmonis.'
                    : 'Ekosistem sedang tidak seimbang. Coba klik tombol "Perbaiki Ekosistem" untuk menyeimbangkannya kembali!'
                );
              }}
              className="p-2.5 rounded-2xl bg-white border border-current shadow-sm hover:scale-105 cursor-pointer shrink-0"
              title="Dengarkan Status"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* SVG Dynamic Line Chart */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Grafik Populasi (Langkah ke-{stepCount})
              </div>
              
              {/* Legends with Large Child-Friendly Emojis */}
              <div className="flex items-center gap-4 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-[#1E7A50]">
                  <span className="text-lg">🌾</span> Tumbuhan ({Math.round(producers)})
                </span>
                <span className="flex items-center gap-1.5 text-[#E68A00]">
                  <span className="text-lg">🦗</span> Herbivora ({Math.round(herbivores)})
                </span>
                <span className="flex items-center gap-1.5 text-[#D45014]">
                  <span className="text-lg">🐍</span> Karnivora ({Math.round(carnivores)})
                </span>
              </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="h-56 w-full relative bg-[#F4FBF7] rounded-2xl p-2 border-2 border-emerald-100 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                {/* Reference Guideline for carrying capacity */}
                <line x1="0" y1="60" x2="400" y2="60" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1.5" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1.5" />

                {history.length > 1 && (
                  <>
                    {/* Producers Line (Green) */}
                    <polyline
                      fill="none"
                      stroke="#1E7A50"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={history
                        .map((pt, idx) => {
                          const x = (idx / (history.length - 1)) * 400;
                          const y = 145 - (pt.producers / 100) * 135;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                    {/* Herbivores Line (Warm Yellow / Amber) */}
                    <polyline
                      fill="none"
                      stroke="#E68A00"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={history
                        .map((pt, idx) => {
                          const x = (idx / (history.length - 1)) * 400;
                          const y = 145 - (pt.herbivores / 100) * 135;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                    {/* Carnivores Line (Natural Orange / Red) */}
                    <polyline
                      fill="none"
                      stroke="#D45014"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={history
                        .map((pt, idx) => {
                          const x = (idx / (history.length - 1)) * 400;
                          const y = 145 - (pt.carnivores / 50) * 135;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </>
                )}
              </svg>
            </div>

            {/* If not balanced, offer friendly restoration button */}
            {!balanced && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-amber-900">
                  Ingin mengembalikan ekosistem ke titik seimbang?
                </span>
                <button
                  onClick={handleRestoreEcosystem}
                  className="px-4 py-2 rounded-xl bg-[#1E7A50] hover:bg-[#16603F] text-white text-sm font-bold cursor-pointer transition-transform hover:scale-105 min-h-[44px]"
                >
                  🌱 Perbaiki Ekosistem
                </button>
              </div>
            )}
          </div>

          {/* Controls Bar (Min 48px buttons) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FFFDF9] rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  audioManager.playClick();
                  setIsRunning(!isRunning);
                }}
                className={`px-6 py-3 rounded-2xl text-base font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md min-h-[48px] ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-[#1E7A50] hover:bg-[#16603F] text-white animate-pulse-btn'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                {isRunning ? 'Jeda' : 'Ayo Mulai (Play)'}
              </button>

              <button
                onClick={() => {
                  audioManager.playClick();
                  advanceStep();
                }}
                disabled={isRunning}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-base font-bold border-2 border-slate-300 cursor-pointer transition-colors min-h-[48px]"
              >
                +1 Langkah
              </button>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi
            </button>
          </div>

        </div>

        {/* Right: Selectable Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] text-lg font-black text-[#1E7A50]">
                Pilih Cerita Kasus Ekosistem:
              </h3>
              <button
                onClick={() => {
                  audioManager.speakNarration(
                    'Pilihlah salah satu cerita kasus untuk mengamati apa yang terjadi jika salah satu hewan atau tumbuhan terganggu!'
                  );
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Dengarkan Petunjuk"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              
              {/* Scenario 1: Normal Balanced */}
              <button
                onClick={() => handleApplyScenario('normal')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer min-h-[48px] ${
                  activeScenario === 'normal'
                    ? 'bg-[#EAF7EF] border-[#1E7A50] text-[#1E7A50] ring-2 ring-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1F2D3D]'
                }`}
              >
                <div className="font-bold text-base flex items-center gap-2">
                  <span>🏡</span> 1. Ekosistem Seimbang (Normal)
                </div>
                <div className="text-xs sm:text-sm mt-1 opacity-80 leading-relaxed font-medium">
                  Tumbuhan tumbuh subur, herbivora cukup, dan pemangsa menjaga keseimbangan.
                </div>
              </button>

              {/* Scenario 2: Snake poached */}
              <button
                onClick={() => handleApplyScenario('ular-diburu')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer min-h-[48px] ${
                  activeScenario === 'ular-diburu'
                    ? 'bg-[#FFF3E8] border-[#D45014] text-[#D45014] ring-2 ring-orange-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1F2D3D]'
                }`}
              >
                <div className="font-bold text-base flex items-center gap-2">
                  <span>🏹</span> 2. Ular Diburu → Tikus Meledak
                </div>
                <div className="text-xs sm:text-sm mt-1 opacity-80 leading-relaxed font-medium">
                  Saat ular diburu habis, jumlah tikus melonjak dan padi dimakan sampai habis!
                </div>
              </button>

              {/* Scenario 3: Deforestation */}
              <button
                onClick={() => handleApplyScenario('hutan-gundul')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer min-h-[48px] ${
                  activeScenario === 'hutan-gundul'
                    ? 'bg-[#FFF3E8] border-[#D45014] text-[#D45014] ring-2 ring-orange-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1F2D3D]'
                }`}
              >
                <div className="font-bold text-base flex items-center gap-2">
                  <span>🪓</span> 3. Hutan Ditebang → Tumbuhan Berkurang
                </div>
                <div className="text-xs sm:text-sm mt-1 opacity-80 leading-relaxed font-medium">
                  Tumbuhan berkurang drastis sehingga herbivora dan karnivora ikut kelaparan.
                </div>
              </button>

              {/* Scenario 4: Overuse of pesticide */}
              <button
                onClick={() => handleApplyScenario('pestisida')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer min-h-[48px] ${
                  activeScenario === 'pestisida'
                    ? 'bg-[#FFF3E8] border-[#D45014] text-[#D45014] ring-2 ring-orange-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#1F2D3D]'
                }`}
              >
                <div className="font-bold text-base flex items-center gap-2">
                  <span>🧪</span> 4. Racun Pestisida Berlebihan
                </div>
                <div className="text-xs sm:text-sm mt-1 opacity-80 leading-relaxed font-medium">
                  Racun membunuh serangga baik dan mencemari air minum hewan lain.
                </div>
              </button>

            </div>

            {/* Educational Takeaway Callout */}
            <div className="p-4 rounded-2xl bg-[#EAF7EF] border border-[#1E7A50]/30 text-xs sm:text-sm text-[#1E7A50] leading-relaxed font-medium">
              <span className="font-bold">Pelajaran Penting: </span>
              Di alam, tidak ada makhluk hidup yang hidup sendirian. Menjaga kelestarian satu hewan sama dengan melindungi seisi ekosistem!
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
