import React, { useState, useEffect } from 'react';
import '../css/personalCenterviewUseract.css';
import moment from 'moment';
import axios from '../utils/axios';

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
    if(fromdate==='' || todate==='') alert("Please Select Dates");
    else if (fromdate.length && todate.length && moment(fromdate).isSameOrBefore(todate)) {
      setupdatedactlist(
        agentactlist.filter((val) => {
            const date=moment(val.timestamp).utc().format('YYYY-MM-DD');
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
          <th>Date</th>
          <th>Time</th>
          <th>Agent Name</th>
          <th>User Activity Description</th>
        </tr>
        {updatedactlist.map((val, index) => {
          // eslint-disable-next-line no-param-reassign
          index+=1;
          return (
            <tr key={val.id} >
              <th>{index}</th>
              <th>{moment(val.timestamp).utc().format('DD-MM-YYYY')}</th>
              <th>{moment(val.timestamp).utc().format('HH:mm')}</th>
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
