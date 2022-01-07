import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute({ component }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user.auth) return <Navigate to="/" state={{ from: location }} replace />;

  return component;
}
