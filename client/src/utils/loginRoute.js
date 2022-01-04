import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function LoginRoute({ component }) {
  const { user } = useAuth();

  if (user.auth) return <Navigate to="/dashboard" replace />;

  return component;
}
