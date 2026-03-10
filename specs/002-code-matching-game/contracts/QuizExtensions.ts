/**
 * Code Matching Mini Game - Quiz Type Extensions
 *
 * This file defines extensions to existing quiz types to support the code matching game feature.
 * These extensions maintain backward compatibility with existing quiz functionality.
 *
 * @file contracts/QuizExtensions.ts
 * @feature 002-code-matching-game
 */

import type { CodeMatchingGameData, CodeMatchingSession } from './CodeMatchingTypes'

/**
 * Extension to existing Question interface
 *
 * Adds optional matching game data for code-snippet questions.
 * This is a NON-BREAKING change - existing questions without this field continue to work.
 */
export interface QuestionWithMatchingGame {
  // ... all existing Question fields (id, themeId, difficulty, type, prompt, etc.)

  /**
   * Optional code matching game configuration
   * Only present for code-snippet questions that support the mini game
   */
  matchingGame?: CodeMatchingGameData
}

/**
 * Extension to existing UserAnswer interface
 *
 * Adds optional game bonus and attempt tracking.
 * This is a NON-BREAKING change - existing answers without these fields continue to work.
 */
export interface UserAnswerWithGameBonus {
  // ... all existing UserAnswer fields (questionId, selectedId, isCorrect)

  /**
   * Bonus points earned from code matching game (0-10)
   * Only present if user played and completed the matching game
   * undefined means user skipped the game
   */
  gameBonus?: number

  /**
   * Number of attempts to complete the matching game
   * Only present if user played the matching game
   * Used for statistics and learning insights
   */
  gameAttempts?: number
}

/**
 * Extension to existing QuizSession interface
 *
 * Adds optional code matching game state persistence.
 * This is a NON-BREAKING change - existing sessions without this field continue to work.
 */
export interface QuizSessionWithMatchingGames {
  // ... all existing QuizSession fields (selectedThemes, difficulty, questions, etc.)

  /**
   * Persistent state for code matching games
   * Maps questionId → game session state
   * Used to restore game progress after page refresh
   */
  codeMatchingStates?: Record<string, CodeMatchingSession>
}

/**
 * Helper type for question type guards
 */
export function hasMatchingGame(question: any): question is QuestionWithMatchingGame {
  return (
    question &&
    question.type === 'code-snippet' &&
    question.matchingGame !== undefined &&
    Array.isArray(question.matchingGame.fragments) &&
    Array.isArray(question.matchingGame.descriptions) &&
    question.matchingGame.fragments.length > 0
  )
}

/**
 * Helper type for answer type guards
 */
export function hasGameBonus(answer: any): answer is UserAnswerWithGameBonus {
  return answer && typeof answer.gameBonus === 'number'
}

/**
 * Helper type for session type guards
 */
export function hasMatchingGameStates(session: any): session is QuizSessionWithMatchingGames {
  return session && typeof session.codeMatchingStates === 'object'
}

/**
 * Typed version of Question.matchingGame accessor
 * Provides type-safe access to matching game data
 */
export function getMatchingGameData(question: any): CodeMatchingGameData | null {
  if (!hasMatchingGame(question)) {
    return null
  }
  return question.matchingGame
}

/**
 * Calculate bonus points based on attempt count
 * @param attemptCount Number of attempts to complete the game
 * @returns Bonus points (10 for first try, 5 for second try, 0 otherwise)
 */
export function calculateGameBonus(attemptCount: number): number {
  if (attemptCount === 1) return 10  // 🎯 First try bonus
  if (attemptCount === 2) return 5   // ✅ Second try bonus
  return 0                            // No bonus after 2 attempts
}

/**
 * Get total score for a quiz including game bonuses
 * @param answers Array of user answers
 * @returns Object with correct count, total questions, and bonus points
 */
export function calculateScoreWithBonus(answers: UserAnswerWithGameBonus[]): {
  correctAnswers: number
  totalQuestions: number
  bonusPoints: number
  totalScore: number
} {
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const bonusPoints = answers.reduce((sum, a) => sum + (a.gameBonus || 0), 0)

  return {
    correctAnswers,
    totalQuestions: answers.length,
    bonusPoints,
    totalScore: correctAnswers + bonusPoints
  }
}

/**
 * Get or initialize code matching session for a question
 * @param session Current quiz session
 * @param questionId Question to get/create session for
 * @returns Existing or new code matching session
 */
export function getOrCreateMatchingSession(
  session: QuizSessionWithMatchingGames,
  questionId: string
): CodeMatchingSession {
  if (!session.codeMatchingStates) {
    session.codeMatchingStates = {}
  }

  if (!session.codeMatchingStates[questionId]) {
    session.codeMatchingStates[questionId] = {
      questionId,
      placements: {},
      attemptCount: 0,
      isComplete: false,
      earnedBonus: 0
    }
  }

  return session.codeMatchingStates[questionId]
}

/**
 * Save code matching session to quiz session
 * @param session Current quiz session
 * @param matchingSession Code matching session to save
 */
export function saveMatchingSession(
  session: QuizSessionWithMatchingGames,
  matchingSession: CodeMatchingSession
): void {
  if (!session.codeMatchingStates) {
    session.codeMatchingStates = {}
  }

  session.codeMatchingStates[matchingSession.questionId] = matchingSession
}

// Re-export for convenience
export type {
  QuestionWithMatchingGame,
  UserAnswerWithGameBonus,
  QuizSessionWithMatchingGames
}
