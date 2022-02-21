import React, { useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import '../css/departmentModify.css';
import axios from '../utils/axios';

const TalkGroupModify = () => {
  const [tglist, settgtlist] = useState([]);
  const [tgnewname, settgnewname] = useState('');

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [talkgroup, setTalkgroup] = useState('0');
  const [err, setErr] = useState({});

 

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/talkgroup/');
      settgtlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    settgnewname('');
    setTalkgroup('0');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      name: tgnewname,
    };

    try {
      await axios.put(`/talkgroup/${talkgroup}`, data);
      reset();
    } catch (err) {
      console.log(err.response.data);
    }

    setDisabled(false);
  };

  const form = () => (
    <form className="modifyback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY TALK-GROUP
      </div>
      <br />
      <div className="modifyform">
        <div>
          <span>
            <label htmlFor="company">
              Select Talk-Group :&nbsp;&nbsp;&nbsp;{' '}
            </label>
          </span>
          <select
            id="company"
            onChange={(event) => {
              setTalkgroup(event.target.value);
            }}
            value={talkgroup}
            required
          >
            <option value={0}>Select Talk-Group</option>
            {tglist.map((val) => {
              return (
                <option key={val.id} value={val.id}>
                  {val.tg_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mt-3">
          <span>
            <label htmlFor="display_name">
              Talkgroup Name :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="display_name"
            style={{ width: '12vw' }}
            onChange={(event) => {
              settgnewname(event.target.value);
            }}
            value={tgnewname}
          />
        </div>
      </div>
      <button className="mt-3" type="submit" disabled={disabled}>
        UPDATE
      </button>
      <div className="text-danger">{err?.company}</div>
    </form>
  );

  if (loading) {
    return (
      <div className="modifyback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && form()}</div>;
};
export default TalkGroupModify;
