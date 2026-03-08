<script setup lang="ts">
  import type { Difficulty } from '@/types/quiz';

  defineProps<{
    modelValue: Difficulty;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: Difficulty];
  }>();

  const difficulties: {
    value: Difficulty;
    label: string;
    description: string;
  }[] = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'Core concepts & definitions',
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Application & trade-offs',
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Deep mechanics & edge cases',
    },
  ];

  function select(difficulty: Difficulty): void {
    emit('update:modelValue', difficulty);
  }
</script>

<template>
  <div
    class="difficulty-selector"
    role="radiogroup"
    aria-label="Select difficulty"
  >
    <button
      v-for="d in difficulties"
      :key="d.value"
      type="button"
      class="difficulty-selector__btn"
      :class="{ 'difficulty-selector__btn--active': modelValue === d.value }"
      role="radio"
      :aria-checked="modelValue === d.value"
      @click="select(d.value)"
    >
      <span class="difficulty-selector__label">{{ d.label }}</span>
      <span class="difficulty-selector__desc">{{ d.description }}</span>
    </button>
  </div>
</template>

<style scoped>
  .difficulty-selector {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .difficulty-selector__btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
    padding: var(--spacing-md) var(--spacing-lg);
    min-width: 140px;
    min-height: 44px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .difficulty-selector__btn:hover {
    border-color: var(--color-accent);
    color: var(--color-text);
  }

  .difficulty-selector__btn--active {
    background: rgba(78, 205, 196, 0.15);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .difficulty-selector__label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .difficulty-selector__desc {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  @media (max-width: 767px) {
    .difficulty-selector {
      flex-direction: column;
    }

    .difficulty-selector__btn {
      min-width: unset;
      width: 100%;
    }
  }
</style>
