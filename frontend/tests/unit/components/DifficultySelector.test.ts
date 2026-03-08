import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DifficultySelector from '@/components/quiz/DifficultySelector.vue';

describe('DifficultySelector', () => {
  it('renders 3 difficulty options', () => {
    const wrapper = mount(DifficultySelector, {
      props: { modelValue: 'beginner' },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('highlights the selected difficulty', () => {
    const wrapper = mount(DifficultySelector, {
      props: { modelValue: 'intermediate' },
    });
    const activeButton = wrapper.find('.difficulty-selector__btn--active');
    expect(activeButton.text().toLowerCase()).toContain('intermediate');
  });

  it('emits difficulty value on click', async () => {
    const wrapper = mount(DifficultySelector, {
      props: { modelValue: 'beginner' },
    });
    const buttons = wrapper.findAll('button');
    await buttons[1]?.trigger('click'); // intermediate
    const emitted = wrapper.emitted('update:modelValue')!;
    expect(emitted[0]).toEqual(['intermediate']);
  });

  it('defaults to showing beginner selected', () => {
    const wrapper = mount(DifficultySelector, {
      props: { modelValue: 'beginner' },
    });
    const activeButton = wrapper.find('.difficulty-selector__btn--active');
    expect(activeButton.text().toLowerCase()).toContain('beginner');
  });
});
