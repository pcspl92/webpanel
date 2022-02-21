import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../css/companyView.css';
import axios from '../utils/axios';

const CompanyView = () => {
  const [tableData, setTableData] = useState([]);
  const [companyName, setcompanyname] = useState('');
  const [compaccname, setcomaccname] = useState('');
  const [updatedlist, setupdatedlist] = useState([]);
  const [loading, setLoading] = useState(true);

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
      tableData.filter(
        (val) =>
          (companyName.length &&
            val.company_name
              .toLowerCase()
              .includes(companyName.toLowerCase())) ||
          (compaccname.length &&
            val.account_name.toLowerCase().includes(compaccname.toLowerCase()))
      )
    );
  };

  const reset = () => {
    setcompanyname('');
    setcomaccname('');
  };

  const unfilter = () => {
    setupdatedlist(tableData);
    reset();
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
            <label htmlFor="id1">Company Name :</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setcompanyname(event.target.value);
            }}
            value={companyName}
            required
          />
        </div>
        <br />
        <br />
        <div>
          <span>
            <label htmlFor="id2">Company Account Name :</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setcomaccname(event.target.value);
            }}
            value={compaccname}
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
        {updatedlist.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{val.company_name}</th>
            <th>{val.account_name}</th>
            <th>{moment(val.timestamp).format('DD-MM-YYYY')}</th>
            <th>{val.contact_number}</th>
            <th>{val.agent_name}</th>
          </tr>
        ))}
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
