<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Question } from '@/types/quiz';
  import AnswerOption from '@/components/quiz/AnswerOption.vue';
  import AnswerFeedback from '@/components/quiz/AnswerFeedback.vue';
  import CodeSnippet from '@/components/quiz/CodeSnippet.vue';

  const props = defineProps<{
    question: Question;
    isLastQuestion?: boolean;
  }>();

  const emit = defineEmits<{
    'answer-submitted': [optionId: string];
    next: [];
  }>();

  const selectedOptionId = ref<string | null>(null);
  const confirmedOptionId = ref<string | null>(null);
  const isConfirmed = ref(false);

  const canConfirm = computed(
    () => selectedOptionId.value !== null && !isConfirmed.value,
  );

  const correctOptionId = computed(
    () => props.question.options.find((o) => o.isCorrect)?.id ?? null,
  );

  const isAnswerCorrect = computed(() => {
    if (!confirmedOptionId.value) return false;
    return confirmedOptionId.value === correctOptionId.value;
  });

  function getOptionState(
    optionId: string,
  ): 'neutral' | 'correct' | 'incorrect' {
    if (!isConfirmed.value) return 'neutral';
    if (optionId === correctOptionId.value) return 'correct';
    if (optionId === confirmedOptionId.value) return 'incorrect';
    return 'neutral';
  }

  function selectOption(optionId: string): void {
    if (isConfirmed.value) return;
    selectedOptionId.value = optionId;
  }

  function confirmAnswer(): void {
    if (!selectedOptionId.value || isConfirmed.value) return;
    confirmedOptionId.value = selectedOptionId.value;
    isConfirmed.value = true;
    emit('answer-submitted', selectedOptionId.value);
  }

  function handleNext(): void {
    emit('next');
  }
</script>

<template>
  <div class="quiz-question">
    <p class="quiz-question__prompt">{{ question.prompt }}</p>

    <CodeSnippet
      v-if="question.type === 'code-snippet' && question.codeSnippet"
      :language="question.codeSnippet.language"
      :code="question.codeSnippet.code"
      class="quiz-question__code-snippet"
    />

    <div
      class="quiz-question__options"
      role="radiogroup"
      aria-label="Answer options"
    >
      <AnswerOption
        v-for="option in question.options"
        :key="option.id"
        :option-id="option.id"
        :text="option.text"
        :is-selected="
          selectedOptionId === option.id ||
          (isConfirmed && option.id === correctOptionId)
        "
        :is-disabled="isConfirmed"
        :state="getOptionState(option.id)"
        @select="selectOption"
      />
    </div>

    <button
      v-if="!isConfirmed"
      type="button"
      class="quiz-question__confirm-btn"
      :disabled="!canConfirm"
      :aria-disabled="!canConfirm"
      data-testid="confirm-btn"
      @click="confirmAnswer"
    >
      Confirm Answer
    </button>

    <Transition name="feedback">
      <AnswerFeedback
        v-if="isConfirmed"
        :is-correct="isAnswerCorrect"
        :explanation="question.explanation"
        :bonus-fact="question.bonusFact"
        :is-last-question="isLastQuestion ?? false"
        data-testid="answer-feedback"
        @next="handleNext"
      />
    </Transition>
  </div>
</template>

<style scoped>
  .quiz-question {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .quiz-question__prompt {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 500;
    line-height: 1.6;
    color: var(--color-text);
  }

  .quiz-question__options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .quiz-question__code-snippet {
    margin: var(--spacing-sm) 0;
  }

  .quiz-question__confirm-btn {
    align-self: flex-start;
    padding: var(--spacing-sm) var(--spacing-xl);
    min-height: 44px;
    background: var(--gradient-primary);
    color: var(--color-text);
    border: none;
    border-radius: var(--border-radius-sm);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .quiz-question__confirm-btn:hover:not(:disabled) {
    opacity: 0.9;
  }

  .quiz-question__confirm-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .feedback-enter-active {
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
