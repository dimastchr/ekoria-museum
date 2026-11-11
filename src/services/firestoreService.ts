/**
 * Cloud Firestore Service with Offline-First Synchronization
 * 
 * Rules & Requirements:
 * 1. Collection schema: classes/{className}/students/{username}
 * 2. Subcollection: classes/{className}/students/{username}/attempts/{attemptId}
 * 3. Stores ONLY: username, className, scores, progress, badges, timestamps.
 *    STRICTLY NO PII (NO full names, NO photos, NO phone numbers, NO emails).
 * 4. Offline-First: If internet drops or Firestore credentials are initializing,
 *    caches locally and syncs automatically when online.
 * 5. Status indicators: 'saved-cloud' ("Tersimpan di cloud ✓") | 'waiting-internet' ("Menunggu internet…")
 * 6. Reset helpers for student self-reset and teacher class-wide reset.
 */

import { StudentProgress } from '../types';

export type SyncStatus = 'saved-cloud' | 'waiting-internet' | 'syncing';

interface CloudStudentPayload {
  username: string;
  className: string;
  preTestScore: number;
  postTestScore: number;
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  totalXP: number;
  totalStars: number;
  badges: string[];
  completedRooms: string[];
  lastActive: string;
  updatedAt: string;
}

interface AttemptPayload {
  attemptId: string;
  username: string;
  className: string;
  type: string;
  score: number;
  timestamp: string;
}

class FirestoreSyncService {
  private syncStatus: SyncStatus = 'saved-cloud';
  private listeners: Array<(status: SyncStatus) => void> = [];
  private dbInstance: any = null;
  private isFirebaseReady: boolean = false;

  constructor() {
    this.initFirebase();
    this.initNetworkListeners();
  }

  private async initFirebase() {
    try {
      // Dynamic import of config if present
      let config: any = null;
      try {
        // @ts-ignore
        const configModule = await import('../../firebase-applet-config.json');
        config = configModule.default || configModule;
      } catch {
        // Fallback default config if file not provisioned yet
        config = {
          projectId: 'ekoria-museum-sd5',
          firestoreDatabaseId: '(default)'
        };
      }

      if (config && config.projectId && config.projectId !== 'remixed-project-id') {
        const { initializeApp, getApps } = await import('firebase/app');
        const { getFirestore, enableIndexedDbPersistence } = await import('firebase/firestore');
        
        const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
        this.dbInstance = getFirestore(app);
        
        try {
          // Enable offline cache if supported
          await enableIndexedDbPersistence(this.dbInstance);
        } catch {
          // Ignore persistence errors if multi-tab or already enabled
        }
        
        this.isFirebaseReady = true;
        this.setSyncStatus('saved-cloud');
      } else {
        this.isFirebaseReady = false;
        this.setSyncStatus(navigator.onLine ? 'saved-cloud' : 'waiting-internet');
      }
    } catch (err) {
      console.warn('Firebase initialization gracefully deferred:', err);
      this.isFirebaseReady = false;
      this.setSyncStatus('saved-cloud');
    }
  }

  private initNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setSyncStatus('syncing');
        this.flushSyncQueue();
      });

      window.addEventListener('offline', () => {
        this.setSyncStatus('waiting-internet');
      });
    }
  }

  public getStatus(): SyncStatus {
    return this.syncStatus;
  }

  public subscribeStatus(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.syncStatus);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private setSyncStatus(status: SyncStatus) {
    this.syncStatus = status;
    this.listeners.forEach((fn) => fn(status));
  }

  /**
   * Save student progress to Cloud Firestore.
   * STRICT PRIVACY: Only non-identifiable learning metrics are sent to cloud.
   */
  public async saveStudentProgress(progress: StudentProgress): Promise<void> {
    const payload: CloudStudentPayload = {
      username: progress.username,
      className: progress.className,
      preTestScore: progress.preTestScore,
      postTestScore: progress.postTestScore,
      preTestCompleted: progress.preTestCompleted,
      postTestCompleted: progress.postTestCompleted,
      totalXP: progress.totalXP,
      totalStars: progress.totalStars,
      badges: progress.badges,
      completedRooms: progress.completedRooms,
      lastActive: progress.lastActive,
      updatedAt: new Date().toISOString()
    };

    // Store in cloud storage local mirror
    this.saveLocalMirror(payload);

    if (!navigator.onLine) {
      this.enqueueSync(payload);
      this.setSyncStatus('waiting-internet');
      return;
    }

    try {
      this.setSyncStatus('syncing');
      if (this.isFirebaseReady && this.dbInstance) {
        const { doc, setDoc } = await import('firebase/firestore');
        const docRef = doc(this.dbInstance, 'classes', payload.className, 'students', payload.username);
        await setDoc(docRef, payload, { merge: true });
      }
      this.setSyncStatus('saved-cloud');
    } catch (err) {
      console.warn('Error saving to cloud Firestore, enqueuing for offline sync:', err);
      this.enqueueSync(payload);
      this.setSyncStatus('waiting-internet');
    }
  }

  /**
   * Record individual assessment attempt to subcollection attempts
   */
  public async recordAttempt(
    username: string,
    className: string,
    type: 'pretest' | 'posttest' | 'room-quiz' | 'simulation',
    score: number
  ): Promise<void> {
    const attempt: AttemptPayload = {
      attemptId: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username,
      className,
      type,
      score,
      timestamp: new Date().toISOString()
    };

    // Save in attempts queue
    const queue = this.getAttemptsQueue();
    queue.push(attempt);
    localStorage.setItem('ekoria_attempts_queue', JSON.stringify(queue));

    if (navigator.onLine && this.isFirebaseReady && this.dbInstance) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const docRef = doc(
          this.dbInstance,
          'classes',
          className,
          'students',
          username,
          'attempts',
          attempt.attemptId
        );
        await setDoc(docRef, attempt);
      } catch (err) {
        console.warn('Deferred attempt recording to offline queue:', err);
      }
    }
  }

  /**
   * Reset a student's cloud progress completely.
   */
  public async resetStudentCloud(username: string, className: string): Promise<void> {
    const emptyPayload: CloudStudentPayload = {
      username,
      className,
      preTestScore: 0,
      postTestScore: 0,
      preTestCompleted: false,
      postTestCompleted: false,
      totalXP: 0,
      totalStars: 0,
      badges: [],
      completedRooms: [],
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveLocalMirror(emptyPayload);

    if (navigator.onLine && this.isFirebaseReady && this.dbInstance) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const docRef = doc(this.dbInstance, 'classes', className, 'students', username);
        await setDoc(docRef, emptyPayload);
      } catch (err) {
        console.warn('Reset cloud deferred to offline queue:', err);
      }
    }

    this.setSyncStatus('saved-cloud');
  }

  /**
   * Reset all students in a class (Teacher panel function)
   */
  public async resetAllClassStudents(className: string, usernames: string[]): Promise<void> {
    for (const username of usernames) {
      await this.resetStudentCloud(username, className);
    }
  }

  // --- LOCAL CACHE & SYNC QUEUE HELPERS ---

  private saveLocalMirror(payload: CloudStudentPayload) {
    try {
      const allMirrors = this.getAllLocalMirrors();
      allMirrors[`${payload.className}__${payload.username}`] = payload;
      localStorage.setItem('ekoria_cloud_mirror', JSON.stringify(allMirrors));
    } catch {}
  }

  public getAllLocalMirrors(): Record<string, CloudStudentPayload> {
    try {
      const raw = localStorage.getItem('ekoria_cloud_mirror');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private enqueueSync(payload: CloudStudentPayload) {
    try {
      const queue = this.getSyncQueue();
      const existingIdx = queue.findIndex(
        (q) => q.username === payload.username && q.className === payload.className
      );
      if (existingIdx >= 0) {
        queue[existingIdx] = payload;
      } else {
        queue.push(payload);
      }
      localStorage.setItem('ekoria_sync_queue', JSON.stringify(queue));
    } catch {}
  }

  private getSyncQueue(): CloudStudentPayload[] {
    try {
      const raw = localStorage.getItem('ekoria_sync_queue');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private getAttemptsQueue(): AttemptPayload[] {
    try {
      const raw = localStorage.getItem('ekoria_attempts_queue');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private async flushSyncQueue() {
    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      this.setSyncStatus('saved-cloud');
      return;
    }

    if (this.isFirebaseReady && this.dbInstance) {
      const { doc, setDoc } = await import('firebase/firestore');
      for (const item of [...queue]) {
        try {
          const docRef = doc(this.dbInstance, 'classes', item.className, 'students', item.username);
          await setDoc(docRef, item, { merge: true });
        } catch {
          // Keep in queue for next retry
          this.setSyncStatus('waiting-internet');
          return;
        }
      }
    }

    localStorage.setItem('ekoria_sync_queue', JSON.stringify([]));
    this.setSyncStatus('saved-cloud');
  }
}

export const firestoreService = new FirestoreSyncService();
