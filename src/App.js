import React from 'react';
import './App.scss';
import Routes from './pages/Routes';
import { useAuthContext } from './context/AuthContext';
import ScreenLoader from './components/ScreenLoader';

function App() {
  const { isAppLoading } = useAuthContext()
  return (
    <>
      {!isAppLoading ?  <Routes /> :  <ScreenLoader /> }
    </>
  );
}

export default App;
