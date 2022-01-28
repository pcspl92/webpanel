import React, { useState, useEffect } from 'react';

import axios from '../utils/axios';
import '../css/companyCreate.css';

const CompanyCreate = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [compname, setcompname] = useState('');
  const [contnum, setcontnum] = useState('');
  const [subagent, setSubagent] = useState(0);
  const [sagentlist, setsagentlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/names');
      setsagentlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setDisabled(false);
    setusername('');
    setPassword('');
    setcompname('');
    setcontnum('');
    setSubagent(0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      username,
      password,
      display_name: compname,
      contact_number: contnum,
      subagent_id: subagent,
    };

    try {
      await axios.post('/company/', data);
    } catch (err) {
      console.log(err.response.data);
    }

    reset();
  };

  const form = () => {
    return (
      <form className="passback" onSubmit={onSubmit}>
        <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
          CREATE NEW COMPANY
        </div>
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
              <label htmlFor="display_name">Company Name : &nbsp;</label>
            </span>
            <input
              type="text"
              id="display_name"
              onChange={(event) => {
                setcompname(event.target.value);
              }}
              value={compname}
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label htmlFor="contact">Contact Number : &nbsp;</label>
            </span>
            <input
              type="text"
              id="contact"
              onChange={(event) => {
                setcontnum(event.target.value);
              }}
              value={contnum}
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label htmlFor="subagent">Sub-Agent :&nbsp;&nbsp;&nbsp; </label>
            </span>
            <select
              id="subagent"
              onChange={(event) => {
                setSubagent(event.target.value);
              }}
              value={subagent}
              required
            >
              <option value={0}>Select Sub Agent</option>
              {sagentlist.map((val) => {
                return (
                  <option key={val.id} value={val.id}>
                    {val.display_name}
                  </option>
                );
              })}
            </select>
          </div>
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
export default CompanyCreate;
