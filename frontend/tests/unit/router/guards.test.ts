import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Router, RouteLocationNormalized } from 'vue-router';

const mockIsActive = vi.fn();
const mockIsComplete = vi.fn();

vi.mock('@/composables/useQuiz', () => ({
  useQuiz: () => ({
    isActive: { value: mockIsActive() },
    isComplete: { value: mockIsComplete() },
    session: { value: null },
    currentQuestion: { value: null },
    currentIndex: { value: 0 },
    totalQuestions: { value: 0 },
    startQuiz: vi.fn(),
    submitAnswer: vi.fn(),
    nextQuestion: vi.fn(),
    getResult: vi.fn(),
    resetQuiz: vi.fn(),
  }),
}));

function makeRoute(path: string): RouteLocationNormalized {
  return {
    path,
    name: '',
    params: {},
    query: {},
    hash: '',
    fullPath: path,
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  } as RouteLocationNormalized;
}

type GuardFn = (to: RouteLocationNormalized) => unknown;

describe('Navigation Guards', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('/quiz/play guard', () => {
    it('redirects to /quiz/setup when no active session', async () => {
      mockIsActive.mockReturnValue(false);
      mockIsComplete.mockReturnValue(false);

      const { setupGuards } = await import('@/router/guards');
      let redirectTarget: string | undefined;

      const mockRouter = {
        beforeEach: (fn: unknown) => {
          const result = (fn as GuardFn)(makeRoute('/quiz/play'));
          if (typeof result === 'string') redirectTarget = result;
        },
      };

      setupGuards(mockRouter as unknown as Router);
      expect(redirectTarget).toBe('/quiz/setup');
    });

    it('allows navigation when session is active', async () => {
      mockIsActive.mockReturnValue(true);
      mockIsComplete.mockReturnValue(false);

      const { setupGuards } = await import('@/router/guards');
      let redirectTarget: unknown = undefined;

      const mockRouter = {
        beforeEach: (fn: unknown) => {
          redirectTarget = (fn as GuardFn)(makeRoute('/quiz/play'));
        },
      };

      setupGuards(mockRouter as unknown as Router);
      expect(redirectTarget).toBe(true);
    });
  });

  describe('/quiz/results guard', () => {
    it('redirects to / when quiz not complete', async () => {
      mockIsActive.mockReturnValue(false);
      mockIsComplete.mockReturnValue(false);

      const { setupGuards } = await import('@/router/guards');
      let redirectTarget: string | undefined;

      const mockRouter = {
        beforeEach: (fn: unknown) => {
          const result = (fn as GuardFn)(makeRoute('/quiz/results'));
          if (typeof result === 'string') redirectTarget = result;
        },
      };

      setupGuards(mockRouter as unknown as Router);
      expect(redirectTarget).toBe('/');
    });

    it('allows navigation when quiz is complete', async () => {
      mockIsActive.mockReturnValue(false);
      mockIsComplete.mockReturnValue(true);

      const { setupGuards } = await import('@/router/guards');
      let redirectTarget: unknown = undefined;

      const mockRouter = {
        beforeEach: (fn: unknown) => {
          redirectTarget = (fn as GuardFn)(makeRoute('/quiz/results'));
        },
      };

      setupGuards(mockRouter as unknown as Router);
      expect(redirectTarget).toBe(true);
    });
  });

  describe('Home route', () => {
    it('allows navigation to / always', async () => {
      mockIsActive.mockReturnValue(false);
      mockIsComplete.mockReturnValue(false);

      const { setupGuards } = await import('@/router/guards');
      let redirectTarget: unknown = undefined;

      const mockRouter = {
        beforeEach: (fn: unknown) => {
          redirectTarget = (fn as GuardFn)(makeRoute('/'));
        },
      };

      setupGuards(mockRouter as unknown as Router);
      expect(redirectTarget).toBe(true);
    });
  });
});
