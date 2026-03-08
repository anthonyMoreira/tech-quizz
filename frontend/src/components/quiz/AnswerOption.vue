<script setup lang="ts">
  type AnswerState = 'neutral' | 'correct' | 'incorrect';

  const props = defineProps<{
    optionId: string;
    text: string;
    isSelected: boolean;
    isDisabled: boolean;
    state: AnswerState;
  }>();

  const emit = defineEmits<{
    select: [optionId: string];
  }>();

  function handleClick(): void {
    if (props.isDisabled) return;
    emit('select', props.optionId);
  }
</script>

<template>
  <button
    type="button"
    class="answer-option"
    :class="{
      'answer-option--selected': isSelected && state === 'neutral',
      'answer-option--correct': state === 'correct',
      'answer-option--incorrect': state === 'incorrect',
      'answer-option--disabled': isDisabled,
    }"
    :disabled="isDisabled"
    :aria-pressed="isSelected"
    data-testid="answer-option"
    @click="handleClick"
  >
    <span class="answer-option__indicator" aria-hidden="true">
      {{ optionId.toUpperCase() }}
    </span>
    <span class="answer-option__text">{{ text }}</span>
  </button>
</template>

<style scoped>
  .answer-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    width: 100%;
    min-height: 56px;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-sm);
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.95rem;
  }

  .answer-option:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--color-accent);
  }

  .answer-option--selected {
    background: rgba(78, 205, 196, 0.1);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .answer-option--correct {
    background: rgba(78, 205, 196, 0.15);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .answer-option--incorrect {
    background: rgba(255, 107, 107, 0.15);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .answer-option--disabled {
    cursor: not-allowed;
  }

  .answer-option__indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    font-size: 0.75rem;
    font-weight: 600;
  }

  .answer-option--selected .answer-option__indicator,
  .answer-option--correct .answer-option__indicator {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-bg);
  }

  .answer-option--incorrect .answer-option__indicator {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-bg);
  }

  .answer-option__text {
    flex: 1;
    line-height: 1.4;
  }
</style>
