import React, { useState, useEffect } from 'react';
import '../css/Modify.css';
import generator from 'generate-password-browser';
import axios from '../utils/axios';
import * as yup from 'yup';

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
    setagentid('0');
    setactive(true);
    setcontact('');
    setagentnewname('');
    setPassword('');
    setGenerated(false);
  };

  const schema = yup.object().shape({
    display_name: yup
      .string()
      .typeError('Sub-Agent name must be string')
      .matches(/[^\s*].*[^\s*]/g, '* This field cannot contain only blankspaces')
      .required('This field is required')
      .min(3, 'Sub-Agent name must be 3-90 characters long')
      .max(90, 'Sub-Agent name must be 3-90 characters long'),
    contact_number: yup
      .string()
      .required('This field is required')
      .matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        "Contact number is not valid"
      ),
  });

  const validate = async (data) => {
    await schema.validate(data, { abortEarly: false });
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      password,
      display_name: agentnewname,
      contact_number: contactNumber,
      status: active ? 'active' : 'paused',
    };
    if (contactNumber === '' && agentnewname === '') {
      alert("Please fill all the fields");
      setDisabled(false);
    } else {
      try {
        await validate(data);
        const response = await axios.put(`/subagent/${agentid}`, data);
        if (response.data.message) {
          alert(response.data.message);
        }
        reset();
        setDisabled(false);
      } catch (err) {
        console.log(err);
        setDisabled(false);
      }
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
            value={agentid}
            required
          >
            <option value=''>Select Sub Agent</option>
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
            <label htmlFor="subagent">Sub Agent Name :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <input
            type="text"
            id="subagent"
            onChange={(event) => {
              setagentnewname(event.target.value);
            }}
            value={agentnewname}
          />
        </div>
        <div className="mt-3 ">
          <span>
            <label htmlFor="contact_number">Contact Number :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <input
            type="number"
            id="contact_number"
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
