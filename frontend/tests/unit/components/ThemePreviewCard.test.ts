import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHashHistory } from 'vue-router';
import ThemePreviewCard from '@/components/home/ThemePreviewCard.vue';
import type { Theme } from '@/types/quiz';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }],
});

const theme: Theme = {
  id: 'ddd',
  name: 'Domain-Driven Design',
  description: 'Tackle complexity through domain modeling',
  icon: '🏛️',
};

describe('ThemePreviewCard', () => {
  it('renders theme name', async () => {
    const wrapper = mount(ThemePreviewCard, {
      props: { theme },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('Domain-Driven Design');
  });

  it('renders theme description', async () => {
    const wrapper = mount(ThemePreviewCard, {
      props: { theme },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain(
      'Tackle complexity through domain modeling',
    );
  });

  it('renders theme icon', async () => {
    const wrapper = mount(ThemePreviewCard, {
      props: { theme },
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('🏛️');
  });

  it('links to quiz setup', async () => {
    const wrapper = mount(ThemePreviewCard, {
      props: { theme },
      global: { plugins: [router] },
    });
    const link = wrapper.find('a');
    expect(link.attributes('href')).toContain('/quiz/setup');
  });
});
