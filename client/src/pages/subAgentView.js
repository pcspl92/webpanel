import React, { useState, useEffect } from 'react';
import '../css/ViewAgent.css';
import axios from '../utils/axios';
const ViewAgent = () => {
  const [agentname, setagentname] = useState('');
  const [agentaccname, setagentaccname] = useState('');
  const [agentlist, setagentlist] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/');
      setagentlist(data);
    })();
  }, []);

  return (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        VIEW SUB-AGENTS
      </div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label for="id1">Agent Name :</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setagentname(event.target.value);
            }}
            required
          />
        </div>
        <br />
        <br />
        <div>
          <span>
            <label for="id2">Agent Account Name :</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setagentaccname(event.target.value);
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
          <th>Agent Name</th>
          <th>Account Name</th>
          <th>Total Orders</th>
          <th>Total Active Orders</th>
          <th>Total Accounts Available</th>
        </tr>
        {agentlist.map((val, key) => {
          return (
            <tr>
              <th>{val.id}</th>
              <th>{val.agent_name}</th>
              <th>{val.account_name}</th>
              <th>{val.orders}</th>
              <th>{val.active}</th>
              <th>{val.available}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
export default ViewAgent;
