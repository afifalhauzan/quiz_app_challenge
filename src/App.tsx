import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SWRConfig } from 'swr';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

const swrConfig = {
  fetcher: (url: any) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />} />

        <Route
          path="/"
          element={
            <QuizPage />
          }
        />
        <Route
          path="/quiz"
          element={
            <QuizPage />
          }
        />
        <Route
          path="/results"
          element={
            <ResultPage />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SWRConfig>
  );
}

export default App;
