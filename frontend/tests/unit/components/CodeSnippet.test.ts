import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeSnippet from '@/components/quiz/CodeSnippet.vue';

// Mock prismjs to avoid DOM dependencies in tests
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

describe('CodeSnippet', () => {
  it('renders code text', () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'javascript',
        code: 'const x = 1;',
      },
    });
    expect(wrapper.text()).toContain('const x = 1;');
  });

  it('applies correct language class', () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'typescript',
        code: 'const x: number = 1;',
      },
    });
    const codeEl = wrapper.find('code');
    expect(codeEl.exists()).toBe(true);
    expect(codeEl.classes()).toContain('language-typescript');
  });

  it('renders inside a pre element for scrollable container', () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'javascript',
        code: 'console.log("hello");',
      },
    });
    expect(wrapper.find('pre').exists()).toBe(true);
  });

  it('does not break layout with long code lines', () => {
    const longLine = 'const x = '.repeat(20) + '1;';
    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'javascript',
        code: longLine,
      },
    });
    expect(wrapper.find('pre').exists()).toBe(true);
    expect(wrapper.text()).toContain('const x =');
  });

  it('calls highlightElement again when code prop changes', async () => {
    const Prism = await import('prismjs');
    vi.mocked(Prism.default.highlightElement).mockClear();

    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'javascript',
        code: 'const x = 1;',
      },
    });

    // highlightElement called once on mount
    expect(Prism.default.highlightElement).toHaveBeenCalledTimes(1);

    // Update the code prop to trigger the watcher
    await wrapper.setProps({ code: 'const y = 2;' });

    expect(Prism.default.highlightElement).toHaveBeenCalledTimes(2);
  });

  it('displays the language label in the header', () => {
    const wrapper = mount(CodeSnippet, {
      props: {
        language: 'python',
        code: 'print("hello")',
      },
    });
    expect(wrapper.find('.code-snippet__lang').text()).toBe('python');
  });
});
