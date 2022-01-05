import React, { useState } from 'react';
import '../css/Recharge.css';
import Axios from 'axios';
const RechargeAgent=()=>{
    const [agentname, setagentname] = useState('');
    const [agentlist, setagentlist] = useState([]);
    const [balance, setbalance] = useState(100);
    const [recharge, setrecharge] = useState(100);

    return(
        <div className='rechargeback'>
            
<div style={{fontWeight
:"bolder",fontSize:"4vh"}}>RECHARGE SUB-AGENT</div>
<br/>
<br/>
<div>Available Balance :{balance}</div>
<br/>
<div className='d-flex flex-column justify-content-end aligh-items-end'>
<div >
      <span>
          <label for="id1">Select Sub-Agent : </label>
        </span>
        <select
          id="id1"
          onChange={(event) => {
            setagentname(event.target.value);
          }}
          required
        >
              <option>Select a Option </option> 
        {
            agentlist.map((val,key)=>{
                return(
                       
           <option>{val.agent_name}</option>
         )
           } )
        }
         
    </select>
        </div>
        <br/>
        <div>Sub Agent Current Balance : {balance}</div>      <br/>
       <div>
        <span>
          <label for="id1">Recharge Amount :</label>
        </span>
        <input
          type="text"
          id="id1"
          onChange={(event) => {
            setrecharge(event.target.value);
          }}
          required
        />
        </div>
        <br/>
        <div>Sub Agent Current Balance  After Recharge: {balance}</div>   
        </div>
        <br/>
        <button className='p-1'>Recharge</button>
        </div>
    )
}


export default RechargeAgent; 