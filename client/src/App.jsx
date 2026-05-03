import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages — to be built out in Phase 1 & 2 (Dev B)
// import Login         from './pages/Login';
// import Register      from './pages/Register';
// import BorrowerDash  from './pages/BorrowerDashboard';
// import LenderDash    from './pages/LenderDashboard';
// import Marketplace   from './pages/Marketplace';
// import LoanDetail    from './pages/LoanDetail';

// Placeholder page until Dev B builds real pages
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
          <Route path="/"          element={<ComingSoon page="Home / Marketplace" />} />
          <Route path="/login"     element={<ComingSoon page="Login" />} />
          <Route path="/register"  element={<ComingSoon page="Register" />} />
          <Route path="/dashboard" element={<ComingSoon page="Dashboard" />} />
          <Route path="/loans/:id" element={<ComingSoon page="Loan Detail" />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
