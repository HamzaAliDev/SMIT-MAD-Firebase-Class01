import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function PrivateRoutes({ Component }) {
    const { isAuthenticated } = useAuthContext()

    if (!isAuthenticated) { return <Navigate to='/auth/login' /> }

    return (
        <Component />
    )
}
