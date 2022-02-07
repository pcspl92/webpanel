import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/index.css';

import Index from '../pages/index';
import { AgentPrivateRoute, CompanyPrivateRoute } from '../utils/privateRoute';
import { AgentLoginRoute, CompanyLoginRoute } from '../utils/loginRoute';
import HeroRoute from '../utils/heroRoute';
// agent imports
import AgentLogin from '../pages/login/agent';
import CreateSubAgent from '../pages/subAgentCreate';
import ViewAgent from '../pages/subAgentView';
import SetPrices from '../pages/subAgentSetprices';
import RechargeAgent from '../pages/subAgentRecharge';
import ModifyAgent from '../pages/subAgentModify';
import ChangePassword from '../pages/personalCenterChangePassword';
import ViewActivity from '../pages/personalCenterViewUserActivity';
import ViewLogin from '../pages/personalCenterLoginRec';
import ViewUsers from '../pages/usersView';
import AgentDashboard from '../pages/dashboard/agent';
import NotFound from '../pages/404';
import CompanyModify from '../pages/companyModify';
import CompanyView from '../pages/companView';
import CompanyCreate from '../pages/companyCreate';
import LicenseCreate from '../pages/licenseCreate';
import LicenseView from '../pages/licenseView';
import Licensetransac from '../pages/licensetransac';
import LicenseModify from '../pages/licenseModify';
import AgentHeader from './header/agent';
import AgentNavbar from './navbar/agent';
import CompanyChangePassword from '../pages/companyPersonalCentrechangepass';
import CompanyViewActivity from '../pages/companypersonalcentreActRec';
import CompanyViewLogin from '../pages/companyPersonalCentreLogRec';
//company imports
import CompanyLogin from '../pages/login/company';
import CompanyDashboard from '../pages/dashboard/company';
import CompanyHeader from './header/company';
import CompanyNavbar from './navbar/company';

export default function App() {
  return (
    <BrowserRouter>
      <div className="mainback">
        {/* <Header /> */}
        <div className="bottompart">
          {/* <Navbar /> */}
          <div className="routearea">
            <Routes>
              <Route path="/">
                <Route index element={<HeroRoute component={<Index />} />} />
                <Route path="agent">
                  <Route
                    index
                    element={<AgentLoginRoute component={<AgentLogin />} />}
                  />
                  <Route
                    path="dashboard"
                    element={
                      <AgentPrivateRoute component={<AgentDashboard />} />
                    }
                  />
                  <Route path="users">
                    <Route
                      path="view"
                      element={<AgentPrivateRoute component={<ViewUsers />} />}
                    />
                  </Route>
                  <Route path="license-management">
                    <Route
                      path="new-order"
                      element={
                        <AgentPrivateRoute component={<LicenseCreate />} />
                      }
                    />
                    <Route
                      path="order-history"
                      element={
                        <AgentPrivateRoute component={<LicenseView />} />
                      }
                    />
                    <Route
                      path="transactions"
                      element={
                        <AgentPrivateRoute component={<Licensetransac />} />
                      }
                    />
                    <Route
                      path="update-license"
                      element={
                        <AgentPrivateRoute component={<LicenseModify />} />
                      }
                    />
                  </Route>
                  <Route path="subagent">
                    <Route
                      path="create"
                      element={
                        <AgentPrivateRoute component={<CreateSubAgent />} />
                      }
                    />
                    <Route path="view" element={<ViewAgent />} />
                    <Route path="setprices" element={<SetPrices />} />
                    <Route path="recharge" element={<RechargeAgent />} />
                    <Route path="modify" element={<ModifyAgent />} />
                  </Route>
                  <Route path="personal-center">
                    <Route
                      path="change-password"
                      element={
                        <CompanyPrivateRoute component={<CompanyChangePassword />} />
                      }
                    />
                    <Route
                      path="activity"
                      element={
                        <CompanyPrivateRoute component={<CompanyViewActivity />} />
                      }
                    />
                    <Route
                      path="loginrecord"
                      element={<CompanyPrivateRoute component={<CompanyViewLogin />} />}
                    />
                  </Route>
                  <Route path="company-management">
                    <Route
                      path="create-new-company"
                      element={
                        <AgentPrivateRoute component={<CompanyCreate />} />
                      }
                    />
                    <Route
                      path="view-companies"
                      element={
                        <AgentPrivateRoute component={<CompanyView />} />
                      }
                    />
                    <Route
                      path="modify-company"
                      element={
                        <AgentPrivateRoute component={<CompanyModify />} />
                      }
                    />
                  </Route>
                </Route>

                <Route path="company">
                  <Route
                    index
                    element={<CompanyLoginRoute component={<CompanyLogin />} />}
                  />
                  <Route
                    path="dashboard"
                    element={
                      <CompanyPrivateRoute component={<CompanyDashboard />} />
                    }
                  />
                     <Route path="personal-center">
                    <Route
                      path="change-password"
                      element={
                        <AgentPrivateRoute component={<ChangePassword />} />
                      }
                    />
                    <Route
                      path="activity"
                      element={
                        <AgentPrivateRoute component={<ViewActivity />} />
                      }
                    />
                    <Route
                      path="loginrecord"
                      element={<AgentPrivateRoute component={<ViewLogin />} />}
                    />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
