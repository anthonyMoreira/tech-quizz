import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuizQuestion from '@/components/quiz/QuizQuestion.vue';
import type { Question } from '@/types/quiz';

// Mock prismjs for CodeSnippet rendering
vi.mock('prismjs', () => ({
  default: {
    highlightElement: vi.fn(),
  },
  highlightElement: vi.fn(),
}));
vi.mock('prismjs/themes/prism-tomorrow.css', () => ({}));
vi.mock('prismjs/components/prism-javascript', () => ({}));
vi.mock('prismjs/components/prism-typescript', () => ({}));
vi.mock('prismjs/components/prism-java', () => ({}));
vi.mock('prismjs/components/prism-python', () => ({}));
vi.mock('prismjs/components/prism-csharp', () => ({}));
vi.mock('prismjs/components/prism-sql', () => ({}));

const mockQuestion: Question = {
  id: 'test-001',
  themeId: 'ddd',
  difficulty: 'beginner',
  type: 'text',
  prompt: 'What is a Bounded Context?',
  codeSnippet: null,
  options: [
    { id: 'a', text: 'Correct answer', isCorrect: true },
    { id: 'b', text: 'Wrong B', isCorrect: false },
    { id: 'c', text: 'Wrong C', isCorrect: false },
    { id: 'd', text: 'Wrong D', isCorrect: false },
  ],
  explanation: 'This is the explanation.',
  bonusFact: null,
};

describe('QuizQuestion', () => {
  it('renders question prompt text', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    expect(wrapper.text()).toContain('What is a Bounded Context?');
  });

  it('renders 4 answer options', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    const options = wrapper.findAll('[data-testid="answer-option"]');
    expect(options).toHaveLength(4);
  });

  it('does not show feedback before answer is confirmed', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    expect(wrapper.find('[data-testid="answer-feedback"]').exists()).toBe(
      false,
    );
  });

  it('confirm button is disabled until an option is selected', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    const confirmBtn = wrapper.find('[data-testid="confirm-btn"]');
    expect(confirmBtn.attributes('disabled')).toBeDefined();
  });

  it('confirm button enables after selecting an option', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    const confirmBtn = wrapper.find('[data-testid="confirm-btn"]');
    expect(confirmBtn.attributes('disabled')).toBeUndefined();
  });

  it('shows feedback after confirm is clicked', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');
    expect(wrapper.find('[data-testid="answer-feedback"]').exists()).toBe(true);
  });

  it('emits answer-submitted event when confirmed', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');
    expect(wrapper.emitted('answer-submitted')).toBeTruthy();
    const emitted = wrapper.emitted('answer-submitted')!;
    expect(emitted[0]).toEqual(['a']);
  });

  it('renders CodeSnippet for code-snippet type questions', () => {
    const codeQuestion: Question = {
      id: 'code-001',
      themeId: 'ddd',
      difficulty: 'intermediate',
      type: 'code-snippet',
      prompt: 'What does this code output?',
      codeSnippet: {
        language: 'typescript',
        code: 'console.log("hello");',
      },
      options: [
        { id: 'a', text: 'hello', isCorrect: true },
        { id: 'b', text: 'undefined', isCorrect: false },
        { id: 'c', text: 'error', isCorrect: false },
        { id: 'd', text: 'null', isCorrect: false },
      ],
      explanation: 'It logs hello.',
      bonusFact: null,
    };

    const wrapper = mount(QuizQuestion, {
      props: { question: codeQuestion },
    });

    expect(wrapper.find('.code-snippet').exists()).toBe(true);
    expect(wrapper.text()).toContain('console.log("hello")');
  });

  it('does not render CodeSnippet for text type questions', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });

    expect(wrapper.find('.code-snippet').exists()).toBe(false);
  });

  it('shows "See Results" text when isLastQuestion is true', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion, isLastQuestion: true },
    });

    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');

    expect(wrapper.find('[data-testid="answer-feedback"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('See Results');
  });

  it('shows "Next Question" text when isLastQuestion is false', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion, isLastQuestion: false },
    });

    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');

    expect(wrapper.text()).toContain('Next Question');
  });

  it('getOptionState returns neutral when answer is not yet confirmed', () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });

    // Before confirming, all options should have neutral state (no correct/incorrect classes)
    const options = wrapper.findAll('[data-testid="answer-option"]');
    for (const option of options) {
      expect(option.classes()).not.toContain('answer-option--correct');
      expect(option.classes()).not.toContain('answer-option--incorrect');
    }
  });

  it('does not change selection when clicking option after confirmation', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });

    // Select first option and confirm
    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');

    // After confirmation, the emitted event should have 'a'
    expect(wrapper.emitted('answer-submitted')![0]).toEqual(['a']);

    // Try clicking a different option after confirmation
    await wrapper.findAll('[data-testid="answer-option"]')[1]?.trigger('click');

    // Should still only have one answer-submitted event (no new submission)
    expect(wrapper.emitted('answer-submitted')).toHaveLength(1);
  });

  it('emits next event when the next button is clicked', async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });

    await wrapper.findAll('[data-testid="answer-option"]')[0]?.trigger('click');
    await wrapper.find('[data-testid="confirm-btn"]').trigger('click');
    await wrapper.find('[data-testid="next-btn"]').trigger('click');

    expect(wrapper.emitted('next')).toBeTruthy();
    expect(wrapper.emitted('next')).toHaveLength(1);
  });
});
