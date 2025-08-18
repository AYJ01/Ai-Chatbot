import { useAuthenticationStatus, useUserData } from '@nhost/react';
import { useRef } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem('user')
  console.log(user)

  if (!user) {
    return <div>Loading...</div>; 
  }

  if (user) {
    return children;
  }

 
};

export default ProtectedRoute;
