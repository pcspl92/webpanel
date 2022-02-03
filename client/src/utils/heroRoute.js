import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function HeroRoute({ component }) {
  const { user } = useAuth();
  const agentAccess = new Set(['agent', 'subagent']);
  const companyAccess = new Set(['company']);

  if (user.auth && agentAccess.has(user.type))
    return <Navigate to="/agent/dashboard" replace />;
  if (user.auth && companyAccess.has(user.type))
    return <Navigate to="/company/dashboard" replace />;
  return component;
}
