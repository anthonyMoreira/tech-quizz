<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuiz } from '@/composables/useQuiz';
  import ResultsSummary from '@/components/results/ResultsSummary.vue';
  import ResultsBreakdown from '@/components/results/ResultsBreakdown.vue';

  const router = useRouter();
  const { getResult, isComplete } = useQuiz();

  if (!isComplete.value) {
    void router.push('/');
  }

  const result = computed(() => getResult());
</script>

<template>
  <div class="quiz-results-view">
    <h1 class="quiz-results-view__title">Quiz Complete!</h1>

    <template v-if="result">
      <div class="quiz-results-view__layout">
        <ResultsSummary :result="result" class="quiz-results-view__summary" />
        <ResultsBreakdown
          :breakdown="result.breakdown"
          class="quiz-results-view__breakdown"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
  .quiz-results-view {
    padding: var(--spacing-xl);
    max-width: 1000px;
    margin: 0 auto;
  }

  .quiz-results-view__title {
    margin: 0 0 var(--spacing-xl);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .quiz-results-view__layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-xl);
    align-items: start;
  }

  @media (max-width: 767px) {
    .quiz-results-view {
      padding: var(--spacing-md);
    }

    .quiz-results-view__layout {
      grid-template-columns: 1fr;
    }
  }
</style>
