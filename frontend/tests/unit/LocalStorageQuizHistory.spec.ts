import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageQuizHistory } from '../../src/services/LocalStorageQuizHistory';
import type { QuizAttempt } from '../../src/types/history';

describe('LocalStorageQuizHistory', () => {
  let repository: LocalStorageQuizHistory;

  beforeEach(() => {
    repository = new LocalStorageQuizHistory();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns empty array when history is empty', async () => {
    const history = await repository.getHistory();
    expect(history).toEqual([]);
  });

  it('saves an attempt and retrieves it', async () => {
    const attempt: QuizAttempt = {
      id: 'test-1',
      timestamp: Date.now(),
      themes: ['vue'],
      answers: [{ questionId: 'q1', theme: 'vue', isCorrect: true }],
    };

    await repository.saveAttempt(attempt);
    const history = await repository.getHistory();

    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(attempt);
  });

  it('calculates theme statistics correctly', async () => {
    const attempt1: QuizAttempt = {
      id: 'test-1',
      timestamp: Date.now(),
      themes: ['vue', 'react'],
      answers: [
        { questionId: 'q1', theme: 'vue', isCorrect: true },
        { questionId: 'q2', theme: 'vue', isCorrect: false },
        { questionId: 'q3', theme: 'react', isCorrect: true },
      ],
    };

    const attempt2: QuizAttempt = {
      id: 'test-2',
      timestamp: Date.now(),
      themes: ['vue'],
      answers: [{ questionId: 'q4', theme: 'vue', isCorrect: true }],
    };

    await repository.saveAttempt(attempt1);
    await repository.saveAttempt(attempt2);

    const stats = await repository.getThemeStatistics();

    expect(stats['vue']).toBeDefined();
    expect(stats['vue']?.totalAnswers).toBe(3);
    expect(stats['vue']?.correctAnswers).toBe(2);
    expect(stats['vue']?.correctnessRate).toBeCloseTo(0.666, 2);

    expect(stats['react']).toBeDefined();
    expect(stats['react']?.totalAnswers).toBe(1);
    expect(stats['react']?.correctAnswers).toBe(1);
    expect(stats['react']?.correctnessRate).toBe(1);
  });
});
