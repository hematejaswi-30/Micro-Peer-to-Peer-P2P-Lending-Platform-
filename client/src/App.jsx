import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ✅ Import your actual pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Repayments from './pages/Repayments';

// ✅ Protected route
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder (keep for future pages)
function ComingSoon({ page }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card text-center max-w-sm">
        <h2 className="mb-2">{page}</h2>
        <p className="text-sm text-gray-500">Phase 1 — Assigned to Dev B</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* 🔁 Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/repayments" element={<Repayments />} />

          {/* 🔐 Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 🚧 Future Pages */}
          <Route path="/loans/:id" element={<ComingSoon page="Loan Detail" />} />

          {/* ❌ Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}