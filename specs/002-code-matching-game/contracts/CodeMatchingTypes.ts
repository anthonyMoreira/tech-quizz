/**
 * Code Matching Mini Game - Type Definitions
 *
 * This file defines TypeScript interfaces for the code matching game feature.
 * These types are used throughout the game components and composables.
 *
 * @file contracts/CodeMatchingTypes.ts
 * @feature 002-code-matching-game
 */

/**
 * Represents a draggable code fragment that must be matched with a description
 */
export interface CodeFragment {
  /** Unique identifier for this fragment (e.g., "frag-1") */
  id: string

  /** The code text to display (will be syntax-highlighted) */
  code: string

  /** ID of the DescriptionZone this fragment correctly matches */
  descriptionId: string
}

/**
 * Represents a drop zone with descriptive text explaining expected code behavior
 */
export interface DescriptionZone {
  /** Unique identifier for this zone (e.g., "desc-1") */
  id: string

  /** Description text explaining what the code should do */
  text: string
}

/**
 * Game configuration data stored in question JSON files
 */
export interface CodeMatchingGameData {
  /** Array of 3-5 code fragments to be matched */
  fragments: CodeFragment[]

  /** Array of 3-5 descriptions (must match fragments count) */
  descriptions: DescriptionZone[]
}

/**
 * Runtime state for an active code matching game instance
 */
export interface CodeMatchingGameState {
  /** All available fragments for this game */
  fragments: CodeFragment[]

  /** All drop zones for this game */
  zones: DescriptionZone[]

  /** Current placements: zoneId → fragmentId */
  placements: Record<string, string>

  /** ID of fragment currently being dragged (null when not dragging) */
  draggedFragmentId: string | null

  /** Number of times user clicked "Check Matches" */
  attemptCount: number

  /** Whether user has validated at least once */
  isValidated: boolean

  /** Validation results: zoneId → isCorrect (null before first validation) */
  validationResults: Record<string, boolean> | null

  /** Whether all placements are correct (game won) */
  isComplete: boolean
}

/**
 * Persistent state for a code matching game within a quiz session
 */
export interface CodeMatchingSession {
  /** Which question this game belongs to */
  questionId: string

  /** User's current placements (persisted across page refresh) */
  placements: Record<string, string>

  /** Number of validation attempts (persisted) */
  attemptCount: number

  /** Whether game was successfully completed (persisted) */
  isComplete: boolean

  /** Bonus points earned (0, 5, or 10) */
  earnedBonus: number
}

/**
 * Touch drag state for mobile devices
 */
export interface TouchDragState {
  /** ID of fragment being dragged */
  fragmentId: string

  /** Starting X coordinate */
  startX: number

  /** Starting Y coordinate */
  startY: number

  /** Current X coordinate */
  currentX: number

  /** Current Y coordinate */
  currentY: number
}

/**
 * Props for CodeMatchingGame component
 */
export interface CodeMatchingGameProps {
  /** The game configuration data from the question */
  gameData: CodeMatchingGameData

  /** The question ID (for session persistence) */
  questionId: string

  /** Optional initial state (for restoring from session) */
  initialState?: CodeMatchingSession
}

/**
 * Events emitted by CodeMatchingGame component
 */
export interface CodeMatchingGameEmits {
  /** Emitted when user clicks "Skip to Question" */
  skip: []

  /** Emitted when game is successfully completed */
  complete: [bonus: number, attempts: number]
}

/**
 * Props for CodeFragment component
 */
export interface CodeFragmentProps {
  /** Fragment data */
  fragment: CodeFragment

  /** Whether this fragment is currently being dragged */
  isDragging: boolean

  /** Whether this fragment is placed in a zone */
  isPlaced: boolean

  /** Syntax highlighting language (defaults to "typescript") */
  language?: string
}

/**
 * Events emitted by CodeFragment component
 */
export interface CodeFragmentEmits {
  /** Emitted when user starts dragging this fragment */
  dragstart: [fragmentId: string]

  /** Emitted when user clicks to pick up/place fragment (keyboard mode) */
  click: [fragmentId: string]
}

/**
 * Props for DescriptionZone component
 */
export interface DescriptionZoneProps {
  /** Zone data */
  zone: DescriptionZone

  /** Fragment currently placed in this zone (null if empty) */
  placedFragment: CodeFragment | null

  /** Whether a fragment is being dragged over this zone */
  isHovered: boolean

  /** Validation result for this zone (undefined before validation) */
  validationResult?: boolean
}

/**
 * Events emitted by DescriptionZone component
 */
export interface DescriptionZoneEmits {
  /** Emitted when user drops a fragment on this zone */
  drop: [zoneId: string, fragmentId: string]

  /** Emitted when user clicks a placed fragment to remove it */
  remove: [zoneId: string]

  /** Emitted when user focuses zone for keyboard placement */
  focus: [zoneId: string]
}

/**
 * Props for MatchValidationResult component
 */
export interface MatchValidationResultProps {
  /** Validation results: zoneId → isCorrect */
  validationResults: Record<string, boolean>

  /** All zones (to display results) */
  zones: DescriptionZone[]

  /** All fragments (to show correct answers) */
  fragments: CodeFragment[]

  /** Current placements: zoneId → fragmentId */
  placements: Record<string, string>

  /** Whether all matches are correct */
  isComplete: boolean

  /** Current attempt count */
  attemptCount: number
}

/**
 * Events emitted by MatchValidationResult component
 */
export interface MatchValidationResultEmits {
  /** Emitted when user clicks "Try Again" */
  retry: []

  /** Emitted when user clicks "Continue to Question" */
  continue: []
}

/**
 * Return type of useCodeMatchingGame composable
 */
export interface UseCodeMatchingGameReturn {
  // State
  state: Ref<CodeMatchingGameState>

  // Computed
  availableFragments: ComputedRef<CodeFragment[]>
  isAllPlaced: ComputedRef<boolean>
  canValidate: ComputedRef<boolean>

  // Actions
  placeFragment: (zoneId: string, fragmentId: string) => void
  removeFragment: (zoneId: string) => void
  validateMatches: () => void
  retryGame: () => void
  getFragmentForZone: (zoneId: string) => CodeFragment | null

  // Drag and Drop
  handleDragStart: (event: DragEvent, fragmentId: string) => void
  handleDragOver: (event: DragEvent) => void
  handleDrop: (event: DragEvent, zoneId: string) => void
  handleDragEnd: (event: DragEvent) => void

  // Touch Events
  handleTouchStart: (event: TouchEvent, fragmentId: string) => void
  handleTouchMove: (event: TouchEvent) => void
  handleTouchEnd: (event: TouchEvent, zoneId: string) => void

  // Keyboard
  handleKeyboardPlace: (zoneId: string) => void
}

// Re-export for convenience
export type {
  CodeFragment,
  DescriptionZone,
  CodeMatchingGameData,
  CodeMatchingGameState,
  CodeMatchingSession,
  TouchDragState
}
