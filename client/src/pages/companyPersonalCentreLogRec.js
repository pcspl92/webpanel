import '../css/personalCenterLoginRecord.css';
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ReactPaginate from "react-paginate";
import axios from '../utils/axios';
import "react-toastify/ReactToastify.min.css";

const CompanyViewLogin = () => {
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('');
  const [companyloglist, setcompanyloglist] = useState([]);
  const [updatedloglist, setupdatedloglist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/auth/logs/company');
      setcompanyloglist(data);
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
    setCurrentPage(0);
    if (fromdate === '' || todate === '') toast("Please Select Dates");
    else if (fromdate.length && todate.length && moment(fromdate).isSameOrBefore(todate)) {
      setupdatedloglist(
        companyloglist.filter((val) => {
          const date = moment(val.timestamp).local().format('YYYY-MM-DD');
          return moment(date).isSameOrAfter(fromdate) && moment(date).isSameOrBefore(todate)
        }));
    } else if (fromdate.length && todate.length && moment(fromdate).isAfter(todate)) {
      toast('Invalid Date Selection');
    }
  };

  const reset = () => {
    setfromdate('');
    settodate('');
  };

  const unfilterlist = () => {
    setupdatedloglist(companyloglist);
    reset();
  };

  const table = () => (
    <>
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
      <table style={{ textAlign: 'center' }} className="mt-3">
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
          {currentPageData.map((val, index) => {
            return (
              <tr key={val.id}>
                <th>{index + 1 + offset}</th>
                <th>{moment(val.timestamp).local().format('DD-MM-YYYY')}</th>
                <th>{moment(val.timestamp).local().format('HH:mm')}</th>
                <th>{val.login_desc}</th>
                <th>{val.ipaddress}</th>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
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
    <ToastContainer position='top-center' newestOnTop autoClose='2000'/>
    </>
    
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

export default CompanyViewLogin;
