
export type UserRole = 'manager' | 'teacher' | 'student';

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface StudyPlanItem {
  surah: string;
  from: number;
  to: number;
  lines: number;
  grade?: string;
}

export interface StudyPlan {
  hifdh: StudyPlanItem;
  tathbeet: StudyPlanItem;
  review: StudyPlanItem;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  joinDate: string;
}

export interface Teacher extends User {
  studentsCount: number;
  circlesCount: number;
  rating: number;
}

export interface Student extends User {
  totalMemorized: number;
  lastSurah: string;
  dailyStreak: number;
  teacherName: string;
  plan?: StudyPlan;
  progress: number;
  idNumber?: string;
  birthDate?: string;
  nationality?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  audioUrl?: string;
}

export interface Verse {
  number: number;
  text: string;
  translation?: string;
}
