import '../css/licenseModify.css';

import React, { useState, useRef, useEffect } from 'react';
import generator from 'generate-password-browser';

import axios from '../utils/axios';

function UserModify() {
  const [updateType, setupdateType] = useState('0');
  const [password, setPassword] = useState('');
  const [controlStationType, setcontrolStationType] = useState('0');
  const [remoteIDadd, setRemoteIPadd] = useState('');
  const [remotePortadd, setRemotePortadd] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const [contactNum, setcontactNum] = useState(0);

  const [user, setUser] = useState('0');
  const [users, setUsers] = useState([]);
  const [contactList, setContactlist] = useState('0');
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [talkgroup, setTalkgroup] = useState();
  const [updUsers, setUpdUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [selectedTG, setSelectedTG] = useState([]);
  const [selectedCS, setSelectedCS] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({});
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

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/user/company-panel/user-modify');
      setUsers(data.users);
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
          {selectedTG?.map((val) => <div key={val.id}>{val.tg_name}</div>) ||
            null}
        </div>
      </div>
    </div>
  );

  const generatePassword = () => {
    const pwd = generator.generate({
      length: 8,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    setPassword(pwd);
  };

  const setFeature = (checked, feature) => {
    setFeaturesGlobal({ ...featuresGlobal, [feature]: checked });
  };

  const resetPttForm = () => {
    setPassword('');
    setcontactNum('');
    setDisplayName('');
    setFeaturesGlobal('');
    setContactlist('');
    setTalkgroup('');
    setSelectedTG([]);
    selectedTGIds.current.clear();
  };

  const pttSubmit = async () => {
    const tgIds = [];
    selectedTGIds.current.forEach((tgId) => tgIds.push(tgId));
    const data = {
      password,
      display_name: displayName,
      features: featuresGlobal,
      contact_number: contactNum,
      contact_list_id: Number(contactList),
      tg_ids: tgIds,
      def_tg: Number(talkgroup),
    };

    try {
      await axios.put(`/user/ptt/${user}`, data);
      resetPttForm();
    } catch (err) {
      console.log(err.response.data);
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
        <br />
        <div>
          <span>
            <label htmlFor="confirm">Password : &nbsp;</label>
          </span>
          <button onClick={generatePassword} type="button">
            {' '}
            RESET{' '}
          </button>
        </div>
        <br />
        {password}
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
            <div key={val.id}>
              <input
                type="checkbox"
                id="subitem"
                name="selection"
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
    setPassword('');
    setcontactNum('');
    setDisplayName('');
    setFeaturesGlobal('');
    setContactlist('');
    setTalkgroup('');
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
      password,
      display_name: displayName,
      features: featuresGlobal,
      contact_number: contactNum,
      contact_list_id: Number(contactList),
      tg_ids: tgIds,
      control_ids: csIds,
    };

    try {
      await axios.put(`/user/dispatcher/${user}`, data);
      resetDispatcherForm();
    } catch (err) {
      console.log(err.response.data);
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
        <br />
        <div>
          <span>
            <label htmlFor="confirm">Password : &nbsp;</label>
          </span>
          <button onClick={generatePassword} type="button">
            {' '}
            RESET{' '}
          </button>
        </div>
        <br />
        {password}
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
      contact_no: contactNum,
      cs_type_id: Number(controlStationType),
    };

    try {
      await axios.put(`/user/control/${user}`, data);
      resetControlForm();
    } catch (err) {
      console.log(err.response.data);
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
        Receiving Port Address : {formData.receivingPort} (Cannot be changed)
      </div>
      <br />
      <br />{' '}
    </div>
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

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
      default:
    }
    setDisabled(false);
  };

  const onSelectType = (type) => {
    setUpdUsers([]);
    if (type !== '0') {
      const updatedUserList = users.filter((val) => val.user_type === type);
      setUpdUsers(updatedUserList);
    }
    setupdateType(type);
  };

  const getFormData = async (userId) => {
    setFormLoading(true);
    if (userId !== '0') {
      const { order_id: orderId } = updUsers.filter(
        (updUser) =>
          updUser.id === Number(userId) && updUser.user_type === updateType
      )[0];
      const { data } = await axios.get(`/user/modify/${updateType}/${orderId}`);
      setFormData(data);
    }
    setUser(userId);
    setFormLoading(false);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY USER ACCOUNT
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
        </div>
        <div>
          <span>
            <label htmlFor="lictype">Select User: </label>
          </span>
          <select
            id="id1"
            onChange={(e) => {
              getFormData(e.target.value);
            }}
            value={user}
            required
          >
            <option value={'0'}>Select User</option>
            {updUsers?.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
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
      {updateType === 'ptt' && user !== '0' && PTTUserForm()}
      {updateType === 'dispatcher' && user !== '0' && DispatcherForm()}
      {updateType === 'control' && user !== '0' && ControlStationForm()}
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

        <br />
      </div>
      <button type="submit" disabled={disabled}>
        {' '}
        UPDATE{' '}
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
export default UserModify;
