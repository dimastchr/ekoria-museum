import React, { useState } from 'react';
import { Trophy, CheckCircle2, ArrowRight, RotateCcw, Award, BookOpen, Volume2, VolumeX, MapPin, Sparkles, Check, HelpCircle } from 'lucide-react';
import { PRETEST_QUESTIONS, POSTTEST_QUESTIONS } from '../../data/museumData';
import { StudentProgress, ViewState } from '../../types';
import { audioManager } from '../../utils/audioManager';

interface AssessmentModalProps {
  type: 'pretest' | 'posttest';
  progress: StudentProgress;
  onBack: () => void;
  onComplete: (score: number, reflection?: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  type,
  progress,
  onBack,
  onComplete,
  onNavigate
}) => {
  const questions = type === 'pretest' ? PRETEST_QUESTIONS : POSTTEST_QUESTIONS;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reflectionText, setReflectionText] = useState(progress.reflectionNotes || '');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    audioManager.playClick();
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    audioManager.playSuccessChime();
    setIsSubmitted(true);
    onComplete(score, reflectionText);
    audioManager.speak(
      `Kamu sudah menyelesaikan 10 soal dengan skor ${score} dari seratus. Ayo, lanjutkan petualanganmu!`
    );
  };

  const handleReadQuestion = (questionId: string, text: string, options: string[]) => {
    if (speakingId === questionId && audioManager.isSpeakingNow()) {
      audioManager.stopSpeaking();
      setSpeakingId(null);
      return;
    }
    const fullText = `Pertanyaan: ${text}. Pilihan A: ${options[0]}. Pilihan B: ${options[1]}. Pilihan C: ${options[2]}. Pilihan D: ${options[3]}.`;
    setSpeakingId(questionId);
    audioManager.speak(fullText);
  };

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner - Cheerful Adventure Theme */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#EAF7EF] via-[#FEF7EC] to-[#EBF3FC] border-2 border-[#1E7A50]/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E7A50] text-white text-sm font-bold mb-2 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-300" />
            {type === 'pretest' ? 'Kuis Awal Petualangan (10 Soal)' : 'Tantangan Akhir Ekosistem (10 Soal)'}
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-[#1F2D3D]">
            {type === 'pretest' ? 'Tes Awal: Pemahaman Awal Ekosistem' : 'Tes Akhir: Penguasaan Harmoni Ekosistem'}
          </h2>
          <p className="text-lg text-[#334E68] mt-1.5 max-w-2xl font-medium">
            {type === 'pretest'
              ? 'Yuk, jawab 10 pertanyaan seru ini untuk mengukur pemahaman awalmu sebelum menjelajahi museum!'
              : 'Hebat, kamu sudah menuntaskan semua zona! Buktikan seberapa jauh pemahamanmu berkembang lewat 10 soal ini!'}
          </p>
        </div>

        {/* Always visible Kembali ke Peta button */}
        <button
          onClick={() => {
            audioManager.playClick();
            audioManager.stopSpeaking();
            onBack();
          }}
          className="min-h-[48px] px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1E7A50] font-bold text-base border-2 border-[#1E7A50] shadow-sm flex items-center gap-2 cursor-pointer transition-transform hover:scale-102 shrink-0"
        >
          <MapPin className="w-5 h-5 text-[#1E7A50]" />
          Kembali ke Peta
        </button>
      </div>

      {/* Quick Question Jump Navigator */}
      {!isSubmitted && (
        <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#627D98] uppercase tracking-wider">
              Daftar Nomor Soal (Klik untuk melompat):
            </span>
            <span className="text-xs font-bold text-[#1E7A50]">
              Terjawab: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              return (
                <a
                  key={q.id}
                  href={`#question-${idx + 1}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isAnswered
                      ? 'bg-[#1E7A50] text-white shadow-xs'
                      : 'bg-slate-100 text-[#334E68] hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Card if Submitted */}
      {isSubmitted ? (
        <div className="p-8 rounded-3xl bg-white border-2 border-[#1E7A50] shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-5xl shadow-lg">
            🏆
          </div>

          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#EAF7EF] text-[#1E7A50] font-bold text-base mb-2">
              Kuis Selesai!
            </div>
            <h3 className="font-['Outfit'] text-3xl font-black text-[#1F2D3D]">
              Hasil Evaluasi {type === 'pretest' ? 'Tes Awal' : 'Tes Akhir'} Kamu
            </h3>
            <div className="text-6xl sm:text-7xl font-black text-[#1E7A50] my-3 font-mono">
              {score} <span className="text-2xl text-[#627D98] font-normal">/ 100</span>
            </div>
            <p className="text-lg text-[#334E68] max-w-xl mx-auto font-medium leading-relaxed">
              {score >= 80
                ? 'Luar biasa! Pemahamanmu tentang harmoni ekosistem sangat mendalam dan matang!'
                : score >= 60
                ? 'Bagus sekali! Kamu telah memahami konsep rantai makanan dan keseimbangan alam dengan baik.'
                : 'Terus semangat! Kunjungi lagi laboratorium dan zona ekosistem untuk memperkuat pemahamanmu.'}
            </p>
          </div>

          {/* Post-Test: Button to view explanation / review */}
          <div className="pt-2">
            <button
              onClick={() => {
                audioManager.playClick();
                setShowReview(!showReview);
              }}
              className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#FEF7EC] border-2 border-amber-300 text-[#9C4221] font-bold text-base hover:bg-amber-100 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5 text-amber-600" />
              {showReview ? 'Sembunyikan Pembahasan Soal' : 'Lihat Pembahasan 10 Soal'}
            </button>
          </div>

          {/* Full Question Review with Explanation */}
          {showReview && (
            <div className="text-left space-y-4 pt-4 border-t-2 border-slate-100">
              <h4 className="font-['Outfit'] text-xl font-bold text-[#1F2D3D] mb-3">
                Pembahasan Jawaban Lengkap (10 Soal):
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {questions.map((q, idx) => {
                  const studentAns = answers[q.id];
                  const isCorrect = studentAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border-2 ${
                        isCorrect
                          ? 'bg-[#EAF7EF]/60 border-[#1E7A50]/40'
                          : 'bg-rose-50/60 border-rose-300/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-[#1F2D3D] text-base">
                          {idx + 1}. {q.question}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                          isCorrect ? 'bg-[#1E7A50] text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {isCorrect ? 'Benar (+5)' : 'Salah'}
                        </span>
                      </div>
                      <div className="text-sm mt-2 space-y-1">
                        <div className="text-[#334E68]">
                          Jawabanmu: <span className="font-semibold">{studentAns !== undefined ? q.options[studentAns] : 'Belum dijawab'}</span>
                        </div>
                        {!isCorrect && (
                          <div className="text-[#1E7A50] font-semibold">
                            Kunci Jawaban: {q.options[q.correctIndex]}
                          </div>
                        )}
                        <div className="text-xs text-[#627D98] bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                          💡 <span className="font-bold">Penjelasan:</span> {q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reflection Note for Post-Test */}
          {type === 'posttest' && (
            <div className="max-w-xl mx-auto text-left space-y-3 pt-4 border-t-2 border-slate-100">
              <label className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1E7A50]" />
                Catatan Aksi Nyataku untuk Bumi:
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Aku berjanji membuang sampah pada tempatnya dan merawat tanaman di sekolah..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="w-full bg-[#F8FAF8] border-2 border-slate-200 rounded-2xl p-4 text-base text-[#1F2D3D] placeholder-slate-400 focus:outline-none focus:border-[#1E7A50] font-medium"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            {type === 'posttest' ? (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onNavigate('certificate');
                }}
                className="min-h-[52px] px-7 py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-extrabold text-lg shadow-lg flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-102"
              >
                <Award className="w-5 h-5 text-amber-300" />
                Buka & Cetak Sertifikat Kelulusan
              </button>
            ) : (
              <button
                onClick={() => {
                  audioManager.playClick();
                  onBack();
                }}
                className="min-h-[52px] px-7 py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] text-white font-extrabold text-lg shadow-lg flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-102"
              >
                Mulai Petualangan Museum <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                audioManager.playClick();
                onBack();
              }}
              className="min-h-[52px] px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1F2D3D] font-bold text-base border-2 border-slate-300 cursor-pointer transition-colors"
            >
              Kembali ke Peta
            </button>
          </div>
        </div>
      ) : (
        /* Question List */
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              id={`question-${idx + 1}`}
              className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-[#1E7A50]/50 shadow-sm space-y-4 transition-all scroll-mt-24"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#EAF7EF] text-[#1E7A50] font-bold text-lg flex items-center justify-center shrink-0 border border-[#1E7A50]/20 font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2D3D] leading-snug">
                      {q.question}
                    </h3>
                    <span className="inline-block mt-1 text-xs font-semibold text-[#1E7A50] px-2.5 py-0.5 rounded-full bg-[#EAF7EF]">
                      Topik: {q.concept}
                    </span>
                  </div>
                </div>

                {/* Speaker narration button for the question */}
                <button
                  onClick={() => handleReadQuestion(q.id, q.question, q.options)}
                  className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                    speakingId === q.id
                      ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                      : 'bg-[#FEF7EC] border-amber-200 text-[#9C4221] hover:bg-amber-100'
                  }`}
                  title="Dengarkan soal dan pilihan jawaban"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Dengarkan</span>
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`min-h-[52px] w-full text-left p-4 rounded-2xl text-lg border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-[#EAF7EF] text-[#1E7A50] border-[#1E7A50] font-bold shadow-sm'
                          : 'bg-[#F8FAF8] hover:bg-slate-100 text-[#1F2D3D] border-slate-200 font-medium'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                        isSelected ? 'bg-[#1E7A50] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                      {isSelected && <CheckCircle2 className="w-6 h-6 text-[#1E7A50] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* For pre-test: immediate friendly hint/explanation after choosing */}
              {type === 'pretest' && answers[q.id] !== undefined && (
                <div className="mt-3 p-3.5 rounded-2xl bg-[#EAF7EF]/70 border border-[#1E7A50]/30 text-xs sm:text-sm text-[#1E7A50] flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="font-bold">Info Penjelajah:</span> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Bottom Action Bar */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#1E7A50]/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
            <div className="text-base text-[#334E68] font-semibold">
              Terjawab: <span className="text-[#1E7A50] font-bold text-lg font-mono">{Object.keys(answers).length}</span> dari <span className="font-mono">{questions.length}</span> soal
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  audioManager.playClick();
                  onBack();
                }}
                className="min-h-[48px] flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#1F2D3D] font-bold text-base border border-slate-300 cursor-pointer"
              >
                Batal
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="min-h-[48px] flex-1 sm:flex-none px-7 py-3 rounded-2xl bg-[#1E7A50] hover:bg-[#16603E] disabled:opacity-40 disabled:hover:bg-[#1E7A50] text-white font-extrabold text-base sm:text-lg shadow-lg cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>Kirim 10 Jawaban</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
