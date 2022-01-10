import React, { useState, useEffect } from 'react';
import '../css/personalCenterChangePassword.css'
import axios from '../utils/axios';
const ChangePassword = () => {
    const [password, setPassword] = useState("");
return(
    <div className='passback'>
   <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
         CHANGE PASSWORD
        </div>
        <div className='formarea'>


        <div>
            <span>
              <label for="id1">New Password: &nbsp;</label>
            </span>
            <input
              type="password"
              id="id1"
              onChange={(event) => {
                password(event.target.value);
              }}
              required
            />
          </div>
          <br />
          <br />
          <div>
            <span>
              <label for="id2">Confirm Password : &nbsp;</label>
            </span>
            <input
              type="password"
              id="id2"
              onChange={(event) => {
                password(event.target.value);
              }}
              required
            />
          </div>
  
        </div>
        <br/>
        <button>UPDATE</button>
    </div>
)
}
export default ChangePassword;