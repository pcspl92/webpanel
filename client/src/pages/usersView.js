import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../css/userView.css';
import axios from '../utils/axios';
import ReactPaginate from "react-paginate";

const ViewUsers = () => {
  const [companyName, setCompanyName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [userName, setuserName] = useState('');
  const [expiryDate, setexpiryDate] = useState('');
  const [userlist, setuserlist] = useState([]);
  const [userupdlist, setuserupdlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/agent-panel');
      console.log(data);
      setuserlist(data);
      setuserupdlist(data);
      setLoading(false);
    })();
  }, []);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const currentPageData = userupdlist.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(userupdlist.length / PER_PAGE);

  // const companyFilter = () =>
  //   userlist.filter((rec) =>
  //     rec.company_name.toLowerCase().includes(companyName.toLowerCase().trim())
  //   );

  // const accountFilter = () =>
  //   userlist.filter((rec) =>
  //     rec.account_name.toLowerCase().includes(accountName.toLowerCase().trim())
  //   );

  // const userFilter = () =>
  //   userlist.filter((rec) =>
  //     rec.user_name.toLowerCase().includes(userName.toLowerCase().trim())
  //   );

  // const expiryFilter = () =>
  //   userlist.filter((rec) => moment(rec.license_expiry).isAfter(expiryDate));

  const filter = () => {
    // if (companyName.length) setuserupdlist(companyFilter());
    // if (accountName.length) setuserupdlist(accountFilter());
    // if (userName.length) setuserupdlist(userFilter());
    // if (expiryDate.length) setuserupdlist(expiryFilter());
    setCurrentPage(0);
    setuserupdlist(
      userlist.filter(
        (rec) =>
          (companyName.length && rec.company_name.toLowerCase().includes(companyName.toLowerCase().trim())) &&
          (accountName.length && rec.account_name.toLowerCase().includes(accountName.toLowerCase().trim())) &&
          (userName.length &&  rec.user_name.toLowerCase().includes(userName.toLowerCase().trim())) &&
          (expiryDate.length && moment(rec.license_expiry).isAfter(expiryDate))
         )
      )
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

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>VIEW USERS</div>

      <br />
      <span>Total Users : &nbsp; {userupdlist.length}</span>
      <div className="filter">
        <div>
          <span>
            <label htmlFor="id1">Company Name : &nbsp;</label>
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
            <label htmlFor="id2">User Name : &nbsp;</label>
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
            <label htmlFor="id1">Account Name : &nbsp;</label>
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
            <label htmlFor="id1">License Expiring After : &nbsp;</label>
          </span>
          <input
            type="date"
            id="id4"
            onChange={(event) => {
              setexpiryDate(event.target.value);
            }}
            value={expiryDate}
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
      <thead>
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
        </tr>
        </thead>
        <tbody>
        {currentPageData.map((val, index) => (
          <tr key={val.license_id}>
            <th>{index + 1 + offset}</th>
            <th>{val.user_name}</th>
            <th>{val.account_name}</th>
            <th>{val.company_name}</th>
            <th>{val.account_type}</th>
            <th>{val.status}</th>
            <th>{val.license_id}</th>
            <th>{moment(val.license_expiry).local().format('DD-MM-YYYY')}</th>
            <th>{val.agent_name}</th>
          </tr>
        ))}
        </tbody> 
      </table>
      {userupdlist.length === 0 ? (
        <div className="text-danger fw-500">No Matching Records Exist </div>
      ) : (
        <div></div>
      )}
      <br />
      <ReactPaginate
        previousLabel={"??? Previous"}
        nextLabel={"Next ???"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={
          currentPage !== undefined ? Math.ceil(currentPage) : 0
        } 
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="viewback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && table()}</div>;
};
export default ViewUsers;
