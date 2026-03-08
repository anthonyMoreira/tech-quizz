<script setup lang="ts">
  import '@/assets/styles/variables.css';
</script>

<template>
  <div class="app-layout">
    <aside class="app-layout__sidebar">
      <slot name="sidebar" />
    </aside>
    <main class="app-layout__main">
      <slot />
    </main>
    <nav class="app-layout__bottom-nav">
      <slot name="bottom-nav" />
    </nav>
  </div>
</template>

<style scoped>
  .app-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-family);
  }

  .app-layout__sidebar {
    display: none;
    width: var(--sidebar-width);
    flex-shrink: 0;
  }

  .app-layout__main {
    flex: 1;
    overflow-y: auto;
    padding-bottom: var(--bottom-nav-height);
  }

  .app-layout__bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottom-nav-height);
    z-index: var(--z-nav);
  }

  @media (min-width: 768px) {
    .app-layout__sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: var(--z-nav);
    }

    .app-layout__main {
      margin-left: var(--sidebar-width);
      padding-bottom: 0;
    }

    .app-layout__bottom-nav {
      display: none;
    }
  }
</style>
