import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeSelector from '@/components/quiz/ThemeSelector.vue';

vi.mock('@/composables/useQuestionBank', () => ({
  useQuestionBank: () => ({
    getAvailableCounts: vi.fn(() => [
      { themeId: 'ddd', count: 5 },
      { themeId: 'tdd', count: 0 },
    ]),
    selectQuestions: vi.fn(() => []),
    getFilteredQuestions: vi.fn(() => []),
    allQuestions: { value: [] },
  }),
}));

vi.mock('@/data/questions/index', () => ({
  themes: [
    { id: 'ddd', name: 'DDD', description: 'desc', icon: '🏛️' },
    { id: 'tdd', name: 'TDD', description: 'desc', icon: '🧪' },
  ],
  getAllQuestions: vi.fn(() => []),
}));

describe('ThemeSelector', () => {
  it('renders all themes', () => {
    const wrapper = mount(ThemeSelector, {
      props: { modelValue: [], difficulty: 'beginner' },
    });
    expect(wrapper.text()).toContain('DDD');
    expect(wrapper.text()).toContain('TDD');
  });

  it('toggles selection on click', async () => {
    const wrapper = mount(ThemeSelector, {
      props: { modelValue: [], difficulty: 'beginner' },
    });
    const dddCard = wrapper.findAll('button')[0];
    await dddCard?.trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([['ddd']]);
  });

  it('disables themes with 0 questions', () => {
    const wrapper = mount(ThemeSelector, {
      props: { modelValue: [], difficulty: 'beginner' },
    });
    const buttons = wrapper.findAll('button');
    const tddButton = buttons.find((b) => b.text().includes('TDD'));
    expect(tddButton?.attributes('disabled')).toBeDefined();
  });

  it('emits deselect when clicking already-selected theme', async () => {
    const wrapper = mount(ThemeSelector, {
      props: { modelValue: ['ddd'], difficulty: 'beginner' },
    });
    const dddCard = wrapper.findAll('button')[0];
    await dddCard?.trigger('click');
    const emitted = wrapper.emitted('update:modelValue')!;
    expect(emitted[0]).toEqual([[]]);
  });
});
