/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import * as yup from 'yup';
import '../css/licenseModify.css';
import '../css/companyUserCreate.css';
import axios from '../utils/axios';

function UserCreate() {
  const [updateType, setupdateType] = useState('0');
  const [accountName, setaccountName] = useState('');
  const [userdispName, setuserDispName] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplaynamw] = useState('');
  const [controlStationTypeList, setcontrolStationTypeList] = useState([]);
  const [controlStationType, setcontrolStationType] = useState([]);
  const [remoteIDadd, setRemoteIPadd] = useState('');
  const [remotePortadd, setRemotePortadd] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [receivingPortadd, setReceivingPortadd] = useState('');
  const [contactNum, setcontactNum] = useState(0);
  const [department, setDepartment] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [order, setorder] = useState('0');
  const [orderlist, setorderlist] = useState([]);
  const [contactList, setContactlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [TGList, setTGList] = useState([]);
  const [CSList, setCSList] = useState([]);
  const [talkgroup, setTalkgroup] = useState();
  const [controlstation, setControlStation] = useState();
  const [updOrderList, setUpdOrderList] = useState([]);

  const [selectedTG, setSelectedTG] = useState([]);
  const [selectedCS, setSelectedCS] = useState([]);
  const [showacc, setshowacc] = useState(true);
  const [company, setcompany] = useState('0');
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [disableSelect, setDisableSelect] = useState(true);
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

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/company-panel/user-panel');
      console.log(data);
      setorderlist(data.users);
      setDepartmentList(data.departments);
      setLoading(false);
    })();
  }, []);
  // transfers users to new list

  function onTGSelect() {
    const selected = [];
    selectedTGIds.current.forEach((id) => {
      selected.push(TGList.filter((TGid) => TGid.id === id)[0]);
    });
    setSelectedTG(selected);
  }

  function onCSSelect() {
    const selected = [];
    selectedCSIds.current.forEach((id) => {
      selected.push(CSList.filter((usersel) => usersel.id === id)[0]);
    });
    setSelectedCS(selected);
  }

  const SelectTalkGroups = () => (
    <div>
      Select Talkgroups
      <div className="comp">
        <div className="accbox">
          {formData.tgs.map((val) => (
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
              <label htmlFor="selection">{val.tg_name}</label>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onTGSelect()}>
          &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
        </button>
        <div className="accbox">
          {(selectedTG.length &&
            selectedTG.map((val) => <div key={val.id}>{val.tg_name}</div>)) ||
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
          {formData.controlStations.map((val) => (
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
            selectedCS.map((val) => (
              <div key={val.id}>{val.display_name}</div>
            ))) ||
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div>
          <span>
            <label htmlFor="confirm">Account Username : &nbsp;</label>
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
        <br />
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
        <br />
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
        <br />
        <div>
          <span>
            <label htmlFor="confirm">User Display Name : &nbsp;</label>
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
      <br />
      <SelectTalkGroups />
      <div>
        <br />
        <div>
          <span>
            <label htmlFor="lictype">Default Talkgroup: &nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(e) => {
              setTalkgroup(e.target.value);
            }}
            value={talkgroup}
            required
          >
            <option value="0">Select Default Talkgroup</option>
            {formData.tgs.map((val, id) => (
              <option key={val.id} value={val.id}>
                {val.tg_name}
              </option>
            ))}
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
            value={controlstation}
            required
          >
            <option value="0">Select Contact List</option>
            {formData.cls.map((val, id) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <label>Features : </label>&nbsp;
        <br />
        {formData.features.grp_call ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature1"
              onChange={(e) => {
                setFeature(e.target.checked, 'grp_call');
              }}
            />
            <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.priv_call ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature2"
              onChange={(e) => {
                setFeature(e.target.checked, 'priv_call');
              }}
            />
            <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.enc ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'enc');
              }}
            />
            <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.live_gps ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'live_gps');
              }}
            />
            <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.geo_fence ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'geo_fence');
              }}
            />
            <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.chat ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'chat');
              }}
            />
            <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
          </>
        ) : null}
      </div>
      <br />{' '}
    </div>
  );

  const DispatcherForm = () => (
    <div className="box2">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div>
          <span>
            <label htmlFor="confirm">Account Username : &nbsp;</label>
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
        <br />
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
        <br />
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
        <br />
        <div>
          <span>
            <label htmlFor="confirm">User Display Name : &nbsp;</label>
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
      <br />
      <SelectTalkGroups />
      <br />
      <SelectControlStations />
      <br />
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
        {formData.features.grp_call ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature1"
              onChange={(e) => {
                setFeature(e.target.checked, 'grp_call');
              }}
            />
            <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.priv_call ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature2"
              onChange={(e) => {
                setFeature(e.target.checked, 'priv_call');
              }}
            />
            <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.enc ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'enc');
              }}
            />
            <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.live_gps ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'live_gps');
              }}
            />
            <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.geo_fence ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'geo_fence');
              }}
            />
            <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
          </>
        ) : null}
        {formData.features.chat ? (
          <>
            <input
              type="checkbox"
              id="feature"
              name="feature3"
              onChange={(e) => {
                setFeature(e.target.checked, 'chat');
              }}
            />
            <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
          </>
        ) : null}
      </div>
      <br />{' '}
    </div>
  );

  const ControlStationForm = () => (
    <div className="box2">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <br />
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
            <option value="0">Selct Control Station Type</option>
            {formData.csTypes.map((val, id) => (
              <option key={val.id} value={val.id}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="confirm">Remote IP Address : &nbsp;</label>
          </span>
          <input
            type="text"
            id="name"
            onChange={(event) => {
              setRemoteIPadd(event.target.value);
            }}
            value={remoteIDadd}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="confirm">Remote Port Address : &nbsp;</label>
          </span>
          <input
            type="text"
            id="portaddress"
            onChange={(event) => {
              setRemotePortadd(event.target.value);
            }}
            value={remotePortadd}
            required
          />
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="confirm">User Display Name : &nbsp;</label>
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
        <br />
        <div>
          <span>
            <label htmlFor="confirm">Device ID : &nbsp;</label>
          </span>
          <input
            type="text"
            id="name"
            onChange={(event) => {
              setDeviceID(event.target.value);
            }}
            value={deviceID}
            required
          />
        </div>
        <br />
        Receiving Port Address : {formData.receivingPort} (Auto-Generated)
      </div>
      <br />
      <br />{' '}
    </div>
  );

  const selectType = (type) => {
    if (type !== '0') {
      const orderIds = orderlist.filter((data) => data.license_type === type);
      console.log(orderIds);
      setUpdOrderList(orderIds);
    } else setUpdOrderList([]);
    setupdateType(type);
  };

  const getFormData = async (orderId) => {
    if (orderId !== '0') {
      const { data } = await axios.get(`/user/${updateType}/${orderId}`);
      console.log(data);
      setFormData(data);
    }
    setorder(orderId);
  };

  const form = () => (
    <form className="passback">
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        CREATE NEW USER ACCOUNT
      </div>
      <div className="formarea">
        <br />
        <div>
          <span>
            <label htmlFor="lictype">Select User Account Type: &nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(e) => {
              selectType(e.target.value);
            }}
            value={updateType}
            required
          >
            <option value={'0'}>Select Account Type</option>
            <option value={'ptt'}>PTT User Account</option>
            <option value={'dispatcher'}>Dispatcher Account</option>
            <option value={'control'}>Control Station</option>
          </select>
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="company">Select Order :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="order"
            onChange={(e) => {
              getFormData(e.target.value);
            }}
            value={order}
            required
          >
            <option value={'0'}>Select Order Id</option>
            {updOrderList.map((val) => (
              <option key={val.order_id} value={val.order_id}>
                {val.order_id}
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
      {updateType === 'ptt' && order !== '0' && PTTUserForm()}
      {updateType === 'dispatcher' && order !== '0' && DispatcherForm()}
      {updateType === 'control' && order !== '0' && ControlStationForm()}
      <br />
      <div className="formarea">
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
        <br />
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
            <option value="0">Select Department</option>
            {departmentList.map((val, id) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
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
export default UserCreate;
