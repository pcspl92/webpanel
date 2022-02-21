import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../css/index.css';

export default function Navbar() {
  const location = useLocation();

  const [userdrop, setuserdrop] = useState(false);
  function dropdownuser() {
    setuserdrop(!userdrop);
  }
  const [condrop, setcondrop] = useState(false);
  function dropdowncon() {
    setcondrop(!condrop);
  }
  const [talkgdrop, settalkgdrop] = useState(false);
  function dropdowntalkg() {
    settalkgdrop(!talkgdrop);
  }
  const [deptdrop, setdeptdrop] = useState(false);
  function dropdowndept() {
    setdeptdrop(!deptdrop);
  }
  const [orderdrop, setorderdrop] = useState(false);
  function dropdownorder() {
    setorderdrop(!orderdrop);
  }

  const [perdrop, setperdrop] = useState(false);
  function dropdownper() {
    setperdrop(!perdrop);
  }

  const restrictedPaths = new Set(['/', '/company/', '/agent/']);
  if (restrictedPaths.has(location.pathname)) return null;

  return (
    <div className="navbar">
      <NavLink
        className={({ isActive }) =>
          `link ${isActive ? 'activeheadings' : 'headings'}`
        }
        to="/company/dashboard"
      >
        &nbsp; &nbsp; Dashboard
      </NavLink>

      <div className="headings" onClick={dropdownuser}>
        + User Management
      </div>
      {userdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/user-managment/create-new-user"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Create New User{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/user-managment/bulk-create-excel"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Bulk Create(Excel){' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/user-management/bulk-create"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Bulk Create{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/user-management/view-user-list"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; View User List{' '}
          </NavLink>
          <br />

          <NavLink
            to="/company/user-managment/modify-user"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Modify User{' '}
          </NavLink>
        </div>
      )}

      <div className="headings" onClick={dropdowncon}>
        {' '}
        + Contact List
      </div>
      {condrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/contact-list/new"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; New Contact List{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/contact-list/modify"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Modify Contact List{' '}
          </NavLink>
          <br />
        </div>
      )}
      <div className="headings" onClick={dropdowntalkg}>
        + Talk Group Management
      </div>
      {talkgdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/talkgroup-management/new-talk-group"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; New Talk-Group{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/talkgroup-management/modify-talk-group"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Modify Talk-Group{' '}
          </NavLink>
        </div>
      )}
      <div className="headings" onClick={dropdowndept}>
        + Department Management
      </div>
      {deptdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/department-management/new-department"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; New Department{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/department-management/modify-department"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Modify Department{' '}
          </NavLink>
        </div>
      )}
      <div className="headings" onClick={dropdownorder}>
        + Order Center
      </div>
      {orderdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/order-center/order-list"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Order List{' '}
          </NavLink>
          <br />
          <NavLink
            to="/company/order-center/transaction-history"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Order Transaction History{' '}
          </NavLink>
        </div>
      )}
      <div className="headings" onClick={dropdownper}>
        + Personal Center
      </div>
      {perdrop && (
        <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
          <NavLink
            to="/company/personal-center/change-password"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp; Change Password{' '}
          </NavLink>

          <br />
          <NavLink
            to="/company/personal-center/activity"
            className={({ isActive }) =>
              `link ${isActive ? 'activesubheadings' : 'subheadings'}`
            }
          >
            &nbsp;&nbsp;View User Activity Log{' '}
          </NavLink>

          <br />
          <NavLink
            to="/company/personal-center/loginrecord"
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
