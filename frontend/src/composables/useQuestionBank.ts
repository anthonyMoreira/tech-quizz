import { computed } from 'vue';
import type { Difficulty, Question, Theme } from '@/types/quiz';
import { getAllQuestions, themes } from '@/data/questions/index';

function shuffleArray<T>(array: readonly T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    const next = arr[j];
    if (temp !== undefined && next !== undefined) {
      arr[i] = next;
      arr[j] = temp;
    }
  }
  return arr;
}

export interface ThemeAvailability {
  themeId: string;
  count: number;
}

export function useQuestionBank() {
  const allQuestions = computed(() => getAllQuestions());

  function getFilteredQuestions(
    themeIds: readonly string[],
    difficulty: Difficulty,
  ): Question[] {
    return allQuestions.value.filter(
      (q) => themeIds.includes(q.themeId) && q.difficulty === difficulty,
    );
  }

  function selectQuestions(
    themeIds: readonly string[],
    difficulty: Difficulty,
    maxCount = 10,
  ): Question[] {
    const filtered = getFilteredQuestions(themeIds, difficulty);
    const shuffled = shuffleArray(filtered);
    return shuffled.slice(0, maxCount).map((q) => ({
      ...q,
      options: shuffleArray(q.options) as unknown as typeof q.options,
    }));
  }

  function getAvailableCounts(difficulty: Difficulty): ThemeAvailability[] {
    return themes.map((theme: Theme) => ({
      themeId: theme.id,
      count: allQuestions.value.filter(
        (q) => q.themeId === theme.id && q.difficulty === difficulty,
      ).length,
    }));
  }

  return {
    allQuestions,
    selectQuestions,
    getFilteredQuestions,
    getAvailableCounts,
  };
}
