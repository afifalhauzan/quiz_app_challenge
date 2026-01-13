import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SWRConfig } from 'swr';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

const swrConfig = {
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <AuthProvider>
      <div className="">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
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
