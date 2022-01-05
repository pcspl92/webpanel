import React, { useState } from 'react';
import '../css/index.css';
import { Routes, Route, NavLink } from 'react-router-dom';
import CreateSubAgent from './subAgentCreate';
export default function Index() {
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
   <>fffdffdfdfdfdfffdfffdffdfdfdfdfffd</>
  );
}