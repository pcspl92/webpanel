import React, { useState, useEffect } from 'react';

import '../css/AddAgent.css';
import axios from '../utils/axios';

const CompanyView = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/company/agent-panel');
      setTableData(data);
      setLoading(false);
    })();
  }, []);

  const table = () => (
    <div>
      <div>Here Table Will Go Check tableData I've Integrated It.</div>
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
