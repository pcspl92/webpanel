import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../css/index.css';

export default function Navbar() {
  const [companydrop, setcompanydrop] = useState(false);
  const location = useLocation();
  function dropdowncompany() {
    setcompanydrop(!companydrop);
  }
  const [userdrop, setuserdrop] = useState(false);
  function dropdownuser() {
    setuserdrop(!userdrop);
  }
  const [licdrop, setlicdrop] = useState(false);
  function dropdownlic() {
    setlicdrop(!licdrop);
  }
  const [agentdrop, setagentdrop] = useState(false);
  function dropdownagent() {
    setagentdrop(!agentdrop);
  }
  const [perdrop, setperdrop] = useState(false);
  function dropdownper() {
    setperdrop(!perdrop);
  }

  if (location.pathname === '/agent/' || location.pathname === '/') return null;

  return (
    <div className="navbar">
      <NavLink
        className={({ isActive }) =>
          `link ${isActive ? 'activeheadings' : 'headings'}`
        }
        to="/agent/dashboard"
      >
        &nbsp; &nbsp; Dashboard
      </NavLink>

      <div className="headings" onClick={dropdowncompany}>
        + Company Management
      </div>
      {companydrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/agent/company-management/create-new-company"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Create New Company{' '}
          </NavLink>
          <br />
          <NavLink
            to="/agent/company-management/view-companies"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; View Company List{' '}
          </NavLink>
          <br />
          <NavLink
            to="/agent/company-management/modify-company"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Modify Company{' '}
          </NavLink>
        </div>
      )}

      <div className="headings" onClick={dropdownuser}>
        {' '}
        + User Management
      </div>
      {userdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/agent/users/view"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; View User Accounts{' '}
          </NavLink>

          <br />
        </div>
      )}
      <div className="headings" onClick={dropdownlic}>
        + License Management
      </div>
      {licdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/agent/license-management/new-order"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; New License Order{' '}
          </NavLink>
          <br />
          <NavLink
            to="/agent/license-management/order-history"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; View Order History{' '}
          </NavLink>
          <br />
          <NavLink
            to="/agent/license-management/transactions"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Transactions{' '}
          </NavLink>
          <br />
          <NavLink
            to="/agent/license-management/update-license"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Update License{' '}
          </NavLink>
        </div>
      )}
      <div className="headings" onClick={dropdownagent}>
        + Sub-Agent Management
      </div>
      {agentdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/agent/subagent/create"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Create New Sub-Agent{' '}
          </NavLink>

          <br />

          <NavLink
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
            to="/agent/subagent/view"
          >
            &nbsp; Views Sub-Agents
          </NavLink>

          <br />

          <NavLink
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
            to="/agent/subagent/setprices"
          >
            &nbsp; Set Prices for Sub_Agents
          </NavLink>

          <br />

          <NavLink
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
            to="/agent/subagent/recharge"
          >
            &nbsp; Recharge Sub-Agents
          </NavLink>

          <br />

          <NavLink
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
            to="/agent/subagent/modify"
          >
            &nbsp; Modify Sub-Agents
          </NavLink>
        </div>
      )}
      <div className="headings" onClick={dropdownper}>
        + Personal Center
      </div>
      {perdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/agent/personal-center/change-password"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Change Password{' '}
          </NavLink>

          <br />
          <NavLink
            to="/agent/personal-center/activity"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp;&nbsp;View User Activity Log{' '}
          </NavLink>

          <br />
          <NavLink
            to="/agent/personal-center/loginrecord"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Login Record{' '}
          </NavLink>

          <br />
        </div>
      )}
    </div>
  );
}
