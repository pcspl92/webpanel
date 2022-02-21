import React, { useState, useEffect } from 'react';
import '../css/SetPrices.css';
import axios from '../utils/axios';

const SetPrices = () => {
  const [agentid, setagentid] = useState(0);
  const [agentlist, setagentlist] = useState([]);
  // Setting PTT User Price
  const [monthlyptt, setmonthlyppt] = useState(0);
  const [quarterlyptt, setquarterlyppt] = useState(0);
  const [halfylyptt, sethalfylyppt] = useState(0);
  const [yearlyptt, setyearlyppt] = useState(0);
  const [onetimeptt, setonetimeppt] = useState(0);
  // Setting Dispatcher Account Price
  const [monthlydap, setmonthlydap] = useState(0);
  const [quarterlydap, setquarterlydap] = useState(0);
  const [halfylydap, sethalfylydap] = useState(0);
  const [yearlydap, setyearlydap] = useState(0);
  const [onetimedap, setonetimedap] = useState(0);
  // Setting Control Station Account Price
  const [monthlycsap, setmonthlycsap] = useState(0);
  const [quarterlycsap, setquarterlycsap] = useState(0);
  const [halfylycsap, sethalfylycsap] = useState(0);
  const [yearlycsap, setyearlycsap] = useState(0);
  const [onetimecsap, setonetimecsap] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/names');
      setagentlist(data);
    })();
  }, []);

  const reset = () => {
    setagentid(0);
    setmonthlyppt(0);
    setquarterlyppt(0);
    sethalfylyppt(0);
    setyearlyppt(0);
    setonetimeppt(0);
    setmonthlydap(0);
    setquarterlydap(0);
    sethalfylydap(0);
    setyearlydap(0);
    setonetimedap(0);
    setmonthlycsap(0);
    setquarterlycsap(0);
    sethalfylycsap(0);
    setyearlycsap(0);
    setonetimecsap(0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      ptt: {
        monthly: monthlyptt,
        quarterly: quarterlyptt,
        half_yearly: halfylyptt,
        yearly: yearlyptt,
        one_time: onetimeptt,
      },
      dispatcher: {
        monthly: monthlydap,
        quarterly: quarterlydap,
        half_yearly: halfylydap,
        yearly: yearlydap,
        one_time: onetimedap,
      },
      control: {
        monthly: monthlycsap,
        quarterly: quarterlycsap,
        half_yearly: halfylycsap,
        yearly: yearlycsap,
        one_time: onetimecsap,
      },
    };

    try {
      await axios.put(`/subagent/${agentid}/prices`, data);
      reset();
      setDisabled(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <form className="setpricesback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        SET PRICES FOR SUB-AGENTS
      </div>
      <br />
      <br />
      <div>
        <span>
          <label htmlFor="id1">Select Sub-Agent : </label>
        </span>
        <select
          id="id1"
          onChange={(event) => {
            setagentid(event.target.value);
          }}
          required
        >
          <option>Select a Option</option>

          {agentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
        </select>
      </div>
      <br />
      <div style={{ marginLeft: '40vw' }}>
        <i>
          (Prices have to be greater than or equal to the Base Price of Parent
          Agent)
        </i>
      </div>
      <br />
      <br />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '14vw',
            position: 'absolute',
          }}
        >
          <div className="subformelements">Monthly License</div>
          <div className="subformelements">Quarterly License</div>
          <div className="subformelements">Half Yearly License</div>
          <div className="subformelements">Yearly License</div>
          <div className="subformelements">One Time License</div>
        </div>
        <br />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '6.8vw',
            }}
          >
            <span style={{ fontSize: '2vh' }}>PTT User Price : &nbsp;</span>
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setmonthlyppt(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlyppt(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylyppt(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlyppt(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimeppt(event.target.value);
              }}
            />
          </div>
          <br />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '2.2vw',
            }}
          >
            <span style={{ fontSize: '2vh', marginLeft: '0.3vw' }}>
              Dispatcher Account Price : &nbsp;
            </span>
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setmonthlydap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlydap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylydap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlydap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimedap(event.target.value);
              }}
            />
          </div>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '0.4vw',
            }}
          >
            <span style={{ fontSize: '2vh', marginLeft: '0.3vw' }}>
              Control Station Account Price : &nbsp;
            </span>
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setmonthlycsap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlycsap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylycsap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlycsap(event.target.value);
              }}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimecsap(event.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <br />
      <button style={{ width: '15vw' }} type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};
export default SetPrices;
