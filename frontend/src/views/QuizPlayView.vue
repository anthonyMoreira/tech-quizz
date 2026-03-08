<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuiz } from '@/composables/useQuiz';
  import QuizProgress from '@/components/quiz/QuizProgress.vue';
  import QuizQuestion from '@/components/quiz/QuizQuestion.vue';

  const router = useRouter();
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isComplete,
    isActive,
    submitAnswer,
    nextQuestion,
  } = useQuiz();

  // Redirect away if no active session
  if (!isActive.value && !isComplete.value) {
    void router.push({ name: 'quiz-setup' });
  }

  // Watch for quiz completion and navigate to results
  watch(isComplete, (complete) => {
    if (complete) {
      void router.push({ name: 'quiz-results' });
    }
  });

  const displayIndex = computed(() => currentIndex.value + 1);
  const isLastQuestion = computed(
    () => currentIndex.value === totalQuestions.value - 1,
  );

  function handleAnswerSubmitted(optionId: string): void {
    submitAnswer(optionId);
  }

  function handleNext(): void {
    if (isLastQuestion.value) {
      void router.push({ name: 'quiz-results' });
    } else {
      nextQuestion();
    }
  }
</script>

<template>
  <div class="quiz-play-view">
    <QuizProgress
      v-if="totalQuestions > 0"
      :current="displayIndex"
      :total="totalQuestions"
      class="quiz-play-view__progress"
    />

    <Transition name="question" mode="out-in">
      <QuizQuestion
        v-if="currentQuestion"
        :key="currentQuestion.id"
        :question="currentQuestion"
        :is-last-question="isLastQuestion"
        class="quiz-play-view__question"
        @answer-submitted="handleAnswerSubmitted"
        @next="handleNext"
      />
    </Transition>
  </div>
</template>

<style scoped>
  .quiz-play-view {
    padding: var(--spacing-xl);
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .quiz-play-view__progress {
    /* progress bar at top */
  }

  .quiz-play-view__question {
    /* question card */
  }

  /* Question transition */
  .question-enter-active,
  .question-leave-active {
    transition: all var(--transition);
  }

  .question-enter-from {
    opacity: 0;
    transform: translateX(20px);
  }

  .question-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }

  @media (max-width: 767px) {
    .quiz-play-view {
      padding: var(--spacing-md);
    }
  }
</style>
