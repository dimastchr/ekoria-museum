import React, { useState } from 'react';
import { Sun, Droplets, BookOpen, Sparkles, Check, Plus, RefreshCw, Volume2, MapPin } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

interface VirtualTerrariumProps {
  onBack: () => void;
  onRewardXP: (xp: number) => void;
}

export const VirtualTerrarium: React.FC<VirtualTerrariumProps> = ({ onBack, onRewardXP }) => {
  const [moisture, setMoisture] = useState<number>(65); // 0-100%
  const [lightHours, setLightHours] = useState<number>(8); // 0-16 hours
  const [organismsInJar, setOrganismsInJar] = useState<string[]>(['Lumut Daun', 'Pakis Mini']);
  const [journalLogs, setJournalLogs] = useState<string[]>([
    'Hari ke-1: Terarium dirakit dengan kerikil, arang, dan tanah humus.'
  ]);
  const [newNote, setNewNote] = useState('');
  const [hasRewarded, setHasRewarded] = useState(false);

  const availableAdditions = [
    { name: 'Cacing Tanah', roleDesc: 'Detritivor (Peremah)', icon: '🪱' },
    { name: 'Kepik Bintik', roleDesc: 'Konsumen', icon: '🐞' },
    { name: 'Jamur Kecil', roleDesc: 'Pengurai (Dekomposer)', icon: '🍄' },
    { name: 'Sukulen Mini', roleDesc: 'Produsen', icon: '🪴' }
  ];

  const handleAddOrganism = (name: string) => {
    if (organismsInJar.includes(name)) return;
    audioManager.playClick();
    setOrganismsInJar([...organismsInJar, name]);
    const log = `Ditambahkan ${name} ke dalam ekosistem toples tertutup.`;
    setJournalLogs([log, ...journalLogs]);

    if (!hasRewarded) {
      setHasRewarded(true);
      onRewardXP(40);
      audioManager.playSuccessChime();
    }
  };

  const handleAddJournalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    audioManager.playClick();
    setJournalLogs([`Catatan Penjelajah: "${newNote}"`, ...journalLogs]);
    setNewNote('');
  };

  const getTerrariumHealth = () => {
    if (moisture > 85) {
      return { status: 'Terlalu Basah (Embun terlalu tebal)', color: 'text-[#D45014] bg-amber-50' };
    }
    if (moisture < 35) {
      return { status: 'Terlalu Kering (Tanaman butuh air)', color: 'text-rose-600 bg-rose-50' };
    }
    if (lightHours < 4) {
      return { status: 'Kurang Cahaya (Daun mulai pucat)', color: 'text-amber-700 bg-amber-50' };
    }
    return { status: 'Seimbang & Segar (Siklus air alami berjalan lancar!)', color: 'text-[#1E7A50] bg-[#EAF7EF]' };
  };

  const health = getTerrariumHealth();

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#EAF7EF] via-[#FEF7EC] to-[#EBF3FC] border-2 border-[#1E7A50]/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E7A50] text-white text-sm font-bold mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Miniatur Ekosistem
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-[#1F2D3D]">
            Toples Kaca Ajaib (Terarium)
          </h2>
          <p className="text-lg text-[#334E68] mt-1.5 max-w-2xl font-medium">
            Yuk lihat bagaimana tumbuhan, tanah, dan air bisa hidup harmonis bersama di dalam toples tertutup!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => audioManager.speak('Ini adalah toples ekosistem tertutup. Di dalamnya, air menguap lalu mengembun menjadi tetesan hujan mini. Tumbuhan dan pengurai saling melengkapi!')}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FEF7EC] border-2 border-amber-300 text-[#9C4221] font-bold text-sm flex items-center gap-2 cursor-pointer hover:bg-amber-100"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            Dengarkan
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              audioManager.stopSpeaking();
              onBack();
            }}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1E7A50] font-bold text-base border-2 border-[#1E7A50] shadow-sm flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
          >
            <MapPin className="w-5 h-5 text-[#1E7A50]" />
            Kembali ke Peta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Interactive Visual Jar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md flex flex-col items-center justify-between relative overflow-hidden">
          
          <div className="w-full flex items-center justify-between text-base mb-4">
            <span className="text-[#627D98] font-bold uppercase text-xs tracking-wider">Kondisi Toples:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-extrabold border ${health.color}`}>
              {health.status}
            </span>
          </div>

          {/* Jar Container Graphic */}
          <div className="relative w-64 h-84 rounded-t-[48px] rounded-b-[32px] border-4 border-[#1E7A50]/40 bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-100/60 p-4 shadow-xl flex flex-col justify-end overflow-hidden">
            {/* Top Jar Lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-amber-800 rounded-t-xl border-b-2 border-amber-900 shadow-sm" />

            {/* Condensation Droplets */}
            {moisture > 60 && (
              <div className="absolute inset-0 pointer-events-none opacity-60">
                <div className="absolute top-10 left-8 text-sky-500 text-sm">💧</div>
                <div className="absolute top-16 right-10 text-sky-500 text-sm">💧</div>
                <div className="absolute top-28 left-14 text-sky-500 text-xs">💧</div>
                <div className="absolute top-24 right-16 text-sky-500 text-xs">💧</div>
              </div>
            )}

            {/* Sunlight rays overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity"
              style={{ opacity: lightHours / 16 * 0.4 }}
            >
              <div className="w-full h-full bg-gradient-to-tr from-transparent via-amber-300/30 to-amber-200/50" />
            </div>

            {/* Organisms inside Jar */}
            <div className="relative z-10 flex flex-wrap items-end justify-center gap-3 pb-8">
              {organismsInJar.map((name, i) => (
                <div key={i} className="text-center animate-in zoom-in-75 duration-300">
                  <span className="text-4xl block filter drop-shadow">
                    {name.includes('Lumut') ? '🌿' : name.includes('Pakis') ? '🪴' : name.includes('Cacing') ? '🪱' : name.includes('Kepik') ? '🐞' : name.includes('Jamur') ? '🍄' : '🌵'}
                  </span>
                  <span className="text-xs text-[#1F2D3D] bg-white/90 border border-slate-300 px-2 py-0.5 rounded-full font-bold shadow-xs">
                    {name}
                  </span>
                </div>
              ))}
            </div>

            {/* Soil & Pebble Layers at Bottom */}
            <div className="w-full h-20 rounded-b-2xl overflow-hidden flex flex-col justify-end border-t-2 border-amber-900/30 shadow-inner">
              <div className="h-9 bg-[#4a2e1b] flex items-center justify-center text-xs text-amber-200 font-bold">
                Tanah Humus Subur
              </div>
              <div className="h-6 bg-[#262626] flex items-center justify-center text-[10px] text-slate-300 font-semibold">
                Arang Aktif
              </div>
              <div className="h-5 bg-[#78716c] flex items-center justify-center text-[9px] text-white font-semibold">
                Kerikil Saluran Air
              </div>
            </div>
          </div>

          {/* Quick Add Organisms */}
          <div className="w-full mt-5 pt-4 border-t-2 border-slate-100">
            <div className="text-sm font-bold text-[#1F2D3D] mb-2.5">
              Tambahkan Makhluk Hidup ke Toples:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableAdditions.map((item) => {
                const isAdded = organismsInJar.includes(item.name);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleAddOrganism(item.name)}
                    disabled={isAdded}
                    className={`min-h-[48px] p-2.5 rounded-2xl text-xs font-bold flex items-center justify-between border-2 cursor-pointer transition-all ${
                      isAdded
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-[#EAF7EF] hover:bg-[#d8f1e2] text-[#1E7A50] border-[#1E7A50]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="text-xs font-bold leading-tight">{item.name}</div>
                        <div className="text-[10px] text-[#627D98] font-normal">{item.roleDesc}</div>
                      </div>
                    </div>
                    {isAdded ? <Check className="w-4 h-4 text-[#1E7A50]" /> : <Plus className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Environmental Controls & Observation Journal */}
        <div className="space-y-4">
          
          {/* Controls */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-5">
            <h4 className="font-['Outfit'] text-lg font-bold text-[#1F2D3D]">
              Atur Suhu & Udara (Faktor Abiotik)
            </h4>

            {/* Moisture slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span className="text-[#1C5FC4] font-bold flex items-center gap-2">
                  <Droplets className="w-5 h-5" /> Kelembapan
                </span>
                <span className="font-mono font-bold text-[#1F2D3D]">{moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full accent-[#1C5FC4] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sunlight hours slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span className="text-[#D45014] font-bold flex items-center gap-2">
                  <Sun className="w-5 h-5" /> Cahaya Matahari
                </span>
                <span className="font-mono font-bold text-[#1F2D3D]">{lightHours} jam/hari</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={lightHours}
                onChange={(e) => setLightHours(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Observation Journal */}
          <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-['Outfit'] text-lg font-bold text-[#1F2D3D] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1E7A50]" />
                Buku Catatan Penjelajah
              </h4>
              <button
                onClick={() => setJournalLogs(['Buku catatan dibuka kembali.'])}
                className="min-h-[44px] px-3 py-1.5 text-xs text-[#627D98] hover:text-[#1F2D3D] flex items-center gap-1 cursor-pointer font-semibold rounded-xl hover:bg-slate-100"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Hapus Catatan
              </button>
            </div>

            <form onSubmit={handleAddJournalNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis apa yang kamu amati di toples ini..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#F8FAF8] border-2 border-slate-200 rounded-2xl px-4 py-2.5 text-base text-[#1F2D3D] placeholder-slate-400 focus:outline-none focus:border-[#1E7A50] font-medium"
              />
              <button
                type="submit"
                className="min-h-[48px] px-5 py-2.5 bg-[#1E7A50] hover:bg-[#16603E] text-white rounded-2xl text-base font-bold cursor-pointer transition-colors"
              >
                Catat
              </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {journalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F8FAF8] border border-slate-200 text-sm text-[#334E68] leading-relaxed font-medium"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
