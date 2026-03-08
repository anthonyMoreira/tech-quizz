<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', to: '/', disabled: false },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: '📝',
      to: '/quiz/setup',
      disabled: false,
    },
    {
      id: 'themes',
      label: 'Themes',
      icon: '🎨',
      to: '/themes',
      disabled: true,
    },
    {
      id: 'history',
      label: 'History',
      icon: '📊',
      to: '/history',
      disabled: true,
    },
  ] as const;

  const isActive = computed(() => (to: string) => {
    if (to === '/') return route.path === '/';
    return route.path.startsWith(to);
  });
</script>

<template>
  <nav class="app-sidebar" aria-label="Main navigation">
    <ul class="app-sidebar__list" role="list">
      <li
        v-for="item in navItems"
        :key="item.id"
        class="app-sidebar__item"
        :class="{ 'app-sidebar__item--disabled': item.disabled }"
      >
        <router-link
          v-if="!item.disabled"
          :to="item.to"
          class="app-sidebar__link"
          :class="{ 'app-sidebar__link--active': isActive(item.to) }"
          :aria-label="item.label"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span class="app-sidebar__icon" aria-hidden="true">{{
            item.icon
          }}</span>
          <span class="app-sidebar__label">{{ item.label }}</span>
        </router-link>
        <button
          v-else
          class="app-sidebar__link app-sidebar__link--disabled"
          :aria-label="`${item.label} (Coming soon)`"
          :title="`${item.label} — Coming soon`"
          disabled
          type="button"
        >
          <span class="app-sidebar__icon" aria-hidden="true">{{
            item.icon
          }}</span>
          <span class="app-sidebar__label">{{ item.label }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .app-sidebar {
    width: 100%;
    height: 100%;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-md) 0;
  }

  .app-sidebar__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }

  .app-sidebar__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    min-height: 56px;
    width: 100%;
    color: var(--color-text-muted);
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
    font-size: 0.75rem;
  }

  .app-sidebar__link:hover:not(.app-sidebar__link--disabled) {
    color: var(--color-text);
    background-color: var(--glass-bg);
  }

  .app-sidebar__link--active {
    color: var(--color-accent) !important;
    background-color: rgba(78, 205, 196, 0.1) !important;
  }

  .app-sidebar__link--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .app-sidebar__icon {
    font-size: 1.25rem;
  }

  .app-sidebar__label {
    font-size: 0.65rem;
    letter-spacing: 0.02em;
  }

  /* Mobile: horizontal bottom bar */
  @media (max-width: 767px) {
    .app-sidebar {
      flex-direction: row;
      padding: 0;
      border-right: none;
      border-top: 1px solid var(--color-border);
      height: var(--bottom-nav-height);
    }

    .app-sidebar__list {
      flex-direction: row;
      height: 100%;
      align-items: stretch;
    }

    .app-sidebar__item {
      flex: 1;
    }

    .app-sidebar__link {
      height: 100%;
      min-height: 44px;
    }
  }
</style>
