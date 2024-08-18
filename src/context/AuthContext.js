import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useState, useEffect, createContext, useCallback, useContext, useReducer, } from 'react'
import { auth } from '../config/firebase';

const Auth = createContext();

const initialState = { isAuthenticated: false, user: {} }

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_LOGGED_IN':
      return { isAuthenticated: true, user: payload.user }
    case 'SET_PROFILE':
      return { ...state, user: payload.user }
    case 'SET_LOGGED_OUT':
      return initialState;
    default:
      return state
  }
}

export default function AuthContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isAppLoading, setIsAppLoading] = useState(true)

  const readProfile = useCallback(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'SET_LOGGED_IN', payload: { user } });

      } else {
        dispatch({ type: 'SET_LOGGED_OUT' })
      }
    });
    setTimeout(() => {
      setIsAppLoading(false)
    }, 2000)
  }, [])

  useEffect(() => { readProfile() }, [readProfile])

  const handleLogout = () => {
    signOut(auth).then(() => {
      dispatch({ type: 'SET_LOGGED_OUT' });
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  }

  return (
    <Auth.Provider value={{ ...state, dispatch, isAppLoading, setIsAppLoading, handleLogout }}>
      {children}
    </Auth.Provider>
  )
}

export const useAuthContext = () => useContext(Auth)
