/**
 * Interface representing the storage mechanism for user quiz history.
 * Designed to be easily implemented by both LocalStorage and a future Backend API.
 */
export interface QuizHistoryRepository {
  /**
   * Saves a newly completed quiz attempt.
   * @param attempt The QuizAttempt to save.
   */
  saveAttempt(attempt: QuizAttempt): Promise<void>;

  /**
   * Retrieves all historical quiz attempts for the current user.
   * @returns A promise resolving to an array of QuizAttempts.
   */
  getHistory(): Promise<QuizAttempt[]>;

  /**
   * Calculates and returns the aggregated performance statistics mapped by theme ID.
   * @returns A promise resolving to a record mapping theme IDs to ThemePerformanceStatistic objects.
   */
  getThemeStatistics(): Promise<Record<string, ThemePerformanceStatistic>>;
}
