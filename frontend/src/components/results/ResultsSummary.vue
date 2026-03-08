<script setup lang="ts">
  import type { QuizResult } from '@/types/quiz';

  defineProps<{
    result: QuizResult;
  }>();
</script>

<template>
  <div class="results-summary">
    <div class="results-summary__score-card">
      <div class="results-summary__score">
        <span class="results-summary__score-fraction">
          <span class="results-summary__score-correct">{{
            result.correctCount
          }}</span>
          <span class="results-summary__score-divider">/</span>
          <span class="results-summary__score-total">{{
            result.totalQuestions
          }}</span>
        </span>
        <span class="results-summary__score-pct"
          >{{ result.scorePercent }}%</span
        >
      </div>

      <div class="results-summary__meta">
        <div class="results-summary__meta-item">
          <span class="results-summary__meta-label">Difficulty</span>
          <span class="results-summary__meta-value results-summary__difficulty">
            {{ result.difficulty }}
          </span>
        </div>
        <div class="results-summary__meta-item">
          <span class="results-summary__meta-label">Themes</span>
          <div class="results-summary__themes">
            <span
              v-for="theme in result.themes"
              :key="theme"
              class="results-summary__theme-tag"
              >{{ theme }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <router-link to="/quiz/setup" class="results-summary__new-quiz-btn">
      New Quiz
    </router-link>
  </div>
</template>

<style scoped>
  .results-summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .results-summary__score-card {
    padding: var(--spacing-xl);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .results-summary__score {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-lg);
  }

  .results-summary__score-fraction {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .results-summary__score-divider {
    font-size: 2.5rem;
    opacity: 0.6;
  }

  .results-summary__score-pct {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .results-summary__meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .results-summary__meta-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .results-summary__meta-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
  }

  .results-summary__meta-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .results-summary__difficulty {
    text-transform: capitalize;
  }

  .results-summary__themes {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .results-summary__theme-tag {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: rgba(78, 205, 196, 0.1);
    border: 1px solid rgba(78, 205, 196, 0.3);
    border-radius: var(--border-radius-sm);
    font-size: 0.8rem;
    color: var(--color-accent);
  }

  .results-summary__new-quiz-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) var(--spacing-xl);
    min-height: 44px;
    background: var(--gradient-primary);
    color: var(--color-text);
    text-decoration: none;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: 1rem;
    transition: all var(--transition-fast);
    align-self: flex-start;
  }

  .results-summary__new-quiz-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
</style>
