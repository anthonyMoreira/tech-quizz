import { ref, onMounted, getCurrentInstance } from 'vue';
import type { QuizHistoryRepository } from '../services/QuizHistoryRepository';
import { LocalStorageQuizHistory } from '../services/LocalStorageQuizHistory';
import type { ThemePerformanceStatistic, QuizAttempt } from '../types/history';

// Dependency injection point for tests
let repositoryInstance: QuizHistoryRepository = new LocalStorageQuizHistory();

export function setRepositoryForTesting(repo: QuizHistoryRepository) {
  repositoryInstance = repo;
}

export function useQuizHistory() {
  const isLoading = ref(true);
  const themeStats = ref<Record<string, ThemePerformanceStatistic>>({});
  const history = ref<QuizAttempt[]>([]);

  const loadData = async () => {
    isLoading.value = true;
    try {
      const [fetchedHistory, fetchedStats] = await Promise.all([
        repositoryInstance.getHistory(),
        repositoryInstance.getThemeStatistics(),
      ]);
      history.value = fetchedHistory;
      themeStats.value = fetchedStats;
    } catch (e) {
      console.error('Failed to load quiz history', e);
    } finally {
      isLoading.value = false;
    }
  };

  const saveAttempt = async (attempt: QuizAttempt) => {
    await repositoryInstance.saveAttempt(attempt);
    // Refresh stats after saving
    await loadData();
  };

  if (getCurrentInstance()) {
    onMounted(() => {
      void loadData();
    });
  } else {
    // If called outside component setup (e.g., in some tests), just load data
    void loadData();
  }

  return {
    isLoading,
    themeStats,
    history,
    saveAttempt,
    loadData,
  };
}
