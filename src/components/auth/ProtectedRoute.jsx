import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { isUserAuthenticated } from '../../api/authService';

/**
 * ProtectedRoute Component
 * Restricts access to authenticated users with a valid token.
 * 
 * If unauthenticated:
 * Redirects to /login, passing the current location in router state
 * so the user can be routed back after logging in.
 * 
 * If authenticated:
 * Renders the child components or nested <Outlet /> routes.
 */
export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const location = useLocation();

  // Check if token exists in localStorage (direct key or via authService)
  const hasToken = Boolean(
    (typeof window !== 'undefined' && (
      localStorage.getItem('token') || 
      localStorage.getItem('kids_area_auth_token')
    )) || isUserAuthenticated()
  );

  if (!hasToken) {
    // Redirect to login while preserving intended path in state
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children or nested routes
  return children ? children : <Outlet />;
}
