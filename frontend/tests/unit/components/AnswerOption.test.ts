import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AnswerOption from '@/components/quiz/AnswerOption.vue';

describe('AnswerOption', () => {
  it('renders option text', () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: false,
        isDisabled: false,
        state: 'neutral',
      },
    });
    expect(wrapper.text()).toContain('Test answer');
  });

  it('applies selected styling when isSelected is true', () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: true,
        isDisabled: false,
        state: 'neutral',
      },
    });
    expect(wrapper.classes()).toContain('answer-option--selected');
  });

  it('emits select event with optionId on click', async () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: false,
        isDisabled: false,
        state: 'neutral',
      },
    });
    await wrapper.trigger('click');
    const emitted = wrapper.emitted('select')!;
    expect(emitted[0]).toEqual(['a']);
  });

  it('does not emit select when disabled', async () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: false,
        isDisabled: true,
        state: 'neutral',
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('select')).toBeFalsy();
  });

  it('applies correct styling when state is correct', () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: true,
        isDisabled: true,
        state: 'correct',
      },
    });
    expect(wrapper.classes()).toContain('answer-option--correct');
  });

  it('applies incorrect styling when state is incorrect', () => {
    const wrapper = mount(AnswerOption, {
      props: {
        optionId: 'a',
        text: 'Test answer',
        isSelected: true,
        isDisabled: true,
        state: 'incorrect',
      },
    });
    expect(wrapper.classes()).toContain('answer-option--incorrect');
  });
});
