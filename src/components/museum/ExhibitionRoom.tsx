import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Trophy, Volume2, Map, Check } from 'lucide-react';
import { RoomData, Organism, StudentProgress, ViewState } from '../../types';
import { audioManager } from '../../utils/audioManager';
import { OrganismModal } from './OrganismModal';
import { EcoBotGuide } from '../guide/EcoBotGuide';
import { FoodChainBuilder } from '../exhibits/FoodChainBuilder';
import { ROOM_QUIZZES } from '../../data/museumData';

interface ExhibitionRoomProps {
  room: RoomData;
  progress: StudentProgress;
  onBackToHall: () => void;
  onUpdateProgress: (newProgress: Partial<StudentProgress>) => void;
  onNavigate: (view: ViewState) => void;
  onOpenEcoBot: (initialQuery?: string) => void;
}

export const ExhibitionRoom: React.FC<ExhibitionRoomProps> = ({
  room,
  progress,
  onBackToHall,
  onUpdateProgress,
  onNavigate,
  onOpenEcoBot
}) => {
  const [activeTab, setActiveTab] = useState<'diorama' | 'chain' | 'quiz'>('diorama');
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [selectedAbiotic, setSelectedAbiotic] = useState<typeof room.abioticFactors[0] | null>(null);
  const [hiddenDiscovered, setHiddenDiscovered] = useState(
    room.hiddenItem ? progress.hiddenFound.includes(room.hiddenItem.id) : false
  );

  // Play habitat ambient sound
  useEffect(() => {
    audioManager.playHabitatAmbient(room.ambientType);
    return () => {
      audioManager.stopHabitatAmbient();
    };
  }, [room.ambientType]);

  const handleDiscoverOrganism = (id: string) => {
    const discovered = [...new Set([...progress.discoveredOrganisms, id])];
    const roomOrganismIds = room.organisms.map((o) => o.id);
    const discoveredInRoom = roomOrganismIds.filter((oid) => discovered.includes(oid));
    const roomPct = Math.round((discoveredInRoom.length / roomOrganismIds.length) * 100);

    const completed = roomPct === 100 && !progress.completedRooms.includes(room.id)
      ? [...progress.completedRooms, room.id]
      : progress.completedRooms;

    onUpdateProgress({
      discoveredOrganisms: discovered,
      totalXP: progress.totalXP + 25,
      totalStars: progress.totalStars + 1,
      roomProgress: {
        ...progress.roomProgress,
        [room.id]: Math.max(progress.roomProgress[room.id] || 0, roomPct)
      },
      completedRooms: completed
    });
  };

  const handleDiscoverHidden = () => {
    if (!room.hiddenItem || hiddenDiscovered) return;
    audioManager.playDiscoveryChime();
    setHiddenDiscovered(true);

    const updatedHidden = [...new Set([...progress.hiddenFound, room.hiddenItem.id])];
    onUpdateProgress({
      hiddenFound: updatedHidden,
      totalXP: progress.totalXP + room.hiddenItem.xp,
      totalStars: progress.totalStars + 2
    });
    audioManager.speakNarration(room.hiddenItem.discoveryFact);
  };

  const handleCompleteFoodChain = (xpGained: number) => {
    const badges = [...progress.badges];
    if (!badges.includes('ahli-rantai-makanan')) {
      badges.push('ahli-rantai-makanan');
    }
    onUpdateProgress({
      totalXP: progress.totalXP + xpGained,
      totalStars: progress.totalStars + 2,
      badges
    });
  };

  // Quiz Handling
  const roomQuizQuestions = ROOM_QUIZZES[room.id] || [];
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    audioManager.playClick();
    setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    roomQuizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += Math.round(100 / roomQuizQuestions.length);
      }
    });

    audioManager.playSuccessChime();
    setQuizSubmitted(true);

    const badges = [...progress.badges];
    const roomBadgeMap: Record<string, string> = {
      'hutan-harmoni': 'penjelajah-hutan',
      'sungai-bersih': 'penjaga-sungai',
      'laut-karang': 'sahabat-karang',
      'sawah-kebun': 'sahabat-tani'
    };
    const badgeToAdd = roomBadgeMap[room.id];
    if (badgeToAdd && !badges.includes(badgeToAdd)) {
      badges.push(badgeToAdd);
    }

    const completed = !progress.completedRooms.includes(room.id)
      ? [...progress.completedRooms, room.id]
      : progress.completedRooms;

    onUpdateProgress({
      quizScores: {
        ...progress.quizScores,
        [room.id]: score
      },
      roomProgress: {
        ...progress.roomProgress,
        [room.id]: 100
      },
      completedRooms: completed,
      totalXP: progress.totalXP + 80,
      totalStars: progress.totalStars + 3,
      badges
    });

    import('../../services/firestoreService').then(({ firestoreService }) => {
      firestoreService.recordAttempt(progress.username, progress.className, 'room-quiz', score);
    }).catch(() => {});

    audioManager.speakNarration(`Selamat! Kamu menyelesaikan kuis dengan skor ${score}. Hebat sekali!`);
  };

  const handleSpeakQuestion = (q: typeof roomQuizQuestions[0]) => {
    const textToRead = `${q.question}. Pilihan A: ${q.options[0]}. Pilihan B: ${q.options[1]}. Pilihan C: ${q.options[2]}. Pilihan D: ${q.options[3] || ''}`;
    audioManager.speakNarration(textToRead);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300 text-[#1F2D3D]">
      
      {/* Top Breadcrumb & Always Visible "Kembali ke Peta" Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#FFFDF9] border-3 border-[#1E7A50]/30 shadow-sm">
        
        <div className="flex items-center gap-3">
          {/* ALWAYS VISIBLE "KEMBALI KE PETA" BUTTON */}
          <button
            onClick={() => {
              audioManager.playClick();
              onBackToHall();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#EAF7EF] hover:bg-[#D5EFE0] text-[#1E7A50] font-black text-base border-2 border-[#1E7A50] cursor-pointer transition-transform hover:scale-105 min-h-[48px] shadow-sm"
            title="Kembali ke Peta Petualangan"
          >
            <Map className="w-5 h-5 text-[#1E7A50]" />
            <span>Kembali ke Peta</span>
          </button>

          <div>
            <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider">
              Ruang {room.roomNumber ?? room.zoneNumber ?? 1} · {room.theme}
            </div>
            <h1 className="font-['Outfit'] text-xl sm:text-2xl font-black text-[#1E7A50] leading-tight">
              {room.title}
            </h1>
          </div>
        </div>

        {/* Mode Switcher Tabs (Min 48px Touch Targets) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('diorama');
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors min-h-[44px] ${
              activeTab === 'diorama'
                ? 'bg-[#1E7A50] text-white shadow'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Diorama Habitat
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('chain');
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors min-h-[44px] ${
              activeTab === 'chain'
                ? 'bg-[#1E7A50] text-white shadow'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Rantai Makanan
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('quiz');
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors min-h-[44px] ${
              activeTab === 'quiz'
                ? 'bg-[#1E7A50] text-white shadow'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Kuis ({roomQuizQuestions.length} Soal)
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chain' ? (
        <FoodChainBuilder
          roomOrganisms={room.organisms}
          roomId={room.id}
          roomTitle={room.title}
          onComplete={handleCompleteFoodChain}
          onBackToRoom={() => setActiveTab('diorama')}
        />
      ) : activeTab === 'quiz' ? (
        /* Room Quiz Tab */
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-bold text-[#1E7A50] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              Kuis Penjelajah
            </div>
            <h2 className="font-['Outfit'] text-2xl font-black text-[#1E7A50]">
              Kuis: {room.title}
            </h2>
            <p className="text-base text-slate-600 mt-1 font-medium">
              Jawab pertanyaan di bawah ini! Klik tombol suara 🔊 jika ingin soal dibacakan.
            </p>
          </div>

          <div className="space-y-6">
            {roomQuizQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-sm">
                
                <div className="flex items-start justify-between gap-3">
                  <div className="text-base sm:text-lg font-bold text-[#1F2D3D] leading-relaxed">
                    <span className="text-[#1E7A50] mr-1.5 font-black">{idx + 1}.</span> {q.question}
                  </div>
                  <button
                    onClick={() => handleSpeakQuestion(q)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E7A50] cursor-pointer shrink-0"
                    title="Dengarkan Soal Ini"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[q.id] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnClass = 'bg-white hover:bg-slate-50 text-[#1F2D3D] border-slate-200';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-[#EAF7EF] text-[#1E7A50] border-[#1E7A50] font-black';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-50 text-rose-800 border-rose-300';
                      } else {
                        btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-[#EAF7EF] text-[#1E7A50] border-[#1E7A50] ring-2 ring-emerald-300 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !quizSubmitted && handleSelectQuizAnswer(q.id, optIdx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3.5 rounded-2xl text-sm sm:text-base border-2 transition-all cursor-pointer flex items-start gap-2.5 min-h-[48px] ${btnClass}`}
                      >
                        <span className="font-bold opacity-80">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="leading-relaxed font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="p-3.5 rounded-2xl bg-[#EAF7EF] border border-[#1E7A50] text-sm text-[#1E7A50] leading-relaxed font-medium">
                    <span className="font-bold">Penjelasan: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < roomQuizQuestions.length}
                className="px-6 py-3.5 rounded-2xl bg-[#1E7A50] hover:bg-[#16603F] disabled:opacity-40 text-white font-bold text-base shadow-lg cursor-pointer transition-colors min-h-[48px]"
              >
                Kirim Jawaban Kuis (+80 XP)
              </button>
            ) : (
              <button
                onClick={() => {
                  audioManager.playClick();
                  setActiveTab('diorama');
                }}
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1F2D3D] font-bold text-base border-2 border-slate-300 cursor-pointer min-h-[48px]"
              >
                Kembali ke Diorama
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Diorama View */
        <div className="space-y-6">
          
          {/* Main Visual Diorama Canvas */}
          <div className="relative w-full aspect-[16/9] min-h-[420px] rounded-3xl overflow-hidden border-4 border-[#1E7A50] shadow-2xl bg-black select-none">
            
            <img
              src={room.bgImage}
              alt={room.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-95"
            />

            {/* Interactive Organism Hotspots */}
            {room.organisms.map((org) => {
              const isFound = progress.discoveredOrganisms.includes(org.id);
              return (
                <div
                  key={org.id}
                  style={{ left: `${org.x}%`, top: `${org.y}%` }}
                  onClick={() => {
                    audioManager.playClick();
                    setSelectedOrganism(org);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                >
                  <div
                    className={`relative p-2.5 sm:p-3 rounded-3xl border-3 shadow-2xl transition-all duration-300 group-hover:scale-125 flex items-center justify-center ${
                      isFound
                        ? 'bg-[#1E7A50] text-white border-white'
                        : 'bg-white text-slate-900 border-amber-400 animate-bounce'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{org.icon}</span>
                  </div>

                  {/* Tooltip Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1 rounded-xl bg-black/90 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {org.localName}
                  </div>
                </div>
              );
            })}

            {/* Abiotic Factor Hotspots */}
            {room.abioticFactors.map((ab) => (
              <div
                key={ab.id}
                style={{ left: `${ab.x}%`, top: `${ab.y}%` }}
                onClick={() => {
                  audioManager.playClick();
                  setSelectedAbiotic(ab);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              >
                <div className="p-2 sm:p-2.5 rounded-full bg-[#1C5FC4] text-white text-base sm:text-lg border-2 border-white shadow hover:scale-110 transition-transform">
                  <span>{ab.icon}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1 rounded-xl bg-black/90 text-sky-300 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow">
                  Abiotik: {ab.name}
                </div>
              </div>
            ))}

            {/* Hidden Secret Object Hotspot */}
            {room.hiddenItem && (
              <div
                style={{ left: `${room.hiddenItem.x}%`, top: `${room.hiddenItem.y}%` }}
                onClick={handleDiscoverHidden}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all ${
                  hiddenDiscovered
                    ? 'opacity-90 scale-100'
                    : 'opacity-50 hover:opacity-100 scale-90 hover:scale-110 animate-pulse'
                }`}
                title={hiddenDiscovered ? 'Rahasia Ditemukan!' : 'Klik objek berkilau ini!'}
              >
                <div className="p-2.5 rounded-2xl bg-purple-600 text-white text-xl shadow-lg border-2 border-amber-300">
                  ✨
                </div>
              </div>
            )}

            {/* Bottom Bar Info on Diorama */}
            <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-white font-bold">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#1E7A50] inline-block" />
                  Biotik (Makhluk Hidup)
                </span>
                <span className="flex items-center gap-1.5 text-sky-300">
                  <span className="w-3 h-3 rounded-full bg-[#1C5FC4] inline-block" />
                  Abiotik (Benda Tak Hidup)
                </span>
              </div>

              <div className="text-amber-300 font-mono">
                {room.organisms.filter((o) => progress.discoveredOrganisms.includes(o.id)).length} / {room.organisms.length} Ditemukan
              </div>
            </div>

          </div>

          {/* Abiotic Callout if selected */}
          {selectedAbiotic && (
            <div className="p-5 rounded-3xl bg-[#EAF7EF] border-2 border-[#1C5FC4] flex items-start justify-between gap-3 animate-in fade-in duration-200 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-4xl p-2.5 rounded-2xl bg-white border border-sky-300 shadow-sm">
                  {selectedAbiotic.icon}
                </span>
                <div>
                  <div className="text-xs font-bold text-[#1C5FC4] uppercase tracking-wider">
                    Abiotik (Benda Tak Hidup)
                  </div>
                  <h4 className="font-['Outfit'] text-xl font-black text-[#1F2D3D]">
                    {selectedAbiotic.name}
                  </h4>
                  <p className="text-base text-[#1F2D3D] mt-1 font-medium leading-relaxed">
                    <span className="font-bold text-[#1C5FC4]">Manfaat bagi makhluk hidup: </span>
                    {selectedAbiotic.effectOnEcosystem}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAbiotic(null)}
                className="text-slate-500 hover:text-black p-2 rounded-xl text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Hidden Object Discovery Notice if found */}
          {hiddenDiscovered && room.hiddenItem && (
            <div className="p-4 sm:p-5 rounded-3xl bg-purple-50 border-2 border-purple-300 flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <div className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Penemuan Rahasia: {room.hiddenItem.name}
                  </div>
                  <p className="text-xs sm:text-sm text-purple-800 mt-0.5 font-medium">
                    {room.hiddenItem.discoveryFact}
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                +{room.hiddenItem.xp} XP
              </span>
            </div>
          )}

          {/* Organisms Cards Strip */}
          <div className="p-6 rounded-3xl bg-[#FFFDF9] border-3 border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Daftar Makhluk Hidup di {room.title}:
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Klik kartu untuk membaca info makanannya
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {room.organisms.map((org) => {
                const isDiscovered = progress.discoveredOrganisms.includes(org.id);
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      audioManager.playClick();
                      setSelectedOrganism(org);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-102 cursor-pointer flex flex-col justify-between min-h-[48px] ${
                      isDiscovered
                        ? 'bg-[#EAF7EF] border-[#1E7A50] shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-1">{org.icon}</div>
                      <div className="font-bold text-base text-[#1F2D3D] leading-tight">
                        {org.localName}
                      </div>
                      <div className="text-xs text-[#1E7A50] font-bold mt-1 capitalize">
                        {org.role.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      {isDiscovered ? (
                        <span className="text-[#1E7A50] font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Tercatat
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Klik info</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Organism Modal */}
      {selectedOrganism && (
        <OrganismModal
          organism={selectedOrganism}
          isDiscovered={progress.discoveredOrganisms.includes(selectedOrganism.id)}
          onClose={() => setSelectedOrganism(null)}
          onDiscover={handleDiscoverOrganism}
          onAskEcoBot={onOpenEcoBot}
        />
      )}

      {/* Guide EcoBot Sprout Mascot */}
      <EcoBotGuide
        speechText={room.welcomeSpeech}
        guidingQuestion={room.guidingQuestion}
        locationName={room.title}
        autoPlayAudio={true}
        onAskEcoBot={onOpenEcoBot}
      />

    </div>
  );
};
