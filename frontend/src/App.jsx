import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';
import axios from 'axios';

// Konfigurasi Axios Global
axios.defaults.baseURL = 'http://localhost:8000'; 
axios.defaults.withCredentials = true; 
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <div className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Halaman Login */}
            <Route path="/login" element={<Login />} />

            {/* Halaman Dashboard (Rute Utama) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect jika akses root "/" langsung ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Opsional: Handle 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;