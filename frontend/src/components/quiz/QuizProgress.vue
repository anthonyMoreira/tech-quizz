<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    current: number;
    total: number;
  }>();

  const progressPercent = computed(() =>
    props.total > 0 ? (props.current / props.total) * 100 : 0,
  );
</script>

<template>
  <div
    class="quiz-progress"
    role="progressbar"
    :aria-valuenow="current"
    :aria-valuemin="1"
    :aria-valuemax="total"
  >
    <div class="quiz-progress__label">
      <span class="quiz-progress__text">Question</span>
      <span class="quiz-progress__numbers">{{ current }} / {{ total }}</span>
    </div>
    <div class="quiz-progress__track">
      <div
        class="quiz-progress__fill"
        :style="{ width: `${progressPercent}%` }"
        data-testid="progress-bar"
      />
    </div>
  </div>
</template>

<style scoped>
  .quiz-progress {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .quiz-progress__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .quiz-progress__text {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .quiz-progress__numbers {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .quiz-progress__track {
    height: 4px;
    background: var(--glass-border);
    border-radius: 2px;
    overflow: hidden;
  }

  .quiz-progress__fill {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: 2px;
    transition: width var(--transition);
  }
</style>
