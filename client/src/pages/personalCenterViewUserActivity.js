import React, { useState, useEffect } from 'react';
import '../css/personalCenterviewUseract.css';
import axios from '../utils/axios';
import moment from 'moment';
const ViewActivity = () => {
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [agentactlist, setagentactlist] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/agent/activity-logs');
      setagentactlist(data);
    })(console.log(agentactlist));
    console.log(agentactlist);
  }, []);

  return (
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
          <th>Date</th>
          <th>Time</th>
          <th>Agent Name</th>
          <th>User Activity Description</th>
        </tr>
        {agentactlist.map((val, index) => {
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
};
export default ViewActivity;
