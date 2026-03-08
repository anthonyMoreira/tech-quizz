import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ResultsBreakdown from '@/components/results/ResultsBreakdown.vue';
import type { BreakdownItem, Question } from '@/types/quiz';

const makeQuestion = (id: string): Question => ({
  id,
  themeId: 'ddd',
  difficulty: 'beginner',
  type: 'text',
  prompt: `Question ${id} prompt text`,
  codeSnippet: null,
  options: [
    { id: 'a', text: 'Correct answer', isCorrect: true },
    { id: 'b', text: 'Wrong B', isCorrect: false },
    { id: 'c', text: 'Wrong C', isCorrect: false },
    { id: 'd', text: 'Wrong D', isCorrect: false },
  ],
  explanation: 'Explanation text',
  bonusFact: null,
});

const breakdown: BreakdownItem[] = [
  { question: makeQuestion('q1'), selectedId: 'a', isCorrect: true },
  { question: makeQuestion('q2'), selectedId: 'b', isCorrect: false },
];

describe('ResultsBreakdown', () => {
  it('lists all questions', () => {
    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown },
    });
    expect(wrapper.text()).toContain('q1 prompt text');
    expect(wrapper.text()).toContain('q2 prompt text');
  });

  it('shows correct indicator for correct answers', () => {
    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown },
    });
    const correctItems = wrapper.findAll('[data-testid="result-correct"]');
    expect(correctItems).toHaveLength(1);
  });

  it('shows incorrect indicator for wrong answers', () => {
    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown },
    });
    const incorrectItems = wrapper.findAll('[data-testid="result-incorrect"]');
    expect(incorrectItems).toHaveLength(1);
  });

  it('shows user answer text for wrong answers', () => {
    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown },
    });
    // For wrong answer (q2, selected 'b' = 'Wrong B'), should show what user selected
    expect(wrapper.text()).toContain('Wrong B');
  });

  it('toggles expand to show explanation then collapses on second click', async () => {
    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown },
    });

    const expandBtns = wrapper.findAll('.results-breakdown__expand-btn');
    const firstBtn = expandBtns[0]!;

    // Initially no explanation is visible
    expect(wrapper.find('.results-breakdown__explanation').exists()).toBe(
      false,
    );
    expect(firstBtn.attributes('aria-expanded')).toBe('false');

    // Click to expand
    await firstBtn.trigger('click');
    expect(wrapper.find('.results-breakdown__explanation').exists()).toBe(true);
    expect(wrapper.find('.results-breakdown__explanation').text()).toContain(
      'Explanation text',
    );
    expect(firstBtn.attributes('aria-expanded')).toBe('true');

    // Click again to collapse
    await firstBtn.trigger('click');
    expect(wrapper.find('.results-breakdown__explanation').exists()).toBe(
      false,
    );
    expect(firstBtn.attributes('aria-expanded')).toBe('false');
  });

  it('displays full prompt without truncation when 80 chars or less', () => {
    const shortPrompt = 'Short question?';
    const shortBreakdown: BreakdownItem[] = [
      {
        question: {
          ...makeQuestion('q-short'),
          prompt: shortPrompt,
        },
        selectedId: 'a',
        isCorrect: true,
      },
    ];

    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown: shortBreakdown },
    });

    const promptEl = wrapper.find('.results-breakdown__prompt');
    expect(promptEl.text()).toBe(shortPrompt);
    expect(promptEl.text()).not.toContain('…');
  });

  it('truncates prompt text longer than 80 characters', () => {
    const longPrompt = 'A'.repeat(100);
    const longBreakdown: BreakdownItem[] = [
      {
        question: {
          ...makeQuestion('q-long'),
          prompt: longPrompt,
        },
        selectedId: 'a',
        isCorrect: true,
      },
    ];

    const wrapper = mount(ResultsBreakdown, {
      props: { breakdown: longBreakdown },
    });

    const promptEl = wrapper.find('.results-breakdown__prompt');
    expect(promptEl.text()).toContain('…');
    expect(promptEl.text().length).toBeLessThan(longPrompt.length);
  });
});
