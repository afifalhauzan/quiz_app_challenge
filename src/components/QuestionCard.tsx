import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuestionCardProps } from '../types/quiz';


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
  const [clickedAnswer, setClickedAnswer] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Shuffle answers randomly so correct answer isn't always first
  // Use useMemo to recalculate when question changes
  const allAnswers = useMemo(() => {
    const answers = [
      question.correct_answer,
      ...question.incorrect_answers
    ];
    
    // Create a deterministic but pseudo-random shuffle based on question content
    // This ensures the same question always has the same shuffle order
    const seed = question.question.length + question.correct_answer.length;
    
    // Fisher-Yates shuffle with seeded random
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(((seed + i) * 9301 + 49297) % 233280 / 233280) * (i + 1);
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    
    return answers;
  }, [question]);

  const handleAnswerClick = (answer: string): void => {
    if (!isSubmitted) {
      // Set the clicked answer for visual feedback
      setClickedAnswer(answer);
      onAnswerSelect(answer);
      
      // Auto-advance to next question after a short delay (unless it's the last question)
      if (!isLast && onNext) {
        setTimeout(() => {
          onNext();
          setClickedAnswer(null);
        }, 500); // Small delay
      } else {
        // // Only auto-navigate to results if all questions are answered
        // const willBeCompleted = answeredQuestionsCount + (selectedAnswer ? 0 : 1) >= totalQuestions;
        // if (willBeCompleted && onSubmit) {
        //   setTimeout(() => {
        //     setClickedAnswer(null);
        //     onSubmit();
        //   }, 500);
        // } else {
        //   setTimeout(() => {
        //     setClickedAnswer(null);
        //   }, 500);
        // }
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Question */}
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Question {questionNumber}
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {question.category}
            </span>
          </div>
          
          <h2 
            className="text-xl font-bold text-slate-800 leading-relaxed"
          >
            {question.question}
          </h2>
          
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
            const isClicked = clickedAnswer === answer;
            
            // Show correct/incorrect styling only after submission
            const getAnswerStyling = () => {
              // Show blue feedback immediately when clicked (before submission)
              if (isClicked && !isSubmitted) {
                return 'border-blue-500 bg-blue-500 ring-2 ring-blue-300 text-white';
              }
              
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
                    isClicked && !isSubmitted
                      ? 'border-white bg-white text-blue-500'
                      : isSelected 
                        ? isSubmitted
                          ? (isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white')
                          : 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  <span 
                    className={`flex-1 ${isClicked && !isSubmitted ? 'text-white' : 'text-slate-800'}`}
                  >
                    {answer}
                  </span>
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