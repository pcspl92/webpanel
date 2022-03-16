import React, { useState } from 'react';

import axios from '../utils/axios';
import '../css/talkGroupCreate.css';

const TalkGroupCreate = () => {
  const [tgname, settgname] = useState('');

  const [disabled, setDisabled] = useState(false);

  const reset = () => {
    settgname('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      name: tgname,
    };

    try {
      const response = await axios.post('/talkgroup/', data);
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
    } catch (err) {
      console.log(err.response.data);
    }

    setDisabled(false);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        NEW TALK-GROUP
      </div>
      <br />
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

  return <div>{form()}</div>;
};
export default TalkGroupCreate;
