import { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
if (storedToken) {
  api.setToken(storedToken);
}

const initialState = {
  user: null,
  token: storedToken,
  loading: !!storedToken,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload, token: null, user: null };

    case 'LOGOUT':
      return { ...initialState, token: null, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount if token exists
  useEffect(() => {
    async function restoreSession() {
      if (!state.token) return;
      try {
        api.setToken(state.token);
        const data = await api.get('/auth/me');
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: data.user, token: state.token },
        });
      } catch {
        sessionStorage.removeItem('authToken');
        api.setToken(null);
        dispatch({ type: 'LOGOUT' });
      }
    }
    restoreSession();
  }, []);

  // ✅ REGISTER
  const register = async (name, email, password, role) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const data = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      sessionStorage.setItem('authToken', data.token);
      api.setToken(data.token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.user, token: data.token },
      });

    } catch (err) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: err.message,
      });
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const data = await api.post('/auth/login', {
        email,
        password,
      });

      sessionStorage.setItem('authToken', data.token);
      api.setToken(data.token);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.user, token: data.token },
      });

    } catch (err) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: err.message,
      });
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    sessionStorage.removeItem('authToken');
    api.setToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider
      value={{ ...state, register, login, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}