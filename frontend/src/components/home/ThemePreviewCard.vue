<script setup lang="ts">
  import type { Theme } from '@/types/quiz';

  defineProps<{
    theme: Theme;
  }>();
</script>

<template>
  <router-link
    to="/quiz/setup"
    class="theme-card"
    :aria-label="`${theme.name} — ${theme.description}`"
  >
    <span class="theme-card__icon" aria-hidden="true">{{ theme.icon }}</span>
    <h3 class="theme-card__name">{{ theme.name }}</h3>
    <p class="theme-card__description">{{ theme.description }}</p>
  </router-link>
</template>

<style scoped>
  .theme-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    border-radius: var(--border-radius);
    color: var(--color-text);
    text-decoration: none;
    transition: all var(--transition);
    cursor: pointer;
    min-height: 140px;
  }

  .theme-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(78, 205, 196, 0.15);
  }

  .theme-card__icon {
    font-size: 2rem;
    line-height: 1;
  }

  .theme-card__name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .theme-card__description {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }
</style>
