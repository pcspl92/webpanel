import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/index.css';

import Login from '../pages/login';
import CreateSubAgent from '../pages/subAgentCreate';
import ViewAgent from '../pages/subAgentView';
import SetPrices from '../pages/subAgentSetprices';
import RechargeAgent from '../pages/subAgentRecharge';
import ModifyAgent from '../pages/subAgentModify';
import ChangePassword from '../pages/personalCenterChangePassword';
import ViewActivity from '../pages/personalCenterViewUserActivity';
import ViewLogin from '../pages/personalCenterLoginRec';
import ViewUsers from '../pages/usersView';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/404';
import PrivateRoute from '../utils/privateRoute';
import LoginRoute from '../utils/loginRoute';
import Header from './header';
import Navbar from './navbar';
import CompanyModify from '../pages/companyModify';
import CompanyView from '../pages/companView';
import CompanyCreate from '../pages/companyCreate';

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
                 <Route path="/users">
                <Route path="view" element={<PrivateRoute component={<ViewUsers/>}/>} />
             
            
              </Route>
              <Route path="/subagent">
                <Route path="create" element={<PrivateRoute component={<CreateSubAgent />}/>} />
                <Route path="view" element={<ViewAgent />} />
                <Route path="setprices" element={<SetPrices />} />
                <Route path="recharge" element={<RechargeAgent />} />
                <Route path="modify" element={<ModifyAgent />} />
              </Route>
              <Route path="/personal-center">
                <Route path="change-password" element={<PrivateRoute component={<ChangePassword/>}/>} />
                <Route path="activity" element={<PrivateRoute component={<ViewActivity/>}/>}  />
                <Route path="loginrecord" element={<PrivateRoute component={<ViewLogin/>}/>} />
            
              </Route>
              <Route path="/company-management">
                <Route path="create-new-company" element={<PrivateRoute component={<CompanyCreate/>}/>} />
                <Route path="view-companies" element={<PrivateRoute component={<CompanyView/>}/>}  />
                <Route path="modify-company" element={<PrivateRoute component={<CompanyModify/>}/>} />
            
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
