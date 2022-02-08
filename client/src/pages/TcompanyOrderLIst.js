import '../css/ViewAgent.css';

import React, { useState, useEffect } from 'react';

import axios from '../utils/axios';

const CompanyOrderList = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/company-panel');
      setTableData(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="viewback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && 'Hello World User Activity'}</div>;
};

export default CompanyOrderList;
