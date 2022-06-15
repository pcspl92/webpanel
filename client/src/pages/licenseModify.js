import '../css/licenseModify.css';

import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

export default function LicenseModify() {
  const [updateType, setupdateType] = useState('0');
  const [order, setorder] = useState('0');
  const [orderlist, setorderlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showacc, setshowacc] = useState(true);
  const [company, setcompany] = useState('0');
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [number, setNumber] = useState(0);
  const [period, setPeriod] = useState('0');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [disableSelect, setDisableSelect] = useState(false);
  const [disableOrder, setDisableOrder] = useState(true);
  const [featuresGlobal, setFeaturesGlobal] = useState({
    grp_call: false,
    enc: false,
    priv_call: false,
    live_gps: false,
    geo_fence: false,
    chat: false,
  });
  const selectedUserIds = useRef(new Set());
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/');
      setorderlist(data);
      setLoading(false);
    })();
  }, []);

  function onSelect(users) {
    const selected = [];
    selectedUserIds.current.forEach((id) => {
      selected.push(users.filter((usersel) => usersel.id === id)[0]);
    });
    setSelectedUsers(selected);
  }

  const SelectAcc = ({ users }) => (
    <div>
      Select Accounts
      <div className="comp">
        <div className="accbox">
          {users.map((val) => (
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
                style={{ margin: 'none', width: '2vw' }}
                name="selection"
                defaultChecked={selectedUserIds.current.has(val.id)}
                onClick={() => {
                  selectedUserIds.current.has(val.id)
                    ? selectedUserIds.current.delete(val.id)
                    : selectedUserIds.current.add(val.id);
                }}
              />
              <label htmlFor="selection">{val.display_name}</label>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => onSelect(users)}>
          &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
        </button>
        <div className="accbox">
          {(selectedUsers.length &&
            selectedUsers.map((val) => (
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

  /*const resetUpdateForm = () => {
    selectedUserIds.current.clear();
    setSelectedUsers([]);
    setshowacc(true);
  };*/

  const updateSubmit = async () => {
    const users = [];
    selectedUserIds.current.forEach((id) => users.push(id));
    const data = { features: featuresGlobal, user_ids: users, all: !showacc };
    if (data.user_ids.length === 0) {
      alert("Please Select Accounts");
    } else {
      try {
        console.log(data);
        const response = await axios.put(`/order/${order}/features`, data);
        if (response.data.message) {
          alert(response.data.message);
        }
        // resetUpdateForm();
        window.location.reload()
      } catch (err) {
        console.log(err);
      }
    };
  };

  const setFeature = (checked, feature) => {
    setFeaturesGlobal({ ...featuresGlobal, [feature]: checked });
  };

  const updateForm = () => {
    const { users } = formData;
    //const { chat, grpCall, privCall, geoFence, enc, liveGps } = features;
    //console.log(grpCall);
    return (
      <div className="box">
        <div>
          <input
            type="checkbox"
            id="feature"
            name="selection"
            onClick={() => {
              setShow(!showacc, users);
            }}
          />
          <label htmlFor="selection"> All Accounts </label>
        </div>
        {showacc && <SelectAcc users={users} />}
        <div>
          <label>Features : </label>&nbsp;
          <br />
          <input
            type="checkbox"
            id="feature"
            name="feature1"
            //defaultChecked={grpCall}
            onChange={(e) => {
              setFeature(e.target.checked, 'grp_call');
            }}
          />
          <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature2"
            //defaultChecked={privCall}
            onChange={(e) => {
              setFeature(e.target.checked, 'priv_call');
            }}
          />
          <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            // defaultChecked={enc}
            onChange={(e) => {
              setFeature(e.target.checked, 'enc');
            }}
          />
          <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            //defaultChecked={liveGps}
            onChange={(e) => {
              setFeature(e.target.checked, 'live_gps');
            }}
          />
          <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            //defaultChecked={geoFence}
            onChange={(e) => {
              setFeature(e.target.checked, 'geo_fence');
            }}
          />
          <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            //defaultChecked={chat}
            onChange={(e) => {
              setFeature(e.target.checked, 'chat');
            }}
          />
          <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
        </div>
        Add-on Unit Price : 0 &nbsp; &nbsp; Add-on Total Price : 0
        <button type="submit" disabled={disabled}>
          Update License
        </button>{' '}
      </div>
    );
  };

  const resetRenewForm = () => {
    selectedUserIds.current.clear();
    setSelectedUsers([]);
    setshowacc(true);
    setNumber(0);
    setPeriod('0');
  };

  const renewSubmit = async () => {
    const users = [];
    selectedUserIds.current.forEach((id) => users.push(id));
    const data = {
      user_ids: users,
      renewal: period,
      period: number,
      all: !showacc,
    };
    if (users.length === 0) {
      alert("Please select Account");
    } else if (number === 0) {
      alert("Please enter renew license for");
    } else if (period === '0') {
      alert("Please select Period");
    } else {
      try {
        const response = await axios.put(`/order/${order}/renewal`, data);
        if (response.data.message) {
          alert(response.data.message);
        }
        resetRenewForm();
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };

  const calcExpiryDate = (expDate) => {
    let date;
    if (period !== '0') {
      switch (period) {
        case 'monthly':
          date = moment(`${expDate}`)
            .add(number, 'M')
            .format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'quarterly':
          date = moment(`${expDate}`)
            .add(number, 'Q')
            .format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'half_yearly':
          date = moment(`${expDate}`)
            .add(2 * number, 'Q')
            .format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'yearly':
          date = moment(`${expDate}`)
            .add(number, 'y')
            .format('YYYY-MM-DD HH:mm:ss');
          break;
        default:
          return;
      }

      // const newExpDate = moment(date).isAfter('2038-01-19 03:14:07')
      //   ? '2038-01-19 03:14:07'
      //   : date;
      const newExpDate = date;
      // eslint-disable-next-line consistent-return
      return moment(`${newExpDate}`).utc().format('DD-MM-YYYY HH:mm:ss');
    }
  };

  const renewForm = () => {
    const { users, expDate, unitPrices } = formData;

    return (
      <div className="box">
        <div>
          <input
            type="checkbox"
            id="feature"
            name="selection"
            onClick={() => {
              setShow(!showacc, users);
            }}
          />
          <label htmlFor="selection"> All Accounts </label>
        </div>
        {showacc && <SelectAcc users={users} />}
        <br />
        <div className="me-3">
          Renew License For :{' '}
          <input
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />{' '}
          &nbsp;{' '}
          <select
            required
            onChange={(e) => setPeriod(e.target.value)}
            value={period}
          >
            <option value="0">Select Period</option>
            <option value={'monthly'}>Monthly</option>
            <option value={'quarterly'}>Quarterly</option>
            <option value={'half_yearly'}>Half-Yearly</option>
            <option value={'yearly'}>Yearly</option>
          </select>
        </div>
        <br />
        <div>
          Current Expiry Date : {moment(expDate).utc().format('DD-MM-YYYY HH:mm:ss')}{' '}

          &nbsp; &nbsp; After Renewal Expiry Date :{calcExpiryDate(expDate)}
        </div>
        <br />
        <div>
          Renewal Unit Price : {period !== '0' ? unitPrices[period] : ''} &nbsp;
          &nbsp; Renewal Total Price :{' '}
          {period !== '0'
            ? number * selectedUserIds.current.size * unitPrices[period]
            : ''}
        </div>
        <br />
        <button type="submit" disabled={disabled}>
          Renew License
        </button>
      </div>
    );
  };

  const resetTransferForm = () => {
    setcompany('0');
    setTransferQuantity(0);
  };

  const transferSubmit = async () => {
    const data = { qty: transferQuantity, company_id: company };
    if (company === '0') {
      alert("Please Select Company")
    } else if (transferQuantity === 0) {
      alert("Enter Transfer account quantity more then zero")
    } else {
      try {
        const response = await axios.put(`/order/${order}/transfer`, data);
        if (response.data.message) {
          alert(response.data.message);
        }
        resetTransferForm();
      } catch (err) {
        alert(JSON.stringify(err.response.data));
        console.log(err.response.data);
      }
    };
  };

  const transferForm = () => {
    const { available, companies } = formData;

    return (
      <div className="box">
        Accounts Available:{available}
        <br />
        Transfer Quantity :{' '}
        <input
          type="number"
          value={transferQuantity}
          onChange={(e) => setTransferQuantity(e.target.value)}
        />
        <br />
        Transfer To Company :{' '}
        <select
          id="company"
          onChange={(event) => {
            setcompany(event.target.value);
          }}
          value={company}
          required
        >
          <option value="0">Select Company</option>
          {companies.map((val) => (
            <option key={val.id} value={val.id}>
              {val.display_name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" disabled={disabled}>
          Transfer Accounts
        </button>
      </div>
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    switch (updateType) {
      case 'update':
        await updateSubmit();
        break;
      case 'transfer':
        await transferSubmit();
        break;
      case 'renew':
        await renewSubmit();
        break;
      default:
    }

    setDisabled(false);
  };

  const getFormData = async (type) => {
    setFormLoading(true);
    setDisableSelect(true);
    if (order !== 0) {
      setupdateType(type);
      const { data } = await axios.get(`/order/${order}/${type}`);
      console.log(data);
      setFormData(data);
      if (type === 'update') {
        const { features } = data;
        const { chat, grpCall, privCall, geoFence, enc, liveGps } = features;
        setFeaturesGlobal({
          ...featuresGlobal,
          chat: !!chat,
          grp_call: !!grpCall,
          priv_call: !!privCall,
          geo_fence: !!geoFence,
          enc: !!enc,
          live_gps: !!liveGps,
        });
      }
    }
    setDisableSelect(false);
    setFormLoading(false);
  };

  const setOrder = (value) => {
    if (value !== '0') setDisableOrder(false);
    else setDisableOrder(true);
    setorder(value);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        UPDATE LICENSE ORDER
      </div>
      Available Balance : {user.balance}
      <div className="formarea">
        <br />
        <div>
          <span>
            <label htmlFor="company">Select Order :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="order"
            onChange={(event) => {
              setOrder(event.target.value);
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
        <div>
          <span>
            <label htmlFor="lictype">Update Type: &nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(e) => {
              getFormData(e.target.value);
            }}
            disabled={disableSelect || disableOrder}
            value={updateType}
            required
          >
            <option value={'0'}>Select Update Type</option>
            <option value={'update'}>Update Features</option>
            <option value={'renew'}>Renew</option>
            <option value={'transfer'}>Transfer</option>
          </select>
        </div>
      </div>
      <br />
      <br />
      {formLoading && updateType !== '0' ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : null}
      {updateType === 'update' && !formLoading && updateForm()}
      {updateType === 'renew' && !formLoading && renewForm()}
      {updateType === 'transfer' && !formLoading && transferForm()}
      <br />
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
