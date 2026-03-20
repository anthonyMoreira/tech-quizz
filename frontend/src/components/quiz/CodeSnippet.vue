<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism-tomorrow.css';
  // Import common language grammars
  import 'prismjs/components/prism-javascript';
  import 'prismjs/components/prism-typescript';
  import 'prismjs/components/prism-java';
  import 'prismjs/components/prism-python';
  import 'prismjs/components/prism-csharp';
  import 'prismjs/components/prism-sql';

  const props = defineProps<{
    language: string;
    code: string;
  }>();

  const codeRef = ref<HTMLElement | null>(null);

  function highlight(): void {
    if (codeRef.value) {
      Prism.highlightElement(codeRef.value);
    }
  }

  onMounted(() => {
    highlight();
  });

  watch(
    () => props.code,
    () => {
      highlight();
    },
  );
</script>

<template>
  <div class="code-snippet">
    <div class="code-snippet__header">
      <span class="code-snippet__lang">{{ language }}</span>
    </div>
    <pre class="code-snippet__pre"><code
      ref="codeRef"
      :class="`language-${language}`"
      class="code-snippet__code"
    >{{ code }}</code></pre>
  </div>
</template>

<style scoped>
  .code-snippet {
    border-radius: var(--border-radius-sm);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background-color: var(--color-code-bg);
  }

  .code-snippet__header {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-md);
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid var(--color-border);
  }

  .code-snippet__lang {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    text-transform: lowercase;
  }

  .code-snippet__pre {
    margin: 0;
    padding: var(--spacing-md);
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;
    background-color: var(--color-code-bg) !important;
    border-radius: 0;
  }

  .code-snippet__code {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    white-space: pre;
    background: transparent !important;
  }
</style>
