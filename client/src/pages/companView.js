import React, { useState, useEffect } from 'react';
import '../css/companyView.css';
import axios from '../utils/axios';

const CompanyView = () => {
  const [tableData, setTableData] = useState([]);
  const [companyName, setcompanyname] = useState([]);
  const [compaccname, setcomaccname] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatedlist, setupdatedlist] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/company/agent-panel');
      setTableData(data);
      setupdatedlist(data);
      setLoading(false);
    })();
  }, []);
  const filter = () => {
    setupdatedlist(
      tableData.filter((val) => {
        return (
      (companyName.length&&val.agent_name.toLowerCase().includes(companyName.toLowerCase())) ||
         (compaccname.length&& val.account_name.toLowerCase().includes(compaccname.toLowerCase()))
        );
      })
    );
  };

  const unfilter = () => {
    setupdatedlist(tableData);
  };
  const table = () => (
    <div className="viewback">
    <div style={{ fontWeight: 'bolder', fontSize: '4vh', marginTop: '3vh' }}>
      VIEW COMPANIES
    </div>

    <br />
    <div className="filter">
      <div>
        <span>
          <label for="id1">Company Name :</label>
        </span>
        <input
          type="text"
          id="id1"
          onChange={(event) => {
            setcompanyname(event.target.value);
          }}
          required
        />
      </div>
      <br />
      <br />
      <div>
        <span>
          <label for="id2">Company Account Name :</label>
        </span>
        <input
          type="text"
          id="id2"
          onChange={(event) => {
            setcomaccname(event.target.value);
          }}
          required
        />
      </div>
    </div>
    <div className="mt-3">
      <button
        className="p-1 me-5 font-weight-bold"
        style={{ fontSize: '1vw' }}
        onClick={filter}
      >
        Search
      </button>

      <button
        className="p-1 font-weight-bold"
        style={{ fontSize: '1vw' }}
        onClick={unfilter}
      >
        {' '}
        View All
      </button>
    </div>
    <table className="mt-3">
      <tr className="tableheading">
        <th>S. No</th>
        <th>Company Name</th>
        <th>Account Name</th>
        <th>Date of Creation</th>
        <th>Contact Number</th>
        <th>Agent Name</th>
      </tr>
      {updatedlist.map((val, index) => {
        index++;
        return (
          <tr>
            <th>{index}</th>
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

  if (loading) {
    return (
      <div className="modifyback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && table()}</div>;
};
export default CompanyView;
