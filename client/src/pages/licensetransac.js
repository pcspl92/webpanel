import React, { useEffect, useState } from 'react';
import '../css/licensetransac.css';
import moment from 'moment';
import axios from '../utils/axios';

export default function Licensetransac() {
  const [fromdate, setfromdate] = useState('');
  const [todate, settodate] = useState('');
  const [trandetails, settrandetails] = useState([]);
  const [updatedtranDetails, setupdatedtranDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [err,setErr] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/transaction/agent-panel');
      settrandetails(data);
      setupdatedtranDetails(data);
      setLoading(false);
    })();
  }, []);

  const filterlist = () => {
    if(fromdate==='' || todate==='') alert("Please Select Dates");
    else if (fromdate.length && todate.length && moment(fromdate).isSameOrBefore(todate)) {
      setupdatedtranDetails(
        updatedtranDetails.filter((val) => {
            const date=moment(val.date).local().format('YYYY-MM-DD');
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
    setupdatedtranDetails(trandetails);
    reset();
  };

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>TRANSACTIONS</div>

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
        <tr className="tableheading">
          <th>S. No</th>
          <th>Transation Date</th>
          <th>Transaction Amount</th>
          <th>Transaction Type</th>
          <th>Balance</th>
          <th>Transaction Details</th>
        </tr>
        {updatedtranDetails.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{moment(val.date).local().format('DD-MM-YYYY')}</th>
            <th>{val.transaction_amount}</th>
            <th>{val.transaction_type}</th>
            <th>{val.balance}</th>
            <th>{val.transaction_details}</th>
          </tr>
        ))}
      </table>
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
}
