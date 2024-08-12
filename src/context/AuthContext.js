import React, {useState, useEffect, createContext, useCallback, useContext, useReducer,  } from 'react'

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
    setTimeout(() => {
      setIsAppLoading(false)
    }, 3000)
  }, [])

  useEffect(() => { readProfile() }, [readProfile])

  const handleLogout = () => {
    dispatch({type: 'SET_LOGGED_OUT'})
  }
  // console.log("dispatch",state)

  return (
    <Auth.Provider value={{ ...state, dispatch, isAppLoading, setIsAppLoading, handleLogout }}>
      {children}
    </Auth.Provider>
  )
}

export const useAuthContext = () => useContext(Auth)
