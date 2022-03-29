import React, { useState } from 'react';
import '../css/personalCenterChangePassword.css';

import axios from '../utils/axios';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [errorm, seterrorm] = useState('');

  const [confirmPassword, setconfirmPassword] = useState('');

  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if (confirmPassword === password) {
      try {
        await axios.put('/auth/password/agent', { password });
        setDisabled(false);
        setPassword('');
      } catch (err) {
        console.log(err.response.data);
      }
    } else {
      seterrorm('Confirm Password and Password should match');
      setDisabled(false);
    }
  };

  return (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        CHANGE PASSWORD
      </div>
      <div className="formarea">
        <div>
          <span>
            <label htmlFor="id1">New Password: &nbsp;</label>
          </span>
          <input
            type="password"
            id="id1"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            required
          />
        </div>
        <br />
        <br />
        <div>
          <span>
            <label htmlFor="id2">Confirm Password : &nbsp;</label>
          </span>
          <input
            type="password"
            id="id2"
            onChange={(event) => {
              setconfirmPassword(event.target.value);
            }}
            required
          />
        </div>
        <br />
        <div className="text-danger fw-600">{errorm}</div>
      </div>
      <br />
      <button type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};
export default ChangePassword;
