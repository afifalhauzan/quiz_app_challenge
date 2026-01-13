import type { 
  QuizProgress,
  UseQuizPersistenceReturn 
} from '../types/quiz';

const PERSISTENCE_KEY = 'quiz_app_progress';
const DEFAULT_QUIZ_TIME = 2 * 60; // 2 minutes in seconds

const loadProgress = (): QuizProgress | null => {
  try {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return null;
};

export const useQuizPersistence = (): UseQuizPersistenceReturn => {

  const saveProgress = (progressData: QuizProgress): void => {
    try {
      const dataToSave = {
        ...progressData,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const clearProgress = (): void => {
    try {
      localStorage.removeItem(PERSISTENCE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  };

  const hasStoredProgress = (): boolean => {
    const progress = loadProgress();
    return progress !== null;
  };

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasStoredProgress,
  };
};