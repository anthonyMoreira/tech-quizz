import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Question } from '@/types/quiz';

const makeQuestion = (id: string): Question => ({
  id,
  themeId: 'ddd',
  difficulty: 'beginner',
  type: 'text',
  prompt: `Question ${id}`,
  codeSnippet: null,
  options: [
    { id: 'a', text: 'Correct', isCorrect: true },
    { id: 'b', text: 'Wrong B', isCorrect: false },
    { id: 'c', text: 'Wrong C', isCorrect: false },
    { id: 'd', text: 'Wrong D', isCorrect: false },
  ],
  explanation: 'Explanation here.',
  bonusFact: null,
});

vi.mock('@/composables/useQuestionBank', () => ({
  useQuestionBank: () => ({
    selectQuestions: vi.fn(() => [
      makeQuestion('q1'),
      makeQuestion('q2'),
      makeQuestion('q3'),
    ]),
    getFilteredQuestions: vi.fn(() => []),
    getAvailableCounts: vi.fn(() => []),
    allQuestions: { value: [] },
  }),
}));

vi.mock('@/data/questions/index', () => ({
  themes: [{ id: 'ddd', name: 'DDD', description: 'desc', icon: '🏛️' }],
  getAllQuestions: vi.fn(() => []),
}));

describe('Quiz Answer Flow Integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('starts quiz and tracks progress through all questions', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    expect(quiz.isActive.value).toBe(true);
    expect(quiz.currentIndex.value).toBe(0);
    expect(quiz.totalQuestions.value).toBe(3);

    // Answer Q1
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    expect(quiz.currentIndex.value).toBe(1);

    // Answer Q2
    quiz.submitAnswer('b'); // wrong
    quiz.nextQuestion();
    expect(quiz.currentIndex.value).toBe(2);

    // Answer Q3 (last)
    quiz.submitAnswer('a');
    expect(quiz.isComplete.value).toBe(true);
  });

  it('completes full quiz flow and returns valid result', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a');
    quiz.nextQuestion(); // correct
    quiz.submitAnswer('b');
    quiz.nextQuestion(); // wrong
    quiz.submitAnswer('a'); // correct

    const result = quiz.getResult();
    expect(result).not.toBeNull();
    expect(result?.totalQuestions).toBe(3);
    expect(result?.correctCount).toBe(2);
    expect(result?.scorePercent).toBe(67);
    expect(result?.breakdown).toHaveLength(3);
    expect(result?.difficulty).toBe('beginner');
  });

  it('prevents answering same question twice', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a');
    quiz.submitAnswer('b'); // should be ignored

    expect(quiz.session.value?.answers).toHaveLength(1);
    expect(quiz.session.value?.answers[0]?.selectedId).toBe('a');
  });
});
