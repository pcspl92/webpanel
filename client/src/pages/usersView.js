import React, { useState, useEffect } from 'react';
import '../css/userView.css';
import axios from '../utils/axios';
const ViewUsers = () => {
    const [companyName, setCompanyName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [userName, setuserName] = useState('');
      const [expiryDate,setexpiryDate]=useState('');
    const [agentaccname, setagentaccname] = useState('');
    const [userlist, setuserlist] = useState([]);

return (
    <div className="viewback">
    <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
      VIEW USERS
    </div>

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
          required
        />
      </div>
      <br/>
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
          required
        />
      </div>  
      <br/>  <div>
        <span>
          <label for="id1">License Expiring After: &nbsp;</label>
        </span>
        <input
          type="date"
          id="id4"
          onChange={(event) => {
            setexpiryDate(event.target.value);
          }}
          required
        />
      </div>
    </div>
    <div className="mt-3">
      <button
        className="p-1 me-5 font-weight-bold"
        style={{ fontSize: '1vw' }}
      >
        Search
      </button>

      <button className="p-1 font-weight-bold" style={{ fontSize: '1vw' }}>
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
        <th> </th>
      </tr>
      {userlist.map((val, index) => {
        index++;
        return (
          <tr>
            <th>{index}</th>
            <th>{val.userName}</th>
            <th>{val.accountName}</th>
            <th>{val.companyName}</th>
            <th>{val.accountType}</th>
            <th>{val.status}</th>
            <th>{val.licenseId}</th>
            <th>{val.licenseExpiry}</th>
            <th>{val.agentName}</th>
            <th> </th>
         
          </tr>
        );
      })}
    </table>
  </div>

)


}
export default ViewUsers;