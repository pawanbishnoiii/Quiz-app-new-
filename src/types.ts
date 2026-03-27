export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  examPrep?: string;
  language?: "Hindi" | "English";
  xp: number;
  streak: number;
  role: "user" | "admin";
  lastLogin?: string;
  bookmarks?: string[];
  purchasedCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isFree: boolean;
  rating?: number;
  studentsCount?: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  pdfUrl?: string;
}

export interface Test {
  id: string;
  title: string;
  courseId: string;
  topicId?: string;
  type: "Full" | "Topic" | "Subjective";
  duration: number;
  negativeMarking: number;
  cutoff?: number;
  questionsCount: number;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  likes?: number;
  dislikes?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Result {
  id: string;
  userId: string;
  testId: string;
  score: number;
  accuracy: number;
  timeTaken: number;
  attempted: number;
  unattempted: number;
  rank?: number;
  timestamp: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
  active: boolean;
}
