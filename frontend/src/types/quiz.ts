export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'text' | 'code-snippet';

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface AnswerOption {
  readonly id: string;
  readonly text: string;
  readonly isCorrect: boolean;
}

export interface Question {
  readonly id: string;
  readonly themeId: string;
  readonly difficulty: Difficulty;
  readonly type: QuestionType;
  readonly prompt: string;
  readonly codeSnippet: CodeSnippet | null;
  readonly options: readonly [
    AnswerOption,
    AnswerOption,
    AnswerOption,
    AnswerOption,
  ];
  readonly explanation: string;
  readonly bonusFact: string | null;
}

export interface Theme {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
}

export interface UserAnswer {
  readonly questionId: string;
  readonly selectedId: string;
  readonly isCorrect: boolean;
}

export interface QuizSession {
  readonly selectedThemes: readonly string[];
  readonly difficulty: Difficulty;
  readonly questions: readonly Question[];
  currentIndex: number;
  readonly answers: UserAnswer[];
  isComplete: boolean;
}

export interface BreakdownItem {
  readonly question: Question;
  readonly selectedId: string;
  readonly isCorrect: boolean;
}

export interface QuizResult {
  readonly totalQuestions: number;
  readonly correctCount: number;
  readonly scorePercent: number;
  readonly breakdown: readonly BreakdownItem[];
  readonly themes: readonly string[];
  readonly difficulty: Difficulty;
}
