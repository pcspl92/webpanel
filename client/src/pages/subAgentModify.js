import React, { useState, useEffect } from 'react';
import '../css/Modify.css';
import generator from 'generate-password-browser';
import axios from '../utils/axios';
import * as yup from 'yup';

const ModifyAgent = () => {
  const [agentid, setagentid] = useState('');
  const [agentlist, setagentlist] = useState([]);
  const [active, setactive] = useState('');
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
      .required()
      .matches(
        /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
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
      status: active 
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

  const getFormData = async (agentID) => {
    if (agentID !== '0') {
      const { data } = await axios.get(`/subagent/modify/${agentID}`);
      console.log(data);
      setagentnewname(data[0].display_name);
      setcontact(data[0].contact_number);
      setactive(data[0].status);
      }else reset();
    }

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
            <label htmlFor="id1">Select Sub-Agent :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setagentid(event.target.value);
              getFormData(event.target.value);
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
            <label htmlFor="status">Status :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <span>
            <span
              className={active==='active' ? 'CMactiveclassActive' : 'CMinactiveclass'}
              style={active===''?{backgroundColor:'gray'}:null}
              onClick={() => {
                setactive('active');
              }}
            >
              Active
            </span>
            <span
              className={active==='paused' ? 'CMactiveclassPause' : 'CMinactiveclass'}
              style={active===''?{backgroundColor:'gray'}:null}
              onClick={() => {
                setactive('paused');
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
            type="tel"
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
