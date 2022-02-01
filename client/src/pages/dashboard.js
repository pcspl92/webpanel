import React, { useEffect, useState } from 'react';
import '../css/dashboard.css';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const [dashData, setDashData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/dashboard/agent');
      setDashData(data);
      setLoading(false);
    })();
  }, []);

  const table = () => (
    <div className="viewback">
      <br />

      <div>
        <span>Total Balance :</span>
        {user.balance}
      </div>

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
      <div>
        <span>Total Sub - Agents :</span>
        {dashData.total_subagents}
      </div>
      <br />
      <div>
        <span>Total Companies :</span>
        {dashData.total_companies}
      </div>
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
