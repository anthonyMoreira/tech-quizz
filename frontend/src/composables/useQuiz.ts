import { ref, computed } from 'vue';
import type {
  Difficulty,
  Question,
  QuizResult,
  UserAnswer,
} from '@/types/quiz';
import { themes } from '@/data/questions/index';
import { useQuestionBank } from '@/composables/useQuestionBank';

const session = ref<{
  selectedThemes: readonly string[];
  difficulty: Difficulty;
  questions: readonly Question[];
  currentIndex: number;
  answers: UserAnswer[];
  isComplete: boolean;
} | null>(null);

const isSubmitting = ref(false);

export function useQuiz() {
  const { selectQuestions } = useQuestionBank();

  const isActive = computed(
    () => session.value !== null && !session.value.isComplete,
  );

  const isComplete = computed(() => session.value?.isComplete === true);

  const currentQuestion = computed(() => {
    if (!session.value) return null;
    const q = session.value.questions[session.value.currentIndex];
    return q ?? null;
  });

  const currentIndex = computed(() => session.value?.currentIndex ?? 0);

  const totalQuestions = computed(() => session.value?.questions.length ?? 0);

  function startQuiz(
    themeIds: readonly string[],
    difficulty: Difficulty,
  ): void {
    const questions = selectQuestions(themeIds, difficulty, 10);
    session.value = {
      selectedThemes: themeIds,
      difficulty,
      questions,
      currentIndex: 0,
      answers: [],
      isComplete: false,
    };
  }

  function submitAnswer(selectedOptionId: string): void {
    if (!session.value || isSubmitting.value) return;
    if (session.value.isComplete) return;

    const current = session.value.questions[session.value.currentIndex];
    if (!current) return;

    // Double-click protection
    const alreadyAnswered = session.value.answers.some(
      (a) => a.questionId === current.id,
    );
    if (alreadyAnswered) return;

    isSubmitting.value = true;

    const selectedOption = current.options.find(
      (o) => o.id === selectedOptionId,
    );
    const isCorrect = selectedOption?.isCorrect === true;

    session.value.answers.push({
      questionId: current.id,
      selectedId: selectedOptionId,
      isCorrect,
    });

    if (session.value.answers.length >= session.value.questions.length) {
      session.value.isComplete = true;
    }

    isSubmitting.value = false;
  }

  function nextQuestion(): void {
    if (!session.value) return;
    if (session.value.currentIndex < session.value.questions.length - 1) {
      session.value.currentIndex++;
    }
  }

  function getResult(): QuizResult | null {
    if (!session.value?.isComplete) return null;

    const { questions, answers, selectedThemes, difficulty } = session.value;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length;
    const scorePercent =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    const themeNames = selectedThemes
      .map((id) => themes.find((t) => t.id === id)?.name ?? id)
      .filter(Boolean);

    const breakdown = questions.map((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      return {
        question: q,
        selectedId: answer?.selectedId ?? '',
        isCorrect: answer?.isCorrect === true,
      };
    });

    return {
      totalQuestions,
      correctCount,
      scorePercent,
      breakdown,
      themes: themeNames,
      difficulty,
    };
  }

  function resetQuiz(): void {
    session.value = null;
    isSubmitting.value = false;
  }

  return {
    session,
    isActive,
    isComplete,
    currentQuestion,
    currentIndex,
    totalQuestions,
    startQuiz,
    submitAnswer,
    nextQuestion,
    getResult,
    resetQuiz,
  };
}
