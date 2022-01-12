import React, { useEffect, useState } from 'react';
import '../css/dashboard.css';
import axios from '../utils/axios';

export default function Dashboard() {
  const [dashData, setDashData] = useState({});
  const [totalbalance, settotalbalance] = useState();
  const [tabledata, settabledata] = useState([]);
  const [totalcompanies, settotalcompanies] = useState();
  const [totalsubagents, settotalsubagents] = useState();

console.log(dashData)
  useEffect(() => {
    (async () => {
      const result= await axios.get('/dashboard/agent');
      setDashData(result.data);
    })();
  }, []);

  return (
    <div className="viewback">
   

      <br />
   
        <div>
          <span>
            Total Balance : 
          </span>
         {totalbalance}
        </div>
       
        
     
      <table className="mt-3">
        <tr className="tableheading">
          <th style={{backgroundColor:"white",width:"18vw",border:"none"}}> </th>
          <th>Total</th>
          <th>Active</th>
          <th>Available</th>
          <th>Expired</th>
        
        </tr>
 
        
            <tr>
            <th style={{backgroundColor:"white",width:"18vw",border:"none"}}> Total PPT User Accounts : </th>
              <th>{dashData.data.ptt.total}</th>
              <th>{dashData.data.ptt.active}</th> 
              <th>{dashData.data.ptt.available}</th>
               <th>{dashData.data.ptt.expired}</th>
         
            </tr>
            <tr>
            <th style={{backgroundColor:"white",width:"18vw",border:"none"}}> Total Dispatcher Accounts : </th>
              <th>{dashData.data.dispatcher.total}</th>
              <th>{dashData.data.dispatcher.active}</th> 
              <th>{dashData.data.dispatcher.available}</th>
               <th>{dashData.data.dispatcher.expired}</th>
          </tr> <tr>
            <th style={{backgroundColor:"white",width:"18vw",border:"none"}}> Total Control Station Accounts : </th>
              <th>{dashData.data.control.total}</th>
              <th>{dashData.data.control.active}</th> 
              <th>{dashData.data.control.available}</th>
               <th>{dashData.data.control.expired}</th>
         
            </tr>
    
      </table>
      <br />
      <div>
          <span>
            Total Sub - Agents : 
          </span>
         {dashData.total_subagents}
        </div> 
       <br/>
        <div>
          <span>
            Total Companies : 
          </span>
         {dashData.total_companies}
        </div>
    </div>
  );
}
