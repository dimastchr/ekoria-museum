import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles, 
  Trophy, 
  RotateCcw,
  ChevronRight,
  Award
} from 'lucide-react';
import { QuizQuestion, StudentProgress, ZoneId } from '../../types';
import { PRETEST_QUESTIONS, POSTTEST_QUESTIONS, ROOM_QUIZZES } from '../../data/museumData';
import { MUSEUM_ZONES } from '../../data/museumZonesData';
import { audioManager } from '../../utils/audioManager';
import { EkoZoneIcon } from '../common/EkoIcons';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';

interface QuizCenterProps {
  initialMode?: 'pretest' | 'posttest' | 'zone';
  initialZoneId?: ZoneId;
  progress: StudentProgress;
  onBack: () => void;
  onCompleteQuiz: (type: 'pretest' | 'posttest' | string, score: number) => void;
  onOpenAchievements?: () => void;
}

export const QuizCenter: React.FC<QuizCenterProps> = ({
  initialMode = 'pretest',
  initialZoneId = 'hutan',
  progress,
  onBack,
  onCompleteQuiz,
  onOpenAchievements,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'pretest' | 'posttest' | ZoneId>(
    initialMode === 'pretest' ? 'pretest' : initialMode === 'posttest' ? 'posttest' : initialZoneId
  );

  // Load questions based on category
  const getQuestions = (): QuizQuestion[] => {
    if (selectedCategory === 'pretest') return PRETEST_QUESTIONS;
    if (selectedCategory === 'posttest') return POSTTEST_QUESTIONS;
    return ROOM_QUIZZES[selectedCategory] || PRETEST_QUESTIONS.slice(0, 5);
  };

  const questions = getQuestions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelect = (idx: number) => {
    if (isChecked) return;
    audioManager.playClick();
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsChecked(true);

    const isCorrect = selectedOption === currentQ.correctIndex;
    setAnswersHistory(prev => ({
      ...prev,
      [currentIndex]: { selected: selectedOption, isCorrect }
    }));

    if (isCorrect) {
      audioManager.playSuccessChime();
      audioManager.speak(`Hebat, jawabanmu benar! ${currentQ.explanation}`);
    } else {
      audioManager.playErrorSound();
      audioManager.speak(`Jawaban yang benar adalah pilihan ${optionLetters[currentQ.correctIndex]}. ${currentQ.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      // Finished all questions!
      const correctCount = Object.values(answersHistory).filter(a => a.isCorrect).length + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const finalScore = Math.round((correctCount / totalQuestions) * 100);
      setIsFinished(true);
      onCompleteQuiz(selectedCategory, finalScore);
      audioManager.playSuccessChime();
      audioManager.speak(`Selamat! Kamu telah menyelesaikan semua ${totalQuestions} soal dengan skor ${finalScore}.`);
    }
  };

  const handleSpeakQuestion = () => {
    const text = `Soal nomor ${currentIndex + 1}. ${currentQ.question}. Pilihan A: ${currentQ.options[0]}. Pilihan B: ${currentQ.options[1]}. Pilihan C: ${currentQ.options[2]}. Pilihan D: ${currentQ.options[3]}.`;
    setIsSpeaking(true);
    audioManager.speak(text, () => setIsSpeaking(false));
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setAnswersHistory({});
    setIsFinished(false);
  };

  const calculateFinalScore = () => {
    const correctCount = Object.values(answersHistory).filter(a => a.isCorrect).length;
    return Math.round((correctCount / totalQuestions) * 100);
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
            <span>Kembali</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <h1 className="text-xl md:text-2xl font-heading font-black text-[#0F3D2E]">
                Pusat Kuis & Evaluasi EkoRia
              </h1>
            </div>
            <p className="text-xs text-[#52796F] font-semibold">
              Uji Pemahaman Kurikulum Merdeka IPAS Bab 3 Harmoni Ekosistem
            </p>
          </div>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-xl no-scrollbar">
          <button
            onClick={() => { setSelectedCategory('pretest'); handleRestartQuiz(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === 'pretest' ? 'bg-[#0F3D2E] text-white shadow' : 'bg-white text-[#0F3D2E] border border-[#E8DEC9]'
            }`}
          >
            Tes Awal (20 Soal)
          </button>
          <button
            onClick={() => { setSelectedCategory('posttest'); handleRestartQuiz(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === 'posttest' ? 'bg-[#0F3D2E] text-white shadow' : 'bg-white text-[#0F3D2E] border border-[#E8DEC9]'
            }`}
          >
            Tes Akhir (20 Soal)
          </button>
          {MUSEUM_ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => { setSelectedCategory(z.id); handleRestartQuiz(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                selectedCategory === z.id ? 'bg-[#3FA34D] text-white shadow' : 'bg-white text-[#0F3D2E] border border-[#E8DEC9]'
              }`}
            >
              <EkoZoneIcon zoneId={z.id} size="xs" />
              <span>{z.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ MAIN CONTAINER */}
      {!isFinished ? (
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
          
          {/* TOP PROGRESS BAR & COUNTER */}
          <div className="bg-white p-4 rounded-3xl border border-[#E8DEC9] shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-[#52796F] mb-2">
              <span className="flex items-center gap-1.5 text-[#0F3D2E]">
                <HelpCircle className="w-4 h-4 text-[#3FA34D]" />
                <span className="font-extrabold text-sm">Soal {currentIndex + 1} / {totalQuestions}</span>
              </span>
              <span>{progressPercent}% Selesai</span>
            </div>
            
            <div className="w-full h-3 bg-[#F6F1E3] rounded-full overflow-hidden border border-[#E8DEC9]">
              <div 
                className="h-full bg-gradient-to-r from-[#8BC34A] to-[#3FA34D] transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(5, ((currentIndex + 1) / totalQuestions) * 100)}%` }}
              />
            </div>
          </div>

          {/* CREAM QUESTION CARD */}
          <div className="bg-[#F6F1E3] rounded-3xl p-6 md:p-8 border-2 border-[#E8DEC9] shadow-lg relative">
            
            {/* Question Header & Voice Button */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="bg-[#F5C518] text-[#0F3D2E] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-sm">
                  {currentQ.concept || 'Konsep IPAS Bab 3'}
                </span>
                <h3 className="text-lg md:text-xl font-heading font-extrabold text-[#0F3D2E] leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              <button
                onClick={handleSpeakQuestion}
                className={`p-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-[#0F3D2E] border border-[#E8DEC9] shadow-sm transition shrink-0 ${
                  isSpeaking ? 'text-[#3FA34D] ring-2 ring-[#3FA34D]' : ''
                }`}
                title="Dengarkan Soal Bersama Ozi"
              >
                <Volume2 className="w-5 h-5 text-[#3FA34D]" />
              </button>
            </div>

            {/* 4 CHOICES A - D */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctIndex;
                
                let optionStyle = 'bg-white border-[#E8DEC9] text-[#2D3748] hover:border-[#3FA34D]';
                if (isSelected && !isChecked) {
                  optionStyle = 'bg-amber-50 border-[#F5C518] text-[#0F3D2E] ring-2 ring-[#F5C518]';
                } else if (isChecked) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isChecked}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3.5 text-left text-xs md:text-sm font-medium transition cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      isSelected ? 'bg-[#0F3D2E] text-white' : 'bg-[#F6F1E3] text-[#0F3D2E]'
                    }`}>
                      {optionLetters[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isChecked && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isChecked && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* OZI FEEDBACK BOX AFTER CHECKING */}
            {isChecked && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-[#3FA34D]/40 mb-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-1">
                  <img src={oziAvatar} alt="Ozi" className="w-6 h-6 rounded-full border border-[#F5C518]" />
                  <span className="text-xs font-heading font-black text-[#1B5E3F] uppercase tracking-wider">
                    Umpan Balik Ozi:
                  </span>
                </div>
                <p className="text-xs text-[#2D3748] leading-relaxed pl-8">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* ACTION BUTTON (Periksa Jawaban / Soal Berikutnya) */}
            <div className="pt-2 flex justify-end">
              {!isChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className={`bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold px-6 py-3 rounded-2xl shadow-md transition text-xs md:text-sm ${
                    selectedOption !== null 
                      ? 'hover:bg-[#ffe066] cursor-pointer active:scale-95' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  ✓ Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#3FA34D] hover:bg-[#348840] text-white font-heading font-extrabold px-7 py-3 rounded-2xl shadow-md transition text-xs md:text-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>{currentIndex + 1 < totalQuestions ? 'Soal Berikutnya ▶' : 'Lihat Hasil Akhir 🏆'}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* FINAL RESULTS CARD */
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center bg-white p-8 md:p-10 rounded-3xl border-2 border-[#3FA34D] shadow-xl space-y-5 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 rounded-full bg-emerald-100 text-[#1B5E3F] flex items-center justify-center text-5xl shadow-inner">
            🏆
          </div>

          <div className="space-y-1">
            <span className="bg-[#F5C518] text-[#0F3D2E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Evaluasi Selesai!
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#0F3D2E]">
              Hasil Kuis {selectedCategory.toUpperCase()}
            </h2>
            <p className="text-xs text-[#52796F]">
              Kerja bagus! Pemahamanmu tentang ekosistem makin mantap bersama Ozi dan Nara.
            </p>
          </div>

          {/* Big Score Number */}
          <div className="bg-[#F6F1E3] p-6 rounded-3xl border-2 border-[#E8DEC9] w-full max-w-xs">
            <div className="text-5xl font-heading font-black text-[#0F3D2E]">
              {calculateFinalScore()}
              <span className="text-2xl text-[#52796F]"> / 100</span>
            </div>
            <p className="text-xs font-bold text-[#3FA34D] mt-1">
              {calculateFinalScore() >= 75 ? '🌟 Luar Biasa (Tuntas)' : '💪 Terus Semangat Berlatih'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl border border-[#0F3D2E] text-[#0F3D2E] hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>

            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="bg-[#3FA34D] hover:bg-[#348840] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Lencana & Sertifikat</span>
              </button>
            )}

            <button
              onClick={onBack}
              className="bg-[#F5C518] text-[#0F3D2E] font-heading font-extrabold px-6 py-2.5 rounded-xl shadow hover:bg-[#ffe066] transition text-xs"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
