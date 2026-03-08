<script setup lang="ts">
  import ThemePreviewCard from '@/components/home/ThemePreviewCard.vue';
  import { themes } from '@/data/questions/index';
</script>

<template>
  <div class="home-view">
    <section class="home-view__hero">
      <h1 class="home-view__title">Tech Quiz App</h1>
      <p class="home-view__subtitle">
        Test your knowledge of software engineering best practices
      </p>
      <router-link :to="{ name: 'quiz-setup' }" class="home-view__cta">
        Start Quiz
      </router-link>
    </section>

    <section class="home-view__themes">
      <h2 class="home-view__section-title">Available Themes</h2>
      <div class="home-view__themes-grid">
        <ThemePreviewCard
          v-for="theme in themes"
          :key="theme.id"
          :theme="theme"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
  .home-view {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .home-view__hero {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-2xl);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-lg);
    backdrop-filter: var(--glass-blur);
  }

  .home-view__title {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .home-view__subtitle {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-text-muted);
  }

  .home-view__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) var(--spacing-xl);
    min-height: 44px;
    background: var(--gradient-primary);
    color: var(--color-text);
    text-decoration: none;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: 1rem;
    transition: all var(--transition-fast);
  }

  .home-view__cta:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  }

  .home-view__themes {
    /* themes section */
  }

  .home-view__section-title {
    margin: 0 0 var(--spacing-lg);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .home-view__themes-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
  }

  @media (max-width: 1024px) {
    .home-view__themes-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 767px) {
    .home-view {
      padding: var(--spacing-md);
    }

    .home-view__title {
      font-size: 1.75rem;
    }

    .home-view__themes-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
