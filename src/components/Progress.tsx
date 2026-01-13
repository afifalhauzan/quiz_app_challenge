import React from 'react';
import { motion } from 'framer-motion';
import type { ProgressProps } from '../types/quiz';

const Progress: React.FC<ProgressProps> = ({ current, total, className = '' }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700">
          Question {current} of {total}
        </span>
        <span className="text-sm text-secondary-500">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-secondary-200 rounded-full h-2.5">
        <motion.div
          className="bg-primary-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default Progress;