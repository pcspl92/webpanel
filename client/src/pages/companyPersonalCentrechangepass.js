import React, { useState } from 'react';
import '../css/personalCenterChangePassword.css';

import axios from '../utils/axios';
import * as yup from 'yup';

const CompanyChangePassword = () => {
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorm, seterrorm] = useState('');

  const schema = yup.object().shape({
    password: yup
      .string()
      .typeError('Password must be string')
      .required('This field is required')
      .matches(/^\S+$/, 'Password cannot contain whitespace')
      .min(8, 'Password must be 8-30 characters long')
      .max(30, 'Password must be 8-30 characters long'),
  });

  const validate = async (password) => {
    const formData2 = { password}; 
    console.log(formData2);
    await schema.validate(formData2, { abortEarly: false });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (confirmPassword === password) {
      try {
        await validate(password);
        const { data } = await axios.put('/auth/password/company', { password });
        // console.log(data)
        alert(data)
        setDisabled(false);
        setPassword('');
        setConfirmPassword('');
        seterrorm('');
      } catch (err) {
        alert(err)
        setDisabled(false);
        setPassword('');
        setConfirmPassword('');
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
      <br/>
      <div className="formarea">
        <div>
          <span>
            <label htmlFor="id1">New Password : &nbsp;</label>
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
        <div>
          <span>
            <label htmlFor="id2">Confirm Password : &nbsp;</label>
          </span>
          <input
            type="password"
            id="id2"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />
        </div>
        <br />
        <div className="text-danger fw-600">{errorm}</div>
      </div>
      <button type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};
export default CompanyChangePassword;
