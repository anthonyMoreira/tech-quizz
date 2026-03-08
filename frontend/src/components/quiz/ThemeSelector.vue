<script setup lang="ts">
  import { computed } from 'vue';
  import type { Difficulty } from '@/types/quiz';
  import type { ThemePerformanceStatistic } from '@/types/history';
  import { themes } from '@/data/questions/index';
  import { useQuestionBank } from '@/composables/useQuestionBank';

  const props = defineProps<{
    modelValue: string[];
    difficulty: Difficulty;
    themeStats?: Record<string, ThemePerformanceStatistic>;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: string[]];
  }>();

  const { getAvailableCounts } = useQuestionBank();

  const availableCounts = computed(() => getAvailableCounts(props.difficulty));

  function isDisabled(themeId: string): boolean {
    const entry = availableCounts.value.find((c) => c.themeId === themeId);
    return (entry?.count ?? 0) === 0;
  }

  function getThemeStatLabel(themeId: string): string {
    if (!props.themeStats) return '';
    const stat = props.themeStats[themeId];
    if (!stat || stat.totalAnswers === 0) return 'No history';
    return `${Math.round(stat.correctnessRate * 100).toString()}% correct`;
  }

  function isSelected(themeId: string): boolean {
    return props.modelValue.includes(themeId);
  }

  function toggle(themeId: string): void {
    if (isDisabled(themeId)) return;
    const current = props.modelValue;
    if (isSelected(themeId)) {
      emit(
        'update:modelValue',
        current.filter((id) => id !== themeId),
      );
    } else {
      emit('update:modelValue', [...current, themeId]);
    }
  }
</script>

<template>
  <div class="theme-selector" role="group" aria-label="Select quiz themes">
    <button
      v-for="theme in themes"
      :key="theme.id"
      type="button"
      class="theme-selector__card"
      :class="{
        'theme-selector__card--selected': isSelected(theme.id),
        'theme-selector__card--disabled': isDisabled(theme.id),
      }"
      :disabled="isDisabled(theme.id)"
      :title="
        isDisabled(theme.id)
          ? `No ${modelValue.length > 0 ? '' : ''}${theme.name} questions for selected difficulty`
          : undefined
      "
      :aria-pressed="isSelected(theme.id)"
      :aria-disabled="isDisabled(theme.id)"
      @click="toggle(theme.id)"
    >
      <span class="theme-selector__icon" aria-hidden="true">{{
        theme.icon
      }}</span>
      <span class="theme-selector__name">{{ theme.name }}</span>
      <span v-if="themeStats" class="theme-selector__stat">{{
        getThemeStatLabel(theme.id)
      }}</span>
      <span v-if="isDisabled(theme.id)" class="theme-selector__badge"
        >Coming soon</span
      >
    </button>
  </div>
</template>

<style scoped>
  .theme-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }

  .theme-selector__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
    min-height: 44px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: center;
    position: relative;
  }

  .theme-selector__card:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-text);
  }

  .theme-selector__card--selected {
    background: rgba(78, 205, 196, 0.15);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .theme-selector__card--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .theme-selector__icon {
    font-size: 1.5rem;
    line-height: 1;
  }

  .theme-selector__name {
    font-size: 0.75rem;
    font-weight: 500;
  }

  .theme-selector__stat {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    opacity: 0.8;
  }

  .theme-selector__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.6rem;
    background: var(--color-surface);
    border-radius: 4px;
    padding: 1px 4px;
    color: var(--color-text-muted);
  }

  @media (max-width: 767px) {
    .theme-selector {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
