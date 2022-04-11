import '../css/companyView.css';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as yup from 'yup';

import axios from '../utils/axios';

const CompanyView = () => {
  const [tableData, setTableData] = useState([]);
  const [companyName, setcompanyname] = useState('');
  const [compaccname, setcomaccname] = useState('');
  const [updatedlist, setupdatedlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/company/agent-panel');
      setTableData(data);
      setLoading(false);
    })();
  }, []);

  const validateForm = async (data) => {
    const schema = yup.object().shape({
      companyName: yup.string().required('Company Name is required'),
      compaccname: yup.string().required('Company Account Name is required'),
    });
    await schema.validate(data, { abortEarly: false });
  };

  const filter = async () => {
    try {
      await validateForm({ companyName, compaccname });
      setErrors({});
      setupdatedlist(
        tableData.filter(
          (val) =>
            (companyName.length &&
              val.company_name
                .toLowerCase()
                .includes(companyName.toLowerCase())) &&
            (compaccname.length &&
              val.account_name
                .toLowerCase()
                .includes(compaccname.toLowerCase()))
        )
      );
    } catch (error) {
      if (error.inner.length) {
        const validateErrors = error.inner.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
          {}
        );
        setErrors(validateErrors);
      } else {
        console.log(error.response.data);
      }
    }
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
    <div className="CVviewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh', marginTop: '3vh' }}>
        VIEW COMPANIES
      </div>

      <br />
      <div className="CVfilter">
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
        <div className="CVtext-danger fw-500">{errors?.companyName}</div>
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
        <div className="text-danger fw-500">{errors?.compaccname}</div>
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
        <tr className="CVtableheading">
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
      {updatedlist.length === 0 ? (
        <div className="text-danger fw-500">No Matching Records Exist </div>
      ) : (
        <div></div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="CVviewback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && table()}</div>;
};
export default CompanyView;
