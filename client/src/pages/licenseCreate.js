import '../css/licenseCreate.css';

import React, { useEffect, useState } from 'react';

import { useAuth } from '../hooks/useAuth';
import axios from '../utils/axios';

export default function LicenseCreate() {
  const [quantity, setquantity] = useState(0);
  const [licenseType, setLicenseType] = useState('');
  const [renewalType, setRenewalType] = useState('');
  const [company, setcompany] = useState(0);
  const [companylist, setcompanylist] = useState([]);
  const [features, setFeatures] = useState({
    grp_call: false,
    enc: false,
    priv_call: false,
    live_gps: false,
    geo_fence: false,
    chat: false,
  });
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [price, setPrice] = useState(0);
  const [disableRenewal, setDisableRenewal] = useState(true);
  const [error, setError] = useState();
  const { user } = useAuth();
  const reset = () => {
    setFeatures({
      grp_call: false,
      enc: false,
      priv_call: false,
      live_gps: false,
      geo_fence: false,
      chat: false,
    });
    setcompany(0);
    setLicenseType('');
    setquantity(0);
    setRenewalType('');
  };
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/company/');
      setcompanylist(data);
      setLoading(false);
    })();
  }, []);

  const setFeature = (checked, feature) => {
    setFeatures({ ...features, [feature]: checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    if(Number(quantity)===0){
      alert("Quantity should be greater than or equal to one")
      setDisabled(false)
    }
    else{
      const data = {
        license_type: licenseType,
        renewal: renewalType,
        qty: Number(quantity),
        company_id: Number(company),
        features,
      };
  
      if (data.company_id) {
        setError('');
        const response = await axios.post('/order/', data);
        if (response.data.message) {
          alert(response.data.message)
          window.location.reload()
        }
        reset();
      } else {
        setError('Select a Company');
      }
  
      setDisabled(false);
    }
  };

  const getAgentUnitPrice = async (renewalTypeValue) => {
    if (renewalTypeValue !== '0' && licenseType !== '0') {
      const { data } = await axios.get(
        `/agent/unit-price/${licenseType}/${renewalTypeValue}`
      );
      setPrice(data);
      setInputDisabled(false);
    }
    setRenewalType(renewalTypeValue);
  };

  const form = () => (
    <form className="passback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        NEW LICENSE ORDER
      </div>
      Available Balance : {user.balance}
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
            {companylist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-danger fw-500">{error}</div>
        <br />
        <div>
          <span>
            <label htmlFor="lictype">License Type: &nbsp;</label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setLicenseType(event.target.value);
              setDisableRenewal(false);
            }}
            value={licenseType}
            required
          >
            <option value={0}>Select License Type</option>
            <option value={'ptt'}>PTT User</option>
            <option value={'dispatcher'}>Dispatcher</option>
            <option value={'control'}>Control Station</option>
          </select>
        </div>
        <br />
        <div>
          <span>
            <label htmlFor="username">License Renewal Type: &nbsp;</label>
          </span>
          <select
            id="id3"
            onChange={(e) => {
              getAgentUnitPrice(e.target.value);
            }}
            value={renewalType}
            disabled={disableRenewal}
            required
          >
            <option value={0}>Select License Renewal Type</option>
            <option value={'monthly'}>Monthly</option>
            <option value={'quarterly'}>Quarterly</option>
            <option value={'half_yearly'}>Half Yearly</option>
            <option value={'yearly'}>Yearly</option>
            <option value={'one_time'}>One-Time</option>
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
            disabled={inputDisabled}
            required
          />
        </div>
        <br />
        Unit Price : {price} &nbsp; &nbsp; Total Price : {quantity * price}
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
          disabled={inputDisabled}
        />
        <label htmlFor="feature1"> Group Call</label>&nbsp;&nbsp;
        <input
          type="checkbox"
          id="feature"
          name="feature2"
          onChange={(e) => {
            setFeature(e.target.checked, 'priv_call');
          }}
          disabled={inputDisabled}
        />
        <label htmlFor="feature2"> Private Call</label>&nbsp;&nbsp;
        <input
          type="checkbox"
          id="feature"
          name="feature3"
          onChange={(e) => {
            setFeature(e.target.checked, 'enc');
          }}
          disabled={inputDisabled}
        />
        <label htmlFor="feature3"> Encryption </label>&nbsp;&nbsp;
        <input
          type="checkbox"
          id="feature"
          name="feature3"
          onChange={(e) => {
            setFeature(e.target.checked, 'live_gps');
          }}
          disabled={inputDisabled}
        />
        <label htmlFor="feature3"> Live GPS </label>&nbsp;&nbsp;
        <input
          type="checkbox"
          id="feature"
          name="feature3"
          onChange={(e) => {
            setFeature(e.target.checked, 'geo_fence');
          }}
          disabled={inputDisabled}
        />
        <label htmlFor="feature3"> Geo-Fence </label>&nbsp;&nbsp;
        <input
          type="checkbox"
          id="feature"
          name="feature3"
          onChange={(e) => {
            setFeature(e.target.checked, 'chat');
          }}
          disabled={inputDisabled}
        />
        <label htmlFor="feature3"> Chat </label>&nbsp;&nbsp;
      </div>
      <br />
      <button type="submit" disabled={disabled}>
        Purchase
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
