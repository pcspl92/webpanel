import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import '../css/departmentModify.css';
import axios from '../utils/axios';

const TalkGroupModify = () => {
  const [tglist, settgtlist] = useState([]);
  const [tgnewname, setTgnewname] = useState('');

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
  }, [talkgroup]);

  const reset = () => {
    setTgnewname('');
    setTalkgroup('0');
  };
  const schema = yup.object().shape({
    name: yup
      .string()
      .typeError('Talk-Group name must be string')
      .required('This field is required')
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, 'Invalid Talk-Group name')
      .min(3, 'Username must be 3-40 characters long')
      .max(40, 'Username must be 3-40 characters long'),
  });
  const validate = async (name) => {
    const formData2 = { name };
    await schema.validate(formData2, { abortEarly: false });
  };
  const deleteTalkgroup = async () => {
    if(talkgroup==="0"){
      alert("Please select a talkgroup")
    }
    else{
      const response = await axios.delete(`/talkgroup/${talkgroup}`);
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      name: tgnewname,
    };
    try {
      await validate(data.name);

      const response = await axios.put(`/talkgroup/${talkgroup}`, data);
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
    } catch (error) {
      console.log(error);
      setErr(error.response.data);
    }

    setDisabled(false);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
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
            <option value="">Select Talk-Group</option>
            {tglist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.tg_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <span>
            <label htmlFor="display_name">
              Talkgroup Name :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="display_name"
            pattern=".{3,40}"
            required
            title="3 to 40 characters"
            onChange={(event) => {
              setTgnewname(event.target.value);
            }}
            value={tgnewname}
          />
        </div>
      </div>
      <button className="mt-4" type="submit" disabled={disabled}>
        UPDATE
      </button>
      <button
        className="mt-4"
        type="button"
        onClick={deleteTalkgroup}
        disabled={disabled}
      >
        DELETE
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
