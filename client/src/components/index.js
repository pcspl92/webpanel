import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/index.css';

import Login from '../pages/login';
import CreateSubAgent from '../pages/subAgentCreate';
import ViewAgent from '../pages/subAgentView';
import SetPrices from '../pages/subAgentSetprices';
import RechargeAgent from '../pages/subAgentRecharge';
import ModifyAgent from '../pages/subAgentModify';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/404';
import PrivateRoute from '../utils/privateRoute';
import LoginRoute from '../utils/loginRoute';
import Header from './header';
import Navbar from './navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="mainback">
        <Header />
        <div className="bottompart">
          <Navbar />
          <div className="routearea">
            <Routes>
              <Route path="/" element={<LoginRoute component={<Login />} />} />
              <Route
                path="/dashboard"
                element={<PrivateRoute component={<Dashboard />} />}
              />
              <Route path="/subagent">
                <Route path="create" element={<CreateSubAgent />} />
                <Route path="view" element={<ViewAgent />} />
                <Route path="setprices" element={<SetPrices />} />
                <Route path="recharge" element={<RechargeAgent />} />
                <Route path="modify" element={<ModifyAgent />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
