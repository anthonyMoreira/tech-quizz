<script setup lang="ts">
  import AppLayout from '@/components/layout/AppLayout.vue';
  import AppSidebar from '@/components/layout/AppSidebar.vue';
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <AppSidebar />
    </template>
    <template #bottom-nav>
      <AppSidebar />
    </template>
    <RouterView />
  </AppLayout>
</template>

<style>
  /* Import CSS variables globally */
  @import './assets/styles/variables.css';

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
  }
</style>
