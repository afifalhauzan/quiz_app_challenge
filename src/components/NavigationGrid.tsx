import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import type { NavigationGridProps } from '../types/quiz';

const NavigationGrid: React.FC<NavigationGridProps> = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions, 
  onQuestionClick,
  className = ''
}) => {
  return (
    <div className={className}>
      <h3 className="font-semibold text-slate-800 mb-4">Question Overview</h3>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const questionNumber = index + 1;
          const isAnswered = answeredQuestions.includes(index);
          const isCurrent = currentQuestion === index;
          
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onQuestionClick(index)}
              className={`
                relative w-10 h-10 rounded-lg border-2 font-medium text-sm transition-all duration-200
                ${isCurrent 
                  ? 'border-blue-500 bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
                  : isAnswered
                  ? 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-25'
                }
              `}
            >
              <span className="relative z-10">{questionNumber}</span>
              
              {/* Answer indicator */}
              {isAnswered && !isCurrent && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 z-20"
                >
                  <CheckCircle className="w-4 h-4 text-blue-600 bg-white rounded-full" />
                </motion.div>
              )}
              
              {/* Current question indicator */}
              {isCurrent && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 border-2 border-primary-400 rounded-lg"
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
        <div className="text-sm text-secondary-700">
          <div className="flex justify-between">
            <span>Answered:</span>
            <span className="font-medium">{answeredQuestions.length}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Remaining:</span>
            <span className="font-medium">{totalQuestions - answeredQuestions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationGrid;