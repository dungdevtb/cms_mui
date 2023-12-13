import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { MatxLoading } from 'app/components';
import { useSelector, shallowEqual } from 'react-redux';

const initialState = {
  user: null,
  isInitialised: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }

    case 'LOGIN': {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }

    case 'LOGOUT': {
      return { ...state, isAuthenticated: false, user: null };
    }

    case 'REGISTER': {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  login: () => { },
  logout: () => { },
  register: () => { }
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { user } = response.data;

    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const register = async (email, username, password) => {
    const response = await axios.post('/api/auth/register', { email, username, password });
    const { user } = response.data;

    dispatch({ type: 'REGISTER', payload: { user } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const { infoUser } = useSelector(state => ({
    infoUser: state.homeReducer.infoUser,
  }), shallowEqual)

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: 'INIT', payload: { isAuthenticated: true, user: infoUser } });
      } catch (err) {
        const { data } = await axios.get('/api/auth/profile');
        console.error(err);
        dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: data.user } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialised) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: 'JWT', login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
