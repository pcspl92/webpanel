import React, { useState } from 'react';
import '../css/personalCenterChangePassword.css';
import { FaEye } from 'react-icons/fa';
import axios from '../utils/axios';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [errorm, seterrorm] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [passwordShown1, setPasswordShown1] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);

  const togglePasswordVisiblity1 = () => {
    setPasswordShown1(passwordShown1 ? false : true);
  };

  const togglePasswordVisiblity2 = () => {
    setPasswordShown2(passwordShown2 ? false : true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if(errorm){
      alert("Password not Match")
      setDisabled(false);
    }else{
      try {
        const {data}=await axios.put('/auth/password/agent', { password });
        alert(data);
        setDisabled(false);
        setPassword('');
        setconfirmPassword('')
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };

  return (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        CHANGE PASSWORD
      </div>
      <br />
      <div className="formarea">
        <div>
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
          <i onClick={togglePasswordVisiblity1}><FaEye/></i>
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
              const cnf=event.target.value;
              setconfirmPassword(cnf);
              if(password===cnf) seterrorm('');
              else seterrorm('Confirm Password and Password should match');
            }}
            required
            value={confirmPassword}
          />
          <i onClick={togglePasswordVisiblity2}><FaEye/></i>
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
