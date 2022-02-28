import React, { useState, useEffect } from 'react';
import generator from 'generate-password-browser';

import { useAuth } from '../hooks/useAuth';
import '../css/companyModify.css';
import axios from '../utils/axios';

const CompanyModify = () => {
  const [sagentlist, setsagentlist] = useState([]);
  const [companylist, setcompanylist] = useState([]);
  const [active, setactive] = useState(true);
  const [type, setType] = useState('modify');
  const [contactNumber, setcontact] = useState('');
  const [compnewname, setcompnewname] = useState('');
  const [password, setPassword] = useState('');
  const [generated, setGenerated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subagent, setSubagent] = useState(0);
  const [company, setCompany] = useState(0);
  const [err, setErr] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (user.type === 'agent') {
        const subagents = await axios.get('/subagent/names');
        setsagentlist(subagents.data);
      }
      const companies = await axios.get('/company/');
      setcompanylist(companies.data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setDisabled(false);
    setPassword('');
    setcompnewname('');
    setcontact('');
    setactive(true);
    setGenerated(false);
    setSubagent(0);
    setCompany(0);
    setType('modify');
  };

  const modifyCompany = async () => {
    const data = {
      password,
      display_name: compnewname,
      contact_number: contactNumber,
      agent_id: subagent,
      status: active ? 'active' : 'paused',
    };

    try {
      await axios.put(`/company/${company}`, data);
    } catch (error) {
      setErr(error.response.data);
    }
  };

  const relieveCompany = async () => {
    try {
      await axios.put(`/company/${company}/relieve`);
    } catch (error) {
      setErr(error.response.data);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      await axios.delete(`/company/${company}`);
      setcompanylist(companylist.filter((com) => com.id !== +companyId));
    } catch (error) {
      setErr(error.response.data);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    switch (type) {
      case 'modify':
        await modifyCompany();
        break;
      case 'relieve':
        await relieveCompany(company);
        break;
      case 'delete':
        await deleteCompany(company);
        break;
      default:
        break;
    }

    reset();
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
        MODIFY COMPANY
      </div>
      <br />
      <br />
      <div className="modifyform">
        <div>
          <span>
            <label htmlFor="company">Select Company :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="company"
            onChange={(event) => {
              setCompany(event.target.value);
            }}
            value={company}
            required
          >
            <option value={0}>Select Company</option>
            {companylist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 me-2">
          <button type="submit" onClick={() => setType('delete')}>
            Delete
          </button>
          &nbsp; &nbsp; &nbsp;
          <button type="submit" onClick={() => setType('relieve')}>
            Relieve
          </button>
        </div>
        <div className="mt-3 me-5">
          <span>
            <label htmlFor="status">Status :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <span>
            <span
              className={active ? 'activeclass' : 'inactiveclass'}
              style={{
                borderTopLeftRadius: '10%',
                borderBottomLeftRadius: '10%',
              }}
              onClick={() => {
                setactive(!active);
              }}
            >
              Active
            </span>
            <span
              className={!active ? 'activeclass' : 'inactiveclass'}
              style={{
                borderTopRightRadius: '10%',
                borderBottomRightRadius: '10%',
              }}
              onClick={() => {
                setactive(!active);
              }}
            >
              Paused
            </span>
          </span>
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
              Company Name :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="display_name"
            
            onChange={(event) => {
              setcompnewname(event.target.value);
            }}
            value={compnewname}
          />
        </div>
        <div className="mt-3 ">
          <span>
            <label htmlFor="contact_number">
              Contact Number :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="contact_number"
        
            onChange={(event) => {
              setcontact(event.target.value);
            }}
            value={contactNumber}
          />
        </div>

        <div className="mt-3">
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
            {sagentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
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
export default CompanyModify;
