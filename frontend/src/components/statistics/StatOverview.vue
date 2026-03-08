<script setup lang="ts">
  import { useQuizHistory } from '../../composables/useQuizHistory';
  import ThemeStatCard from './ThemeStatCard.vue';
  import { computed } from 'vue';

  const { themeStats, isLoading } = useQuizHistory();

  const sortedStats = computed(() => {
    return Object.values(themeStats.value).sort(
      (a, b) => b.totalAnswers - a.totalAnswers,
    );
  });
</script>

<template>
  <div class="stat-overview">
    <h2>Theme Performance</h2>
    <div v-if="isLoading" class="placeholder-text">Loading statistics...</div>
    <div v-else-if="sortedStats.length === 0" class="empty-state">
      <p>No quiz history available yet. Complete a quiz to see your stats!</p>
    </div>
    <div v-else class="overview-content">
      <ThemeStatCard
        v-for="stat in sortedStats"
        :key="stat.theme"
        :stat="stat"
      />
    </div>
  </div>
</template>

<style scoped>
  .stat-overview {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .placeholder-text,
  .empty-state {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }

  .overview-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
