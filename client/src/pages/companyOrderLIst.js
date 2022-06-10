import '../css/ViewAgent.css';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from '../utils/axios';

const CompanyOrderList = () => {
  const [tableData, setTableData] = useState([]);
  const [dashData, setDashData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: panelData } = await axios.get('/order/company-panel');
      const { data: companyData } = await axios.get('/dashboard/company');
      setDashData(companyData);
      setTableData(panelData);
      setLoading(false);
      console.log(panelData);
    })();
  }, []);

  if (loading) {
    return (
      <div className="modifyback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  return (
    <div className="viewback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>ORDER LIST</div>
      <table className="mt-3">
        <tr className="tableheading">
          <th
            style={{ backgroundColor: 'white', width: '18vw', border: 'none' }}
          >
            {' '}
          </th>
          <th>Total</th>
          <th>Active</th>
          <th>Available</th>
          <th>Expired</th>
        </tr>
        <tr>
          <th
            style={{ backgroundColor: 'white', width: '18vw', border: 'none' }}
          >
            {' '}
            Total PPT User Accounts :{' '}
          </th>
          <th>{dashData.data?.ptt?.total || 0}</th>
          <th>{dashData.data?.ptt?.active || 0}</th>
          <th>{dashData.data?.ptt?.available || 0}</th>
          <th>{dashData.data?.ptt?.expired || 0}</th>
        </tr>
        <tr>
          <th
            style={{ backgroundColor: 'white', width: '18vw', border: 'none' }}
          >
            {' '}
            Total Dispatcher Accounts :{' '}
          </th>
          <th>{dashData.data?.dispatcher?.total || 0}</th>
          <th>{dashData.data?.dispatcher?.active || 0}</th>
          <th>{dashData.data?.dispatcher?.available || 0}</th>
          <th>{dashData.data?.dispatcher?.expired || 0}</th>
        </tr>{' '}
        <tr>
          <th
            style={{ backgroundColor: 'white', width: '18vw', border: 'none' }}
          >
            {' '}
            Total Control Station Accounts :{' '}
          </th>
          <th>{dashData.data?.control?.total || 0}</th>
          <th>{dashData.data?.control?.active || 0}</th>
          <th>{dashData.data?.control?.available || 0}</th>
          <th>{dashData.data?.control?.expired || 0}</th>
        </tr>
      </table>
      <br />

      <br />
      <table className="mt-3">
        <tr className="tableheading">
          <th>S. No</th>
          <th>Order Id</th>
          <th>Order Status</th>
          <th>Account Type</th>
          <th>License Tpye</th>
          <th>
            License <br /> Renewal Date
          </th>
          <th>
            Active <br /> Accounts
          </th>
          <th>
            Available <br /> Accounts
          </th>
          <th>Features</th>
        </tr>
        {tableData.map((val, index) => (
          <tr key={val.id}>
            <th>{index + 1}</th>
            <th>{val.id}</th>
            <th>{val.status}</th>
            <th>{val.account_type === "control" ? 'Control Station' : (val.account_type).charAt(0).toUpperCase() + (val.account_type).substr(1).toLowerCase()}</th>
            <th>{(val.license_type).toLowerCase().replace(/[^\s_'-]+/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())}</th>
            <th>{moment(val.license_renewal_date).format('DD-MM-YYYY')}</th>
            <th>{val.active}</th>
            <th>{val.available}</th>
            <th>
              {val.geo_fence === 1 && <>Geo Fence; </>}
              {val.grp_call === 1 && <>Group Call; </>}
              {val.chat === 1 && <>Chat; </>}
              {val.enc === 1 && <>Encryption; </>}
              {val.priv_call === 1 && <>Private Call; </>}
              {val.live_gps === 1 && <>Live GPS; </>}
            </th>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default CompanyOrderList;
