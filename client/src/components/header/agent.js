import '../../css/index.css';

import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const restrictedPaths = new Set(['/', '/company/', '/agent/']);
  if (restrictedPaths.has(location.pathname)) return null;

  return (
    <div className="toppart">
      PULSE PTT AGENT MANAGEMENT CONSOLE
      <div className="agentdetails">
        {user.display_name}
        <div className="header-options">
          <div>Lang</div>
          <div onClick={logout}>Logout</div>
        </div>
      </div>
    </div>
  );
}
