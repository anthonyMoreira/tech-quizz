import type { QuizHistoryRepository } from './QuizHistoryRepository';
import type { QuizAttempt, ThemePerformanceStatistic } from '../types/history';

export class LocalStorageQuizHistory implements QuizHistoryRepository {
  private readonly STORAGE_KEY = 'tech_quizz_history';

  async saveAttempt(attempt: QuizAttempt): Promise<void> {
    const history = await this.getHistory();
    history.push(attempt);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  getHistory(): Promise<QuizAttempt[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return Promise.resolve([]);
    try {
      return Promise.resolve(JSON.parse(stored) as QuizAttempt[]);
    } catch {
      return Promise.resolve([]);
    }
  }

  async getThemeStatistics(): Promise<
    Record<string, ThemePerformanceStatistic>
  > {
    const history = await this.getHistory();
    const stats: Record<string, ThemePerformanceStatistic> = {};

    for (const attempt of history) {
      for (const answer of attempt.answers) {
        stats[answer.theme] ??= {
          theme: answer.theme,
          totalAnswers: 0,
          correctAnswers: 0,
          correctnessRate: 0,
        };

        const themeStat = stats[answer.theme];
        if (themeStat) {
          themeStat.totalAnswers++;
          if (answer.isCorrect) {
            themeStat.correctAnswers++;
          }
          themeStat.correctnessRate =
            themeStat.correctAnswers / themeStat.totalAnswers;
        }
      }
    }

    return stats;
  }
}
