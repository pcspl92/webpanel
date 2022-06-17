import '../../css/dashboard.css';

import React, { useEffect, useState } from 'react';

import axios from '../../utils/axios';

export default function Dashboard() {
  const [dashData, setDashData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/dashboard/company');
      console.log(data);
      setDashData(data);
      setLoading(false);
    })();
  }, []);

  const table = () => (
    <div className="viewback">
      <br />
      <table className="mt-3">
        <tr className="tableheading">
          <th
            style={{ backgroundColor: 'white', border: 'none' }}
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
            style={{ backgroundColor: 'white', border: 'none' }}
          >
            {' '}
            Total PPT User Accounts : {' '}
          </th>
          <th>{dashData.data?.ptt?.total || 0}</th>
          <th>{dashData.data?.ptt?.active || 0}</th>
          <th>{dashData.data?.ptt?.available || 0}</th>
          <th>{dashData.data?.ptt?.expired || 0}</th>
        </tr>
        <tr>
          <th
            style={{ backgroundColor: 'white', border: 'none' }}
          >
            {' '}
            Total Dispatcher Accounts : {' '}
          </th>
          <th>{dashData.data?.dispatcher?.total || 0}</th>
          <th>{dashData.data?.dispatcher?.active || 0}</th>
          <th>{dashData.data?.dispatcher?.available || 0}</th>
          <th>{dashData.data?.dispatcher?.expired || 0}</th>
        </tr>{' '}
        <tr>
          <th
            style={{ backgroundColor: 'white', border: 'none' }}
          >
            {' '}
            Total Control Station Accounts : {' '}
          </th>
          <th>{dashData.data?.control?.total || 0}</th>
          <th>{dashData.data?.control?.active || 0}</th>
          <th>{dashData.data?.control?.available || 0}</th>
          <th>{dashData.data?.control?.expired || 0}</th>
        </tr>
      </table>
      <br />
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
