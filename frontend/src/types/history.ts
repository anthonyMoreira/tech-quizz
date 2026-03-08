export interface AnsweredQuestion {
  questionId: string;
  theme: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  themes: string[];
  answers: AnsweredQuestion[];
}

export interface ThemePerformanceStatistic {
  theme: string;
  totalAnswers: number;
  correctAnswers: number;
  correctnessRate: number; // 0.0 to 1.0
}
