import React, { useEffect, useState } from 'react';
import '../css/licenseModify.css';
import axios from '../utils/axios';

export default function LicenseModify() {

 
  
    const [updateType, setupdateType] = useState('');
    const [order, setorder] = useState(0);
    const [orderlist, setorderlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [price,setotalprice]=useState(0);
    const [avlbal,setavlbal]=useState(0);
   const [accountlist,setaccountlist]=useState([]);
   const [selectedlist,setselectedlist]=useState([]);
   const [showacc,setshowacc]=useState(true);
   const [avlaccounts, setavlaccounts] = useState(10);
   const [companylist,setcompanylist]=useState([]);
   const [company,setcompany]=useState("");

   useEffect(() => {
  accountlist.map((val)=>{val.selected=false})
  }, []);
  function onselect(){
setselectedlist(accountlist.filter((val)=>{return val.selected==true}));
setaccountlist(accountlist.filter((val)=>{return val.selected==true}))

  }
   const SelectAcc=()=>{
    return(
      <div>
        Select Accounts
    <div className="comp">

    <div className="accbox">
{accountlist.map((val,index)=>{
  return(<>
    <input type="checkbox" id="subitem" name="selection" onClick={()=>{val.selected=!val.selected}}  />
  <label for="selection">{val.account_name}</label>
  </>
  )
})}
    </div>
    <button onClick={onselect}>&nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;</button>
    <div className="accbox">
    {selectedlist.map((val,index)=>{
  return(<>
   
  <div >{val.account_name}</div>
  </>
  )
})}

    </div>
    </div></div>)
  }
    
  
  



    const form = () => {
      return (
        <form className="passback" >
          <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
             UPDATE LICENSE ORDER
          </div>
          Available Balance : {avlbal}
          <div className="formarea">
          <br />
            <div>
              <span>
                <label htmlFor="company">Select Order :&nbsp;&nbsp;&nbsp; </label>
              </span>
              <select
                id="order"
                onChange={(event) => {
                  setorder(event.target.value);
                }}
                value={order}
                required
              >
                {orderlist.map((val) => {
                  return (
                    <option key={val.id} value={val.id}>
                      {val.display_name}
                    </option>
                  );
                })}
              </select>
            </div>
        
        <br/>
            <div>
              <span>
                <label htmlFor="lictype">Update Type: &nbsp;</label>
              </span>
              <select
                id="id1"
                onChange={(event) => {
                  setupdateType(event.target.value);
                }}
                value={updateType}
                required
              >
                <option value={0}>Select Update Type</option>
             
                    <option >Update Features</option>
                    <option >Renew</option> 
                      <option > Transfer</option>  
              </select>
            </div>
            </div>
            <br />
         
            <br />
          {/*=============================================================================*/}


            {(updateType=="Update Features")&&(<div className='box'>
 <div>
 <input type="checkbox" id="feature" name="selection" onClick={()=>{setshowacc(!showacc)}}/>
  <label for="selection"> All Acocunts </label>

  </div>
{  showacc&&
<SelectAcc/>}
            <div>
 <label >Features : </label>&nbsp;<br/>
  <input type="checkbox" id="feature" name="feature1" />
  <label for="feature1"> Group Call</label>&nbsp;&nbsp;
  <input type="checkbox" id="feature" name="feature2" />
  <label for="feature2"> Private Call</label>&nbsp;&nbsp;
  <input type="checkbox" id="feature" name="feature3" />
  <label for="feature3"> Encryption </label>&nbsp;&nbsp;
 <input type="checkbox" id="feature" name="feature3" />
  <label for="feature3"> Live GPS </label>&nbsp;&nbsp; 
 <input type="checkbox" id="feature" name="feature3" />
  <label for="feature3"> Geo-Fence </label>&nbsp;&nbsp;
   <input type="checkbox" id="feature" name="feature3" />
  <label for="feature3"> Chat </label>&nbsp;&nbsp;
  </div>
  
 Add-on Unit Price : {price} &nbsp; &nbsp;
Add-on Total Price : {price}
  <button type="submit" disabled={disabled}>
            Update License
          </button>      </div>)}
          
          
          {/*=============================================================================*/}
          
          
          
          
            {(updateType=="Renew")&&(<div className='box'>
            <div>
 <input type="checkbox" id="feature" name="selection" onClick={()=>{setshowacc(!showacc)}}/>
  <label for="selection"> All Accounts </label>

  </div>
{  showacc&&
<SelectAcc/>}
<br/>
<div className="me-3">
Renew License For : <input type="number"/>  &nbsp; <select
              
                required
              >
<option>Monthly</option>
<option>Quarterly</option>
<option>Half-Yearly</option>
<option>Yearly</option>


              </select>
              </div>
              <br/>
              <div>
              Current Expiry Date : {0} &nbsp; &nbsp;
After Renewal Expiry Date : {0}</div>
<br/>
              <div>
            Renewal  Unit Price : {price} &nbsp; &nbsp;
Renewal Total Price : {price}</div>
<br/>
            <button type="submit" disabled={disabled}>
            Renew License
          </button>
                
</div>)}
{(updateType=="Transfer")&&(<div className='box'>
Accounts Available:{avlaccounts}
<br/>
Transfer Quantity  : <input type="number"/>
<br/>
Transfer To Company :  <select
                id="company"
                onChange={(event) => {
                  setcompany(event.target.value);
                }}
                value={order}
                required
              >
                {companylist.map((val) => {
                  return (
                    <option key={val.id} value={val.id}>
                      {val.display_name}
                    </option>
                  );
                })}
              </select>

<button type="submit" disabled={disabled}>
            Transfer Accounts
          </button>               
</div>)}
            
     
       
      
     

  <br/>
        
        </form>
      );
    };
  
    if (loading) {
      return (
        <div className="passback">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }
  
    return <div>{!loading && form()}</div>;
}