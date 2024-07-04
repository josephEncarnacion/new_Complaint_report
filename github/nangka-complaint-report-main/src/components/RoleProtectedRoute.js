// src/components/RoleProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  return isAuthenticated && allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

export default RoleProtectedRoute;
