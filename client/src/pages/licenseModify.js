import '../css/licenseModify.css';

import React, { useEffect, useState } from 'react';
import moment from 'moment';

import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

export default function LicenseModify() {
  const [updateType, setupdateType] = useState('0');
  const [order, setorder] = useState('0');
  const [orderlist, setorderlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [accountlist, setaccountlist] = useState([]);
  const [selectedlist, setselectedlist] = useState([]);
  const [showacc, setshowacc] = useState(true);
  const [company, setcompany] = useState('0');
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [number, setNumber] = useState(0);
  const [period, setPeriod] = useState('0');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/order/');
      setorderlist(data);
      setLoading(false);
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);

    console.log('submitted');
  };

  function onselect() {
    setselectedlist(
      accountlist.filter((val) => {
        return val.selected === true;
      })
    );
    setaccountlist(
      accountlist.filter((val) => {
        return val.selected === true;
      })
    );
  }

  const SelectAcc = ({ users }) => {
    return (
      <div>
        Select Accounts
        <div className="comp">
          <div className="accbox">
            {users.map((val, index) => {
              return (
                <>
                  <input
                    type="checkbox"
                    id="subitem"
                    name="selection"
                    onClick={() => {
                      val.selected = !val.selected;
                    }}
                  />
                  <label for="selection">{val.display_name}</label>
                </>
              );
            })}
          </div>
          <button onClick={onselect}>
            &nbsp;&nbsp; &gt; &gt; &nbsp;&nbsp;
          </button>
          <div className="accbox">
            {selectedlist.map((val, index) => {
              return (
                <>
                  <div>{val.account_name}</div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const updateForm = () => {
    const { features, users } = formData;
    const { chat, grp_call, priv_call, geo_fence, enc, live_gps } = features;

    return (
      <div className="box">
        <div>
          <input
            type="checkbox"
            id="feature"
            name="selection"
            onClick={() => {
              setshowacc(!showacc);
            }}
          />
          <label for="selection"> All Acocunts </label>
        </div>
        {showacc && <SelectAcc users={users} />}
        <div>
          <label>Features : </label>&nbsp;
          <br />
          <input
            type="checkbox"
            id="feature"
            name="feature1"
            checked={grp_call}
          />
          <label for="feature1"> Group Call</label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature2"
            checked={priv_call}
          />
          <label for="feature2"> Private Call</label>&nbsp;&nbsp;
          <input type="checkbox" id="feature" name="feature3" checked={enc} />
          <label for="feature3"> Encryption </label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            checked={live_gps}
          />
          <label for="feature3"> Live GPS </label>&nbsp;&nbsp;
          <input
            type="checkbox"
            id="feature"
            name="feature3"
            checked={geo_fence}
          />
          <label for="feature3"> Geo-Fence </label>&nbsp;&nbsp;
          <input type="checkbox" id="feature" name="feature3" checked={chat} />
          <label for="feature3"> Chat </label>&nbsp;&nbsp;
        </div>
        Add-on Unit Price : 0 &nbsp; &nbsp; Add-on Total Price : 0
        <button type="submit" disabled={disabled}>
          Update License
        </button>{' '}
      </div>
    );
  };

  const calcExpiryDate = (expDate) => {
    let date;
    if (period !== '0') {
      switch (period) {
        case 'monthly':
          date = moment(expDate).add(number, 'M').format('DD-MM-YYYY HH:mm:ss');
          break;
        case 'quarterly':
          date = moment(expDate).add(number, 'Q').format('DD-MM-YYYY HH:mm:ss');
          break;
        case 'half_yearly':
          date = moment(expDate)
            .add(2 * number, 'Q')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case 'yearly':
          date = moment(expDate).add(number, 'y').format('DD-MM-YYYY HH:mm:ss');
          break;
        default:
      }

      const newExpDate = moment(date).isAfter('19-01-2038 03:14:07')
        ? '19-01-2038 03:14:07'
        : date;

      return newExpDate;
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
              setshowacc(!showacc);
            }}
          />
          <label for="selection"> All Accounts </label>
        </div>
        {showacc && <SelectAcc users={users} />}
        <br />
        <div className="me-3">
          Renew License For :{' '}
          <input type="number" onChange={(e) => setNumber(e.target.value)} />{' '}
          &nbsp;{' '}
          <select required onChange={(e) => setPeriod(e.target.value)}>
            <option value="0">Select Period</option>
            <option value={'monthly'}>Monthly</option>
            <option value={'quarterly'}>Quarterly</option>
            <option value={'half_yearly'}>Half-Yearly</option>
            <option value={'yearly'}>Yearly</option>
          </select>
        </div>
        <br />
        <div>
          Current Expiry Date : {moment(expDate).format('DD-MM-YYYY HH:mm:ss')}{' '}
          &nbsp; &nbsp; After Renewal Expiry Date :{calcExpiryDate(expDate)}
        </div>
        <br />
        <div>
          Renewal Unit Price : {period !== '0' ? unitPrices[period] : ''} &nbsp;
          &nbsp; Renewal Total Price :{' '}
          {period !== '0' ? number * unitPrices[period] : ''}
        </div>
        <br />
        <button type="submit" disabled={disabled}>
          Renew License
        </button>
      </div>
    );
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
          {companies.map((val) => {
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
      </div>
    );
  };

  const getFormData = async (type) => {
    setFormLoading(true);
    if (order !== 0) {
      setupdateType(type);
      const { data } = await axios.get(`/order/${order}/${type}`);
      console.log('fetched', data);
      setFormData(data);
    }
    setFormLoading(false);
  };

  const form = () => {
    return (
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
                setorder(event.target.value);
              }}
              value={order}
              required
            >
              <option value={'0'}>Select Order Id</option>
              {orderlist.map((val) => {
                return (
                  <option key={val.id} value={val.id}>
                    {val.id}
                  </option>
                );
              })}
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
