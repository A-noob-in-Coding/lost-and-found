import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoutes = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        // Log authentication status for debugging
        console.log('Protected Route: Authentication Status', {
            isAuthenticated: !!user,
            user,
            loading
        });
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Verifying your credentials...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login page and save the location they were trying to access
    if (!user) {
        console.log('User not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child routes
    console.log('User authenticated, rendering protected content');
    return <Outlet />;
};


export default ProtectedRoutes;
