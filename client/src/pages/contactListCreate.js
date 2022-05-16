import '../css/contactlistModify.css';

import React, { useEffect, useState, useRef } from 'react';
import * as yup from 'yup';
import axios from '../utils/axios';

export default function ContactListCreate() {
  const [loading, setLoading] = useState(true);
  const [contactlistName, setcontactlistName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [userlist, setuserlist] = useState([]);
  const [newid, setnewid] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const selectedUserIds = useRef(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/ptt');
      const { data: datatg } = await axios.get('contactlist/getclid');
      setnewid(datatg.contactlist_id);
      setuserlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setcontactlistName('');
    setnewid(newid+1);
    setSelectedUsers([]);
  };
  const schema = yup.object().shape({
    name: yup
      .string()
      .typeError('Contactlist name must be string')
      .required('This field is required')
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, 'Invalid Contactlist name')
      .min(3, 'Username must be 3-40 characters long')
      .max(40, 'Username must be 3-40 characters long'),
  });
  const validate = async (name2) => {
    console.log(name2)
    const  {name } = name2;
    console.log(name)
    await schema.validate(name2, { abortEarly: false });
  };
  function onSelect(users) {
    const selected = [];
    selectedUserIds.current.forEach((id) => {
      selected.push(users.filter((user) => user.id === id)[0]);
    });
    setSelectedUsers(selected);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const users = [];
    selectedUserIds.current.forEach((id) => users.push(id));
    const data = {
      name: contactlistName,
      userIds: users,
    };
    try {

      if (users.length === 0) {
        alert("Please Select the PTT User.");
      } else {
        await validate(data);
        const response = await axios.post('/contactlist/', data);
        if (response.data.message) {
          alert(response.data.message);
        }
        reset();
      }
    } catch (error) {
      if (error.inner.length) {
        const validateErrors = error.inner.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
          {}
        );
        setErrors(validateErrors);
      } else {
        console.log(error.response.data);
      }
    }

    setDisabled(false);
  };

  const SelectAcc = ({ users }) => (
    <div>
      <span>Add PTT User Accounts</span>
      <br />
      <div className="comp">
        <div className="accbox">
          {users.map((val) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              key={val.id}
            >
              <input
                type="checkbox"
                id="subitem"
                name="selection"
                style={{ margin: 'none', width: '2vw' }}
                defaultChecked={selectedUserIds.current.has(val.id)}
                onClick={() => {
                  selectedUserIds.current.has(val.id)
                    ? selectedUserIds.current.delete(val.id)
                    : selectedUserIds.current.add(val.id);
                }}
              />
              <label htmlFor="selection">{val.display_name}</label>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onSelect(users)}>
          &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
        </button>
        <div className="accbox">
          {(selectedUsers.length &&
            selectedUsers.map((val) => (
              <div key={val.id}>{val.display_name}</div>
            ))) ||
            null}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="passback">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }
  return (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        NEW CONTACT LIST
      </div>
      <br />
      <div className="formarea">
        <div>
          <span>
            <label htmlFor="username">Contact list Name: &nbsp;</label>
          </span>
          <input
            type="text"
            id="username"
            name="username"
            pattern=".{3,40}"
            required
            title="3 to 40 characters"
            onChange={(event) => {
              setcontactlistName(event.target.value);
            }}
            value={contactlistName}
          />
        </div>
        <br />
        <div className="text-danger fw-600">{errors?.name}</div>

        <SelectAcc users={userlist} />
      </div>
      <br />
      Contact List ID (auto-generated) : {newid}
      <br />
      <button type="submit" disabled={disabled}>
        Save
      </button>
    </form>
  );
}
