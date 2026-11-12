import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowLeft,
  Map as MapIcon,
  Award,
  HelpCircle,
  Bookmark,
  Star,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Leaf,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';
import { StudentProfile, StudentProgress } from '../../types';
import { MUSEUM_ZONES, MUSEUM_BADGES } from '../../data/museumZonesData';
import { EkoHeart, EkoZoneIcon } from '../common/EkoIcons';
import { LogoutConfirmDialog } from '../common/AppNav';

interface ProfileModalProps {
  profile: StudentProfile;
  progress: StudentProgress;
  onClose: () => void;
  onGoToJournal?: () => void;
  onGoToQuiz?: () => void;
  /** Optional "Keluar Akun" button (with the child-safe confirmation). */
  onLogout?: () => void;
}

/** Badge ids that the app awards but that have no card in MUSEUM_BADGES. */
const EXTRA_BADGE_INFO: Record<string, { title: string; icon: string }> = {
  'rantai-makanan': { title: 'Perakit Rantai Makanan', icon: '🔗' },
  'penyeimbang-alam': { title: 'Penyeimbang Alam', icon: '⚖️' },
  'pengurai-alam': { title: 'Peneliti Pengurai', icon: '🍄' },
};

function prettifyId(id: string): string {
  return id
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function formatLastActive(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime()) || d.getTime() <= 0) return null;
  try {
    return d.toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toISOString();
  }
}

const EmptyNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-[#52796F] bg-white/70 border border-dashed border-[#C9D8C5] rounded-2xl px-4 py-3">
    {children}
  </p>
);

/**
 * "Profil Saya": the logged-in pupil's own learning progress.
 * Reads only fields that StorageService already stores in StudentProfile / StudentProgress.
 */
export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, progress, onClose, onGoToJournal, onGoToQuiz, onLogout }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const journalEntries = progress.journalEntries || [];
  const discovered = progress.discoveredOrganisms || [];
  const completedRooms = (progress.completedRooms || []) as string[];
  const badgeIds = progress.badges || [];
  const quizScores = progress.quizScores || {};

  // A zone counts as explored when it is marked complete, or the pupil found
  // an organism there, or saved a journal note from it.
  const zoneRows = MUSEUM_ZONES.map((zone) => {
    const organismIds = zone.organisms.map((o) => o.id);
    const foundHere = discovered.filter((id) => organismIds.includes(id)).length;
    const notesHere = journalEntries.filter((j) => j.zoneId === zone.id).length;
    const explored = completedRooms.includes(zone.id) || foundHere > 0 || notesHere > 0;
    const quizScore = typeof quizScores[zone.id] === 'number' ? quizScores[zone.id] : null;
    return { zone, foundHere, notesHere, explored, quizScore };
  });
  const exploredCount = zoneRows.filter((r) => r.explored).length;
  const exploredPercent = Math.round((exploredCount / MUSEUM_ZONES.length) * 100);

  // Quiz scores saved under other keys (older room ids), if any
  const zoneIds = MUSEUM_ZONES.map((z) => z.id as string);
  const otherQuizScores = Object.entries(quizScores).filter(
    ([key, value]) => !zoneIds.includes(key) && key !== 'pretest' && key !== 'posttest' && typeof value === 'number'
  );

  const badges = badgeIds.map((id) => {
    const known = MUSEUM_BADGES.find((b) => b.id === id);
    if (known) return { id, title: known.title, icon: known.icon, description: known.description };
    const extra = EXTRA_BADGE_INFO[id];
    return { id, title: extra?.title || prettifyId(id), icon: extra?.icon || '🏅', description: '' };
  });

  const lastActive = formatLastActive(progress.lastActive);
  const avatarIsEmoji = profile.avatar && profile.avatar.length <= 8;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-profil"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92dvh] bg-[#F6F1E3] text-[#0F3D2E] rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-[#3FA34D] flex flex-col overflow-hidden animate-pop-spring"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0F3D2E] text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-3 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2 text-sm font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <h2 id="judul-profil" className="font-heading font-extrabold text-lg sm:text-xl truncate">
            Profil Saya
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
            aria-label="Tutup profil"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* IDENTITY */}
          <section className="flex items-center gap-4 bg-white rounded-3xl border border-[#E8DEC9] p-4 shadow-sm">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-[#EAF7EF] border-4 border-[#3FA34D] flex items-center justify-center text-4xl sm:text-5xl"
              aria-hidden="true"
            >
              {avatarIsEmoji ? profile.avatar : '🧑'}
            </div>
            <div className="min-w-0">
              <p className="font-heading font-extrabold text-xl sm:text-2xl leading-tight break-words">
                {profile.fullName || profile.username}
              </p>
              <p className="text-sm text-[#52796F] font-semibold">
                {profile.className ? `Kelas: ${profile.className.replace(/^Kelas\s*/i, '')}` : 'Kelas: Belum ada'}
              </p>
              <p className="text-xs text-[#52796F]">Nama akun: {profile.username}</p>
              <div className="flex items-center gap-1 mt-1.5" aria-label={`Nyawa penjelajah: ${progress.hearts ?? 4} dari 4`}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <EkoHeart key={i} filled={i < (progress.hearts ?? 4)} size="sm" />
                ))}
              </div>
            </div>
          </section>

          {/* QUICK NUMBERS */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Ringkasan">
            <div className="bg-white rounded-2xl border border-[#E8DEC9] p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto text-[#F5C518]" />
              <div className="font-heading font-extrabold text-xl">{progress.totalXP || 0}</div>
              <div className="text-xs text-[#52796F] font-semibold">Poin XP</div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8DEC9] p-3 text-center">
              <Star className="w-5 h-5 mx-auto text-amber-500" />
              <div className="font-heading font-extrabold text-xl">{progress.totalStars || 0}</div>
              <div className="text-xs text-[#52796F] font-semibold">Bintang</div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8DEC9] p-3 text-center">
              <Bookmark className="w-5 h-5 mx-auto text-blue-700" />
              <div className="font-heading font-extrabold text-xl">{journalEntries.length}</div>
              <div className="text-xs text-[#52796F] font-semibold">Catatan Jurnal</div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8DEC9] p-3 text-center">
              <Leaf className="w-5 h-5 mx-auto text-[#3FA34D]" />
              <div className="font-heading font-extrabold text-xl">{discovered.length}</div>
              <div className="text-xs text-[#52796F] font-semibold">Makhluk Hidup Ditemukan</div>
            </div>
          </section>

          {/* ZONES */}
          <section className="bg-white rounded-3xl border border-[#E8DEC9] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-[#1B5E3F]" /> Zona yang Sudah Dijelajahi
              </h3>
              <span className="font-heading font-extrabold text-lg text-[#3FA34D] shrink-0">
                {exploredCount}/{MUSEUM_ZONES.length}
              </span>
            </div>
            <div
              className="w-full h-4 bg-[#E8DEC9] rounded-full overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={MUSEUM_ZONES.length}
              aria-valuenow={exploredCount}
              aria-label="Zona yang sudah dijelajahi"
            >
              <div
                className="h-full bg-gradient-to-r from-[#3FA34D] to-[#F5C518] rounded-full transition-all duration-700"
                style={{ width: `${exploredPercent}%` }}
              />
            </div>
            {exploredCount === 0 && (
              <EmptyNote>Belum ada zona yang dijelajahi. Yuk, masuk ke Museum dan temukan makhluk hidup pertamamu!</EmptyNote>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zoneRows.map(({ zone, explored, foundHere, notesHere }) => (
                <li
                  key={zone.id}
                  className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2 ${
                    explored ? 'bg-[#EAF7EF] border-[#3FA34D]/40' : 'bg-[#FAF7F0] border-[#E8DEC9]'
                  }`}
                >
                  {explored ? (
                    <CheckCircle2 className="w-5 h-5 text-[#3FA34D] shrink-0" aria-label="Sudah" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" aria-label="Belum" />
                  )}
                  <EkoZoneIcon zoneId={zone.id} size="xs" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold leading-tight break-words">
                      {zone.zoneNumber}. {zone.title}
                    </div>
                    <div className="text-xs text-[#52796F]">
                      {explored ? `${foundHere} temuan • ${notesHere} catatan` : 'Belum dijelajahi'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* BADGES */}
          <section className="bg-white rounded-3xl border border-[#E8DEC9] p-4 shadow-sm space-y-3">
            <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-700" /> Lencana yang Diraih
              <span className="ml-auto text-sm font-bold text-purple-700">{badges.length}</span>
            </h3>
            {badges.length === 0 ? (
              <EmptyNote>Belum ada lencana. Selesaikan kegiatan di zona dan isi jurnalmu untuk mendapatkannya!</EmptyNote>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {badges.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 rounded-2xl bg-[#FFF9E6] border border-[#F5C518]/60 px-3 py-2">
                    <span className="text-2xl" aria-hidden="true">{b.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold leading-tight">{b.title}</div>
                      {b.description && <div className="text-xs text-[#52796F] leading-snug">{b.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* TES AWAL / TES AKHIR */}
          <section className="bg-white rounded-3xl border border-[#E8DEC9] p-4 shadow-sm space-y-3">
            <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#1B5E3F]" /> Tes Awal dan Tes Akhir
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#FAF7F0] border border-[#E8DEC9] p-3 text-center">
                <div className="text-xs font-bold text-[#52796F]">Tes Awal</div>
                <div className="font-heading font-extrabold text-2xl">
                  {progress.preTestCompleted ? progress.preTestScore : <span className="text-base text-[#52796F]">Belum ada</span>}
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAF7F0] border border-[#E8DEC9] p-3 text-center">
                <div className="text-xs font-bold text-[#52796F]">Tes Akhir</div>
                <div className="font-heading font-extrabold text-2xl">
                  {progress.postTestCompleted ? progress.postTestScore : <span className="text-base text-[#52796F]">Belum ada</span>}
                </div>
              </div>
            </div>
            {progress.preTestCompleted && progress.postTestCompleted && (
              <p className="text-sm font-semibold text-[#1B5E3F]">
                {progress.postTestScore > progress.preTestScore
                  ? `Hebat! Nilaimu naik ${progress.postTestScore - progress.preTestScore} poin.`
                  : progress.postTestScore === progress.preTestScore
                  ? 'Nilaimu sama dengan tes awal. Terus berlatih, ya!'
                  : 'Tidak apa-apa, coba pelajari zonanya lagi, lalu ulangi tesnya.'}
              </p>
            )}
          </section>

          {/* KUIS PER ZONA */}
          <section className="bg-white rounded-3xl border border-[#E8DEC9] p-4 shadow-sm space-y-3">
            <h3 className="font-heading font-extrabold text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" /> Nilai Kuis per Zona
            </h3>
            {zoneRows.every((r) => r.quizScore === null) && otherQuizScores.length === 0 && (
              <EmptyNote>Belum ada nilai kuis zona. Coba kerjakan kuis di menu Kuis, ya!</EmptyNote>
            )}
            <ul className="divide-y divide-[#F0EBE1]">
              {zoneRows.map(({ zone, quizScore }) => (
                <li key={zone.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm font-semibold min-w-0 break-words">
                    {zone.zoneNumber}. {zone.title}
                  </span>
                  {quizScore === null ? (
                    <span className="text-xs font-bold text-[#52796F] bg-[#FAF7F0] border border-[#E8DEC9] rounded-full px-2.5 py-1 shrink-0">
                      Belum ada
                    </span>
                  ) : (
                    <span
                      className={`text-sm font-extrabold rounded-full px-3 py-1 shrink-0 ${
                        quizScore >= 80 ? 'bg-[#EAF7EF] text-[#1B5E3F]' : quizScore >= 60 ? 'bg-[#FFF9E6] text-amber-800' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {quizScore}
                    </span>
                  )}
                </li>
              ))}
              {otherQuizScores.map(([key, value]) => (
                <li key={key} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm font-semibold min-w-0 break-words">{prettifyId(key)}</span>
                  <span className="text-sm font-extrabold rounded-full px-3 py-1 bg-[#FAF7F0] shrink-0">{value as number}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* TERAKHIR AKTIF */}
          <section className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8DEC9] px-4 py-3">
            <Clock className="w-5 h-5 text-[#52796F] shrink-0" />
            <div className="text-sm">
              <span className="font-bold">Terakhir aktif: </span>
              <span>{lastActive || 'Belum ada'}</span>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 pb-2">
            {onGoToJournal && (
              <button
                type="button"
                onClick={onGoToJournal}
                className="flex-1 min-h-[52px] rounded-2xl bg-white border-2 border-[#3FA34D] text-[#1B5E3F] font-bold flex items-center justify-center gap-2"
              >
                <Bookmark className="w-5 h-5" /> Buka Jurnal
              </button>
            )}
            {onGoToQuiz && (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="flex-1 min-h-[52px] rounded-2xl bg-[#F5C518] text-[#0F3D2E] font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <HelpCircle className="w-5 h-5" /> Kerjakan Kuis
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[52px] rounded-2xl bg-[#0F3D2E] text-white font-bold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Kembali
            </button>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              className="w-full min-h-[48px] rounded-2xl bg-white border-2 border-rose-300 text-rose-700 font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Keluar Akun
            </button>
          )}
        </div>
      </div>
      {confirmLogout && onLogout && (
        <div onClick={(e) => e.stopPropagation()}>
          <LogoutConfirmDialog
            onCancel={() => setConfirmLogout(false)}
            onConfirm={() => {
              setConfirmLogout(false);
              onLogout();
            }}
          />
        </div>
      )}
    </div>
  );
};
