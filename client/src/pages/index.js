import React from 'react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="form-login">
      <div>
        <h3>Welcome to Pulse Agent and Company Management Console</h3>
        <h6>Version : 0.1.1</h6>
        <div className="login-buttons">
          <Link to="/agent/">Agent Login</Link>
          <Link to="/company/">Company Login</Link>
        </div>
      </div>
    </div>
  );
}
