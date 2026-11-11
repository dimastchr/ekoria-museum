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

export default function App() {
  const [activeUser, setActiveUser] = useState<StudentProfile | null>(() => StorageService.getActiveUser());
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const user = StorageService.getActiveUser();
    return StorageService.getProgress(user?.studentId || 'std-5a-01');
  });

  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [activeZoneId, setActiveZoneId] = useState<ZoneId>('hutan');

  // Interactive modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [isOziOpen, setIsOziOpen] = useState(false);
  const [oziQuery, setOziQuery] = useState<string | undefined>(undefined);

  // Sync progress state when activeUser changes
  useEffect(() => {
    if (activeUser) {
      const p = StorageService.getProgress(activeUser.studentId);
      setProgress(p);
    }
  }, [activeUser]);

  // Update progress helper
  const handleUpdateProgress = (newValues: Partial<StudentProgress>) => {
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

  return (
    <div className="min-h-screen bg-[#F6F1E3] text-[#0F3D2E] font-sans selection:bg-[#F5C518] selection:text-[#0F3D2E]">
      
      {/* 1. LANDING PAGE */}
      {currentView === 'landing' && (
        <LandingPage
          onStartExploration={() => setCurrentView('dashboard')}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenTeacherPortal={() => setIsTeacherLoginOpen(true)}
          onOpenOzi={() => handleOpenOzi()}
        />
      )}

      {/* 2. STUDENT DASHBOARD */}
      {currentView === 'dashboard' && (
        <StudentDashboard
          progress={progress}
          profile={activeUser || {
            studentId: 'std-5a-01',
            username: progress.username || 'penjelajah_cilik',
            fullName: progress.username || 'Nara Penjelajah',
            className: progress.className || 'Kelas 5 SD',
            avatar: 'nara',
            role: 'student',
            pin: '1234'
          }}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onSelectZone={handleSelectZone}
          onLogout={() => setCurrentView('landing')}
          onOpenOzi={() => handleOpenOzi()}
        />
      )}

      {/* 3. MUSEUM HUB (CENTRAL HALL) */}
      {currentView === 'museum-hub' && (
        <MuseumHub
          progress={progress}
          onSelectZone={handleSelectZone}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onOpenOzi={() => handleOpenOzi()}
          onOpenEncyclopedia={() => setCurrentView('encyclopedia')}
        />
      )}

      {/* 4. ZONE PANORAMIC VIEW */}
      {currentView === 'zone-view' && (
        <ZoneView
          zoneId={activeZoneId}
          progress={progress}
          profile={activeUser || {
            studentId: 'std-5a-01',
            username: progress.username || 'nara',
            fullName: progress.username || 'Nara',
            className: progress.className || 'Kelas 5 SD',
            avatar: 'nara',
            role: 'student',
            pin: '1234'
          }}
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
      {currentView === 'journal' && (
        <ExplorerJournal
          progress={progress}
          onBack={() => setCurrentView('dashboard')}
          onGoToZone={handleSelectZone}
        />
      )}

      {/* 6. ENCYCLOPEDIA */}
      {currentView === 'encyclopedia' && (
        <EncyclopediaModal
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 7. QUIZ CENTER (Pre-Test, Post-Test, and Zone Quizzes) */}
      {(currentView === 'quiz' || currentView === 'pretest' || currentView === 'posttest') && (
        <QuizCenter
          initialMode={currentView === 'pretest' ? 'pretest' : currentView === 'posttest' ? 'posttest' : 'zone'}
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

            handleUpdateProgress({
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
      {(currentView === 'achievements' || currentView === 'certificate') && (
        <AchievementsView
          progress={progress}
          profile={activeUser || {
            studentId: 'std-5a-01',
            username: progress.username || 'Nara Penjelajah',
            fullName: progress.username || 'Nara Penjelajah',
            className: progress.className || 'Kelas 5 SD',
            avatar: 'nara',
            role: 'student',
            pin: '1234'
          }}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* 9. FOOD CHAIN BUILDER (Zone 5 Interactive) */}
      {currentView === 'food-chain' && (
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
      {currentView === 'simulation' && (
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
      {currentView === 'decomposer' && (
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
      {currentView === 'trash-sorting' && (
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
      {currentView === 'teacher-dashboard' && (
        <TeacherDashboard
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {/* GLOBAL MODALS */}
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
          onUserChange={(newUser) => {
            setActiveUser(newUser);
            if (newUser) {
              const p = StorageService.getProgress(newUser.studentId);
              setProgress(p);
              setCurrentView('dashboard');
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
            setCurrentView('teacher-dashboard');
          }}
        />
      )}

    </div>
  );
}
