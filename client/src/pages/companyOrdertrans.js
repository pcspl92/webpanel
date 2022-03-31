import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from '../utils/axios';

export default function CompanyTransactionView() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [updatedTableData, setupdatedTableData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/transaction/company-panel');
      setTableData(data);
      setupdatedTableData(data);
      console.log(data);
      setLoading(false);
    })();
  }, []);
  const filterlist = () => {
    if (fromdate.length && todate.length) {
      setupdatedTableData(
        tableData.filter(
          (val) =>
            moment(val.timestamp).isSameOrAfter(fromdate) &&
            moment(val.timestamp).isSameOrBefore(todate)
        )
      );
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
            <label htmlFor="id1">From Date: &nbsp;</label>
          </span>
          <input
            type="date"
            id="id1"
            onChange={(event) => {
              setfromdate(event.target.value);
            }}
            value={fromdate}
            required
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
            required
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
        {updatedTableData.map((val, index) => {
          // eslint-disable-next-line no-plusplus
          // eslint-disable-next-line no-param-reassign
          index += 1;
          return (
            <tr key={val.id}>
              <th>{index}</th>
              <th>{val.id}</th>
              <th>{val.transaction_type}</th>
              <th>{moment(val.transaction_date).format('DD-MM-YYYY')}</th>
              <th>{moment(val.transaction_date).format('HH:mm')}</th>
              <th>{val.account_type}</th>
              <th>{val.license_type}</th>
              <th>{moment(val.license_renewal_date).format('DD-MM-YYYY')}</th>
              <th>{val.active}</th>
              <th>{val.available}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
