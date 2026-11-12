import { StudentProfile, StudentProgress } from '../types';

const STORAGE_KEY_PROFILES = 'ekoria_profiles_v1';
const STORAGE_KEY_PROGRESS = 'ekoria_progress_v1';
const STORAGE_KEY_ACTIVE_USER = 'ekoria_active_user_v1';
const STORAGE_KEY_OFFLINE_QUEUE = 'ekoria_offline_queue_v1';

const STORAGE_KEY_AUTH_VERSION = 'ekoria_auth_version';
const AUTH_VERSION = '2';

/**
 * Only the teacher account is seeded. Pupils are NOT seeded any more: every
 * pupil must register (daftar) and then log in (masuk) on this device.
 */
const DEFAULT_PROFILES: StudentProfile[] = [
  {
    studentId: 'tch-001',
    username: 'guru_ipas',
    pin: '9999',
    fullName: 'Dimas Yuli Rakasiwi, S.Pd',
    className: 'Guru Pembimbing IPAS',
    avatar: '👩‍🏫',
    role: 'teacher'
  }
];

/** Demo pupils that older versions seeded and auto-logged in (removed on upgrade). */
const LEGACY_DEMO_STUDENT_IDS = ['std-5a-01', 'std-5a-02', 'std-5b-01'];

/** Explicit "Mode Demo" account (only used when someone presses the Mode Demo button). */
export const DEMO_STUDENT_ID = 'std-demo';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * One-time upgrade from the old storage: drop the seeded demo pupils
 * (Budi, Siti, Eko), their fake progress, and the auto-login session.
 */
function migrateAuthStorage() {
  try {
    if (localStorage.getItem(STORAGE_KEY_AUTH_VERSION) === AUTH_VERSION) return;

    const profiles = readJson<StudentProfile[]>(STORAGE_KEY_PROFILES, []);
    const cleaned = profiles.filter((p) => !LEGACY_DEMO_STUDENT_IDS.includes(p.studentId));
    if (!cleaned.some((p) => p.role === 'teacher')) cleaned.unshift(...DEFAULT_PROFILES);
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(cleaned));

    const progress = readJson<Record<string, StudentProgress>>(STORAGE_KEY_PROGRESS, {});
    LEGACY_DEMO_STUDENT_IDS.forEach((id) => delete progress[id]);
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));

    // Old versions logged everyone in as "Budi Santoso" automatically
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    localStorage.setItem(STORAGE_KEY_AUTH_VERSION, AUTH_VERSION);
  } catch {
    // Storage unavailable: nothing to migrate
  }
}

if (typeof window !== 'undefined') {
  migrateAuthStorage();
}

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

  /** Returns the logged-in user, or null. There is NO automatic/demo login. */
  public static getActiveUser(): StudentProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    if (!raw) return null;
    try {
      const saved = JSON.parse(raw) as StudentProfile;
      // Only keep the session if the account still exists on this device
      const exists = this.getProfiles().find((p) => p.studentId === saved.studentId);
      if (!exists) {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
        return null;
      }
      return exists;
    } catch {
      return null;
    }
  }

  public static findProfileByUsername(username: string): StudentProfile | undefined {
    const u = username.trim().toLowerCase();
    return this.getProfiles().find((p) => p.username.toLowerCase() === u);
  }

  /** Check username + PIN. Returns the profile when both match. */
  public static authenticate(username: string, pin: string, role?: 'student' | 'teacher'): StudentProfile | null {
    const found = this.findProfileByUsername(username);
    if (!found || found.pin !== pin.trim()) return null;
    if (role && found.role !== role) return null;
    return found;
  }

  /** Register a new pupil. Returns an error message, or null on success. */
  public static registerStudent(input: { username: string; pin: string; fullName: string; className: string }): { profile?: StudentProfile; error?: string } {
    const username = input.username.trim().toLowerCase();
    const pin = input.pin.trim();
    const fullName = input.fullName.trim();
    if (!username || !pin || !fullName) {
      return { error: 'Isi semua kolom pendaftaran dulu, ya!' };
    }
    if (!/^[a-z0-9_.]{3,20}$/.test(username)) {
      return { error: 'Nama akun memakai 3–20 huruf kecil atau angka tanpa spasi, ya! Contoh: rina5a' };
    }
    if (!/^[0-9]{4,6}$/.test(pin)) {
      return { error: 'PIN harus berupa 4 sampai 6 angka, ya!' };
    }
    if (this.findProfileByUsername(username)) {
      return { error: 'Nama akun ini sudah dipakai. Coba nama lain, ya!' };
    }
    const profile: StudentProfile = {
      studentId: `std-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      username,
      pin,
      fullName,
      className: input.className,
      avatar: '🧑',
      role: 'student'
    };
    this.saveProfile(profile);
    return { profile };
  }

  /** Explicit demo account for judges/guests. Never used automatically. */
  public static getOrCreateDemoProfile(): StudentProfile {
    const existing = this.getProfiles().find((p) => p.studentId === DEMO_STUDENT_ID);
    if (existing) return existing;
    const demo: StudentProfile = {
      studentId: DEMO_STUDENT_ID,
      username: 'mode_demo',
      pin: '0000',
      fullName: 'Penjelajah Demo',
      className: 'Mode Demo',
      avatar: '🧭',
      role: 'student'
    };
    this.saveProfile(demo);
    return demo;
  }

  public static setActiveUser(user: StudentProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    }
  }

  public static getProgress(studentId: string): StudentProgress {
    const allProgress = readJson<Record<string, StudentProgress>>(STORAGE_KEY_PROGRESS, {});

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
    const profiles = this.getProfiles().filter((p) => p.role === 'student' && p.studentId !== DEMO_STUDENT_ID);
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
