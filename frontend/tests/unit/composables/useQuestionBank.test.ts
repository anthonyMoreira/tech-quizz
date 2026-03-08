import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuestionBank } from '@/composables/useQuestionBank';
import type { Question } from '@/types/quiz';

// Mock the question data
vi.mock('@/data/questions/index', () => ({
  themes: [
    { id: 'ddd', name: 'DDD', description: 'desc', icon: '🏛️' },
    { id: 'tdd', name: 'TDD', description: 'desc', icon: '🧪' },
  ],
  getAllQuestions: vi.fn(),
}));

import { getAllQuestions } from '@/data/questions/index';

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
    { id: 'a', text: 'Answer A', isCorrect: true },
    { id: 'b', text: 'Answer B', isCorrect: false },
    { id: 'c', text: 'Answer C', isCorrect: false },
    { id: 'd', text: 'Answer D', isCorrect: false },
  ],
  explanation: 'Explanation',
  bonusFact: null,
});

describe('useQuestionBank', () => {
  beforeEach(() => {
    vi.mocked(getAllQuestions).mockReturnValue([
      makeQuestion('ddd-beg-001', 'ddd', 'beginner'),
      makeQuestion('ddd-beg-002', 'ddd', 'beginner'),
      makeQuestion('ddd-int-001', 'ddd', 'intermediate'),
      makeQuestion('tdd-beg-001', 'tdd', 'beginner'),
      makeQuestion('tdd-beg-002', 'tdd', 'beginner'),
      makeQuestion('tdd-beg-003', 'tdd', 'beginner'),
    ]);
  });

  describe('getFilteredQuestions', () => {
    it('filters by theme ID and difficulty', () => {
      const { getFilteredQuestions } = useQuestionBank();
      const result = getFilteredQuestions(['ddd'], 'beginner');
      expect(result).toHaveLength(2);
      expect(result.every((q) => q.themeId === 'ddd')).toBe(true);
      expect(result.every((q) => q.difficulty === 'beginner')).toBe(true);
    });

    it('filters by multiple themes', () => {
      const { getFilteredQuestions } = useQuestionBank();
      const result = getFilteredQuestions(['ddd', 'tdd'], 'beginner');
      expect(result).toHaveLength(5);
    });

    it('returns empty array when no questions match', () => {
      const { getFilteredQuestions } = useQuestionBank();
      const result = getFilteredQuestions(['ddd'], 'advanced');
      expect(result).toHaveLength(0);
    });
  });

  describe('selectQuestions', () => {
    it('limits selection to maxCount', () => {
      vi.mocked(getAllQuestions).mockReturnValue(
        Array.from({ length: 20 }, (_, i) =>
          makeQuestion(
            `ddd-beg-${String(i).padStart(3, '0')}`,
            'ddd',
            'beginner',
          ),
        ),
      );
      const { selectQuestions } = useQuestionBank();
      const result = selectQuestions(['ddd'], 'beginner', 10);
      expect(result).toHaveLength(10);
    });

    it('returns all questions when fewer than maxCount available', () => {
      const { selectQuestions } = useQuestionBank();
      const result = selectQuestions(['ddd'], 'beginner', 10);
      expect(result).toHaveLength(2);
    });

    it('handles empty question bank gracefully', () => {
      vi.mocked(getAllQuestions).mockReturnValue([]);
      const { selectQuestions } = useQuestionBank();
      const result = selectQuestions(['ddd'], 'beginner');
      expect(result).toHaveLength(0);
    });
  });

  describe('getAvailableCounts', () => {
    it('returns count per theme for difficulty', () => {
      const { getAvailableCounts } = useQuestionBank();
      const counts = getAvailableCounts('beginner');
      const dddCount = counts.find((c) => c.themeId === 'ddd');
      const tddCount = counts.find((c) => c.themeId === 'tdd');
      expect(dddCount?.count).toBe(2);
      expect(tddCount?.count).toBe(3);
    });

    it('returns 0 when no questions for difficulty', () => {
      const { getAvailableCounts } = useQuestionBank();
      const counts = getAvailableCounts('advanced');
      expect(counts.every((c) => c.count === 0)).toBe(true);
    });
  });
});
