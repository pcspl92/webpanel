import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const to = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate(to, { replace: true });
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={onSubmit} className="layout-login">
        <h3 className="fs-4 text-white text-center fw-600">
          PULSE PTT Management System(Agent Login)
        </h3>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <label htmlFor="inputUsername" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUsername"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            value={credentials.username}
          />
        </div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            value={credentials.password}
          />
        </div>
        {Object.keys(errors).length ? <div>{errors.auth}</div> : null}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  };

  return <div className="centerAlign">{renderForm()}</div>;
}
