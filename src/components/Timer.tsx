import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import type { TimerProps } from '../types/quiz';

const Timer = ({ timeRemaining, onTimeUpdate, onTimeUp }: TimerProps) => {
  const [time, setTime] = useState<number>(timeRemaining || 90); // Default 2 minutes
  const [isLowTime, setIsLowTime] = useState<boolean>(false);
  const [isCriticalTime, setIsCriticalTime] = useState<boolean>(false);

  useEffect(() => {
    setTime(timeRemaining || 90);
  }, [timeRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        
        const newTime = prevTime - 1;
        setIsLowTime(newTime <= 60); // Yellow at 1 minute
        setIsCriticalTime(newTime <= 30); // Red with message at 30 seconds
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUpdate, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (time <= 30) return 'text-red-600'; // Last 30 seconds - red
    if (time <= 60) return 'text-yellow-600'; // Last minute - yellow
    return 'text-slate-700'; // Normal - gray
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className={`w-5 h-5 ${getTimeColor()}`} />
        <h3 className="font-medium text-slate-800">Time Remaining</h3>
      </div>
      
      <motion.div
        animate={isCriticalTime ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: isCriticalTime ? Infinity : 0, duration: 1 }}
        className={`text-3xl font-mono font-bold ${getTimeColor()}`}
      >
        {formatTime(time)}
      </motion.div>
      
      {isCriticalTime && time > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1 mt-2 text-red-600"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Time is almost up!
          </span>
        </motion.div>
      )}

      {time === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-red-600 font-medium"
        >
          Time's Up!
        </motion.div>
      )}
    </div>
  );
};

export default Timer;