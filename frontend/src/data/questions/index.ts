import type { Question, Theme } from '@/types/quiz';

import dddQuestions from './ddd.json';
import tddQuestions from './tdd.json';
import solidQuestions from './solid.json';
import designPatternsQuestions from './design-patterns.json';
import cleanArchitectureQuestions from './clean-architecture.json';
import ciCdQuestions from './ci-cd.json';
import microservicesQuestions from './microservices.json';
import refactoringQuestions from './refactoring.json';

export const themes: readonly Theme[] = [
  {
    id: 'ddd',
    name: 'Domain-Driven Design',
    description: 'Tackle complexity in software through domain modeling',
    icon: '🏛️',
  },
  {
    id: 'tdd',
    name: 'Test-Driven Development',
    description: 'Write tests first, then code to make them pass',
    icon: '🧪',
  },
  {
    id: 'solid',
    name: 'SOLID Principles',
    description: 'Five principles for maintainable object-oriented design',
    icon: '🔷',
  },
  {
    id: 'design-patterns',
    name: 'Design Patterns',
    description: 'Reusable solutions to commonly occurring problems',
    icon: '🎯',
  },
  {
    id: 'clean-architecture',
    name: 'Clean Architecture',
    description: 'Organize code to be independent of frameworks and UI',
    icon: '🏗️',
  },
  {
    id: 'ci-cd',
    name: 'CI/CD',
    description: 'Automate building, testing, and deploying software',
    icon: '🚀',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Architect systems as a suite of small, independent services',
    icon: '🔗',
  },
  {
    id: 'refactoring',
    name: 'Refactoring',
    description: 'Improve code structure without changing its behavior',
    icon: '🔄',
  },
] as const;

const allQuestionArrays: Question[][] = [
  dddQuestions as unknown as Question[],
  tddQuestions as unknown as Question[],
  solidQuestions as unknown as Question[],
  designPatternsQuestions as unknown as Question[],
  cleanArchitectureQuestions as unknown as Question[],
  ciCdQuestions as unknown as Question[],
  microservicesQuestions as unknown as Question[],
  refactoringQuestions as unknown as Question[],
];

export function getAllQuestions(): Question[] {
  return allQuestionArrays.flat();
}
