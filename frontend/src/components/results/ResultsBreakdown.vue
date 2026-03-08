<script setup lang="ts">
  import { ref } from 'vue';
  import type { BreakdownItem } from '@/types/quiz';

  defineProps<{
    breakdown: readonly BreakdownItem[];
  }>();

  const expandedIds = ref<Set<string>>(new Set());

  function toggleExpand(questionId: string): void {
    const next = new Set(expandedIds.value);
    if (next.has(questionId)) {
      next.delete(questionId);
    } else {
      next.add(questionId);
    }
    expandedIds.value = next;
  }

  function getSelectedOptionText(item: BreakdownItem): string {
    return (
      item.question.options.find((o) => o.id === item.selectedId)?.text ?? ''
    );
  }

  function getCorrectOptionText(item: BreakdownItem): string {
    return item.question.options.find((o) => o.isCorrect)?.text ?? '';
  }
</script>

<template>
  <div class="results-breakdown">
    <h3 class="results-breakdown__title">Question Breakdown</h3>
    <ul class="results-breakdown__list" role="list">
      <li
        v-for="(item, index) in breakdown"
        :key="item.question.id"
        class="results-breakdown__item"
        :class="
          item.isCorrect
            ? 'results-breakdown__item--correct'
            : 'results-breakdown__item--incorrect'
        "
      >
        <div class="results-breakdown__item-header">
          <div class="results-breakdown__item-left">
            <span
              v-if="item.isCorrect"
              class="results-breakdown__indicator results-breakdown__indicator--correct"
              data-testid="result-correct"
              aria-label="Correct"
              >✓</span
            >
            <span
              v-else
              class="results-breakdown__indicator results-breakdown__indicator--incorrect"
              data-testid="result-incorrect"
              aria-label="Incorrect"
              >✗</span
            >
            <span class="results-breakdown__q-number">Q{{ index + 1 }}</span>
          </div>
          <p class="results-breakdown__prompt">
            {{
              item.question.prompt.length > 80
                ? item.question.prompt.slice(0, 80) + '…'
                : item.question.prompt
            }}
          </p>
          <button
            type="button"
            class="results-breakdown__expand-btn"
            :aria-expanded="expandedIds.has(item.question.id)"
            :aria-label="
              expandedIds.has(item.question.id)
                ? `Collapse question ${index + 1} explanation`
                : `Expand question ${index + 1} explanation`
            "
            @click="toggleExpand(item.question.id)"
          >
            {{ expandedIds.has(item.question.id) ? '▲' : '▼' }}
          </button>
        </div>

        <div v-if="!item.isCorrect" class="results-breakdown__answers">
          <div
            class="results-breakdown__answer results-breakdown__answer--selected"
          >
            <span class="results-breakdown__answer-label">Your answer:</span>
            <span class="results-breakdown__answer-text">{{
              getSelectedOptionText(item)
            }}</span>
          </div>
          <div
            class="results-breakdown__answer results-breakdown__answer--correct"
          >
            <span class="results-breakdown__answer-label">Correct answer:</span>
            <span class="results-breakdown__answer-text">{{
              getCorrectOptionText(item)
            }}</span>
          </div>
        </div>

        <div
          v-if="expandedIds.has(item.question.id)"
          class="results-breakdown__explanation"
        >
          <p>{{ item.question.explanation }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .results-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .results-breakdown__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .results-breakdown__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .results-breakdown__item {
    padding: var(--spacing-md);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
  }

  .results-breakdown__item--correct {
    border-left: 3px solid var(--color-accent);
  }

  .results-breakdown__item--incorrect {
    border-left: 3px solid var(--color-primary);
  }

  .results-breakdown__item-header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .results-breakdown__item-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-shrink: 0;
  }

  .results-breakdown__indicator {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .results-breakdown__indicator--correct {
    background: var(--color-accent);
    color: var(--color-bg);
  }

  .results-breakdown__indicator--incorrect {
    background: var(--color-primary);
    color: var(--color-bg);
  }

  .results-breakdown__q-number {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    font-weight: 600;
  }

  .results-breakdown__prompt {
    flex: 1;
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text);
    line-height: 1.4;
  }

  .results-breakdown__expand-btn {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0 var(--spacing-xs);
    min-height: 44px;
    min-width: 44px;
    font-size: 0.7rem;
    flex-shrink: 0;
  }

  .results-breakdown__answers {
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .results-breakdown__answer {
    display: flex;
    gap: var(--spacing-sm);
    font-size: 0.85rem;
  }

  .results-breakdown__answer-label {
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .results-breakdown__answer--selected .results-breakdown__answer-text {
    color: var(--color-primary);
  }

  .results-breakdown__answer--correct .results-breakdown__answer-text {
    color: var(--color-accent);
  }

  .results-breakdown__explanation {
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--glass-border);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  .results-breakdown__explanation p {
    margin: 0;
  }
</style>
