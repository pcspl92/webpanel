import React, { useState, useEffect } from 'react';
import '../css/Modify.css';
import generator from 'generate-password-browser';
import axios from '../utils/axios';

const ModifyAgent = () => {
  const [agentid, setagentid] = useState('');
  const [agentlist, setagentlist] = useState([]);
  const [active, setactive] = useState(true);
  const [contactNumber, setcontact] = useState('');
  const [agentnewname, setagentnewname] = useState('');
  const [password, setPassword] = useState('');
  const [generated, setGenerated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/names');
      setagentlist(data);
    })();
  }, []);

  const reset = () => {
    setagentid('');
    setactive(true);
    setcontact('');
    setagentnewname('');
    setPassword('');
    setGenerated(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      password,
      display_name: agentnewname,
      contactNumber,
      status: active ? 'active' : 'paused',
    };

    try {
      const response = await axios.put(`/subagent/${agentid}`, data);
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
      setDisabled(false);
    } catch (err) {
      console.log(err.response.data);
    }
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

  return (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY SUB-AGENT
      </div>
      <br />
      <br />
      <div className="modifyform">
        <div>
          <span>
            <label htmlFor="id1">Select Sub-Agent : </label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setagentid(event.target.value);
            }}
            required
          >
            <option value="">Select Sub Agent</option>
            {agentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 me-5">
          <span>
            <label htmlFor="id1">Status :&nbsp;&nbsp;&nbsp;</label>
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
        <div className="mt-3">
          <span>Password : &nbsp;&nbsp;</span>
          <button
            type="button"
            style={{ width: '13vw' }}
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
            <label htmlFor="id5">Sub Agent Name :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <input
            type="text"
            id="id5"
            onChange={(event) => {
              setagentnewname(event.target.value);
            }}
            value={agentnewname}
          />
        </div>
        <div className="mt-3 ">
          <span>
            <label htmlFor="id5">Contact Number :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <input
            type="number"
            id="id5"
            onChange={(event) => {
              setcontact(event.target.value);
            }}
            value={contactNumber}
          />
        </div>
      </div>
      <button className="mt-3" type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};

export default ModifyAgent;
