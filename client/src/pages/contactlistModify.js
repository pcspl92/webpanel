import '../css/contactlistModify.css';

import React, { useEffect, useState, useRef } from 'react';
import * as yup from 'yup';

import axios from '../utils/axios';

export default function ContactListCreate() {
  const [loading, setLoading] = useState(true);
  const [contactList, setContactList] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [contactlistarr, setcontactlistarr] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userlist, setuserlist] = useState([]);
  const [contactlistName, setcontactlistName] = useState('');
  //  const [clid, setclid] = useState();

  const selectedUserIds = useRef(new Set());

  useEffect(() => {
    (async () => {
      const { data: users } = await axios.get('/user/ptt');
      const { data: contactlists } = await axios.get('/contactlist/');
      setuserlist(users);
      setcontactlistarr(contactlists);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setContactList('');
    setcontactlistName('');
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

  function onSelect(users) {
    const selected = [];
    selectedUserIds.current.forEach((id) => {
      selected.push(users.filter((user) => user.user_id === id)[0]);
    });
    setSelectedUsers(selected);
  }
  const validate = async (name) => {
    const formData2 = { name };
    console.log(formData2);
    await schema.validate(formData2, { abortEarly: false });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
  
    const users = [];
    selectedUsers.forEach((value) => users.push(value.user_id));
    const data = {
      name: contactlistName,
      userIds: users,
    };
    try {
      await validate(data.name);
      const response = await axios.put(`/contactlist/${contactList}`, data);
      if (response.data.message) {
        alert(response.data.message);
      }
      if (response.data.message==='Contact-List has been updated') {
        reset();
      }
      const { data: contactlists } = await axios.get('/contactlist/');
      setcontactlistarr(contactlists);
      
    } catch (err) {
      
      alert(JSON.stringify(err.response.data));
      reset();
      setDisabled(false);
      console.log(err.response.data);
    }

    setDisabled(false);
  };
  const cldelete = async () => {
    if(contactList===""){
      alert("Please select the contact list")
    }
    else{
      const response = await axios.delete(`/contactlist/${contactList}`);
      setcontactlistarr(contactlistarr.filter((val) => val.id !== contactList));
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
      const { data: contactlists } = await axios.get('/contactlist/');
      setcontactlistarr(contactlists);
    }
  };

  const getFormData = async (listNameId) => {
    if (listNameId !== '0') {
      const { data } = await axios.get(`/contactlist/getData/${listNameId}`);
    const selected = [];
    data.forEach((id) => {
      selected.push(userlist.filter((user) => user.user_id === id.user_id)[0]);
    });
    setSelectedUsers(selected);
  }
    setContactList(listNameId);
  };

  const SelectAcc = ({ users }) => (
    <div>
      <span>PTT User Accounts</span>
      <br />
      <div className="comp">
        <div className="accbox">
          {users.map((val) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              key={val.user_id}
            >
              <input
                type="checkbox"
                id="subitem"
                name="selection"
                style={{ margin: 'none', width: '2vw' }}
                // defaultChecked={selectedUserIds.current.has(val.id)}
                onClick={() => {
                  selectedUserIds.current.has(val.user_id)
                    ? selectedUserIds.current.delete(val.user_id)
                    : selectedUserIds.current.add(val.user_id);
                }}
              />
              <label style={{whiteSpace: 'nowrap'}} htmlFor="selection">{val.user_display_name}</label>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onSelect(users)}>
          &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
        </button>
        <div className="accbox" style={{whiteSpace: 'nowrap'}}>
          {(selectedUsers.length &&
            selectedUsers.map((val) => (
              <div key={val.user_id}>{val.user_display_name}</div>
            ))) ||
            null}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="passback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  return (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY CONTACT LIST
      </div>
      <br />
      <div className="formarea">
        <div>
          <span>
            <label htmlFor="username">Contact list Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="username"
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
        <div>
          <span>
            <label htmlFor="company">
              Select Contact-List :&nbsp;&nbsp;{' '}
            </label>
          </span>
          <select
            id="company"
            onChange={(event) => {
              getFormData(event.target.value);
            }}
            value={contactList}
            required
          >
            <option value="">Select Contact_List</option>
            {contactlistarr.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <SelectAcc users={userlist} />
      </div>
      <br />
      <button type="submit" disabled={disabled}>
        Update
      </button>
      <br />
      <button type="button" onClick={cldelete}>
        Delete
      </button>
    </form>
  );
}
