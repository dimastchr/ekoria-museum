import { StudentProfile, StudentProgress } from '../types';

const STORAGE_KEY_PROFILES = 'ekoria_profiles_v1';
const STORAGE_KEY_PROGRESS = 'ekoria_progress_v1';
const STORAGE_KEY_ACTIVE_USER = 'ekoria_active_user_v1';
const STORAGE_KEY_OFFLINE_QUEUE = 'ekoria_offline_queue_v1';

const DEFAULT_PROFILES: StudentProfile[] = [
  {
    studentId: 'std-5a-01',
    username: 'budi5a',
    pin: '1234',
    fullName: 'Budi Santoso',
    className: 'Kelas 5A',
    avatar: '👦',
    role: 'student'
  },
  {
    studentId: 'std-5a-02',
    username: 'siti5a',
    pin: '2345',
    fullName: 'Siti Rahmawati',
    className: 'Kelas 5A',
    avatar: '👧',
    role: 'student'
  },
  {
    studentId: 'std-5b-01',
    username: 'eko5b',
    pin: '3456',
    fullName: 'Eko Prasetyo',
    className: 'Kelas 5B',
    avatar: '🧑',
    role: 'student'
  },
  {
    studentId: 'tch-001',
    username: 'guru_ipas',
    pin: '9999',
    fullName: 'Ibu Rahayu, S.Pd.',
    className: 'Guru Pembimbing IPAS',
    avatar: '👩‍🏫',
    role: 'teacher'
  }
];

const DEFAULT_PROGRESS: Record<string, StudentProgress> = {
  'std-5a-01': {
    studentId: 'std-5a-01',
    username: 'budi5a',
    className: 'Kelas 5A',
    hearts: 4,
    lastVisitedZone: 'hutan',
    completedRooms: ['hutan-harmoni'],
    roomProgress: {
      'hutan-harmoni': 100,
      'sungai-bersih': 40,
      'laut-karang': 0,
      'sawah-kebun': 0,
      'hutan': 100,
      'padang-rumput': 50,
      'sungai-danau': 40,
      'laut': 0,
      'rantai-makanan': 0,
      'keseimbangan-ekosistem': 0,
      'ekosistem-buatan': 0,
      'pelestarian-lingkungan': 0
    },
    totalXP: 240,
    totalStars: 6,
    badges: ['penjelajah-hutan'],
    hiddenFound: ['kumbang-permata-tersembunyi'],
    discoveredOrganisms: ['pohon-meranti', 'rusa-bawean', 'macan-tutul', 'jamur-pelapuk', 'burung-rangkong'],
    journalEntries: [],
    preTestCompleted: true,
    preTestScore: 80,
    postTestCompleted: false,
    postTestScore: 0,
    reflectionNotes: 'Saya belajar bahwa jika pohon hutan ditebang, rusa tidak punya makanan dan macan tutul ikut kelaparan.',
    quizScores: {
      'hutan-harmoni': 100
    },
    timeSpentMinutes: 38,
    lastActive: new Date().toISOString(),
    syncStatus: 'synced'
  },
  'std-5a-02': {
    studentId: 'std-5a-02',
    username: 'siti5a',
    className: 'Kelas 5A',
    hearts: 4,
    lastVisitedZone: 'padang-rumput',
    completedRooms: ['hutan-harmoni', 'sungai-bersih'],
    roomProgress: {
      'hutan-harmoni': 100,
      'sungai-bersih': 100,
      'laut-karang': 60,
      'sawah-kebun': 20,
      'hutan': 100,
      'padang-rumput': 100,
      'sungai-danau': 80,
      'laut': 60,
      'rantai-makanan': 40,
      'keseimbangan-ekosistem': 0,
      'ekosistem-buatan': 20,
      'pelestarian-lingkungan': 0
    },
    totalXP: 510,
    totalStars: 12,
    badges: ['penjelajah-hutan', 'penjaga-sungai', 'ahli-rantai-makanan'],
    hiddenFound: ['kumbang-permata-tersembunyi', 'kepiting-batu-langka'],
    discoveredOrganisms: ['pohon-meranti', 'rusa-bawean', 'macan-tutul', 'ikan-wader', 'capung-jarum', 'katak-sungai'],
    journalEntries: [],
    preTestCompleted: true,
    preTestScore: 100,
    postTestCompleted: false,
    postTestScore: 0,
    reflectionNotes: 'Capung air hanya bertelur di air bersih! Kita tidak boleh membuang sabun cuci langsung ke sungai.',
    quizScores: {
      'hutan-harmoni': 100,
      'sungai-bersih': 100
    },
    timeSpentMinutes: 65,
    lastActive: new Date().toISOString(),
    syncStatus: 'synced'
  }
};

export class StorageService {
  public static getProfiles(): StudentProfile[] {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROFILES;
    }
  }

  public static saveProfile(profile: StudentProfile): void {
    const profiles = this.getProfiles();
    const existingIdx = profiles.findIndex((p) => p.studentId === profile.studentId || p.username.toLowerCase() === profile.username.toLowerCase());
    if (existingIdx >= 0) {
      profiles[existingIdx] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }

  public static getActiveUser(): StudentProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (!raw) {
      // Default to Budi for immediate engaging exploration
      const budi = this.getProfiles()[0];
      this.setActiveUser(budi);
      return budi;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static setActiveUser(user: StudentProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    }
  }

  public static getProgress(studentId: string): StudentProgress {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    let allProgress: Record<string, StudentProgress> = DEFAULT_PROGRESS;
    if (raw) {
      try {
        allProgress = JSON.parse(raw);
      } catch {
        allProgress = DEFAULT_PROGRESS;
      }
    }

    if (allProgress[studentId]) {
      const existing = allProgress[studentId];
      if (existing.hearts === undefined) existing.hearts = 4;
      if (!existing.lastVisitedZone) existing.lastVisitedZone = 'hutan';
      if (!existing.journalEntries) existing.journalEntries = [];
      return existing;
    }

    // Initialize fresh empty progress for new student
    const profile = this.getProfiles().find((p) => p.studentId === studentId);
    const fresh: StudentProgress = {
      studentId,
      username: profile?.username || 'penjelajah',
      className: profile?.className || 'Kelas 5',
      hearts: 4,
      lastVisitedZone: 'hutan',
      completedRooms: [],
      roomProgress: {
        'hutan': 0,
        'padang-rumput': 0,
        'sungai-danau': 0,
        'laut': 0,
        'rantai-makanan': 0,
        'keseimbangan-ekosistem': 0,
        'ekosistem-buatan': 0,
        'pelestarian-lingkungan': 0
      },
      totalXP: 50,
      totalStars: 1,
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
      timeSpentMinutes: 5,
      lastActive: new Date().toISOString(),
      syncStatus: 'synced'
    };

    allProgress[studentId] = fresh;
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(allProgress));
    return fresh;
  }

  public static saveProgress(progress: StudentProgress): void {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    let allProgress: Record<string, StudentProgress> = {};
    if (raw) {
      try {
        allProgress = JSON.parse(raw);
      } catch {
        allProgress = {};
      }
    }
    progress.lastActive = new Date().toISOString();
    allProgress[progress.studentId] = progress;
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(allProgress));

    // Sync to Cloud Firestore (offline-first, no PII)
    import('./firestoreService').then(({ firestoreService }) => {
      firestoreService.saveStudentProgress(progress);
    }).catch(() => {});

    // Record to offline queue
    this.enqueueOfflineSync({
      type: 'PROGRESS_UPDATE',
      studentId: progress.studentId,
      payload: progress,
      timestamp: Date.now()
    });
  }

  /**
   * Reset student progress completely (Student reset & Teacher single reset)
   */
  public static resetStudentProgress(studentId: string): StudentProgress {
    const profile = this.getProfiles().find((p) => p.studentId === studentId);
    const username = profile?.username || 'penjelajah';
    const className = profile?.className || 'Kelas 5';

    const fresh: StudentProgress = {
      studentId,
      username,
      className,
      hearts: 4,
      lastVisitedZone: 'hutan',
      completedRooms: [],
      roomProgress: {
        'hutan': 0,
        'padang-rumput': 0,
        'sungai-danau': 0,
        'laut': 0,
        'rantai-makanan': 0,
        'keseimbangan-ekosistem': 0,
        'ekosistem-buatan': 0,
        'pelestarian-lingkungan': 0
      },
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
      lastActive: new Date().toISOString(),
      syncStatus: 'synced'
    };

    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    let allProgress: Record<string, StudentProgress> = {};
    if (raw) {
      try {
        allProgress = JSON.parse(raw);
      } catch {}
    }
    allProgress[studentId] = fresh;
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(allProgress));

    // Reset on Cloud Firestore
    import('./firestoreService').then(({ firestoreService }) => {
      firestoreService.resetStudentCloud(username, className);
    }).catch(() => {});

    return fresh;
  }

  /**
   * Reset all students in a class (Teacher class-wide reset)
   */
  public static resetAllClass(className: string): void {
    const profiles = this.getProfiles().filter((p) => p.className === className && p.role === 'student');
    const usernames = profiles.map((p) => p.username);
    profiles.forEach((p) => {
      this.resetStudentProgress(p.studentId);
    });

    import('./firestoreService').then(({ firestoreService }) => {
      firestoreService.resetAllClassStudents(className, usernames);
    }).catch(() => {});
  }

  public static getAllStudentProgress(): StudentProgress[] {
    const profiles = this.getProfiles().filter((p) => p.role === 'student');
    return profiles.map((p) => this.getProgress(p.studentId));
  }

  private static enqueueOfflineSync(item: { type: string; studentId: string; payload: unknown; timestamp: number }) {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    let queue: unknown[] = [];
    if (raw) {
      try {
        queue = JSON.parse(raw);
      } catch {
        queue = [];
      }
    }
    queue.push(item);
    // Keep max 50 queue items
    if (queue.length > 50) queue.shift();
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
  }
}
