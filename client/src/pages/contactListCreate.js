import '../css/contactlistModify.css';

import React, { useEffect, useState, useRef } from 'react';

import axios from '../utils/axios';

export default function ContactListCreate() {
  const [loading, setLoading] = useState(true);
  const [contactlistName, setcontactlistName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [userlist, setuserlist] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const selectedUserIds = useRef(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/ptt');
      setuserlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setcontactlistName('');
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
      await axios.post('/contactlist/', data);
      reset();
    } catch (err) {
      console.log(err.response.data);
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
            <div key={val.id}>
              <input
                type="checkbox"
                id="subitem"
                name="selection"
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
            onChange={(event) => {
              setcontactlistName(event.target.value);
            }}
            value={contactlistName}
            required
          />
        </div>
        <br />
        <SelectAcc users={userlist} />
      </div>
      <br />
      <button type="submit" disabled={disabled}>
        Save
      </button>
    </form>
  );
}
