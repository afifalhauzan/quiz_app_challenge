import type { 
  QuizQuestion, 
  QuizServiceResponse, 
  QuizSubmissionData, 
  QuizSubmissionResponse,
  QuizSettings 
} from '../types/quiz';

class QuizService {
    // Define mock question first, TODO: Replace with real API calls
  private mockQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
      category: "Geography",
      difficulty: "easy",
      type: "multiple",
      points: 1
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Venus", "Jupiter", "Saturn"],
      category: "Science",
      difficulty: "easy",
      type: "multiple",
      points: 1
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      correct_answer: "4",
      incorrect_answers: ["3", "5", "6"],
      category: "Mathematics",
      difficulty: "easy",
      type: "multiple",
      points: 1
    },
    {
      id: 4,
      question: "Who wrote 'Romeo and Juliet'?",
      correct_answer: "William Shakespeare",
      incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
      category: "Literature",
      difficulty: "medium",
      type: "multiple",
      points: 2
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      correct_answer: "Pacific Ocean",
      incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      category: "Geography",
      difficulty: "medium",
      type: "multiple",
      points: 2
    }
  ];

  // Simulate API delay
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getQuestions(): Promise<QuizQuestion[]> {
    await this.delay(800);
    
    let questions = [...this.mockQuestions];
    
    return questions;
  }

  async submitQuiz(submissionData: QuizSubmissionData): Promise<QuizSubmissionResponse> {
    await this.delay(500);
    
    const { answers } = submissionData;
    const questions = await this.getQuestions();
    
    let correctAnswers = 0;
    
    Object.entries(answers).forEach(([questionIndex, selectedAnswer]) => {
      const question = questions[parseInt(questionIndex)];
      if (question && question.correct_answer === selectedAnswer) {
        correctAnswers++;
      }
    });
    
    const totalQuestions = questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    const result = {
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      percentage,
      answers,
      timeTaken: submissionData.timeSpent,
      completedAt: submissionData.completedAt
    };
    
    return {
      ...result,
      results: result,
      success: true
    };
  }
}

export const quizService = new QuizService();