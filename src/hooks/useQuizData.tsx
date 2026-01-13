import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { quizService } from '../services/quizService';
import type { 
  QuizQuestion,
  QuizAnswers,
  UseQuizDataReturn,
  QuizResult,
  QuizProgress
} from '../types/quiz';

const PERSISTENCE_KEY = 'quiz_app_progress';

export const useQuizData = (): UseQuizDataReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Load saved progress on initialization
  useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const saved = localStorage.getItem(PERSISTENCE_KEY);
        if (saved) {
          const progress: QuizProgress = JSON.parse(saved);
          setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
          setAnswers(progress.answers || {});
          setIsSubmitted(progress.isSubmitted || false);
        }
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    };

    loadSavedProgress();
  }, []);

  const { data: questions, error, isLoading: loading, mutate } = useSWR(
    'quiz/questions',
    () => quizService.getQuestions(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const setAnswer = (questionIndex: number, answer: string): void => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
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

  const submitQuiz = async (): Promise<QuizResult | undefined> => {
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
        timeTaken: 0, // TODO: Calculate actual time
        completedAt: submissionData.completedAt
      };
      
      return quizResult;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
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
  };
};