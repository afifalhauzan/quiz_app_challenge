import { motion } from 'framer-motion';
import type { QuestionCardProps } from '../types/quiz';

// Helper function
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  isFirst,
  isLast,
  isSubmitted,
  onNext
}: QuestionCardProps) => {
  const allAnswers = [
    question.correct_answer,
    ...question.incorrect_answers
  ];

  const handleAnswerClick = (answer: string): void => {
    if (!isSubmitted) {
      onAnswerSelect(answer);
      
      // Auto-advance to next question after a short delay (unless it's the last question)
      if (!isLast && onNext) {
        setTimeout(() => {
          onNext();
        }, 500); // Small delay to show the selection before advancing
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Question */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Question {questionNumber}
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {question.category}
            </span>
          </div>
          
          <h2 
            className="text-xl font-semibold text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: decodeHtmlEntities(question.question) 
            }}
          />
          
          {question.difficulty && (
            <div className="mt-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                question.difficulty === 'easy' 
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

        {/* Answer Options */}
        <div className="space-y-3">
          {allAnswers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === question.correct_answer;
            
            // Show correct/incorrect styling only after submission
            const getAnswerStyling = () => {
              if (!isSubmitted) {
                return isSelected 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50';
              }
              
              if (isSelected && isCorrect) return 'border-green-500 bg-green-50 ring-2 ring-green-200';
              if (isSelected && !isCorrect) return 'border-red-500 bg-red-50 ring-2 ring-red-200';
              if (!isSelected && isCorrect) return 'border-green-500 bg-green-50';
              return 'border-slate-200';
            };

            return (
              <motion.button
                key={answer}
                whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                onClick={() => handleAnswerClick(answer)}
                disabled={isSubmitted}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${getAnswerStyling()} ${
                  isSubmitted ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                    isSelected 
                      ? isSubmitted
                        ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white')
                        : 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  <span 
                    className="flex-1 text-slate-800"
                    dangerouslySetInnerHTML={{ 
                      __html: decodeHtmlEntities(answer) 
                    }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default QuestionCard;