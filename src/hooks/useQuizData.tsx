import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { useQuizPersistence } from './useQuizPersistence';
import type { 
  QuizQuestion,
  QuizAnswers,
  UseQuizDataReturn,
  QuizResult
} from '../types/quiz';

export const useQuizData = (): UseQuizDataReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(120);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  
  const navigate = useNavigate();
  const { saveProgress, loadProgress, clearProgress, initializeTimer } = useQuizPersistence();

  // Load quiz data from localStorage or fetch from API
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        
        // Get questions (either from localStorage or API)
        const fetchedQuestions = await quizService.getQuestions();
        setQuestions(fetchedQuestions);
        
        // Load any saved progress
        const progress = loadProgress();
        if (progress) {
          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setAnswers(progress.answers || {});
          setIsSubmitted(progress.isSubmitted || false);
          setTimeRemaining(progress.timeRemaining || 120);
        } else {
          // Initialize new timer if no progress exists
          const newProgress = initializeTimer();
          setTimeRemaining(newProgress.timeRemaining);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load quiz data:', err);
        setError(err);
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

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
          questions,
          timeRemaining,
          timerStartTime: Date.now() - (120 - timeRemaining) * 1000,
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
      if (!questions) {
        throw new Error('No questions loaded');
      }
      
      const submissionData = {
        answers,
        questions,
        timeSpent: 120 - timeRemaining,
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
        timeTaken: 120 - timeRemaining,
        completedAt: submissionData.completedAt
      };
      
      return quizResult;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }, [answers, questions, timeRemaining]);

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

  const resetQuiz = async () => {
    try {
      setLoading(true);
      
      // Clear quiz session and fetch new questions
      quizService.clearQuizSession();
      clearProgress();
      
      // Fetch fresh questions from API
      const fetchedQuestions = await quizService.getQuestions();
      setQuestions(fetchedQuestions);
      
      // Reset all state
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsSubmitted(false);
      
      // Reset timer
      const newProgress = initializeTimer();
      setTimeRemaining(newProgress.timeRemaining);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to reset quiz:', err);
      setError(err);
      setLoading(false);
    }
  };

  return {
    questions,
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