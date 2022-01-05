import React, { useState } from 'react';
import '../css/index.css';
import { Routes, Route, NavLink } from 'react-router-dom';
export default function Header() {
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