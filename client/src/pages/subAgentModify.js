import React, { useState } from 'react';
import '../css/Modify.css';
import Axios from 'axios';
const ModifyAgent=()=>{
    const [agentname, setagentname] = useState('');
    const [agentlist, setagentlist] = useState([]);
    return(
        <div className='modifyback'> 
        <div style={{fontWeight
        :"bolder",fontSize:"4vh"}}>MODIFY SUB-AGENT</div>
        <br/>
        <br/>
        <div>
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
        <div>Status : </div>
        </div>
        </div>
    )
}


export default ModifyAgent; 