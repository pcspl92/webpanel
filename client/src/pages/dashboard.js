import React, { useEffect, useState } from 'react';

import axios from '../utils/axios';

export default function Dashboard() {
  const [dashData, setDashData] = useState({});

  useEffect(() => {
    (async () => {
      const result = await axios.get('/dashboard/agent');
      setDashData(result.data);
    })();
  }, []);

  console.log(dashData);
  return <div>This is dashboard</div>;
}
