import '../css/companyView.css';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as yup from 'yup';
import ReactPaginate from "react-paginate";
import axios from '../utils/axios';

const CompanyView = () => {
  const [tableData, setTableData] = useState([]);
  const [companyName, setcompanyname] = useState('');
  const [compaccname, setcomaccname] = useState('');
  const [updatedlist, setupdatedlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/company/agent-panel');
      console.log(data);
      setTableData(data);
      setupdatedlist(data);
      setLoading(false);
    })();
  }, []);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  
  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const currentPageData = updatedlist.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(updatedlist.length / PER_PAGE);

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
      setCurrentPage(0);
      setupdatedlist(
        tableData.filter(
          (val) =>
            (companyName.length &&
              (val.company_name.toLowerCase()===(companyName.toLowerCase()).trim())) &&
            (compaccname.length &&
              (val.account_name.toLowerCase()===(compaccname.toLowerCase()).trim()))
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
            <label htmlFor="id1">Company Name : &nbsp;</label>
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
        <div className="text-danger fw-500">{errors?.companyName}</div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">Company Account Name : &nbsp;</label>
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
      <thead>
        <tr className="CVtableheading">
          <th>S. No</th>
          <th>Company Name</th>
          <th>Account Name</th>
          <th>Date of Creation</th>
          <th>Status</th>
          <th>Contact Number</th>
          <th>Sub-agent Name</th>
        </tr>
        </thead>
        <tbody>
        {currentPageData.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{val.company_name}</th>
            <th>{val.account_name}</th>
            <th>{moment(val.timestamp).local().format('DD-MM-YYYY')}</th>
            <th>{val.company_status}</th>
            <th>{val.contact_number}</th>
            <th>{val.agent_name} ({val.agent_status})</th>
          </tr>
        ))}
        </tbody>
      </table>
      {updatedlist.length === 0 ? (
        <div className="text-danger fw-500">No Matching Records Exist </div>
      ) : (
        <div></div>
      )}
      <br />
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={
          currentPage !== undefined ? Math.ceil(currentPage) : 0
        }
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
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
