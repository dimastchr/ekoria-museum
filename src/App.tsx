import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { MuseumHub } from './components/museum/MuseumHub';
import { ZoneView } from './components/museum/ZoneView';
import { ExplorerJournal } from './components/journal/ExplorerJournal';
import { EncyclopediaModal } from './components/encyclopedia/EncyclopediaModal';
import { QuizCenter } from './components/quiz/QuizCenter';
import { AchievementsView } from './components/achievements/AchievementsView';
import { TrashSortingActivity } from './components/exhibits/TrashSortingActivity';
import { EcosystemSimulation } from './components/exhibits/EcosystemSimulation';
import { FoodChainBuilder } from './components/exhibits/FoodChainBuilder';
import { DecomposerLab } from './components/exhibits/DecomposerLab';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { EcoBotModal } from './components/ecobot/EcoBotModal';
import { LoginModal } from './components/auth/LoginModal';
import { TeacherLoginModal } from './components/auth/TeacherLoginModal';

import { MUSEUM_ZONES } from './data/museumZonesData';
import { 
  ZoneId, 
  ZoneData, 
  Organism, 
  AbioticFactor, 
  StudentProfile, 
  StudentProgress, 
  ViewState,
  JournalEntry
} from './types';
import { StorageService } from './services/storageService';
import { audioManager } from './utils/audioManager';
import { SoundToggle } from './components/common/SoundToggle';
import { AppNav } from './components/common/AppNav';
import { ProfileModal } from './components/profile/ProfileModal';

/** Empty progress used only while nobody is logged in (never saved). */
const EMPTY_PROGRESS: StudentProgress = {
  studentId: 'guest',
  username: '',
  className: '',
  hearts: 4,
  lastVisitedZone: 'hutan',
  completedRooms: [],
  roomProgress: {},
  totalXP: 0,
  totalStars: 0,
  badges: [],
  hiddenFound: [],
  discoveredOrganisms: [],
  journalEntries: [],
  preTestCompleted: false,
  preTestScore: 0,
  postTestCompleted: false,
  postTestScore: 0,
  reflectionNotes: '',
  quizScores: {},
  timeSpentMinutes: 0,
  lastActive: new Date(0).toISOString(),
  syncStatus: 'synced'
};

/** Views that can be opened without an account (everything else needs a login). */
const PUBLIC_VIEWS: ViewState[] = ['landing'];

export default function App() {
  const [activeUser, setActiveUser] = useState<StudentProfile | null>(() => StorageService.getActiveUser());
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getProgress(user.studentId) : EMPTY_PROGRESS;
  });

  const [currentView, setCurrentViewRaw] = useState<ViewState>('landing');
  const [activeZoneId, setActiveZoneId] = useState<ZoneId>('hutan');

  // Interactive modals. With nobody logged in, the login page opens first.
  const [isLoginOpen, setIsLoginOpen] = useState(() => !StorageService.getActiveUser());
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [isOziOpen, setIsOziOpen] = useState(false);
  const [oziQuery, setOziQuery] = useState<string | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Guard: the museum can only be used after registering and logging in
  const setCurrentView = (view: ViewState) => {
    if (!activeUser && !PUBLIC_VIEWS.includes(view)) {
      setCurrentViewRaw('landing');
      setIsLoginOpen(true);
      return;
    }
    setCurrentViewRaw(view);
  };

  // Sync progress state when activeUser changes; logging out returns to the login page
  useEffect(() => {
    if (activeUser) {
      const p = StorageService.getProgress(activeUser.studentId);
      setProgress(p);
    } else {
      setProgress(EMPTY_PROGRESS);
      setCurrentViewRaw('landing');
    }
  }, [activeUser]);

  const handleLogout = () => {
    audioManager.playClick();
    audioManager.stopSpeaking();
    audioManager.stopAmbient();
    StorageService.setActiveUser(null);
    setIsProfileOpen(false);
    setIsOziOpen(false);
    setActiveUser(null);
    setCurrentViewRaw('landing');
    setIsLoginOpen(true);
  };

  // Update progress helper
  const handleUpdateProgress = (newValues: Partial<StudentProgress>) => {
    if (!activeUser) return;
    const updated: StudentProgress = {
      ...progress,
      ...newValues
    };
    setProgress(updated);
    StorageService.saveProgress(updated);
  };

  const handleSelectZone = (zoneId: ZoneId) => {
    audioManager.playClick();
    setActiveZoneId(zoneId);
    handleUpdateProgress({ lastVisitedZone: zoneId });
    setCurrentView('zone-view');
  };

  const handleOpenOzi = (query?: string) => {
    audioManager.playClick();
    setOziQuery(query);
    setIsOziOpen(true);
  };

  const handleSaveToJournal = (item: Organism | AbioticFactor, zone: ZoneData) => {
    audioManager.playSuccessChime();

    const isOrganism = 'isBiotic' in item ? (item as Organism).isBiotic : false;
    const organism = 'trophicLevelName' in item ? (item as Organism) : null;
    const abiotic = !organism ? (item as AbioticFactor) : null;

    const explanation = organism
      ? `${organism.name} (${organism.localName}) adalah ${organism.trophicLevelName} yang hidup di ${zone.title}. Sumber energi: ${organism.energySource}. ${organism.funFact}`
      : abiotic
      ? `${abiotic.name} adalah faktor abiotik krusial di ${zone.title}. Berperan dalam ${abiotic.role}.`
      : '';

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}-${item.id}`,
      zoneId: zone.id,
      zoneName: zone.title,
      organismId: item.id,
      name: item.name,
      category: isOrganism ? 'Biotik' : 'Abiotik',
      role: organism ? organism.trophicLevelName : (abiotic?.role || 'Komponen Lingkungan'),
      isBiotic: isOrganism,
      explanation,
      thinkingQuestion: item.thinkingQuestion,
      icon: item.icon,
      discoveredAt: new Date().toISOString(),
    };

    const currentEntries = progress.journalEntries || [];
    const alreadySaved = currentEntries.some(e => e.organismId === item.id);
    const updatedEntries = alreadySaved ? currentEntries : [...currentEntries, newEntry];

    // Mark as discovered if organism
    const discovered = [...(progress.discoveredOrganisms || [])];
    if (isOrganism && !discovered.includes(item.id)) {
      discovered.push(item.id);
    }

    // Award badges if applicable
    const badges = [...(progress.badges || [])];
    if (updatedEntries.length >= 5 && !badges.includes('jurnal-lengkap')) {
      badges.push('jurnal-lengkap');
    }

    handleUpdateProgress({
      journalEntries: updatedEntries,
      discoveredOrganisms: discovered,
      totalXP: progress.totalXP + 25,
      totalStars: progress.totalStars + 1,
      badges,
    });
  };

  const currentZoneData = MUSEUM_ZONES.find(z => z.id === activeZoneId) || MUSEUM_ZONES[0];
  // Nothing but the landing/login page renders until someone is logged in
  const view: ViewState = activeUser ? currentView : 'landing';

  // Global touch-friendly navigation: pupils only, on every screen except the landing page
  const showNav = !!activeUser && activeUser.role === 'student' && view !== 'landing' && view !== 'teacher-dashboard';

  // Scroll to the top when switching screens (important on phones)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div
      className={`app-shell ${showNav ? 'has-nav' : ''} ${view === 'dashboard' ? 'nav-top-off' : ''} min-h-screen max-w-full overflow-x-clip bg-[#F6F1E3] text-[#0F3D2E] font-sans selection:bg-[#F5C518] selection:text-[#0F3D2E]`}
    >
      {/* 0. GLOBAL NAVIGATION (top bar on tablet/Chromebook, bottom bar on phones) */}
      {showNav && (
        <AppNav
          currentView={view}
          onNavigate={(next) => {
            setIsProfileOpen(false);
            setCurrentView(next);
          }}
          onOpenOzi={() => handleOpenOzi()}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={handleLogout}
          hideTopOnDesktop={view === 'dashboard'}
          isProfileOpen={isProfileOpen}
        />
      )}
      
      {/* 1. LANDING PAGE */}
      {view === 'landing' && (
        <LandingPage
          onStartExploration={() => setCurrentView('dashboard')}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenTeacherPortal={() => setIsTeacherLoginOpen(true)}
          onOpenOzi={() => handleOpenOzi()}
          studentName={activeUser ? activeUser.fullName.split(' ')[0] : undefined}
        />
      )}

      {/* 2. STUDENT DASHBOARD */}
      {view === 'dashboard' && (
        <StudentDashboard
          progress={progress}
          profile={activeUser!}
          currentView={view}
          onNavigate={(next) => setCurrentView(next)}
          onSelectZone={handleSelectZone}
          onLogout={handleLogout}
          onOpenOzi={() => handleOpenOzi()}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* 3. MUSEUM HUB (CENTRAL HALL) */}
      {view === 'museum-hub' && (
        <MuseumHub
          progress={progress}
          onSelectZone={handleSelectZone}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onOpenOzi={() => handleOpenOzi()}
          onOpenEncyclopedia={() => setCurrentView('encyclopedia')}
        />
      )}

      {/* 4. ZONE PANORAMIC VIEW */}
      {view === 'zone-view' && (
        <ZoneView
          zoneId={activeZoneId}
          progress={progress}
          profile={activeUser!}
          onBackToHub={() => setCurrentView('museum-hub')}
          onOpenOzi={() => handleOpenOzi()}
          onSaveToJournal={handleSaveToJournal}
          onLaunchInteractive={(type) => {
            if (type === 'decomposer') setCurrentView('decomposer');
            else if (type === 'food-chain') setCurrentView('food-chain');
            else if (type === 'simulation') setCurrentView('simulation');
            else if (type === 'trash-sorting') setCurrentView('trash-sorting');
          }}
        />
      )}

      {/* 5. EXPLORER JOURNAL */}
      {view === 'journal' && (
        <ExplorerJournal
          progress={progress}
          onBack={() => setCurrentView('dashboard')}
          onGoToZone={handleSelectZone}
        />
      )}

      {/* 6. ENCYCLOPEDIA */}
      {view === 'encyclopedia' && (
        <EncyclopediaModal
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 7. QUIZ CENTER (Pre-Test, Post-Test, and Zone Quizzes) */}
      {(view === 'quiz' || view === 'pretest' || view === 'posttest') && (
        <QuizCenter
          initialMode={view === 'pretest' ? 'pretest' : view === 'posttest' ? 'posttest' : 'zone'}
          initialZoneId={activeZoneId}
          progress={progress}
          onBack={() => setCurrentView('dashboard')}
          onCompleteQuiz={(type, score) => {
            const isPre = type === 'pretest';
            const isPost = type === 'posttest';

            const badges = [...(progress.badges || [])];
            if (isPost && score >= 75 && !badges.includes('detektif-ekosistem')) {
              badges.push('detektif-ekosistem');
            }

            // Zone quizzes: keep the best score per zone in the existing quizScores field
            const quizScores = { ...(progress.quizScores || {}) };
            if (!isPre && !isPost) {
              const prev = typeof quizScores[type] === 'number' ? quizScores[type] : -1;
              quizScores[type] = Math.max(prev, score);
            }

            handleUpdateProgress({
              quizScores,
              preTestCompleted: isPre ? true : progress.preTestCompleted,
              preTestScore: isPre ? score : progress.preTestScore,
              postTestCompleted: isPost ? true : progress.postTestCompleted,
              postTestScore: isPost ? score : progress.postTestScore,
              totalXP: progress.totalXP + (isPost ? 100 : 50),
              totalStars: progress.totalStars + (score >= 80 ? 3 : 1),
              badges,
            });

            // Fire and forget cloud sync
            import('./services/firestoreService').then(({ firestoreService }) => {
              firestoreService.recordAttempt(progress.username, progress.className, isPre ? 'pretest' : isPost ? 'posttest' : 'room-quiz', score);
            }).catch(() => {});
          }}
          onOpenAchievements={() => setCurrentView('achievements')}
        />
      )}

      {/* 8. ACHIEVEMENTS & CERTIFICATE */}
      {(view === 'achievements' || view === 'certificate') && (
        <AchievementsView
          progress={progress}
          profile={activeUser!}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 9. FOOD CHAIN BUILDER (Zone 5 Interactive) */}
      {view === 'food-chain' && (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <FoodChainBuilder
            roomOrganisms={currentZoneData.organisms}
            roomId={activeZoneId}
            roomTitle={currentZoneData.title}
            onBackToRoom={() => setCurrentView('zone-view')}
            onComplete={(xp) => {
              const badges = [...(progress.badges || [])];
              if (!badges.includes('rantai-makanan')) badges.push('rantai-makanan');
              handleUpdateProgress({
                totalXP: progress.totalXP + xp,
                totalStars: progress.totalStars + 2,
                badges
              });
            }}
          />
        </div>
      )}

      {/* 10. ECOSYSTEM SIMULATION (Zone 6 Interactive) */}
      {view === 'simulation' && (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <EcosystemSimulation
            onBack={() => setCurrentView('zone-view')}
            onRewardXP={(xp) => {
              const badges = [...(progress.badges || [])];
              if (!badges.includes('penyeimbang-alam')) badges.push('penyeimbang-alam');
              handleUpdateProgress({
                totalXP: progress.totalXP + xp,
                totalStars: progress.totalStars + 2,
                badges
              });
            }}
          />
        </div>
      )}

      {/* 11. DECOMPOSER LAB (Zone 1 Interactive) */}
      {view === 'decomposer' && (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <DecomposerLab
            onBack={() => setCurrentView('zone-view')}
            onRewardXP={(xp) => {
              const badges = [...(progress.badges || [])];
              if (!badges.includes('pengurai-alam')) badges.push('pengurai-alam');
              handleUpdateProgress({
                totalXP: progress.totalXP + xp,
                totalStars: progress.totalStars + 1,
                badges
              });
            }}
          />
        </div>
      )}

      {/* 12. TRASH SORTING & GREEN ACTIONS (Zone 8 Interactive) */}
      {view === 'trash-sorting' && (
        <TrashSortingActivity
          onBack={() => setCurrentView('zone-view')}
          onRewardXP={(xp) => {
            const badges = [...(progress.badges || [])];
            if (!badges.includes('sahabat-bumi')) badges.push('sahabat-bumi');
            handleUpdateProgress({
              totalXP: progress.totalXP + xp,
              totalStars: progress.totalStars + 2,
              badges
            });
          }}
        />
      )}

      {/* 13. TEACHER DASHBOARD */}
      {view === 'teacher-dashboard' && (
        <TeacherDashboard
          onBack={() => setCurrentView('landing')}
        />
      )}

      {/* GLOBAL SOUND SWITCH for views that have no sound button in their own header */}
      {!showNav && !['landing', 'dashboard', 'museum-hub', 'zone-view'].includes(view) && (
        <div className="fixed bottom-4 left-4 z-40 shadow-lg rounded-xl">
          <SoundToggle variant="light" showLabel />
        </div>
      )}

      {/* GLOBAL MODALS */}
      {isProfileOpen && activeUser && activeUser.role === 'student' && (
        <ProfileModal
          profile={activeUser}
          progress={progress}
          onClose={() => setIsProfileOpen(false)}
          onGoToJournal={() => {
            setIsProfileOpen(false);
            setCurrentView('journal');
          }}
          onGoToQuiz={() => {
            setIsProfileOpen(false);
            setCurrentView('quiz');
          }}
        />
      )}

      {isOziOpen && (
        <EcoBotModal
          onClose={() => setIsOziOpen(false)}
          initialQuery={oziQuery}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          activeUser={activeUser}
          onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
          onUserChange={(newUser) => {
            setActiveUser(newUser);
            if (newUser) {
              const p = StorageService.getProgress(newUser.studentId);
              setProgress(p);
              setCurrentViewRaw(newUser.role === 'teacher' ? 'teacher-dashboard' : 'dashboard');
            } else {
              audioManager.stopSpeaking();
              audioManager.stopAmbient();
              setCurrentViewRaw('landing');
              setIsLoginOpen(true);
            }
          }}
          onResetProgress={() => {
            if (activeUser) {
              const fresh = StorageService.getProgress(activeUser.studentId);
              setProgress(fresh);
              setCurrentView('dashboard');
            }
          }}
        />
      )}

      {isTeacherLoginOpen && (
        <TeacherLoginModal
          isOpen={isTeacherLoginOpen}
          onClose={() => setIsTeacherLoginOpen(false)}
          onSuccess={(teacher) => {
            setActiveUser(teacher);
            setIsTeacherLoginOpen(false);
            setIsLoginOpen(false);
            setCurrentViewRaw('teacher-dashboard');
          }}
        />
      )}

    </div>
  );
}
