import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/index.css';

import Index from '../pages/index';
import { AgentPrivateRoute, CompanyPrivateRoute } from '../utils/privateRoute';
import { AgentLoginRoute, CompanyLoginRoute } from '../utils/loginRoute';
import HeroRoute from '../utils/heroRoute';
import { useAuth } from '../hooks/useAuth';

// agent imports
import AgentLogin from '../pages/login/agent';
import CreateSubAgent from '../pages/subAgentCreate';
import ViewAgent from '../pages/subAgentView';
import SetPrices from '../pages/subAgentSetprices';
import RechargeAgent from '../pages/subAgentRecharge';
import ModifyAgent from '../pages/subAgentModify';
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
import ChangePassword from '../pages/personalCenterChangePassword';
import ViewActivity from '../pages/personalCenterViewUserActivity';
import ViewLogin from '../pages/personalCenterLoginRec';
// company imports
import CompanyLogin from '../pages/login/company';
import CompanyDashboard from '../pages/dashboard/company';
import CompanyHeader from './header/company';
import CompanyNavbar from './navbar/company';
import CompanyChangePassword from '../pages/companyPersonalCentrechangepass';
import CompanyViewActivity from '../pages/companypersonalcentreActRec';
import CompanyViewLogin from '../pages/companyPersonalCentreLogRec';
import CompanyUserView from '../pages/companyUserView';
import CompanyOrderList from '../pages/companyOrderLIst';
import CompanyOrderTrans from '../pages/companyOrdertrans';

import TalkGroupCreate from '../pages/talkgroupCreate';
import TalkGroupModify from '../pages/talkgroupModify';
import ContactListCreate from '../pages/contactListCreate';
import ContactListModify from '../pages/contactlistModify';
import UserCreate from '../pages/companyUserCreate';
import UserModify from '../pages/companyUserModify';
import BulkUserCreate from '../pages/companyUserBulkCreate';

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="mainback">
        {user.type === 'company' ? <CompanyHeader /> : <AgentHeader />}
        <div className="bottompart">
          {user.type === 'company' ? <CompanyNavbar /> : <AgentNavbar />}
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
                    <Route
                      path="view"
                      element={<AgentPrivateRoute component={<ViewAgent />} />}
                    />
                    <Route
                      path="setprices"
                      element={<AgentPrivateRoute component={<SetPrices />} />}
                    />
                    <Route
                      path="recharge"
                      element={
                        <AgentPrivateRoute component={<RechargeAgent />} />
                      }
                    />
                    <Route
                      path="modify"
                      element={
                        <AgentPrivateRoute component={<ModifyAgent />} />
                      }
                    />
                  </Route>

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
                  <Route path="user-management">
                    <Route
                      path="create-new-user"
                      element={
                        <CompanyPrivateRoute component={<UserCreate />} />
                      }
                    />
                    <Route
                      path="bulk-create"
                      element={
                        <CompanyPrivateRoute component={<BulkUserCreate />} />
                      }
                    />
                    <Route
                      path="view-user-list"
                      element={
                        <CompanyPrivateRoute component={<CompanyUserView />} />
                      }
                    />

                    <Route
                      path="modify-user"
                      element={
                        <CompanyPrivateRoute component={<UserModify />} />
                      }
                    />
                  </Route>
                  <Route path="contact-list">
                    <Route
                      path="new"
                      element={
                        <CompanyPrivateRoute
                          component={<ContactListCreate />}
                        />
                      }
                    />
                    <Route
                      path="modify"
                      element={
                        <CompanyPrivateRoute
                          component={<ContactListModify />}
                        />
                      }
                    />
                  </Route>
                  <Route path="talkgroup-management">
                    <Route
                      path="new-talk-group"
                      element={
                        <CompanyPrivateRoute component={<TalkGroupCreate />} />
                      }
                    />
                    <Route
                      path="modify-talk-group"
                      element={
                        <CompanyPrivateRoute component={<TalkGroupModify />} />
                      }
                    />
                  </Route>

                  <Route path="order-center">
                    <Route
                      path="order-list"
                      element={
                        <CompanyPrivateRoute component={<CompanyOrderList />} />
                      }
                    />
                    <Route
                      path="transaction-history"
                      element={
                        <CompanyPrivateRoute
                          component={<CompanyOrderTrans />}
                        />
                      }
                    />
                  </Route>
                  <Route path="personal-center">
                    <Route
                      path="change-password"
                      element={
                        <CompanyPrivateRoute
                          component={<CompanyChangePassword />}
                        />
                      }
                    />
                    <Route
                      path="activity"
                      element={
                        <CompanyPrivateRoute
                          component={<CompanyViewActivity />}
                        />
                      }
                    />
                    <Route
                      path="loginrecord"
                      element={
                        <CompanyPrivateRoute component={<CompanyViewLogin />} />
                      }
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
