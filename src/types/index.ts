export type ZoneId =
  | 'hutan'
  | 'padang-rumput'
  | 'sungai-danau'
  | 'laut'
  | 'rantai-makanan'
  | 'keseimbangan-ekosistem'
  | 'ekosistem-buatan'
  | 'pelestarian-lingkungan';

// Backwards-compatible RoomId
export type RoomId = ZoneId | 'hutan-harmoni' | 'sungai-bersih' | 'laut-karang' | 'sawah-kebun';

export type TrophicRole = 'produsen' | 'konsumen-1' | 'konsumen-2' | 'konsumen-3' | 'pengurai' | 'abiotik';

export interface Organism {
  id: string;
  name: string;
  localName: string;
  scientificName: string;
  role: TrophicRole;
  trophicLevelName: string; // e.g. "Produsen", "Konsumen I (Herbivora)"
  habitat: string;
  diet: string;
  predators: string[];
  energySource: string;
  funFact: string;
  thinkingQuestion?: string; // Kotak Ozi "Ayo Berpikir!"
  icon: string;
  x: number; // percentage in panoramic scene (0-100)
  y: number; // percentage in panoramic scene (0-100)
  isBiotic: boolean;
  category: 'flora' | 'fauna' | 'fungi' | 'mikroba' | 'abiotik';
}

export interface AbioticFactor {
  id: string;
  name: string;
  role: string;
  effectOnEcosystem: string;
  thinkingQuestion?: string;
  icon: string;
  x: number;
  y: number;
}

export interface ZoneData {
  id: ZoneId;
  zoneNumber: number;
  roomNumber?: number;
  title: string;
  theme: string;
  tagline: string;
  curriculumTopic: string;
  bgImage: string;
  accentColor: string;
  portalGlow: string;
  portalIcon: string;
  ambientType: 'hutan' | 'sungai' | 'laut' | 'sawah' | 'padang' | 'alam';
  welcomeSpeech: string;
  guidingQuestion: string;
  learningObjectives: string[];
  organisms: Organism[];
  abioticFactors: AbioticFactor[];
  zoneMissions: {
    id: string;
    text: string;
    type: 'biotik' | 'abiotik' | 'journal' | 'activity';
    targetCount: number;
  }[];
  hiddenItem?: {
    id: string;
    name: string;
    hint: string;
    discoveryFact: string;
    xp: number;
    x: number;
    y: number;
  };
}

export interface LegacyRoomData {
  id: RoomId;
  zoneNumber?: number;
  roomNumber?: number;
  title: string;
  theme: string;
  tagline: string;
  curriculumTopic: string;
  bgImage: string;
  accentColor: string;
  portalGlow?: string;
  portalIcon?: string;
  ambientType: 'hutan' | 'sungai' | 'laut' | 'sawah' | 'padang' | 'alam';
  welcomeSpeech: string;
  guidingQuestion: string;
  learningObjectives: string[];
  organisms: Organism[];
  abioticFactors: AbioticFactor[];
  zoneMissions?: {
    id: string;
    text: string;
    type: 'biotik' | 'abiotik' | 'journal' | 'activity';
    targetCount: number;
  }[];
  hiddenItem?: {
    id: string;
    name: string;
    hint: string;
    discoveryFact: string;
    xp: number;
    x: number;
    y: number;
  };
}

export type RoomData = LegacyRoomData;

export interface JournalEntry {
  id: string;
  zoneId: ZoneId;
  zoneName: string;
  organismId: string;
  name: string;
  category: string;
  role: string;
  isBiotic: boolean;
  explanation: string;
  thinkingQuestion?: string;
  icon: string;
  discoveredAt: string;
}

export interface StudentProfile {
  studentId: string;
  username: string;
  pin: string;
  fullName: string;
  className: string;
  avatar: string;
  role: 'student' | 'teacher';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
}

export interface StudentProgress {
  studentId: string;
  username: string;
  className: string;
  hearts: number; // 1-4 (default 4 ♥♥♥♥)
  lastVisitedZone: ZoneId;
  completedRooms: (ZoneId | RoomId)[];
  roomProgress: Record<string, number>; // 0 to 100%
  totalXP: number;
  totalStars: number;
  badges: string[]; // Badge IDs
  hiddenFound: string[];
  discoveredOrganisms: string[];
  journalEntries: JournalEntry[];
  preTestCompleted: boolean;
  preTestScore: number;
  postTestCompleted: boolean;
  postTestScore: number;
  reflectionNotes: string;
  quizScores: Record<string, number>;
  timeSpentMinutes: number;
  lastActive: string;
  syncStatus: 'synced' | 'pending' | 'offline';
}

export type ViewState = 
  | 'landing'
  | 'dashboard'
  | 'museum-hub'
  | 'zone-view'
  | 'journal'
  | 'encyclopedia'
  | 'quiz'
  | 'pretest'
  | 'posttest'
  | 'achievements'
  | 'simulation'
  | 'food-chain'
  | 'decomposer'
  | 'trash-sorting'
  | 'teacher-dashboard'
  // Legacy aliases
  | 'main-hall'
  | 'room-view'
  | 'food-web'
  | 'terrarium'
  | 'certificate';


