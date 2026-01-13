import type { 
  QuizProgress,
  UseQuizPersistenceReturn 
} from '../types/quiz';

const PERSISTENCE_KEY = 'quiz_app_progress';
const DEFAULT_QUIZ_TIME = 90; // 2 minutes in seconds

const loadProgress = (): QuizProgress | null => {
  try {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      
      // Calculate time remaining based on elapsed time
      if (progress.timerStartTime && progress.timeRemaining !== undefined) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - progress.timerStartTime) / 1000);
        const remainingTime = Math.max(0, progress.timeRemaining - elapsedSeconds);
        
        return {
          ...progress,
          timeRemaining: remainingTime
        };
      }
      
      return progress;
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
        timerStartTime: progressData.timerStartTime || Date.now(),
      };
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const initializeTimer = (): QuizProgress => {
    const now = Date.now();
    return {
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: DEFAULT_QUIZ_TIME,
      timerStartTime: now,
      isSubmitted: false,
    };
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
    initializeTimer,
  };
};