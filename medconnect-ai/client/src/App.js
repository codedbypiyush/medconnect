import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import SymptomChecker from './pages/SymptomChecker';

function AppRoutes() {
  const user = useSelector((s) => s.auth.user);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace /> : <Register />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetail />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="patient">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/symptom-checker"
        element={
          <ProtectedRoute>
            <SymptomChecker />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRoutes />
      </div>
    </Router>
  );
}
