import '../css/personalCenterLoginRecord.css';

import React, { useState, useEffect } from 'react';
import moment from 'moment';

import axios from '../utils/axios';

const ViewLogin = () => {
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [agentloglist, setagentloglist] = useState([]);
  const [updatedloglist, setupdatedloglist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/auth/logs/agent');
      setagentloglist(data);
      setupdatedloglist(data);
      setLoading(false);
    })();
  }, []);

  const filterlist = () => {
    if (fromdate.length && todate.length) {
      setupdatedloglist(
        agentloglist.filter(
          (val) =>{
            const date=moment(val.timestamp).utc().format('YYYY-MM-DD');
             return moment(date).isSameOrAfter(fromdate) && moment(date).isSameOrBefore(todate)
          })
      );
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
            <label htmlFor="id1">From Date: &nbsp;</label>
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
          <th>Date</th>
          <th>Time</th>
          <th>Login Activity Description</th>
          <th>IP Address</th>
        </tr>
        {updatedloglist.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{moment(val.timestamp).utc().format('DD-MM-YYYY')}</th>
            <th>{moment(val.timestamp).utc().format('HH:mm')}</th>
            <th>{val.login_desc}</th>
            <th>{val.ipaddress}</th>
          </tr>
        ))}
      </table>
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
