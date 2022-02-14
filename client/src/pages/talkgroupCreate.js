import React, { useState, useEffect } from 'react';

import axios from '../utils/axios';
import '../css/talkGroupCreate.css';

const TalkGroupCreate = () => {
  const [tgname, settgname] = useState('');

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

 

  const reset = () => {
    setDisabled(false);
  
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

   

    reset();
  };

  const form = () => {
    return (
      <form className="passback" onSubmit={onSubmit}>
        <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
           NEW TALK-GROUP
        </div>
        <br/>
        <div className="formarea">
          <div>
            <span>
              <label htmlFor="username">Talk-Group Name: &nbsp;</label>
            </span>
            <input
              type="text"
              id="username"
              onChange={(event) => {
                settgname(event.target.value);
              }}
              value={tgname}
              required
            />
          </div>
          <br />
       
         
        
         
       
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
export default TalkGroupCreate;