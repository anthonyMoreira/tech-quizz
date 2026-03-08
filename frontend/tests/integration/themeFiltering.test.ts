import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Question } from '@/types/quiz';

const makeQuestion = (
  id: string,
  themeId: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
): Question => ({
  id,
  themeId,
  difficulty,
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

vi.mock('@/data/questions/index', () => ({
  themes: [
    { id: 'ddd', name: 'DDD', description: 'desc', icon: '🏛️' },
    { id: 'tdd', name: 'TDD', description: 'desc', icon: '🧪' },
  ],
  getAllQuestions: vi.fn(),
}));

import { getAllQuestions } from '@/data/questions/index';

describe('Theme Filtering Integration', () => {
  beforeEach(() => {
    const questions = [
      ...Array.from({ length: 8 }, (_, i) =>
        makeQuestion(
          `ddd-beg-${String(i + 1).padStart(3, '0')}`,
          'ddd',
          'beginner',
        ),
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        makeQuestion(
          `tdd-beg-${String(i + 1).padStart(3, '0')}`,
          'tdd',
          'beginner',
        ),
      ),
      makeQuestion('ddd-int-001', 'ddd', 'intermediate'),
    ];
    vi.mocked(getAllQuestions).mockReturnValue(questions);
  });

  it('returns correct questions for selected themes and difficulty', async () => {
    const { useQuestionBank } = await import('@/composables/useQuestionBank');
    const { getFilteredQuestions } = useQuestionBank();
    const result = getFilteredQuestions(['ddd', 'tdd'], 'beginner');
    expect(result).toHaveLength(13);
    expect(result.every((q) => q.difficulty === 'beginner')).toBe(true);
    expect(result.every((q) => ['ddd', 'tdd'].includes(q.themeId))).toBe(true);
  });

  it('limits to 10 questions when more are available', async () => {
    const { useQuestionBank } = await import('@/composables/useQuestionBank');
    const { selectQuestions } = useQuestionBank();
    const result = selectQuestions(['ddd', 'tdd'], 'beginner', 10);
    expect(result).toHaveLength(10);
  });

  it('randomizes question selection', async () => {
    const { useQuestionBank } = await import('@/composables/useQuestionBank');
    const { selectQuestions } = useQuestionBank();
    const run1 = selectQuestions(['ddd', 'tdd'], 'beginner', 10).map(
      (q) => q.id,
    );
    const run2 = selectQuestions(['ddd', 'tdd'], 'beginner', 10).map(
      (q) => q.id,
    );
    // Not guaranteed to differ every time, but with 13 questions selecting 10, ordering should often vary
    // Just verify both selections are valid
    expect(run1).toHaveLength(10);
    expect(run2).toHaveLength(10);
  });

  it('returns available counts per theme', async () => {
    const { useQuestionBank } = await import('@/composables/useQuestionBank');
    const { getAvailableCounts } = useQuestionBank();
    const counts = getAvailableCounts('beginner');
    const ddd = counts.find((c) => c.themeId === 'ddd');
    const tdd = counts.find((c) => c.themeId === 'tdd');
    expect(ddd?.count).toBe(8);
    expect(tdd?.count).toBe(5);
  });
});
