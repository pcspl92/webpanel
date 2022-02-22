/* eslint-disable no-unused-vars */
import React, {  useState, useRef } from 'react';
import * as yup from 'yup';
import '../css/companyUserCreate.css';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

 function BulkUserCreate() {
    const [updateType, setupdateType] = useState('0');
    const [accountName,setaccountName]=useState('');
    const [userdispName,setuserDispName]=useState('');
    const [password , setPassword]=useState('');
    const [displayName,setDisplaynamw]=useState('');
    const [remoteIDadd,setRemoteIPadd]=useState('');
    const [remotePortadd,setRemotePortadd]=useState('');
    const [deviceID,setDeviceID]=useState('');
    const [receivingPortadd,setReceivingPortadd]=useState('');
    const [contactNum,setcontactNum]=useState(0);
    const [department,setDepartment]=useState('');
    const [departmentList,setDepartmentList]=useState([])
    const [order, setorder] = useState('0');
    const [orderlist, setorderlist] = useState([]);
    const [contactList,setContactlist]=useState([]);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [TGList, setTGList] = useState([]);
    const [CSList, setCSList] = useState([]);
    const [talkgroup,setTalkgroup]=useState();
    const [controlstation,setControlStation]=useState();
    const [postfixNo,setpostfixNo]=useState();
    const [numberofAccounts,setnumberofAccounts]=useState(1);
    const [selectedTG, setSelectedTG] = useState([]);
    const [selectedCS, setSelectedCS] = useState([]);
    const [controlStationTypeList,setcontrolStationTypeList]=useState([]);
    const [controlStationType,setcontrolStationType]=useState([]);

    const [showacc, setshowacc] = useState(true);
    const [company, setcompany] = useState('0');
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [disableSelect, setDisableSelect] = useState(false);
    const [featuresGlobal, setFeaturesGlobal] = useState({
      grp_call: false,
      enc: false,
      priv_call: false,
      live_gps: false,
      geo_fence: false,
      chat: false,
    });
    const selectedUserIds = useRef(new Set());
    const selectedTGIds = useRef(new Set());
    const selectedCSIds = useRef(new Set());
    const schema = yup.object().shape({
      username: yup
        .string()
        .typeError('Username must be string')
        .required('This field is required')
        .min(3, 'Username must be 3-40 characters long')
        .max(40, 'Username must be 3-40 characters long'),
      password: yup
        .string()
        .typeError('Password must be string')
        .required('This field is required')
        .min(8, 'Password must be 8-30 characters long')
        .max(30, 'Password must be 8-30 characters long'),
      confirm_password: yup
        .string()
        .typeError('Confirm Password must be string')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
      display_name: yup
        .string()
        .typeError('Sub-Agent name must be string')
        .required('This field is required')
        .min(10, 'Sub-Agent name must be 10-90 characters long')
        .max(90, 'Sub-Agent name must be 10-90 characters long'),
      contact_number: yup
        .number()
        .typeError('Contact Number must be number')
        .min(10, 'Contact number must be 10 characters long')
        .max(10, 'Contact number must be 10 characters long')
        .required('This filed is required'),
    });
  
  
  
    const { user } = useAuth();

  // transfers users to new list 
  
    function onTGSelect() {
      const selected = [];
      selectedUserIds.current.forEach((id) => {
        selected.push(TGList.filter((TGid) => TGid.id === id)[0]);
      });
      setSelectedTG(selected);
    }
    function onCSSelect(users) {
      const selected = [];
      selectedUserIds.current.forEach((id) => {
        selected.push(CSList.filter((usersel) => usersel.id === id)[0]);
      });
      setSelectedCS(selected);
    }
   
      // eslint-disable-next-line no-unused-vars
      const SelectTalkGroups = () => (
        <div>
          Select Talkgroups
          <div className="comp">
            <div className="accbox">
              {TGList.map((val) => (
                  <div key={val.id}>
                    <input
                      type="checkbox"
                      id="subitem"
                      name="selection"
                      defaultChecked={selectedTGIds.current.has(val.id)}
                      onClick={() => {
                        selectedTGIds.current.has(val.id)
                          ? selectedTGIds.current.delete(val.id)
                          : selectedTGIds.current.add(val.id);
                      }}
                    />
                    <label htmlFor="selection">{val.display_name}</label>
                  </div>
                ))}
            </div>
            <button type="button" onClick={() => onTGSelect()}>
              &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
            </button>
            <div className="accbox">
              {(selectedTG.length &&
                selectedTG.map((val) => <div key={val.id}>{val.display_name}</div>)) ||
                null}
            </div>
            
          </div>
        </div>
      );
      const SelectControlStations = () => (
        <div>
          Select Control Stations
          <div className="comp">
            <div className="accbox">
              {CSList.map((val) => (
                  <div key={val.id}>
                    <input
                      type="checkbox"
                      id="subitem"
                      name="selection"
                      defaultChecked={selectedUserIds.current.has(val.id)}
                      onClick={() => {
                        selectedCSIds.current.has(val.id)
                          ? selectedCSIds.current.delete(val.id)
                          : selectedCSIds.current.add(val.id);
                      }}
                    />
                    <label htmlFor="selection">{val.display_name}</label>
                  </div>
                ))}
            </div>
            <button type="button" onClick={() => onCSSelect()}>
              &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
            </button>
            <div className="accbox">
              {(selectedCS.length &&
                selectedCS.map((val) => <div key={val.id}>{val.display_name}</div>)) ||
                null}
            </div>
          </div>
        </div>
      );
  
    const setShow = (show, users) => {
      users.forEach(({ id }) => selectedUserIds.current.add(id));
      setshowacc(show);
    };
  
    
  
    const setFeature = (checked, feature) => {
      setFeaturesGlobal({ ...featuresGlobal, [feature]: checked });
    };
    const PTTUserForm = () => (
        <div className="box2">
         <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end" , justifyContent:"center" }}>
             <div>
              <span>
                <label htmlFor="confirm">Account Username Prefix : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Password : &nbsp;</label>
              </span>
              <input
                type="password"
                id="name"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Confirm Password : &nbsp;</label>
              </span>
              <input
                type="password"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">User Display Name Prefix : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            </div>
            <br/>
       <SelectTalkGroups/>
  
          <div>
          <br />
          <div className='
          formarea'>
            <div>
              <span>
                <label htmlFor="lictype">Default Talkgroup: &nbsp;</label>
              </span>
              <select
                id="id1"
                onChange={(e) => {
                  setTalkgroup(e.target.value);
                }}
                disabled={disableSelect}
                value={talkgroup}
                required
              >
              {
  TGList.map((val,id)=>(<option key={id}>{val.tg_name}</option>))
  
              }
              </select>
            </div>
            <br />
            <div>
              <span>
                <label htmlFor="lictype">Assign Contact List: &nbsp;</label>
              </span>
              <select
                id="id1"
                onChange={(e) => {
                  setControlStation(e.target.value);
                }}
                disabled={disableSelect}
                value={controlstation}
                required
              >
           {  CSList.map((val,id)=>(<option key={id}>{val.tg_name}</option>))}
  
              </select>
            </div>
            </div>
            <br/>
            <label>Features : </label>&nbsp;
            <br />
            <input
              type="checkbox"
              id="feature"
              name="feature1"
              onChange={(e) => {
                setFeature(e.target.checked, 'grp_call');
              }}
            />
            <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature2"
              onChange={(e) => {
                setFeature(e.target.checked, 'priv_call');
              }}
            />
            <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'enc');
              }}
            />
            <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'live_gps');
              }}
            />
            <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'geo_fence');
              }}
            />
            <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'chat');
              }}
            />
            <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
          </div>
          <br/>
        {' '}
        </div>
      );
      const DispatcherForm = () => (
        <div className="box2">
         <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end" , justifyContent:"center" }}>
             <div>
              <span>
                <label htmlFor="confirm">Account Username  Prefix: &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Password : &nbsp;</label>
              </span>
              <input
                type="password"
                id="name"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Confirm Password : &nbsp;</label>
              </span>
              <input
                type="password"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">User Display Name Prefix : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setuserDispName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
            </div>
            <br/>
       <SelectTalkGroups/>
       <br/>
       <SelectControlStations/>
       <br/>
       <div>
              <span>
                <label htmlFor="confirm">Assign Contact List : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setaccountName(event.target.value);
                }}
                value={accountName}
                required
              />
            </div>
          <div>
            <label>Features : </label>&nbsp;
            <br />
            <input
              type="checkbox"
              id="feature"
              name="feature1"
              onChange={(e) => {
                setFeature(e.target.checked, 'grp_call');
              }}
            />
            <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature2"
              onChange={(e) => {
                setFeature(e.target.checked, 'priv_call');
              }}
            />
            <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'enc');
              }}
            />
            <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'live_gps');
              }}
            />
            <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'geo_fence');
              }}
            />
            <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
            &nbsp;&nbsp;
            
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'chat');
              }}
            />
            <label htmlFor="feature3"> Kill/Unkill </label>&nbsp;&nbsp;
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'kill/unkill');
              }}
            />
            <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
          </div>
          <br/>
        {' '}
        </div>
      );
  
      const ControlStationForm = () => (
        <div className="box2">
         <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end" , justifyContent:"center" }}>
         <br/>
       
            <div>
              <span>
                <label htmlFor="confirm">Control Station Type: &nbsp;</label>
              </span>
              <select
                onChange={(event) => {
                  setcontrolStationType(event.target.value);
                }}
                value={controlStationType}
                required
              >
                  {controlStationTypeList.map((val,id)=><option key={id}>{val.control_station_name}</option>)}
                  </select>
            </div>
            <br/>
       
            <div>
              <span>
                <label htmlFor="confirm">User Display Name Prefix: &nbsp;</label>
              </span>
              <input
                type="text"
                id="add"
                onChange={(event) => {
                  setuserDispName(event.target.value);
                }}
                value={userdispName}
                required
              />
            </div>
      
            <br/>
            Receiving Port Address : {receivingPortadd}  (Auto-Generated)
            </div>
            <br/>
  
   
          <br/>
        {' '}
        </div>
      ); 
   
  
    
    const form = () => (
        <form className="passback" >
          <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
            BULK CREATE USERS
          </div>
          Available Balance : {user.balance}
          <div className="formarea">
            <br />
            <div>
              <span>
                <label htmlFor="lictype">Select User Account  Type: &nbsp;</label>
              </span>
              <select
                id="id1"
                onChange={(e) => {
                  setupdateType(e.target.value);
                }}
                disabled={disableSelect}
                value={updateType}
                required
              >
                <option value={'0'}>Select Account Type</option>
                <option value={'ptt'}>PTT User Account</option>
                <option value={'dispatcher'}>Dispatcher Account</option>
                <option value={'controlstations'}>Control Station</option>
              </select>
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="company">Select Order :&nbsp;&nbsp;&nbsp; </label>
              </span>
              <select
                id="order"
                onChange={(event) => {
                  setorder(event.target.value);
                }}
                disabled={disableSelect}
                value={order}
                required
              >
                <option value={'0'}>Select Order Id</option>
                {orderlist.map((val) => (
                    <option key={val.id} value={val.id}>
                      {val.id}
                    </option>
                  ))}
              </select>
            </div>
  
            <br />
        
          </div>
          <br />
          <br />
          {formLoading && updateType !== '0' ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : null}
         
          {updateType === 'ptt' && PTTUserForm()}
          {updateType === 'dispatcher' &&  DispatcherForm()}
          {updateType === 'controlstations' &&  ControlStationForm()}
          <br />
          <div className='formarea'>
          <div>
              <span>
                <label htmlFor="confirm">Contact Number : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setcontactNum(event.target.value);
                }}
                value={contactNum}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Department : &nbsp;</label>
              </span>
              <select
                id="name"
                onChange={(event) => {
                  setDepartment(event.target.value);
                }}
                value={department}
                required
              >
                {
  departmentList.map((val,id)=>(<option key={id} >{val.department_name}</option>))
                }
              </select>
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">Post-Fix Starting Number : &nbsp;</label>
              </span>
              <input
                type="text"
                id="name"
                onChange={(event) => {
                  setpostfixNo(event.target.value);
                }}
                value={postfixNo}
                required
              />
            </div>
            <br/>
            <div>
              <span>
                <label htmlFor="confirm">No. of Accounts : &nbsp;</label>
              </span>
              <input
                type="number"
                id="name"
                onChange={(event) => {
                  setnumberofAccounts(event.target.value);
                }}
                value={numberofAccounts}
                required
              />
            </div>
          </div>
          <button> SAVE </button>

        </form>
      );
  
    if (loading) {
      return (
        <div className="passback">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }
  
    return <div>{!loading && form()}</div>;
}
export default  BulkUserCreate