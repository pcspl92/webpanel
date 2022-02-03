import React, { useState } from 'react';
import '../../css/index.css';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
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
  if (location.pathname === '/company/') return null;
  return <div className="navbar">Space For Company Navbar</div>;
}
