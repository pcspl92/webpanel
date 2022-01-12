import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../css/userView.css';
import axios from '../utils/axios';

const ViewUsers = () => {
  const [companyName, setCompanyName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [userName, setuserName] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [userlist, setuserlist] = useState([]);
  const [userupdlist, setuserupdlist] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/agent-panel');
      setuserlist(data);
      setuserupdlist(data);
    })();
  }, []);

  const companyFilter = () => {
    return userlist.filter((rec) =>
      rec.company_name.toLowerCase().includes(companyName.toLowerCase())
    );
  };

  const accountFilter = () => {
    return userlist.filter((rec) =>
      rec.account_name.toLowerCase().includes(accountName.toLowerCase())
    );
  };

  const userFilter = () => {
    return userlist.filter((rec) =>
      rec.user_name.toLowerCase().includes(userName.toLowerCase())
    );
  };

  const expiryFilter = () => {
    return userlist.filter((rec) =>
      moment(rec.license_expiry).isAfter(expiryDate)
    );
  };

  const filter = () => {
    if (companyName.length) setuserupdlist(companyFilter());
    if (accountName.length) setuserupdlist(accountFilter());
    if (userName.length) setuserupdlist(userFilter());
    if (expiryDate.length) setuserupdlist(expiryFilter());
  };

  const reset = () => {
    setCompanyName('');
    setAccountName('');
    setuserName('');
    setexpiryDate('');
  };

  const unFilter = () => {
    setuserupdlist(userlist);
    reset();
  };

  return (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>VIEW USERS</div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label for="id1">Company Name: &nbsp;</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setCompanyName(event.target.value);
            }}
            value={companyName}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label for="id2">User Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setuserName(event.target.value);
            }}
            value={userName}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label for="id1">Account Name: &nbsp;</label>
          </span>
          <input
            type="text"
            id="id3"
            onChange={(event) => {
              setAccountName(event.target.value);
            }}
            value={accountName}
            required
          />
        </div>
        <br />{' '}
        <div>
          <span>
            <label for="id1">License Expiring After: &nbsp;</label>
          </span>
          <input
            type="date"
            id="id4"
            onChange={(event) => {
              setexpiryDate(event.target.value);
            }}
            value={expiryDate}
            required
          />
        </div>
      </div>
      <div className="mt-3">
        <button
          className="p-1 me-5 font-weight-bold"
          style={{ fontSize: '1vw' }}
          onClick={filter}
        >
          Search
        </button>

        <button
          className="p-1 font-weight-bold"
          style={{ fontSize: '1vw' }}
          onClick={unFilter}
        >
          {' '}
          View All
        </button>
      </div>
      <table className="mt-3">
        <tr className="tableheading">
          <th>S. No</th>
          <th>User Name</th>
          <th>Account Name</th>
          <th>Company Name</th>
          <th>Account Type</th>
          <th>Status</th>
          <th>License ID</th>
          <th>License Expiry</th>
          <th>Agent Name</th>
          <th></th>
        </tr>
        {userupdlist.map((val, index) => {
          return (
            <tr key={val.license_id}>
              <th>{index + 1}</th>
              <th>{val.user_name}</th>
              <th>{val.account_name}</th>
              <th>{val.company_name}</th>
              <th>{val.account_type}</th>
              <th>{val.status}</th>
              <th>{val.license_id}</th>
              <th>{moment(val.license_expiry).format('DD-MM-YYYY')}</th>
              <th>{val.agent_name}</th>
              <th> </th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
export default ViewUsers;
