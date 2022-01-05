import './css/global.css';
import React from 'react';
import { render } from 'react-dom';

import App from './components/index';
import AuthProvider from './hooks/useAuth';

render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.querySelector('#root')
);
