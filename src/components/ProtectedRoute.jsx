import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const storedUser = sessionStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Else render the children components
  return children;
};

export default ProtectedRoute;
