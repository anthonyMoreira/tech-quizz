<script setup lang="ts">
  import type { ThemePerformanceStatistic } from '../../types/history';
  import { computed } from 'vue';

  const props = defineProps<{
    stat: ThemePerformanceStatistic;
  }>();

  const formattedRate = computed(() => {
    return `${Math.round(props.stat.correctnessRate * 100).toString()}%`;
  });
</script>

<template>
  <div class="theme-stat-card">
    <div class="theme-info">
      <h3>{{ stat.theme }}</h3>
      <span class="attempt-count">{{ stat.totalAnswers }} answers</span>
    </div>
    <div v-if="stat.totalAnswers === 0" class="score-display score-none">
      <span class="rate">N/A</span>
      <span class="label">No History</span>
    </div>
    <div
      v-else
      class="score-display"
      :class="{
        'score-high': stat.correctnessRate >= 0.8,
        'score-medium':
          stat.correctnessRate >= 0.5 && stat.correctnessRate < 0.8,
        'score-low': stat.correctnessRate < 0.5,
      }"
    >
      <span class="rate">{{ formattedRate }}</span>
      <span class="label">Correct</span>
    </div>
  </div>
</template>

<style scoped>
  .theme-stat-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: white;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .theme-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    text-transform: capitalize;
  }

  .attempt-count {
    font-size: 0.85rem;
    color: #666;
  }

  .score-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 80px;
  }

  .rate {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .score-high {
    color: #10b981; /* Green */
  }

  .score-medium {
    color: #f59e0b; /* Yellow */
  }

  .score-low {
    color: #ef4444; /* Red */
  }

  .score-none {
    color: #9ca3af; /* Gray */
  }
</style>
