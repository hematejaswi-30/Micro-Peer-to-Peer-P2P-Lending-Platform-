import { createContext, useContext, useReducer } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  loading: false,
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

      // 🔥 set token in axios (memory only)
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

      // 🔥 attach token to API
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
    api.setToken(null); // remove token from axios
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