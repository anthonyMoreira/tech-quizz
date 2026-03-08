import type { Router } from 'vue-router';
import { useQuiz } from '@/composables/useQuiz';

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const { isActive, isComplete } = useQuiz();

    if (to.path === '/quiz/play') {
      if (!isActive.value) {
        return '/quiz/setup';
      }
    }

    if (to.path === '/quiz/results') {
      if (!isComplete.value) {
        return '/';
      }
    }

    return true;
  });
}
