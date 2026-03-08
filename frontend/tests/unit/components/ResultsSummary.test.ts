import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import ResultsSummary from '@/components/results/ResultsSummary.vue';
import type { QuizResult } from '@/types/quiz';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }],
});

const mockResult: QuizResult = {
  totalQuestions: 10,
  correctCount: 7,
  scorePercent: 70,
  breakdown: [],
  themes: ['Domain-Driven Design', 'TDD'],
  difficulty: 'beginner',
};

describe('ResultsSummary', () => {
  it('displays score fraction', async () => {
    const wrapper = mount(ResultsSummary, {
      props: { result: mockResult },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('7');
    expect(wrapper.text()).toContain('10');
  });

  it('displays score percentage', async () => {
    const wrapper = mount(ResultsSummary, {
      props: { result: mockResult },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('70');
  });

  it('shows theme names', async () => {
    const wrapper = mount(ResultsSummary, {
      props: { result: mockResult },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('Domain-Driven Design');
  });

  it('shows difficulty level', async () => {
    const wrapper = mount(ResultsSummary, {
      props: { result: mockResult },
      global: { plugins: [router] },
    });
    expect(wrapper.text().toLowerCase()).toContain('beginner');
  });

  it('has a New Quiz button', async () => {
    const wrapper = mount(ResultsSummary, {
      props: { result: mockResult },
      global: { plugins: [router] },
    });
    const button = wrapper.find('a, button');
    expect(button.exists()).toBe(true);
    expect(button.text().toLowerCase()).toContain('quiz');
  });
});
