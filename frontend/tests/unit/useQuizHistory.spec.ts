/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useQuizHistory,
  setRepositoryForTesting,
} from '../../src/composables/useQuizHistory';
import type { QuizHistoryRepository } from '../../src/services/QuizHistoryRepository';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent } from 'vue';

class MockRepo implements QuizHistoryRepository {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async saveAttempt() {}
  async getHistory() {
    return [];
  }
  async getThemeStatistics() {
    return {};
  }
}

describe('useQuizHistory', () => {
  let mockRepo: MockRepo;

  beforeEach(() => {
    mockRepo = new MockRepo();
    setRepositoryForTesting(mockRepo);
    vi.restoreAllMocks();
  });

  const mountComposable = () => {
    let result: ReturnType<typeof useQuizHistory> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useQuizHistory();
        return () => null;
      },
      template: '<div></div>',
    });
    mount(TestComponent);
    return result!;
  };

  it('loads data on mount', async () => {
    vi.spyOn(mockRepo, 'getHistory').mockResolvedValue([]);
    vi.spyOn(mockRepo, 'getThemeStatistics').mockResolvedValue({
      vue: {
        theme: 'vue',
        totalAnswers: 1,
        correctAnswers: 1,
        correctnessRate: 1,
      },
    });

    const composable = mountComposable();
    expect(composable.isLoading.value).toBe(true);

    await flushPromises();

    expect(composable.isLoading.value).toBe(false);
    expect(composable.history.value).toEqual([]);
    expect(composable.themeStats.value).toEqual({
      vue: {
        theme: 'vue',
        totalAnswers: 1,
        correctAnswers: 1,
        correctnessRate: 1,
      },
    });
  });

  it('saves attempt and reloads data', async () => {
    vi.spyOn(mockRepo, 'saveAttempt');
    vi.spyOn(mockRepo, 'getHistory').mockResolvedValue([]);
    vi.spyOn(mockRepo, 'getThemeStatistics').mockResolvedValue({});

    const composable = mountComposable();
    await flushPromises();

    await composable.saveAttempt({
      id: 'test',
      timestamp: 123,
      themes: ['vue'],
      answers: [],
    });

    expect(mockRepo.saveAttempt).toHaveBeenCalledWith(expect.anything());
    expect(mockRepo.getHistory).toHaveBeenCalledTimes(2); // Initial mount + reload
    expect(mockRepo.getThemeStatistics).toHaveBeenCalledTimes(2);
  });
});
