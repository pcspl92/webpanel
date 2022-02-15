/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import generator from 'generate-password-browser';

import { useAuth } from '../hooks/useAuth';
import '../css/departmentModify.css';
import axios from '../utils/axios';

const DepartmentModify = () => {
  const [departmentlist, setdepartmentlist] = useState([]);
  const [deptnewname, setdeptnewname] = useState('');
  const [password, setPassword] = useState('');
  const [generated, setGenerated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('0');
  const [err, setErr] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/department/');
      setdepartmentlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setPassword('');
    setdeptnewname('');
    setGenerated(false);
    setDepartment('0');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      display_name: deptnewname,
      password,
    };

    try {
      await axios.put(`/department/${department}`, data);
      reset();
    } catch (err) {
      console.log(err.resposnse.data);
    }

    setDisabled(false);
  };

  const generatePassword = () => {
    const pwd = generator.generate({
      length: 8,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    setPassword(pwd);
  };

  const form = () => (
    <form className="modifyback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY DEPARTMENT
      </div>
      <br />
      <div className="modifyform">
        <div>
          <span>
            <label htmlFor="company">
              Select Department :&nbsp;&nbsp;&nbsp;{' '}
            </label>
          </span>
          <select
            id="company"
            onChange={(event) => {
              setDepartment(event.target.value);
            }}
            value={department}
            required
          >
            <option value={'0'}>Select Company</option>
            {departmentlist.map((val) => {
              return (
                <option key={val.id} value={val.id}>
                  {val.display_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mt-3 me-5">
          <span>Password : &nbsp;&nbsp;&nbsp;</span>
          <button
            type="button"
            style={{ width: '8.5vw' }}
            onClick={() => {
              setGenerated(true);
              generatePassword();
            }}
          >
            RESET
          </button>
        </div>
        {generated && (
          <div className="mt-3 me-5">New Generated Password : {password}</div>
        )}
        <div className="mt-3">
          <span>
            <label htmlFor="display_name">
              Department Display Name :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="display_name"
            style={{ width: '12vw' }}
            onChange={(event) => {
              setdeptnewname(event.target.value);
            }}
            value={deptnewname}
          />
        </div>
      </div>
      <button className="mt-3" type="submit" disabled={disabled}>
        UPDATE
      </button>
      <div className="text-danger">{err?.company}</div>
    </form>
  );

  if (loading) {
    return (
      <div className="modifyback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && form()}</div>;
};
export default DepartmentModify;
