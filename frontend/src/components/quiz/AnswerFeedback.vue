<script setup lang="ts">
  defineProps<{
    isCorrect: boolean;
    explanation: string;
    bonusFact: string | null;
    isLastQuestion: boolean;
  }>();

  const emit = defineEmits<{
    next: [];
  }>();

  function handleNext(): void {
    emit('next');
  }
</script>

<template>
  <div
    class="answer-feedback"
    :class="
      isCorrect ? 'answer-feedback--correct' : 'answer-feedback--incorrect'
    "
  >
    <div class="answer-feedback__header">
      <span
        v-if="isCorrect"
        class="answer-feedback__icon"
        data-testid="feedback-correct"
        aria-label="Correct"
        >✓</span
      >
      <span
        v-else
        class="answer-feedback__icon"
        data-testid="feedback-incorrect"
        aria-label="Incorrect"
        >✗</span
      >
      <span class="answer-feedback__verdict">
        {{ isCorrect ? 'Correct!' : 'Not quite' }}
      </span>
    </div>

    <p class="answer-feedback__explanation">{{ explanation }}</p>

    <div
      v-if="bonusFact"
      class="answer-feedback__bonus"
      data-testid="bonus-fact"
    >
      <span class="answer-feedback__bonus-icon" aria-hidden="true">💡</span>
      <p class="answer-feedback__bonus-text">{{ bonusFact }}</p>
    </div>

    <button
      type="button"
      class="answer-feedback__next-btn"
      data-testid="next-btn"
      @click="handleNext"
    >
      {{ isLastQuestion ? 'See Results →' : 'Next Question →' }}
    </button>
  </div>
</template>

<style scoped>
  .answer-feedback {
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    border: 1px solid;
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

  .answer-feedback--correct {
    background: rgba(78, 205, 196, 0.1);
    border-color: var(--color-accent);
  }

  .answer-feedback--incorrect {
    background: rgba(255, 107, 107, 0.1);
    border-color: var(--color-primary);
  }

  .answer-feedback__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .answer-feedback__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 1rem;
    font-weight: 700;
  }

  .answer-feedback--correct .answer-feedback__icon {
    background: var(--color-accent);
    color: var(--color-bg);
  }

  .answer-feedback--incorrect .answer-feedback__icon {
    background: var(--color-primary);
    color: var(--color-bg);
  }

  .answer-feedback__verdict {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .answer-feedback--correct .answer-feedback__verdict {
    color: var(--color-accent);
  }

  .answer-feedback--incorrect .answer-feedback__verdict {
    color: var(--color-primary);
  }

  .answer-feedback__explanation {
    margin: 0 0 var(--spacing-md);
    color: var(--color-text-muted);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .answer-feedback__bonus {
    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(238, 90, 157, 0.3);
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-md);
  }

  .answer-feedback__bonus-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .answer-feedback__bonus-text {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .answer-feedback__next-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-xl);
    min-height: 44px;
    background: var(--gradient-accent);
    color: var(--color-bg);
    border: none;
    border-radius: var(--border-radius-sm);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    margin-top: var(--spacing-sm);
  }

  .answer-feedback__next-btn:hover {
    opacity: 0.9;
    transform: translateX(2px);
  }
</style>
