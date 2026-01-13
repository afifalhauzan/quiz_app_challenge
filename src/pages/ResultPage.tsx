import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useQuizData } from '../hooks/useQuizData';
import { useQuizPersistence } from '../hooks/useQuizPersistence';
import { useAuth } from '../hooks/useAuth';

const ResultPage = () => {
  const navigate = useNavigate();
  const { questions, answers, calculateScore } = useQuizData();
  const { clearProgress } = useQuizPersistence();
  const { logout } = useAuth();

  const score = calculateScore();
  const percentage = Math.round((score / (questions?.length ?? 1)) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = () => {
    if (percentage >= 80) return <Trophy className="w-16 h-16 text-green-600" />;
    if (percentage >= 60) return <Trophy className="w-16 h-16 text-yellow-600" />;
    return <XCircle className="w-16 h-16 text-red-600" />;
  };

  const handleRetakeQuiz = () => {
    clearProgress();
    navigate('/quiz');
  };

  const handleLogOut = async () => {
    clearProgress();
    await logout();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                className="mb-6"
              >
                {getScoreIcon()}
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Quiz Completed!
              </h1>

              <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
                {percentage}%
              </div>

              <div className="text-lg text-slate-600 mb-6 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span>✅ Correct:</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>❌ Wrong:</span>
                  <span className="font-semibold text-red-600">{(questions?.length ?? 0) - score}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>📝 Total Questions:</span>
                  <span className="font-semibold text-slate-800">{questions?.length ?? 0}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>Answered:</span>
                  <span className="font-semibold text-blue-600">{Object.keys(answers || {}).length}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>Skipped:</span>
                  <span className="font-semibold text-orange-600">{(questions?.length ?? 0) - Object.keys(answers || {}).length}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </button>

                <button
                  onClick={handleLogOut}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Detailed Results
          </h2>

          <div className="space-y-4">
            {questions?.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-800">
                          Question {index + 1}
                        </h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {question.category}
                        </span>
                      </div>

                      <p
                        className="text-slate-700 mb-3 leading-relaxed"
                      > {question.question}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          <strong>Your answer:</strong> {userAnswer || 'Not answered'}
                        </div>

                        {!isCorrect && (
                          <div className="text-green-700">
                            <strong>Correct answer:</strong> {question.correct_answer}
                          </div>
                        )}

                        {question.difficulty && (
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${question.difficulty === 'easy'
                                ? 'bg-green-100 text-green-700'
                                : question.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                              {question.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResultPage;