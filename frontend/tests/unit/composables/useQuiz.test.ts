import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Question } from '@/types/quiz';

const mockSelectQuestions = vi.fn();

vi.mock('@/composables/useQuestionBank', () => ({
  useQuestionBank: () => ({
    selectQuestions: mockSelectQuestions,
    getFilteredQuestions: vi.fn(() => []),
    getAvailableCounts: vi.fn(() => []),
    allQuestions: { value: [] },
  }),
}));

vi.mock('@/data/questions/index', () => ({
  themes: [
    {
      id: 'ddd',
      name: 'Domain-Driven Design',
      description: 'desc',
      icon: '🏛️',
    },
  ],
  getAllQuestions: vi.fn(() => []),
}));

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
  explanation: 'Explanation',
  bonusFact: null,
});

describe('useQuiz', () => {
  beforeEach(() => {
    vi.resetModules();
    mockSelectQuestions.mockReturnValue([
      makeQuestion('q1'),
      makeQuestion('q2'),
      makeQuestion('q3'),
    ]);
  });

  it('starts quiz with selected themes and difficulty', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    quiz.startQuiz(['ddd'], 'beginner');

    expect(quiz.isActive.value).toBe(true);
    expect(quiz.isComplete.value).toBe(false);
    expect(quiz.totalQuestions.value).toBe(3);
    expect(quiz.currentIndex.value).toBe(0);
  });

  it('tracks current question index correctly', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    expect(quiz.currentIndex.value).toBe(0);
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    expect(quiz.currentIndex.value).toBe(1);
  });

  it('records answer correctly', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a'); // correct answer

    const session = quiz.session.value;
    expect(session?.answers).toHaveLength(1);
    expect(session?.answers[0]?.isCorrect).toBe(true);
    expect(session?.answers[0]?.selectedId).toBe('a');
  });

  it('prevents double submission (idempotent)', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a');
    quiz.submitAnswer('b'); // second submission for same question

    expect(quiz.session.value?.answers).toHaveLength(1);
    expect(quiz.session.value?.answers[0]?.selectedId).toBe('a');
  });

  it('marks quiz complete after last question', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a'); // q1
    quiz.nextQuestion();
    quiz.submitAnswer('b'); // q2 wrong
    quiz.nextQuestion();
    quiz.submitAnswer('a'); // q3

    expect(quiz.isComplete.value).toBe(true);
    expect(quiz.isActive.value).toBe(false);
  });

  it('computes QuizResult with accurate score', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a'); // correct
    quiz.nextQuestion();
    quiz.submitAnswer('b'); // wrong
    quiz.nextQuestion();
    quiz.submitAnswer('a'); // correct

    const result = quiz.getResult();
    expect(result).not.toBeNull();
    expect(result?.totalQuestions).toBe(3);
    expect(result?.correctCount).toBe(2);
    expect(result?.scorePercent).toBe(67);
  });

  it('resets state correctly', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.startQuiz(['ddd'], 'beginner');
    quiz.resetQuiz();

    expect(quiz.isActive.value).toBe(false);
    expect(quiz.isComplete.value).toBe(false);
    expect(quiz.session.value).toBeNull();
  });

  it('returns null for getResult when quiz not complete', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    expect(quiz.getResult()).toBeNull();
  });

  it('submitAnswer does nothing when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    // session is null, submitAnswer should silently return
    quiz.submitAnswer('a');

    expect(quiz.session.value).toBeNull();
  });

  it('submitAnswer does nothing when quiz is already complete', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    // Complete the quiz
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('b');
    quiz.nextQuestion();
    quiz.submitAnswer('a');

    expect(quiz.isComplete.value).toBe(true);

    // Try to submit another answer after completion
    const answerCountBefore = quiz.session.value?.answers.length;
    quiz.submitAnswer('c');
    expect(quiz.session.value?.answers.length).toBe(answerCountBefore);
  });

  it('nextQuestion does nothing when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    // session is null, nextQuestion should silently return
    quiz.nextQuestion();

    expect(quiz.session.value).toBeNull();
  });

  it('nextQuestion does not advance past the last question', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    // Navigate to the last question (index 2 out of 3 questions)
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('b');
    quiz.nextQuestion();

    expect(quiz.currentIndex.value).toBe(2);

    // Try to go past the last question
    quiz.nextQuestion();
    expect(quiz.currentIndex.value).toBe(2);
  });

  it('getResult returns null when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    expect(quiz.getResult()).toBeNull();
  });

  it('currentQuestion returns null when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    expect(quiz.currentQuestion.value).toBeNull();
  });

  it('currentIndex returns 0 when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    expect(quiz.currentIndex.value).toBe(0);
  });

  it('totalQuestions returns 0 when session is null', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    expect(quiz.totalQuestions.value).toBe(0);
  });

  it('records an incorrect answer when a wrong option is selected', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('b'); // wrong answer

    const session = quiz.session.value;
    expect(session?.answers).toHaveLength(1);
    expect(session?.answers[0]?.isCorrect).toBe(false);
  });

  it('getResult resolves theme names from theme ids', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();
    quiz.startQuiz(['ddd'], 'beginner');

    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('a');

    const result = quiz.getResult();
    expect(result?.themes).toContain('Domain-Driven Design');
  });

  it('getResult falls back to theme id when name not found', async () => {
    const { useQuiz } = await import('@/composables/useQuiz');
    const quiz = useQuiz();
    quiz.resetQuiz();

    // Use a theme id that doesn't exist in the mocked themes array
    mockSelectQuestions.mockReturnValue([
      makeQuestion('q1'),
      makeQuestion('q2'),
      makeQuestion('q3'),
    ]);
    quiz.startQuiz(['unknown-theme'], 'beginner');

    // Manually set selectedThemes to the unknown theme
    quiz.session.value!.selectedThemes = ['unknown-theme'];

    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('a');
    quiz.nextQuestion();
    quiz.submitAnswer('a');

    const result = quiz.getResult();
    expect(result?.themes).toContain('unknown-theme');
  });
});
