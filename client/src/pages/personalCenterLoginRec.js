import React, { useState, useEffect } from 'react';
import '../css/personalCenterLoginRecord.css';
import axios from '../utils/axios';
import moment from 'moment';
const ViewLogin = () => {
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [agentloglist, setagentloglist] = useState([]);
  const [updatedloglist,setupdatedloglist]=useState([]);


  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/auth/logs/agent');
      setagentloglist(data);
      setupdatedloglist(data);
    })();
  }, []);
  const filterlist=()=>{
   
      setupdatedloglist(agentloglist.filter((val)=>{return moment(moment(val.timestamp).format('YYYY-MM-DD')).isSameOrAfter(fromdate) && moment(moment(val.timestamp).format('YYYY-MM-DD')).isSameOrBefore(todate)}))
   
  }
  const unfilterlist=()=>{
   
    setupdatedloglist(agentloglist);
 
}
  return (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>LOGIN RECORD</div>

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
      onClick={filterlist}  >
          Search
        </button>

        <button className="p-1 font-weight-bold" style={{ fontSize: '1vw' }} onClick={unfilterlist}>
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
        {updatedloglist.map((val, index) => {
          index = index + 1;

          return (
            <tr>
              <th>{index}</th>
              <th>{moment(val.timestamp).format('DD-MM-YYYY')}</th>
              <th>{moment(val.timestamp).format('HH:mm')}</th>
              <th>{val.login_desc}</th>
              <th>{val.ipaddress}</th>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
export default ViewLogin;
