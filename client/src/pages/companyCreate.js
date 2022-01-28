import React, { useState } from 'react';

import axios from '../utils/axios';
import '../css/companyCreate.css'  

const CompanyCreate = () => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [compname, setcompname] = useState('');
    const [contnum,setcontnum]=useState('');
    const [sagentlist,setsagentlist]=useState([]);


  
 
  
    return (
      <form className="passback" >
        <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
          CREATE NEW COMPANY
        </div>
        <div className="formarea">
          <div>
            <span>
              <label for="id1">Account Username: &nbsp;</label>
            </span>
            <input
              type="text"
              id="id1"
              onChange={(event) => {
                setusername(event.target.value);
              }}
              value={password}
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label for="id2"> Password : &nbsp;</label>
            </span>
            <input
              type="password"
              id="id2"
          
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label for="id2">Confirm Password : &nbsp;</label>
            </span>
            <input
              type="password"
              id="id3"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
          </div>
          <br />
          <div>
            <span>
              <label for="id1">Company Name : &nbsp;</label>
            </span>
            <input
              type="text"
              id="id4"
              onChange={(event) => {
                setusername(event.target.value);
              }}
              value={password}
              required
            />
          </div>
          <br/>
          <div>
            <span>
              <label for="id1">Contact Number : &nbsp;</label>
            </span>
            <input
              type="text"
              id="id4"
              onChange={(event) => {
                setcontnum(event.target.value);
              }}
              value={password}
              required
            />
          </div>
          <br/>
          <div >
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
        <br />
        <button type="submit" >
          Save
        </button>
      </form>
    );
}
export default CompanyCreate;