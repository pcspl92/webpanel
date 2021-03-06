import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from '../utils/axios';
import ReactPaginate from "react-paginate";
//import { NULL } from 'mysql/lib/protocol/constants/types';

export default function CompanyTransactionView() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('');
  const [updatedTableData, setupdatedTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/transaction/company-panel');
      setTableData(data);
      setupdatedTableData(data);
      setLoading(false);
    })();
  }, []);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const currentPageData = updatedTableData.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(updatedTableData.length / PER_PAGE);

  const filterlist = () => {
    setCurrentPage(0);
    if(fromdate==='' || todate==='') alert("Please Select Dates");
    else if (fromdate.length && todate.length && moment(fromdate).isSameOrBefore(todate)) {
      setupdatedTableData(tableData.filter(
        (val) =>{
          const date=moment(val.transaction_date).format('YYYY-MM-DD');
          return moment(date).isSameOrAfter(fromdate) && moment(date).isSameOrBefore(todate)  
        }  
      ));
    }else if(fromdate.length && todate.length && moment(fromdate).isAfter(todate)){
      alert('Invalid Date Selection');
    }
  };

  const reset = () => {
    setfromdate('');
    settodate('');
  };

  const unfilterlist = () => {
    setupdatedTableData(tableData);
    reset();
  };
  if (loading) {
    return (
      <div className="viewback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="viewback">
      {' '}
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        ORDER TRANSACTION HISTORY
      </div>
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
          <th>Order ID</th>
          <th>Transaction Type</th>
          <th>Transaction Date</th>
          <th>Transaction Time</th>
          <th>Account Type</th>
          <th>License Type</th>
          <th>
            License <br /> Renewal Date
          </th>
          <th>
            Active <br /> Accounts
          </th>
          <th>
            Available <br />
            Accounts
          </th>
        </tr>
        </thead>
        <tbody>
        {currentPageData.map((val, index) => {
          return(
            <tr key={index}>
              <th>{index+1+offset}</th>
              <th>{val.id}</th>
              <th>{val.transaction_type}</th>
              <th>{moment(val.transaction_date).local().format('DD-MM-YYYY')}</th>
              <th>{moment(val.transaction_date).local().format('HH:mm')}</th>
              <th>{val.account_type==="control"?'Control Station':(val.account_type).charAt(0).toUpperCase()+(val.account_type).substr(1).toLowerCase()}</th>
              <th>{(val.license_type).toLowerCase().replace(/[^\s_'-]+/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())}</th>
              <th>{moment(val.license_renewal_date).local().format('DD-MM-YYYY')}</th>
              <th>{val.active}</th>
              <th>{val.available}</th>
            </tr>
          );
        })}
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
  );
}
