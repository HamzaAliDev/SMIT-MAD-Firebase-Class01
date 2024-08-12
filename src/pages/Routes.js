import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './Auth'
import Dashboard from './Dashboard'
import PrivateRoutes from '../components/PrivateRoutes'
import { useAuthContext } from '../context/AuthContext'

export default function Index() {
  const { isAuthenticated } = useAuthContext()

  return (
    <Routes>
      <Route path='/*' element={<Navigate to='/auth/register' />} />
      <Route path='auth/*' element={!isAuthenticated ? <Auth /> : <Navigate to={'/dashboard'} />} />
      <Route path='dashboard/*' element={<PrivateRoutes Component={Dashboard} />} />
    </Routes>
  )
}
