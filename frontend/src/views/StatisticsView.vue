<script setup lang="ts">
  import StatOverview from '../components/statistics/StatOverview.vue';
</script>

<template>
  <main class="statistics-view">
    <div class="container">
      <h1>Performance Statistics</h1>
      <p class="description">
        Track your historical quiz performance by theme and identify areas for
        improvement.
      </p>

      <StatOverview />
    </div>
  </main>
</template>

<style scoped>
  .statistics-view {
    padding: 2rem;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .description {
    color: #666;
    margin-bottom: 2rem;
  }
</style>
