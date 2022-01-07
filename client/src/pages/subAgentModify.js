import React, { useState } from 'react';
import '../css/Modify.css';
import Axios from 'axios';
import  generator  from 'generate-password-browser';
const ModifyAgent=()=>{
    const [agentname, setagentname] = useState('');
    const [agentlist, setagentlist] = useState([]);
    const [stateval,setstateval]=useState(false);
    const [active, setactive] = useState(true);
    const [contact_number,setcontact]=useState();
    const [agentnewname, setagentnewname] = useState('');
    const [password, setPassword] = useState('');
    const [generated, setGenerated] = useState(false);
   
    const generatePassword = () => {
        const pwd = generator.generate({
          length: 8,
          lowercase: true,
          uppercase: true,
          numbers: true,
          symbols: true
        });
        setPassword(pwd);
      }
    return(
        <div className='modifyback'> 
        <div style={{fontWeight
        :"bolder",fontSize:"4vh"}}>MODIFY SUB-AGENT</div>
        <br/>
        <br/>
        <div className='modifyform'>
        <div className='me-5' >
      <span>
          <label for="id1">Select Sub-Agent :&nbsp;&nbsp;&nbsp; </label>
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
        <div className='mt-3 me-5'> 
        <span>
          <label for="id1">Status :&nbsp;&nbsp;&nbsp;</label>
        </span>
        <span>
<span className={active?"activeclass":"inactiveclass"} style={{
            
                    borderTopLeftRadius: "10%",
                    borderBottomLeftRadius: "10%",
                  }} onClick={()=>{setactive(!active)}}>Active</span>
<span className={!active?"activeclass":"inactiveclass"}  style={{
     
       
                    borderTopRightRadius: "10%",
                    borderBottomRightRadius: "10%",
                  }} onClick={()=>{setactive(!active)}}>Paused</span>

        </span>
  
</div>
<div className='mt-3 me-5'>
   <span>
    Password : &nbsp;&nbsp;&nbsp;</span>
    <button style={{width:"8.5vw"}} onClick={()=>{setGenerated(true);generatePassword()}}>RESET</button>
</div>
{generated&&
<div className='mt-3 me-5'>New Generated Password : {password}</div>}
<div className='mt-3'>
<span>
          <label for="id5">Sub Agent Name :&nbsp;&nbsp;&nbsp;</label>
        </span>
        <input
          type="text"
          id="id5"
          style={{width:"12vw"}}   
          onChange={(event) => {
            setagentnewname(event.target.value);
          }}
        />
</div>
<div className='mt-3 '  >
<span>
          <label for="id5">Contact Number :&nbsp;&nbsp;&nbsp;</label>
        </span>
        <input
          type="text"
          id="id5"
        style={{width:"12vw"}}   
          onChange={(event) => {
            setcontact(event.target.value);
          }}
        />
</div>
        </div>
        <button className='mt-3'>UPDATE</button>
        </div>
    )
}


export default ModifyAgent; 