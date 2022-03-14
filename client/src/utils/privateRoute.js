import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function AgentPrivateRoute({ component }) {
  const { user } = useAuth();
  const location = useLocation();
  const companyAccess = new Set(['company']);

  if (!user.auth)
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  if (companyAccess.has(user.type))
    return (
      <Navigate
        to="/company/dashboard"
        state={{ from: location }}
        replace={true}
      />
    );
  return component;
}

export function CompanyPrivateRoute({ component }) {
  const { user } = useAuth();
  const location = useLocation();
  const agentAccess = new Set(['agent', 'subagent']);

  if (!user.auth)
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  if (agentAccess.has(user.type))
    return (
      <Navigate
        to="/agent/dashboard"
        state={{ from: location }}
        replace={true}
      />
    );
  return component;
}
