import React, { useState } from 'react';
import '../css/index.css';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
export default function Header() {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return (
    <div className="toppart">
      PULSE PTT AGENT MANAGEMENT CONSOLE
      <div className="agentdetails">
        agent display name
        <div style={{ fontSize: '2vh', fontWeight: 'bold' }}>
          Lang &nbsp; &nbsp; logout{' '}
        </div>
      </div>
    </div>
  );
}
