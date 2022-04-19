import React, { useEffect, useState, useRef } from 'react';
import '../css/licenseModify.css';
import * as yup from 'yup';
import '../css/companyUserCreate.css';
import axios from '../utils/axios';

function UserCreate() {
  const [updateType, setupdateType] = useState('0');
  const [accountName, setaccountName] = useState('');
  const [password, setPassword] = useState('');
  const [controlStationType, setcontrolStationType] = useState('0');
  const [remoteIDadd, setRemoteIPadd] = useState('');
  const [remotePortadd, setRemotePortadd] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [contactNum, setcontactNum] = useState(0);
  const [order, setorder] = useState('0');
  const [orderlist, setorderlist] = useState([]);
  const [contactList, setContactlist] = useState('0');
  const [loading, setLoading] = useState(true);
  // const [disabled, setDisabled] = useState(false);
  const [talkgroup, setTalkgroup] = useState();
  const [updOrderList, setUpdOrderList] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTG, setSelectedTG] = useState([]);
  const [selectedCS, setSelectedCS] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [featuresGlobal, setFeaturesGlobal] = useState({
    grp_call: false,
    enc: false,
    priv_call: false,
    live_gps: false,
    geo_fence: false,
    chat: false,
  });
  const selectedTGIds = useRef(new Set());
  const selectedCSIds = useRef(new Set());
  const schema = yup.object().shape({
    username: yup
      .string()
      .typeError('Username must be string')
      .required('This field is required')
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, 'Invalid username')
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
      .min(10, 'Display name must be 10-90 characters long')
      .max(90, 'Display name must be 10-90 characters long'),
    contact_number: yup
      .string()
      .required('This field is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });
  const validate = async (data) => {
    const formData2 = { ...data, confirm_password: confirmPassword };
    await schema.validate(formData2, { abortEarly: false });
  };
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/company-panel/user-create');
      setorderlist(data.users);
      setLoading(false);
    })();
  }, []);

  function onTGSelect() {
    const selected = [];
    selectedTGIds.current.forEach((id) => {
      selected.push(formData.tgs.filter((TGid) => TGid.id === id)[0]);
    });
    setSelectedTG(selected);
  }

  const SelectTalkGroups = () => (
    <div>
      Select Talkgroups
      <div className="comp">
        <div className="accbox">
          {formData.tgs?.map((val) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              key={val.id}
            >
              <input
                type="checkbox"
                id="subitem"
                name="selection"
                style={{ margin: 'none', width: '2vw' }}
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
          {selectedTG?.map((val) => <div key={val.id}>{val.tg_name}</div>) ||
            null}
        </div>
      </div>
    </div>
  );

  const setFeature = (checked, feature) => {
    setFeaturesGlobal({ ...featuresGlobal, [feature]: checked });
  };

  const resetPttForm = () => {
    setaccountName('');
    setPassword('');
    setcontactNum('');
    setDisplayName('');
    setFeaturesGlobal('');
    setContactlist('');
    setTalkgroup('');
    setConfirmPassword('');
    setSelectedTG([]);
    selectedTGIds.current.clear();
  };

  const pttSubmit = async () => {
    const tgIds = [];

    selectedTGIds.current.forEach((tgId) => tgIds.push(tgId));
    const data = {
      username: accountName,
      password,
      display_name: displayName,
      order_id: Number(order),
      features: featuresGlobal,
      contact_number: contactNum,
      contact_list_id: Number(contactList),
      tg_ids: tgIds,
      def_tg: Number(talkgroup),
    };

    try {
      await validate(data);
      const response = await axios.post('/user/ptt', data);
      if (response.data.message) {
        alert(response.data.message);
      }
      resetPttForm();
      setErrors({});
    } catch (error) {
      if (error.inner.length) {
        const validateErrors = error.inner.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
          {}
        );
        setErrors(validateErrors);
      } else {
        console.log(error.response.data);
      }
    }
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
          <div className="text-danger fw-600">{errors?.username}</div>
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
            value={password}
            required
          />
          <div className="text-danger fw-600">{errors?.password}</div>
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
              setConfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />
          <div className="text-danger fw-600">{errors?.confirm_password}</div>
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
              setDisplayName(event.target.value);
            }}
            value={displayName}
            required
          />
          <div className="text-danger fw-600">{errors?.display_name}</div>
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
            {selectedTG?.map((val) => (
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
              setContactlist(e.target.value);
            }}
            value={contactList}
            required
          >
            <option value="0">Select Contact List</option>
            {formData.cls?.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <label>Features : </label>&nbsp;
        <br />
        {formData.features?.grp_call ? (
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
        {formData.features?.priv_call ? (
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
        {formData.features?.enc ? (
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
        {formData.features?.live_gps ? (
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
        {formData.features?.geo_fence ? (
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
        {formData.features?.chat ? (
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

  function onCSSelect() {
    const selected = [];
    selectedCSIds.current.forEach((id) => {
      selected.push(
        formData.controlStations.filter((usersel) => usersel.id === id)[0]
      );
    });
    setSelectedCS(selected);
  }

  const SelectControlStations = () => (
    <div>
      Select Control Stations
      <div className="comp">
        <div className="accbox">
          {formData.controlStations?.map((val) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              key={val.id}
            >
              <input
                type="checkbox"
                id="subitem"
                name="selection"
                style={{ margin: 'none', width: '2vw' }}
                defaultChecked={selectedCSIds.current.has(val.id)}
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
          {selectedCS?.map((val) => (
            <div key={val.id}>{val.display_name}</div>
          )) || null}
        </div>
      </div>
    </div>
  );

  const resetDispatcherForm = () => {
    setaccountName('');
    setPassword('');
    setcontactNum('');
    setDisplayName('');
    setFeaturesGlobal('');
    setContactlist('');
    setTalkgroup('');
    setConfirmPassword('');
    setSelectedTG([]);
    setSelectedCS([]);
    selectedTGIds.current.clear();
    selectedCSIds.current.clear();
  };

  const dispatcherSubmit = async () => {
    const tgIds = [];
    const csIds = [];
    selectedTGIds.current.forEach((tgId) => tgIds.push(tgId));
    selectedCSIds.current.forEach((csId) => csIds.push(csId));
    const data = {
      username: accountName,
      password,
      display_name: displayName,
      order_id: Number(order),
      features: featuresGlobal,
      contact_number: contactNum,
      contact_list_id: Number(contactList),
      tg_ids: tgIds,
      control_ids: csIds,
    };

    try {
      await validate(data);
      const response = await axios.post('/user/dispatcher', data);

      if (response.data.message) {
        alert(response.data.message);
      }
      resetDispatcherForm();
      setErrors({});
    } catch (error) {
      if (error.inner.length) {
        const validateErrors = error.inner.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
          {}
        );
        setErrors(validateErrors);
      } else {
        console.log(error.response.data);
      }
    }
  };

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
            value={password}
            required
          />
          <div className="text-danger fw-600">{errors?.password}</div>
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
              setConfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />
          <div className="text-danger fw-600">{errors?.confirm_password}</div>
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
              setDisplayName(event.target.value);
            }}
            value={displayName}
            required
          />
          <div className="text-danger fw-600">{errors?.display_name}</div>
        </div>
      </div>
      <br />
      <SelectTalkGroups />
      <br />
      <SelectControlStations />
      <br />
      <div>
        <span>
          <label htmlFor="lictype">Assign Contact List: &nbsp;</label>
        </span>
        <select
          id="id1"
          onChange={(e) => {
            setContactlist(e.target.value);
          }}
          value={contactList}
          required
        >
          <option value="0">Select Contact List</option>
          {formData.cls?.map((val) => (
            <option key={val.id} value={val.id}>
              {val.display_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Features : </label>&nbsp;
        <br />
        {formData.features?.grp_call ? (
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
        {formData.features?.priv_call ? (
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
        {formData.features?.enc ? (
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
        {formData.features?.live_gps ? (
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
        {formData.features?.geo_fence ? (
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
        {formData.features?.chat ? (
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

  const resetControlForm = () => {
    setcontrolStationType('0');
    setRemoteIPadd('');
    setRemotePortadd('');
    setDisplayName('');
    setDeviceID('');
    setcontactNum('');
  };

  const controlSubmit = async () => {
    const data = {
      ip_address: remoteIDadd,
      port: Number(remotePortadd),
      display_name: displayName,
      device_id: deviceID,
      rec_port: formData.receivingPort,
      contact_no: contactNum,
      cs_type_id: Number(controlStationType),
      order_id: Number(order),
    };
    try {
      await validate(data);
      const response = await axios.post('/user/control', data);

      if (response.data.message) {
        alert(response.data.message);
      }
      resetControlForm();
      setErrors({});
    } catch (error) {
      if (error.inner.length) {
        const validateErrors = error.inner.reduce(
          (acc, err) => ({ ...acc, [err.path]: err.errors[0] }),
          {}
        );
        setErrors(validateErrors);
      } else {
        console.log(error.response.data);
      }
    }
  };

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
            {formData.csTypes?.map((val) => (
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
              setDisplayName(event.target.value);
            }}
            value={displayName}
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

  const onSubmit = async (e) => {
    e.preventDefault();
    // setDisabled(true);
    if(order==="0"){
      alert("Please select the order ID")
    }
    switch (updateType) {
      case 'ptt':
        await pttSubmit();
        break;
      case 'dispatcher':
        await dispatcherSubmit();
        break;
      case 'control':
        await controlSubmit();
        break;
      case "0":
        alert("Please select the user account type")
        break
      default:
    }
    // setDisabled(false);
  };

  const onSelectType = (type) => {
    setUpdOrderList([]);
    if (type !== '0') {
      const orderIds = orderlist.filter((data) => data.license_type === type);
      setUpdOrderList(orderIds);
    }
    setupdateType(type);
  };

  const getFormData = async (orderId) => {
    setFormLoading(true);
    if (orderId !== '0') {
      const { data } = await axios.get(`/user/create/${updateType}/${orderId}`);
      setFormData(data);
    }
    setorder(orderId);
    setFormLoading(false);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
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
              onSelectType(e.target.value);
            }}
            value={updateType}
            required
          >
            <option value={'0'}>Select Account Type</option>
            <option value={'ptt'}>PTT User Account</option>
            <option value={'dispatcher'}>Dispatcher Account</option>
            <option value={'control'}>Control Station</option>
          </select>
          <div className="text-danger fw-600">{errors?.actType}</div>
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
          <div className="text-danger fw-600">{errors?.contact_number}</div>
        </div>
        <br />
      </div>
      <button  type="submit">
        {' '}
        SAVE{' '}
      </button>
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
