// ─── AuthContext ─────────────────────────────────────────────
// Scaffold by Lead. Dev B implements actions in Phase 1.
//
// SECURITY RULE: JWT must be stored in memory ONLY.
// Never use localStorage or sessionStorage — enforced in code review.

import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null,       // { id, name, email, role }
  token: null,      // JWT — in memory only, cleared on page refresh (intentional)
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // TODO (Phase 1 — Dev B): Implement these actions
  // Each should call the API, then dispatch the appropriate action.

  const register = async (name, email, password, role) => {
    // POST /api/auth/register
    throw new Error('register() not implemented yet — Phase 1 task');
  };

  const login = async (email, password) => {
    // POST /api/auth/login
    throw new Error('login() not implemented yet — Phase 1 task');
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in all components instead of useContext(AuthContext) directly
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
