import React, { useState, useEffect } from 'react';

import axios from '../utils/axios';
import '../css/departmentCreate.css';

const DepartmentCreate = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [deptname, setdeptname] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

 

  const reset = () => {
    setDisabled(false);
    setusername('');
    setPassword('');
    setdeptname('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

   

    reset();
  };

  const form = () => {
    return (
      <form className="passback" onSubmit={onSubmit}>
        <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
           NEW DEPARTMENT
        </div>
        <br/>
        <div className="formarea">
          <div>
            <span>
              <label htmlFor="username">Account Username: &nbsp;</label>
            </span>
            <input
              type="text"
              id="username"
              onChange={(event) => {
                setusername(event.target.value);
              }}
              value={username}
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label htmlFor="password"> Password : &nbsp;</label>
            </span>
            <input type="password" id="password" required />
          </div>
          <br />
          <div>
            <span>
              <label htmlFor="confirm">Confirm Password : &nbsp;</label>
            </span>
            <input
              type="password"
              id="confirm"
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
              <label htmlFor="display_name">Department Display Name : &nbsp;</label>
            </span>
            <input
              type="text"
              id="display_name"
              onChange={(event) => {
                setdeptname(event.target.value);
              }}
              value={deptname}
              required
            />
          </div>
          <br />
         
          <br />
       
        </div>
        <br />
        <button type="submit" disabled={disabled}>
          Save
        </button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="passback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && form()}</div>;
};
export default DepartmentCreate;
