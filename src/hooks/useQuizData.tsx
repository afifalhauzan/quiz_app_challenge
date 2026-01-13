import { useState, useEffect, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { useQuizPersistence } from './useQuizPersistence';
import type { 
  QuizQuestion,
  QuizAnswers,
  UseQuizDataReturn,
  QuizResult,
  QuizProgress
} from '../types/quiz';

export const useQuizData = (): UseQuizDataReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(90); // 2 minutes
  
  const navigate = useNavigate();
  const { saveProgress, loadProgress, clearProgress, initializeTimer } = useQuizPersistence();

  // Load saved progress on initialization
  useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const progress = loadProgress();
        if (progress) {
          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setAnswers(progress.answers || {});
          setIsSubmitted(progress.isSubmitted || false);
          setTimeRemaining(progress.timeRemaining || 90);
        } else {
          // Initialize new timer if no progress exists
          const newProgress = initializeTimer();
          setTimeRemaining(newProgress.timeRemaining);
        }
      } catch (error) {
        console.error('Failed to load saved progress:', error);
        // Fallback to new timer
        const newProgress = initializeTimer();
        setTimeRemaining(newProgress.timeRemaining);
      }
    };

    loadSavedProgress();
  }, []); // Remove dependencies that cause re-renders

  const { data: questions, error, isLoading: loading, mutate } = useSWR(
    'quiz/questions',
    () => quizService.getQuestions(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleTimeUpdate = (newTime: number): void => {
    setTimeRemaining(newTime);
  };

  const setAnswer = (questionIndex: number, answer: string): void => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionIndex]: answer
      };
      
      // Save progress after updating answers
      setTimeout(() => {
        saveProgress({
          currentQuestionIndex,
          answers: newAnswers,
          timeRemaining,
          timerStartTime: Date.now() - (90 - timeRemaining) * 1000,
          isSubmitted: false
        });
      }, 0);
      
      return newAnswers;
    });
  };

  const calculateScore = (): number => {
    if (!questions) return 0;
    
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    return correctAnswers;
  };

  const getAnsweredQuestionsCount = (): number => {
    return Object.keys(answers).length;
  };

  const isQuizComplete = (): boolean => {
    return questions ? Object.keys(answers).length === questions.length : false;
  };

  const submitQuiz = useCallback(async (): Promise<QuizResult | undefined> => {
    try {
      const score = calculateScore();
      const submissionData = {
        answers,
        timeSpent: 0, // TODO: Calculate actual time spent
        completedAt: new Date().toISOString(),
      };
      
      const result = await quizService.submitQuiz(submissionData);
      
      setIsSubmitted(true);
      
      // Convert QuizSubmissionResponse to QuizResult
      const quizResult: QuizResult = {
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        percentage: result.percentage,
        answers,
        timeTaken: 90 - timeRemaining,
        completedAt: submissionData.completedAt
      };
      
      return quizResult;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }, [answers, questions]);

  // Auto-submit when time runs out
  const handleTimeUp = useCallback(async () => {
    if (!isSubmitted) {
      try {
        await submitQuiz();
        navigate('/results');
      } catch (error) {
        console.error('Auto-submit failed:', error);
      }
    }
  }, [isSubmitted, submitQuiz, navigate]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    clearProgress();
    const newProgress = initializeTimer();
    setTimeRemaining(newProgress.timeRemaining);
    mutate(); // Refetch questions
  };

  return {
    questions: questions || [],
    loading,
    error,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    isSubmitted,
    setIsSubmitted,
    calculateScore,
    getAnsweredQuestionsCount,
    isQuizComplete,
    submitQuiz,
    resetQuiz,
    timeRemaining,
    handleTimeUpdate,
    handleTimeUp,
  };
};