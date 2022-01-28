import React, { useState } from 'react';
import '../css/companyModify.css';
import axios from '../utils/axios';

import generator from 'generate-password-browser';
  
const CompanyModify=()=>{
    const [companyid, setcompanyid] = useState('');
    const [sagentlist, setsagentlist] = useState([]);
    const [companylist, setcompanylist] = useState([]);
    const [active, setactive] = useState(true);
    const [contact_number, setcontact] = useState('');
    const [compnewname, setcompnewname] = useState('');
    const [password, setPassword] = useState('');
    const [generated, setGenerated] = useState(false);
    const [disabled, setDisabled] = useState(false);
  
  

  
  
  
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
      <form className="modifyback" >
        <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
          MODIFY COMPANY
        </div>
        <br />
        <br />
        <div className="modifyform">
          <div >
            <span>
              <label htmlFor="id1">Select Company :&nbsp;&nbsp;&nbsp; </label>
            </span>
            <select
              id="id1"
              onChange={(event) => {
                setcompanyid(event.target.value);
              }}
              required
            >
              <option value="">Select Company</option>
              {companylist.map((val) => {
                return (
                  <option key={val.id} value={val.id}>
                    {val.display_name}
                  </option>
                );
              })}
            </select>
          </div>
       
          <div className='mt-3 me-2'>
              <button>Delete</button>
              &nbsp;
              &nbsp;
              &nbsp;

              <button>Relieve</button>
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
              <label htmlFor="id5">Company Name :&nbsp;&nbsp;&nbsp;</label>
            </span>
            <input
              type="text"
              id="id5"
              style={{ width: '12vw' }}
              onChange={(event) => {
                setcompnewname(event.target.value);
              }}
              value={compnewname}
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
        
          <div className='mt-3'>
          <span>
            <label htmlFor="id1">Sub-Agent :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="id1"
         
            required
          >
            <option value="">Select Sub Agent</option>
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
        <button className="mt-3" type="submit" disabled={disabled}>
          UPDATE
        </button>
      </form>
    );
}
export default CompanyModify;