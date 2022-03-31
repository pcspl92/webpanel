import React, { useState, useEffect } from 'react';

import axios from '../utils/axios';
import '../css/talkGroupCreate.css';

const TalkGroupCreate = () => {
  const [tgname, settgname] = useState('');
  const [newid, setnewid] = useState(0);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('talkgroup/gettalkgroupid');
      console.log(data);
      setnewid(data.talkgroup_id);
    })();
  }, []);
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
            pattern=".{3,40}"
            required
            title="3 to 40 characters"
            onChange={(event) => {
              settgname(event.target.value);
            }}
            value={tgname}
          />
        </div>
        <br />
        Talkgroup ID (auto-generated) : {newid}
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
