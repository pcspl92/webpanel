import '../css/personalCenterLoginRecord.css';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ReactPaginate from "react-paginate";
import axios from '../utils/axios';

const ViewLogin = () => {
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [agentloglist, setagentloglist] = useState([]);
  const [updatedloglist, setupdatedloglist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/auth/logs/agent');
      setagentloglist(data);
      setupdatedloglist(data);
      setLoading(false);
    })();
  }, []);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const currentPageData = updatedloglist.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(updatedloglist.length / PER_PAGE);

  const filterlist = () => {
    if(fromdate==='' || todate==='') alert("Please Select Dates");
    else if (fromdate.length && todate.length && moment(fromdate).isSameOrBefore(todate)) {
      setupdatedloglist(
        agentloglist.filter((val) => {
            const date=moment(val.timestamp).local().format('YYYY-MM-DD');
            return moment(date).isSameOrAfter(fromdate) && moment(date).isSameOrBefore(todate)
      }));
    }else if(fromdate.length && todate.length && moment(fromdate).isAfter(todate)){
      alert('Invalid Date Selection');
    }
  };

  const reset = () => {
    setfromdate('');
    settodate('');
  };

  const unfilterlist = () => {
    setupdatedloglist(agentloglist);
    reset();
  };

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>LOGIN RECORD</div>
      <br />
      <div className="filter">
        <div>
          <span>
            <label htmlFor="id1">From Date : &nbsp;</label>
          </span>
          <input
            type="date"
            id="id1"
            onChange={(event) => {
              setfromdate(event.target.value);
            }}
            value={fromdate}
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">To Date : &nbsp;</label>
          </span>
          <input
            type="date"
            id="id2"
            onChange={(event) => {
              settodate(event.target.value);
            }}
            value={todate}
          />
        </div>
      </div>
      <div className="mt-3">
        <button
          className="p-1 me-5 font-weight-bold"
          style={{ fontSize: '1vw' }}
          onClick={filterlist}
        >
          Search
        </button>
        <button
          className="p-1 font-weight-bold"
          style={{ fontSize: '1vw' }}
          onClick={unfilterlist}
        >
          {' '}
          View All
        </button>
      </div>
      <table className="mt-3">
      <thead>
        <tr className="tableheading">
          <th>S. No</th>
          <th>Date</th>
          <th>Time</th>
          <th>Login Activity Description</th>
          <th>IP Address</th>
        </tr>
        </thead>
        <tbody>
        {currentPageData.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{moment(val.timestamp).local().format('DD-MM-YYYY')}</th>
            <th>{moment(val.timestamp).local().format('HH:mm')}</th>
            <th>{val.login_desc}</th>
            <th>{val.ipaddress}</th>
          </tr>
        ))}
        </tbody>
      </table>
      <br />
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
      {updatedloglist.length === 0 ? (
        <div className="text-danger fw-500">No Matching Records Exist </div>
      ) : (
        <div></div>
      )}
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

export default ViewLogin;
