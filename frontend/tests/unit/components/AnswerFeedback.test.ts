import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AnswerFeedback from '@/components/quiz/AnswerFeedback.vue';

describe('AnswerFeedback', () => {
  it('shows correct icon and text when answer is correct', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'This is why.',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    expect(wrapper.find('[data-testid="feedback-correct"]').exists()).toBe(
      true,
    );
    expect(wrapper.find('[data-testid="feedback-incorrect"]').exists()).toBe(
      false,
    );
  });

  it('shows incorrect icon and text when answer is wrong', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: false,
        explanation: 'This is why.',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    expect(wrapper.find('[data-testid="feedback-incorrect"]').exists()).toBe(
      true,
    );
    expect(wrapper.find('[data-testid="feedback-correct"]').exists()).toBe(
      false,
    );
  });

  it('displays explanation text', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'The explanation goes here.',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    expect(wrapper.text()).toContain('The explanation goes here.');
  });

  it('shows Next Question button when not last question', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'Explanation',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    expect(wrapper.find('[data-testid="next-btn"]').text()).toContain('Next');
  });

  it('shows See Results button on last question', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'Explanation',
        bonusFact: null,
        isLastQuestion: true,
      },
    });
    expect(wrapper.find('[data-testid="next-btn"]').text()).toContain(
      'Results',
    );
  });

  it('emits next event when button is clicked', async () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'Explanation',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    await wrapper.find('[data-testid="next-btn"]').trigger('click');
    expect(wrapper.emitted('next')).toBeTruthy();
  });

  it('displays bonus fact when provided', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'Explanation',
        bonusFact: 'Did you know this interesting fact?',
        isLastQuestion: false,
      },
    });
    expect(wrapper.find('[data-testid="bonus-fact"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Did you know this interesting fact?');
  });

  it('does not show bonus fact section when null', () => {
    const wrapper = mount(AnswerFeedback, {
      props: {
        isCorrect: true,
        explanation: 'Explanation',
        bonusFact: null,
        isLastQuestion: false,
      },
    });
    expect(wrapper.find('[data-testid="bonus-fact"]').exists()).toBe(false);
  });
});
