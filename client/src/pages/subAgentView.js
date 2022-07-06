import React, { useState, useEffect } from 'react';
import '../css/ViewAgent.css';
import * as yup from 'yup';
import axios from '../utils/axios';
import ReactPaginate from "react-paginate";

const ViewAgent = () => {
  const [agentname, setagentname] = useState('');
  const [agentaccname, setagentaccname] = useState('');
  const [agentlist, setagentlist] = useState([]);
  const [updatedlist, setupdatedlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/');
      console.log(data);
      setagentlist(data);
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
      agentname: yup.string().required('Sub-Agent  Name is required'),
      agentaccname: yup.string().required('Sub-Agent Account Name is required'),
    });
    await schema.validate(data, { abortEarly: false });
  };
  const filter = async () => {
    try {
      await validateForm({ agentname, agentaccname });
      setErrors({});
      setCurrentPage(0);
      setupdatedlist(
        agentlist.filter(
          (val) =>
            (agentname.length &&
              val.agent_name.toLowerCase()===(agentname.toLowerCase().trim())) &&
            (agentaccname.length &&
              val.account_name.toLowerCase()===(agentaccname.toLowerCase().trim()))
        )
      );
    } catch (error) {
      const validateErrors = error.inner.reduce(
        (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
        {}
      );
      setErrors(validateErrors);
    }
  };

  const reset = () => {
    setagentname('');
    setagentaccname('');
  };

  const unfilter = () => {
    setupdatedlist(agentlist);
    reset();
  };

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh', marginTop: '3vh' }}>
        VIEW SUB-AGENTS
      </div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label htmlFor="id1"> Sub-Agent Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setagentname(event.target.value);
            }}
            value={agentname}
            required
          />
        </div>
        <br />
        <div className="text-danger fw-500">{errors?.agentname}</div>

        <br />
        <div>
          <span>
            <label htmlFor="id2"> Sub-Agent Account Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setagentaccname(event.target.value);
            }}
            value={agentaccname}
            required
          />
        </div>
        <br />

        <div className="text-danger fw-500">{errors?.agentaccname}</div>
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
        <tr className="tableheading">
          <th>S. No</th>
          <th>Sub-agent Name</th>
          <th>Status</th>
          <th>Account Name</th>
          <th>Total Orders</th>
          <th>Total Active Orders</th>
          <th>Total Accounts Available</th>
        </tr>
        </thead>
        <tbody>
        {currentPageData.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1 + offset}</th>
            <th>{val.agent_name}</th>
            <th>{val.status}</th>
            <th>{val.account_name}</th>
            <th>{val.orders}</th>
            <th>{val.active}</th>
            <th>{val.available}</th>
          </tr>
        ))}
        </tbody>
      </table>
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
      {updatedlist.length === 0 ? (
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

export default ViewAgent;
