# Quiz App Challenge📝

A modern, high-performance Quiz Application built with React 19, Tailwind CSS v4, and TypeScript. This project was developed as a technical challenge, focusing on seamless user experience, state resilience, and clean architecture.

## ✨ Key Features

Secure Authentication: Simple and effective login system to manage user sessions and protect quiz state.

Smart Persistence (Resume Quiz): Advanced state management using localStorage. If the browser is refreshed or closed, the quiz resumes exactly where the user left off, including the specific question set and the remaining time.

Real-time Timer: Accurate countdown timer with auto-submission functionality when time runs out.

Dynamic UI: One-question-at-a-time interface with smooth transitions and interaction feedback powered by Framer Motion.

Detailed Analytics: Comprehensive results page showing correct/incorrect answers, score percentage, and a review of all questions.

Responsive Design: Fully optimized for mobile, tablet, and desktop using the latest Tailwind CSS v4 engine.

## 🛠️ Tech Stack

### Frontend
React 19, TypeScript

### Styling
Tailwind CSS v4

### State & Fetching
SWR (Efficient caching & synchronization)

### Animations
Framer Motion

### Icons
Lucide React

### Build Tool
Vite

## 🚀 Getting Started

1. Clone the repository

git clone [https://github.com/afifalhauzan/quiz_app_challenge.git](https://github.com/afifalhauzan/quiz_app_challenge.git)
cd quiz_app_challenge


2. Install dependencies

npm install


3. Run the development server

npm run dev


🏗️ Project Structure

The project follows a modular architecture designed for scalability and maintainability:

/src
 ├── /components  # Reusable UI (Timer, QuestionCards, Layouts)
 
 ├── /hooks       # Custom logic (useQuizData, useQuizPersistence, useAuth)
 
 ├── /pages       # Main application views (Login, Quiz, Results)
 
 ├── /services    # API interaction logic and mock data services
 
 ├── /types       # TypeScript interfaces and type definitions
 
 └── /utils       # Helper functions (time formatters, score calculation)


## 💡 Notes: State Resilience

One of the main challenges of using a randomized API (like OpenTDB) is maintaining data consistency upon refresh. Standard implementations often lose the current question set or reset the timer when the user reloads the page.

This implementation solves that by focusing on temporal and data consistency:

Data Locking: Fetches a randomized set of questions only once at the start and immediately "locks" that specific set into localStorage.

Temporal Consistency: Instead of saving "seconds remaining," we store the initial start timestamp. The remaining time is calculated dynamically:


``` $$TimeRemaining = TotalDuration - (CurrentTime - StartTimestamp)$$ ```


This ensures the timer remains accurate even if the user leaves the site and returns minutes later.

Automatic Recovery: On mount, the application checks for an existing session and hydrates the state, allowing a "Zero-Interrupt" user experience.
