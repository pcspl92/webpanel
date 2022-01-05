import React, { useState } from 'react';
import '../css/index.css';
import { Routes, Route, NavLink } from 'react-router-dom';
export default function Navbar() {
    const [companydrop, setcompanydrop] = useState(false);
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
    return (
        <div className="navbar">
        <div className="headings">&nbsp; &nbsp; Dashboard</div>

        <div className="headings">+ Company Management</div>

        <div className="headings"> + User Management</div>

        <div className="headings">+ License Management</div>

        <div className="headings" onClick={dropdownagent}>
          + Sub-Agent Management
        </div>
        {agentdrop && (
          <div style={{ marginTop: '1.5vh', marginLeft: '2vw' }}>
            <NavLink
              to="/subagent/create"
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
              to="/subagent/view"
            >
              &nbsp; Views Sub-Agents
            </NavLink>

            <br />

            <NavLink
              className={({ isActive }) =>
                `link ${isActive ? 'activesubheadings' : 'subheadings'}`
              }
              to="/SetPrices"
            >
              &nbsp; Set Prices for Sub_Agents
            </NavLink>

            <br />

            <NavLink
              className={({ isActive }) =>
                `link ${isActive ? 'activesubheadings' : 'subheadings'}`
              }
              to="/RechargeSubAgents"
            >
              &nbsp; Recharge Sub-Agents
            </NavLink>

            <br />

            <NavLink
              className={({ isActive }) =>
                `link ${isActive ? 'activesubheadings' : 'subheadings'}`
              }
              to="/ModifySubAgents"
            >
              &nbsp; Modify Sub-Agents
            </NavLink>
          </div>
        )}
        <div className="headings">+ Personal Center</div>
      </div>
       
    );
  }