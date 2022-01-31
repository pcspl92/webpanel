import React, { useState, useEffect, createContext, useContext } from 'react';

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

  const login = async (body) => {
    await axios.post('/auth/login/agent', body);
    const { data } = await axios.get('/auth/status');
    setUser({ ...data, auth: true });
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser({ auth: false });
  };

  const value = {
    user,
    login,
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
