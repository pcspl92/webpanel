import React, { useState, useEffect } from 'react';
import '../css/Modify.css';
import axios from '../utils/axios';
import generator from 'generate-password-browser';
const ModifyAgent = () => {
  const [agentid, setagentid] = useState('');
  const [agentlist, setagentlist] = useState([]);
  const [active, setactive] = useState(true);
  const [contact_number, setcontact] = useState('');
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
      contact_number,
    };

    try {
      await axios.put(`/subagent/${agentid}`, data);
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
    <form className="modifyback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY SUB-AGENT
      </div>
      <br />
      <br />
      <div className="modifyform">
        <div className="me-5">
          <span>
            <label htmlFor="id1">Select Sub-Agent :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setagentid(event.target.value);
            }}
            required
          >
            <option value="">Select Sub Agent</option>
            {agentlist.map((val) => {
              return (
                <option key={val.id} value={val.id}>
                  {val.display_name}
                </option>
              );
            })}
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
            <label htmlFor="id5">Sub Agent Name :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <input
            type="text"
            id="id5"
            style={{ width: '12vw' }}
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
            type="text"
            id="id5"
            style={{ width: '12vw' }}
            onChange={(event) => {
              setcontact(event.target.value);
            }}
            value={contact_number}
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
