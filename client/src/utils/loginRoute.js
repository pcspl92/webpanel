import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function AgentLoginRoute({ component }) {
  const { user } = useAuth();

  if (user.auth) return <Navigate to="/agent/dashboard" replace />;
  return component;
}

export function CompanyLoginRoute({ component }) {
  const { user } = useAuth();

  if (user.auth) return <Navigate to="/company/dashboard" replace />;
  return component;
}
