import { createRouter, createWebHistory } from 'vue-router';
import { setupGuards } from './guards';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/quiz/setup',
      name: 'quiz-setup',
      component: () => import('@/views/QuizSetupView.vue'),
    },
    {
      path: '/quiz/play',
      name: 'quiz-play',
      component: () => import('@/views/QuizPlayView.vue'),
    },
    {
      path: '/quiz/results',
      name: 'quiz-results',
      component: () => import('@/views/QuizResultsView.vue'),
    },
    {
      path: '/themes',
      redirect: '/',
    },
    {
      path: '/history',
      redirect: '/',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

setupGuards(router);

export default router;
