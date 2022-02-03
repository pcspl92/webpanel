import React from 'react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="loader">
      <div>
        <h3>Welcome to Pulse Agent and Company Management Console</h3>
        <div className="login-buttons">
          <Link to="/agent/">Agent Login</Link>
          <Link to="/company/">Company Login</Link>
        </div>
      </div>
    </div>
  );
}
