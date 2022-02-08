import React, { useState, useEffect, createContext, useContext } from 'react';
import publicIp from 'public-ip';

import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function Auth({ children }) {
  const [user, setUser] = useState({ auth: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/auth/status');
      if (data) setUser({ ...data, auth: true });
      setLoading(false);
    })();
  }, []);

  const getIp = async () => {
    const data = await publicIp.v4({
      fallbackUrls: ['https://ifconfig.co/ip'],
    });
    return data;
  };

  const agentLogin = async (body) => {
    const ip = await getIp();
    await axios.post('/auth/login/agent', { ...body, ip_address: ip });
    const { data } = await axios.get('/auth/status');
    setUser({ ...data, auth: true });
  };

  const companyLogin = async (body) => {
    const ip = await getIp();
    await axios.post('/auth/login/company', { ...body, ip_address: ip });
    const { data } = await axios.get('/auth/status');
    setUser({ ...data, auth: true });
  };

  const logout = async () => {
    const ip = await getIp();
    await axios.post('/auth/logout', { ip_address: ip });
    setUser({ auth: false });
  };

  const value = {
    user,
    agentLogin,
    companyLogin,
    logout,
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
