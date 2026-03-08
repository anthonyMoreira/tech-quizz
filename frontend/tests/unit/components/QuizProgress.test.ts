import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QuizProgress from '@/components/quiz/QuizProgress.vue';

describe('QuizProgress', () => {
  it('displays current question number and total', () => {
    const wrapper = mount(QuizProgress, {
      props: { current: 3, total: 10 },
    });
    expect(wrapper.text()).toContain('3');
    expect(wrapper.text()).toContain('10');
  });

  it('renders a progress bar element', () => {
    const wrapper = mount(QuizProgress, {
      props: { current: 5, total: 10 },
    });
    expect(wrapper.find('[data-testid="progress-bar"]').exists()).toBe(true);
  });

  it('updates displayed numbers when props change', async () => {
    const wrapper = mount(QuizProgress, {
      props: { current: 1, total: 10 },
    });
    expect(wrapper.text()).toContain('1');
    await wrapper.setProps({ current: 5 });
    expect(wrapper.text()).toContain('5');
  });
});
