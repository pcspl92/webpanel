import '../css/licenseView.css';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as yup from 'yup';
import axios from '../utils/axios';

export default function LicenseView() {
  const [tableData, setTableData] = useState([]);
  const [companyName, setcompanyname] = useState('');
  const [agentName, setAgentName] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [expdate, setexpdate] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedlist, setupdatedlist] = useState([]);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/agent-panel');
      setTableData(data);
      setupdatedlist(data);
      setLoading(false);
    })();
  }, []);

  const validateForm = async (data) => {
    const schema = yup.object().shape({
      orderId: yup.string().required('Order ID is required'),
    });
    await schema.validate(data, { abortEarly: false });
  };
  const filter = async () => {
    try {
      await validateForm({ orderId});
      setErrors({});
      setupdatedlist(
        tableData.filter(
          (val) =>
            (companyName.length &&
              val.company_name
                .toLowerCase()
                .includes(companyName.toLowerCase())) ||
            (agentName.length &&
              val.agent_name.toLowerCase().includes(agentName.toLowerCase())) ||
            (expdate.length && moment(val.expiry_date).isAfter(expdate)) ||
            (orderId.length && val.order_id === Number(orderId))
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
 
  const unfilter = () => {
    setupdatedlist(tableData);
  };

  const table = () => (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh', marginTop: '3vh' }}>
        License Order History
      </div>

      <br />
      <div className="filter">
        <div>
          <span>
            <label htmlFor="id1">Order Id :</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              setOrderId(event.target.value);
            }}
            required
          />
        </div>
        <br />
        <div className="text-danger fw-500">{errors?.orderId}</div>
<br/>
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
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">Agent Name :</label>
          </span>
          <input
            type="text"
            id="id2"
            onChange={(event) => {
              setAgentName(event.target.value);
            }}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="id2">License Expiring After :</label>
          </span>
          <input
            type="date"
            id="id2"
            onChange={(event) => {
              setexpdate(event.target.value);
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
          <th>Order Id</th>
          <th>Company Name</th>
          <th>Order Date</th>
          <th>License Type</th>
          <th>Renewal Type</th>
          <th>Accounts Active</th>
          <th>Accounts Available</th>
          <th>Features</th>
          <th>Expiry Date</th>
          <th>Agent Name</th>
        </tr>
        {updatedlist.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{val.order_id}</th>
            <th>{val.company_name}</th>
            <th>{moment(val.order_date).format('DD-MM-YYYY')}</th>
            <th>{val.license_type}</th>
            <th>{val.renewal_type}</th>
            <th>{val.active}</th>
            <th>{val.available}</th>
            <th>
              {val.enc ? 'Encryption, ' : null}
              {val.grp_call ? 'Group Call, ' : null}
              {val.chat ? 'Chat, ' : null}
              {val.priv_call ? 'Private Call, ' : null}
              {val.geo_fence ? 'Geo Fence, ' : null}
              {val.live_gps ? 'Live GPS' : null}
            </th>
            <th>{moment(val.expiry_date).format('DD-MM-YYYY')}</th>
            <th>{val.agent_name}</th>
          </tr>
        ))}
      </table>
      {updatedlist.length===0?        <div className="text-danger fw-500">No Matching Records Exist </div>
:<div></div>}
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
}
