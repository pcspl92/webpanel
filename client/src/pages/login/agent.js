import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';
import axios from '../../utils/axios';

import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const captcha = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { agentLogin } = useAuth();
  const to = location.state?.from?.pathname || '/agent/dashboard';

  useEffect(() => loadReCaptcha(), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await agentLogin(credentials);
      navigate(to, { replace: true });
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  const onLoadRecaptcha = () => {
    if (captcha.current) captcha.current.reset();
  };

  const verifyCallback = async (token) => {
    try {
      await axios.post('/auth/verify-captcha', { token });
      setDisabled(false);
    } catch (err) {
      setErrors({ auth: 'Incorrect Token Used' });
    }
  };

  const expiredCallback = () => setDisabled(true);

  const renderForm = () => (
    <form onSubmit={onSubmit} className="layout-login">
      <h3 className="fs-4 text-white text-center fw-600 my-4">
        PULSE PTT Management System(Agent Login)
      </h3>
      <div className="text-end mr-3rem mt-3rem">
        <div className="mb-3">
          <label
            htmlFor="inputUsername"
            className="d-inline mx-3 text-white fw-600"
          >
            Username :
          </label>
          <input
            type="text"
            className="d-inline form-input"
            id="inputUsername"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            value={credentials.username}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="inputPassword"
            className="d-inline fw-600 mx-3 text-white"
          >
            Password :
          </label>
          <input
            type="password"
            className="d-inline form-input"
            id="inputPassword"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            value={credentials.password}
          />
        </div>
        <div className="captcha">
          <ReCaptcha
            ref={captcha}
            size="normal"
            data-theme="dark"
            render="explicit"
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
            onloadCallback={onLoadRecaptcha}
            verifyCallback={verifyCallback}
            expiredCallback={expiredCallback}
          />
        </div>
        <button
          type="submit"
          className="btn btn-warning mb-2"
          disabled={disabled}
        >
          Login
        </button>
        {Object.keys(errors).length ? (
          <div className="text-white fw-600">{errors.auth}</div>
        ) : null}
      </div>
    </form>
  );

  return <div className="form-login">{renderForm()}</div>;
}
