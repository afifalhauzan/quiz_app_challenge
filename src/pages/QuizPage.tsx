import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import QuestionCard from '../components/QuestionCard';
import NavigationGrid from '../components/NavigationGrid';
import { useQuizData } from '../hooks/useQuizData';
import { useQuizPersistence } from '../hooks/useQuizPersistence';

const QuizPage: React.FC = () => {
  const { 
    questions, 
    loading, 
    error, 
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    isSubmitted 
  } = useQuizData();

  const { 
    saveProgress, 
  } = useQuizPersistence();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-100 bg-slate-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-800 font-semibold">Loading Quiz...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
            <p className="text-red-600 mb-4 font-semibold">Error loading quiz questions</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAnswerSelect = (answer: string): void => {
    setAnswer(currentQuestionIndex, answer);
    saveProgress({
      currentQuestionIndex,
      answers: { ...answers, [currentQuestionIndex]: answer },
      timestamp: new Date().toISOString(),
      isSubmitted: false
    });
  };

  const handleQuestionNavigate = (index: number): void => {
    setCurrentQuestionIndex(index);
    saveProgress({
      currentQuestionIndex: index,
      answers,
      timestamp: new Date().toISOString(),
      isSubmitted: false
    });
  };

  const handleNext = (): void => {
    if (currentQuestionIndex < (questions?.length ?? 0) - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      saveProgress({
        currentQuestionIndex: newIndex,
        answers,
        timestamp: new Date().toISOString(),
        isSubmitted: false
      });
    }
  };

  // Guard clause for questions
  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
            <p className="text-slate-800 font-semibold">No quiz questions available</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Main Question Area */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">            
            {questions[currentQuestionIndex] && (
              <QuestionCard
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === questions.length - 1}
                isSubmitted={isSubmitted}
                onNext={handleNext}
              />
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div 
          className="w-full lg:w-80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-6">
            {/* Question Navigation Grid */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <NavigationGrid
                totalQuestions={questions.length}
                currentQuestion={currentQuestionIndex}
                answeredQuestions={Object.keys(answers).map(Number)}
                onQuestionClick={handleQuestionNavigate}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default QuizPage;