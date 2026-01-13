import type { ReactNode } from 'react';

// ================== QUIZ QUESTION TYPES ==================

export interface QuizQuestion {
  id: string | number;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple' | 'boolean' | 'text';
  points?: number;
  explanation?: string;
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect?: boolean;
  timestamp: string;
}

export interface QuizAnswers {
  [questionIndex: number]: string;
}

// ================== QUIZ STATE TYPES ==================

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswers;
  isSubmitted: boolean;
  startTime: string;
  endTime?: string;
  score?: number;
  totalQuestions: number;
}

export interface QuizProgress {
  currentQuestionIndex: number;
  answers: QuizAnswers;
  quizStartTime?: number;
  quizEndTime?: number;
  timestamp?: string; // Optional since saveProgress adds it automatically
  isSubmitted: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  answers: QuizAnswers;
  timeTaken: number;
  completedAt: string;
}

// ================== QUIZ DATA HOOK TYPES ==================

export interface UseQuizDataReturn {
  questions: QuizQuestion[] | undefined;
  loading: boolean;
  error: any;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: QuizAnswers;
  setAnswer: (questionIndex: number, answer: string) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  calculateScore: () => number;
  getAnsweredQuestionsCount: () => number;
  isQuizComplete: () => boolean;
  submitQuiz: () => Promise<QuizResult | undefined>;
}

// ================== QUIZ PERSISTENCE HOOK TYPES ==================

export interface UseQuizPersistenceReturn { saveProgress: (progressData: QuizProgress) => void;
  loadProgress: () => QuizProgress | null;
  clearProgress: () => void;
  hasStoredProgress?: () => boolean;
}

// ================== COMPONENT PROP TYPES ==================

export interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  isFirst: boolean;
  isLast: boolean;
  isSubmitted: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface TimerProps {
  timeRemaining: number;
  onTimeUpdate?: (time: number) => void;
  onTimeUp?: () => void;
  isActive?: boolean;
  className?: string;
}

export interface ProgressProps {
  current: number;
  total: number;
  className?: string;
}

export interface NavigationGridProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  onQuestionClick: (questionIndex: number) => void;
  className?: string;
}

// ================== QUIZ SERVICE TYPES ==================

export interface QuizServiceResponse {
  questions: QuizQuestion[];
  total: number;
  success: boolean;
}

export interface QuizSubmissionData {
  answers: QuizAnswers;
  timeSpent: number;
  completedAt: string;
  userId?: string | number;
}

export interface QuizSubmissionResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  results: QuizResult;
  success: boolean;
}

// ================== QUIZ CONFIGURATION TYPES ==================

export interface QuizConfig {
  timeLimit: number; // in seconds
  questionsPerPage: number;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  passingScore: number; // percentage
}

export interface QuizSettings {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions?: number;
  timeLimit?: number;
  type?: 'multiple' | 'boolean' | 'mixed';
}

// ================== UTILITY TYPES ==================

export type QuizStatus = 'not-started' | 'in-progress' | 'completed' | 'time-up' | 'paused';

export type QuestionStatus = 'unanswered' | 'answered' | 'current' | 'flagged';

export interface QuizStatistics {
  totalTime: number;
  averageTimePerQuestion: number;
  questionsAnswered: number;
  questionsSkipped: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
}

// ================== ERROR TYPES ==================

export interface QuizError {
  code: string;
  message: string;
  details?: any;
}

export type QuizErrorType = 
  | 'FETCH_FAILED'
  | 'SUBMIT_FAILED'
  | 'TIME_UP'
  | 'NETWORK_ERROR'
  | 'INVALID_DATA'
  | 'UNAUTHORIZED';

// ================== FORM TYPES ==================

export interface QuizFormData {
  category?: string;
  difficulty?: string;
  numberOfQuestions?: number;
  timeLimit?: number;
}

// ================== STORAGE TYPES ==================

export interface QuizStorageData {
  progress: QuizProgress;
  config: QuizConfig;
  timestamp: string;
  version: string;
}
