<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Difficulty } from '@/types/quiz';
  import DifficultySelector from '@/components/quiz/DifficultySelector.vue';
  import ThemeSelector from '@/components/quiz/ThemeSelector.vue';
  import { useQuiz } from '@/composables/useQuiz';
  import { useQuizHistory } from '@/composables/useQuizHistory';

  const router = useRouter();
  const { startQuiz } = useQuiz();
  const { themeStats } = useQuizHistory();

  const selectedDifficulty = ref<Difficulty>('beginner');
  const selectedThemes = ref<string[]>([]);
  const showValidationError = ref(false);

  const canStart = computed(() => selectedThemes.value.length > 0);

  async function handleStart(): Promise<void> {
    if (!canStart.value) {
      showValidationError.value = true;
      return;
    }
    showValidationError.value = false;
    startQuiz(selectedThemes.value, selectedDifficulty.value);
    await router.push({ name: 'quiz-play' });
  }
</script>

<template>
  <div class="quiz-setup-view">
    <h1 class="quiz-setup-view__title">Set Up Your Quiz</h1>

    <section class="quiz-setup-view__section">
      <h2 class="quiz-setup-view__section-title">Difficulty</h2>
      <DifficultySelector v-model="selectedDifficulty" />
    </section>

    <section class="quiz-setup-view__section">
      <h2 class="quiz-setup-view__section-title">Themes</h2>
      <ThemeSelector
        v-model="selectedThemes"
        :difficulty="selectedDifficulty"
        :theme-stats="themeStats"
      />
      <p v-if="showValidationError" class="quiz-setup-view__error" role="alert">
        Please select at least one theme to start the quiz.
      </p>
    </section>

    <div class="quiz-setup-view__actions">
      <button
        type="button"
        class="quiz-setup-view__start-btn"
        :disabled="!canStart"
        :aria-disabled="!canStart"
        @click="handleStart"
      >
        Start Quiz
        <span v-if="selectedThemes.length > 0"
          >({{ selectedThemes.length }} theme{{
            selectedThemes.length > 1 ? 's' : ''
          }})</span
        >
      </button>
    </div>
  </div>
</template>

<style scoped>
  .quiz-setup-view {
    padding: var(--spacing-xl);
    max-width: 800px;
    margin: 0 auto;
  }

  .quiz-setup-view__title {
    margin: 0 0 var(--spacing-xl);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .quiz-setup-view__section {
    margin-bottom: var(--spacing-xl);
  }

  .quiz-setup-view__section-title {
    margin: 0 0 var(--spacing-md);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .quiz-setup-view__error {
    margin-top: var(--spacing-sm);
    color: var(--color-primary);
    font-size: 0.875rem;
  }

  .quiz-setup-view__actions {
    margin-top: var(--spacing-xl);
  }

  .quiz-setup-view__start-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    min-height: 44px;
    background: var(--gradient-primary);
    color: var(--color-text);
    border: none;
    border-radius: var(--border-radius-sm);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .quiz-setup-view__start-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }

  .quiz-setup-view__start-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 767px) {
    .quiz-setup-view {
      padding: var(--spacing-md);
    }

    .quiz-setup-view__title {
      font-size: 1.5rem;
    }

    .quiz-setup-view__start-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
