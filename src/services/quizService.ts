import type { 
  QuizQuestion, 
  QuizSubmissionData, 
  QuizSubmissionResponse
} from '../types/quiz';

// OpenTDB API types
interface OpenTDBQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

class QuizService {
  private readonly API_BASE_URL = 'https://opentdb.com/api.php';
  private readonly STORAGE_KEY = 'quiz_session_data';
  
  // HTML entity decoder
  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  
  // Transform OpenTDB question to our format
  private transformQuestion(apiQuestion: OpenTDBQuestion, index: number): QuizQuestion {
    return {
      id: index + 1,
      question: this.decodeHtmlEntities(apiQuestion.question),
      correct_answer: this.decodeHtmlEntities(apiQuestion.correct_answer),
      incorrect_answers: apiQuestion.incorrect_answers.map(answer => 
        this.decodeHtmlEntities(answer)
      ),
      category: apiQuestion.category,
      difficulty: apiQuestion.difficulty as 'easy' | 'medium' | 'hard',
      type: apiQuestion.type as 'multiple' | 'boolean' | 'text',
      points: apiQuestion.difficulty === 'easy' ? 1 : apiQuestion.difficulty === 'medium' ? 2 : 3
    };
  }

  // Get stored questions from localStorage or fetch from API
  async getQuestions(): Promise<QuizQuestion[]> {
    try {
      // First check localStorage
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const sessionData = JSON.parse(storedData);
        if (sessionData.questions && sessionData.questions.length === 5) {
          console.log('Using stored questions from localStorage');
          return sessionData.questions;
        }
      }
      
      // Fetch from API if no stored questions
      console.log('Fetching new questions from API');
      const amount = 5;
      const category = 9; // General Knowledge
      const difficulty = 'medium';
      const type = 'multiple';
      
      const url = `${this.API_BASE_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
      
      // Add retry logic for rate limiting
      const maxRetries = 3;
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url);
          
          if (response.status === 429) {
            // Rate limited - wait before retry
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Rate limited (429). Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: OpenTDBResponse = await response.json();
          
          if (data.response_code !== 0) {
            throw new Error(`OpenTDB API error: ${data.response_code}`);
          }
          
          // Transform API questions to our format
          const questions = data.results.map((apiQuestion, index) => 
            this.transformQuestion(apiQuestion, index)
          );
          
          // Store questions in localStorage
          const sessionData = {
            questions,
            answers: {},
            currentQuestionIndex: 0,
            timeRemaining: 120,
            timerStartTime: Date.now(),
            isSubmitted: false,
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
          
          return questions;
          
        } catch (error) {
          lastError = error as Error;
          if (attempt === maxRetries) {
            throw error;
          }
        }
      }
      
      throw lastError!;
    } catch (error) {
      console.error('Failed to fetch questions after retries:', error);
      
      // Check if we have any cached questions from a previous session
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        try {
          const sessionData = JSON.parse(storedData);
          if (sessionData.questions && sessionData.questions.length > 0) {
            console.log('Using cached questions due to API failure');
            return sessionData.questions;
          }
        } catch (parseError) {
          console.error('Failed to parse cached data:', parseError);
        }
      }
      
      // Fallback to a set of questions if API fails and no cache
      console.log('Using fallback questions due to API failure');
      const fallbackQuestions: QuizQuestion[] = [
        {
          id: 1,
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["London", "Berlin", "Madrid"],
          category: "Geography",
          difficulty: "easy" as const,
          type: "multiple" as const,
          points: 1
        },
        {
          id: 2,
          question: "Which planet is known as the Red Planet?",
          correct_answer: "Mars",
          incorrect_answers: ["Venus", "Jupiter", "Saturn"],
          category: "Science",
          difficulty: "easy" as const,
          type: "multiple" as const,
          points: 1
        },
        {
          id: 3,
          question: "What is 2 + 2?",
          correct_answer: "4",
          incorrect_answers: ["3", "5", "6"],
          category: "Mathematics",
          difficulty: "easy" as const,
          type: "multiple" as const,
          points: 1
        },
        {
          id: 4,
          question: "Who wrote 'Romeo and Juliet'?",
          correct_answer: "William Shakespeare",
          incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
          category: "Literature",
          difficulty: "medium" as const,
          type: "multiple" as const,
          points: 2
        },
        {
          id: 5,
          question: "What is the largest ocean on Earth?",
          correct_answer: "Pacific Ocean",
          incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
          category: "Geography",
          difficulty: "medium" as const,
          type: "multiple" as const,
          points: 2
        }
      ];
      
      // Store fallback in localStorage too
      const sessionData = {
        questions: fallbackQuestions,
        answers: {},
        currentQuestionIndex: 0,
        timeRemaining: 120,
        timerStartTime: Date.now(),
        isSubmitted: false,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
      return fallbackQuestions;
    }
  }

  async submitQuiz(submissionData: QuizSubmissionData): Promise<QuizSubmissionResponse> {
    try {
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { answers, questions } = submissionData;
      
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
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }
  
  // Clear stored quiz session (for new quiz)
  clearQuizSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const quizService = new QuizService();