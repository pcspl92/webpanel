import React, { useEffect, useState } from 'react';
import '../css/licenseCreate.css';
import axios from '../utils/axios';

export default function LicenseCreate() {

    
    const [quantity, setquantity] = useState(0);
    const [licenseType, setlicensetype] = useState('');
    const [renewalType, setRenewalType] = useState('');
    const [company, setcompany] = useState(0);
    const [companylist, setcompanylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [price,setotalprice]=useState(0);
    const [avlbal,setavlbal]=useState(0);

  
  
  



    const form = () => {
      return (
        <form className="passback" >
          <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
             NEW LICENSE ORDER
          </div>
          Available Balance : {avlbal}
          <div className="formarea">
          <br />
            <div>
              <span>
                <label htmlFor="company">Select Company :&nbsp;&nbsp;&nbsp; </label>
              </span>
              <select
                id="company"
                onChange={(event) => {
                  setcompany(event.target.value);
                }}
                value={company}
                required
              >
                <option value={0}>Select Company</option>
                {companylist.map((val) => {
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
                <label htmlFor="lictype">License Type: &nbsp;</label>
              </span>
              <select
                id="id1"
                onChange={(event) => {
                  setcompany(event.target.value);
                }}
                value={company}
                required
              >
                <option value={0}>Select License Type</option>
             
                    <option >
                        PTT User
                    </option>
                    <option >
                        Dispatcher
                    </option> 
                      <option >
                       Control Station
                    </option>  
              </select>
            </div>
            <br />
            <div>
              <span>
                <label htmlFor="username">License Renewal: &nbsp;</label>
              </span>
              <select
                id="id3"
                onChange={(event) => {
                  setRenewalType(event.target.value);
                }}
                value={renewalType}
                required
              >
                <option value={0}>Select License Renewal Type</option>
             
                    <option >
                        Monthly
                    </option>
                    <option >
                        Quarterly
                    </option> 
                      <option >
                          Half Yearly
                    </option>  
                    <option >
                           Yearly
                    </option>  
                    <option >
                        One-Time
                    </option>  
              </select>
            </div>
            <br />
            <div>
              <span>
                <label htmlFor="confirm">Quantity : &nbsp;</label>
              </span>
              <input
                type="number"
                id="confirm"
                onChange={(event) => {
                  setquantity(event.target.value);
                }}
                value={quantity}
                required
              />
            </div>

            <br />
            Unit Price : {price} &nbsp; &nbsp;
Total Price : {price}
     
       
          </div>
     
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
  <br/>
          <button type="submit" disabled={disabled}>
            Purchase
          </button>
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