import React, { useState } from 'react';
import '../css/personalCenterChangePassword.css';
import { FaEye,FaEyeSlash } from 'react-icons/fa';
import axios from '../utils/axios';
import * as yup from 'yup';

const CompanyChangePassword = () => {
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorm, seterrorm] = useState('');

  const [passwordShown1, setPasswordShown1] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);

  const togglePasswordVisiblity1 = () => {
    setPasswordShown1(passwordShown1 ? false : true);
  };

  const togglePasswordVisiblity2 = () => {
    setPasswordShown2(passwordShown2 ? false : true);
  };

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
    const formData2 = {password}; 
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
        <div style={{position:'relative'}}>
          <span>
            <label htmlFor="id1">New Password : &nbsp;</label>
          </span>
          <input
            type={passwordShown1 ? "text" : "password"}
            id="id1"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            required
          />
          <i className='field-icon' onClick={togglePasswordVisiblity1}>{passwordShown1===false?<FaEyeSlash/>:<FaEye/>}</i>
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">Confirm Password : &nbsp;</label>
          </span>
          <input
            type={passwordShown2 ? "text" : "password"}
            id="id2"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />
          <i className='field-icon' onClick={togglePasswordVisiblity2}>{passwordShown2===false?<FaEyeSlash/>:<FaEye/>}</i>
        </div>
        <br />
        <div className="text-danger fw-600">{errorm}</div>
      </div>
      <button  style={{fontSize:'2vh'}} type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};
export default CompanyChangePassword;
