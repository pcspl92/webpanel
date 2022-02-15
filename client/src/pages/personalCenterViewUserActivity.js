import React, { useState, useEffect } from 'react';
import '../css/personalCenterviewUseract.css';
import axios from '../utils/axios';
import moment from 'moment';
const ViewActivity = () => {
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [agentactlist, setagentactlist] = useState([]);
  const [updatedactlist, setupdatedactlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/agent/activity-logs');
      setagentactlist(data);
      setupdatedactlist(data);
      setLoading(false);
    })();
  }, []);

  const filterlist = () => {
    if (fromdate.length && todate.length) {
      setupdatedactlist(
        agentactlist.filter((val) => {
          return (
            moment(val.timestamp).isSameOrAfter(fromdate) &&
            moment(val.timestamp).isSameOrBefore(todate)
          );
        })
      );
    }
  };

  const reset = () => {
    setfromdate('');
    settodate('');
  };

  const unfilterlist = () => {
    setupdatedactlist(agentactlist);
    reset();
  };

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        VIEW ACTIVITY LOG
      </div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label for="id1">From Date: &nbsp;</label>
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
            <label for="id2">To Date : &nbsp;</label>
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
          <th>Date</th>
          <th>Time</th>
          <th>Agent Name</th>
          <th>User Activity Description</th>
        </tr>
        {updatedactlist.map((val, index) => {
          index++;
          return (
            <tr>
              <th>{index}</th>
              <th>{moment(val.timestamp).format('DD-MM-YYYY')}</th>
              <th>{moment(val.timestamp).format('HH:mm')}</th>
              <th>{val.agent_name}</th>
              <th>{val.activity_desc}</th>
            </tr>
          );
        })}
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

  return <>{!loading && table()}</>;
};

export default ViewActivity;
