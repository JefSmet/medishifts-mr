import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
