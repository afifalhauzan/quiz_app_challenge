// Mock authentication service

import type {
  MockUser,
  LoginCredentials,
  UserWithSession,
} from '../types/auth';

const AUTH_STORAGE_KEY = 'quiz_auth_user';

class AuthService {
  private users: MockUser[];

  constructor() {
    this.users = [
      { id: 1, username: 'admin', password: 'password', name: 'Admin User', email: 'admin@quiz.com' },
      { id: 2, username: 'student', password: 'student123', name: 'Student User', email: 'student@quiz.com' },
      { id: 3, username: 'demo', password: 'demo', name: 'Demo User', email: 'demo@quiz.com' },
    ];
  }

  // Simulate API call delay
  async delay(ms = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginCredentials): Promise<UserWithSession> {
    await this.delay(800); // Simulate network delay
    
    const { username, password } = credentials;
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Create session data (excluding password)
    const sessionData: UserWithSession = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      loginAt: new Date().toISOString(),
      sessionId: this.generateSessionId(),
    };

    // Store in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));

    return sessionData;
  }


  async logout() {
    await this.delay(300);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    
    // Clear other quiz-related data on logout
    const quizKeys = [
      'quiz_progress',
      'quiz_state',
      'quiz_timer',
      'quiz_answers',
      'current_question'
    ];
    
    quizKeys.forEach(key => localStorage.removeItem(key));
    
    return true;
  }

  // From localStorage
  async getCurrentUser(): Promise<UserWithSession | null> {
    await this.delay(200);
    
    try {
      const userData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!userData) return null;

      const user = JSON.parse(userData);
      
      // Check if session is still valid (24 hours)
      const loginTime = new Date(user.loginAt);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin > 24) {
        await this.logout();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  isAuthenticated() {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

}

export const authService = new AuthService();