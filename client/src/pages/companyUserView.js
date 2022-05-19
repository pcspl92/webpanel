import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../css/CompanyUserView.css';
import axios from '../utils/axios';

const CompanyUserView = () => {
  const [orderID, setorderID] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [userDisplayName, setuserDisplayName] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [userupdlist, setuserupdlist] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/company-panel');
      console.log(data);
      setTableData(data);
      setuserupdlist(data);
      setLoading(false);
    })();
  }, []);

  const accountTypeFilter = () =>tableData.filter((rec) =>
      rec.account_type.toLowerCase().includes(accountType.toLowerCase())
    );
  const orderIDFilter = () =>
     tableData.filter((rec) => rec.order_id == orderID );
  
  const accountFilter = () =>
    tableData.filter((rec) =>
      rec.account_name.toLowerCase().includes(accountName.toLowerCase())
    );

  const userFilter = () =>
    tableData.filter((rec) =>
      rec.user_display_name
        .toLowerCase()
        .includes(userDisplayName.toLowerCase())
    );

  const expiryFilter = () =>
    tableData.filter((rec) => moment(rec.license_renewal).isAfter(expiryDate));

  const filter = () => {
    if (accountType.length) setuserupdlist(accountTypeFilter());
    if (orderID) setuserupdlist(orderIDFilter());
    if (accountName.length) setuserupdlist(accountFilter());
    if (userDisplayName.length) setuserupdlist(userFilter());
    if (expiryDate.length) setuserupdlist(expiryFilter());
    if(orderID==='' && accountName==='' && accountType==='' && userDisplayName==='' && expiryDate==='') alert("Please select any fields")
  };

  const reset = () => {
    setorderID('');
    setAccountName('');
    setuserDisplayName('');
    setexpiryDate('');
    setAccountType('');
  };

  const unFilter = () => {
    setuserupdlist(tableData);
    reset();
  };
  //console.log('table-data', tableData);

  if (loading) {
    return (
      <div className="viewback2">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  };

  return (
    <div className="viewback2">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>VIEW USERS</div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label htmlFor="id1">User Account Type: &nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setAccountType(event.target.value);
            }}
            value={accountType}
            required
          >
            <option value={0}>Select Account  Type</option>
            <option value={'ptt'}>PTT User</option>
            <option value={'dispatcher'}>Dispatcher</option>
            <option value={'control'}>Control Station</option>
          </select>
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id1">Order ID: &nbsp;</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setorderID(event.target.value);
            }}
            value={orderID}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">User Display Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setuserDisplayName(event.target.value);
            }}
            value={userDisplayName}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id1">Account Name: &nbsp;</label>
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
            <label htmlFor="id1">License Expiring After: &nbsp;</label>
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
          <th>Order ID</th>
          <th>Account Name</th>
          <th>
            User Display
            <br /> Name
          </th>

          <th>Account Type</th>
          <th>Creation Date</th>
          <th>Contact Person</th>
          <th>License Type</th>
          <th>License Renewal Date</th>
          <th>User Status</th>
          <th>Online</th>
          <th>Features</th>
        </tr>
        {userupdlist.map((val, index) => (
          <tr key={val.license_id}>
            <th>{index + 1}</th>
            <th>{val.order_id}</th>
            <th>{val.account_name}</th>
            <th>{val.user_display_name}</th>
            <th>{val.account_type}</th>
            <th>{moment(val.creation_date).format('DD-MM-YYYY')}</th>
            <th>{val.contact_person}</th>
            <th>{val.license_type}</th>
            <th>{moment(val.license_renewal).format('DD-MM-YYYY')}</th>
            <th>{val.status}</th>
            <th>{val.online}</th>

            <th>
              {val.enc ? 'Encryption, ' : null}
              {val.grp_call ? 'Group Call, ' : null}
              {val.chat ? 'Chat, ' : null}
              {val.priv_call ? 'Private Call, ' : null}
              {val.geo_fence ? 'Geo Fence, ' : null}
              {val.live_gps ? 'Live GPS' : null}
            </th>
          </tr>
        ))}
      </table>
      {userupdlist.length === 0 ? (
        <div className="text-danger fw-500">No Matching Records Exist </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default CompanyUserView;
