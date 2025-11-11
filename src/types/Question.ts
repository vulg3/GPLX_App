export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  _id: {
    $oid: string;
  };
  number: number;
  question: string;
  category: string;
  answers: Answer[];
  explanation?: string;
  hinhanhq?: string;
}

export type LicenseType = "A" | "B";

export interface UserAnswer {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
}

export interface ExamResult {
  id: string;
  licenseType: LicenseType;
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: UserAnswer[];
  questions: Question[];
}

export interface StudyProgress {
  licenseType: LicenseType;
  completedCategories: string[];
  lastStudiedDate: string;
}



