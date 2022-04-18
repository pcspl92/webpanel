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
      const response = await axios.put(`/subagent/${agentid}/prices`, data);
      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
    } catch (err) {
      console.log(err.response.data);
    }

    setDisabled(false);
  };

  return (
    <form className="passback" onSubmit={onSubmit}>
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
          (Prices have to be greater than or equal to the Base Price of Parent
          Agent)
      </div>
      <br />
      <br />
      <div className="grid-container">
        <div className="subformelements2"></div>

        <div className="">Monthly License</div>
        <div className="">Quarterly License</div>
        <div className="">Half Yearly License</div>
        <div className="">Yearly License</div>
        <div className="">One Time License</div>

        <div style={{ fontSize: '2vh' }}>&nbsp;PTT User Price : &nbsp;</div>
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setmonthlyppt(event.target.value);
          }}
          value={monthlyptt}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />

        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setquarterlyppt(event.target.value);
          }}
          value={quarterlyptt}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            sethalfylyppt(event.target.value);
          }}
          value={halfylyptt}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setyearlyppt(event.target.value);
          }}
          value={yearlyptt}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setonetimeppt(event.target.value);
          }}
          value={onetimeptt}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />

        <div style={{ fontSize: '2vh', marginLeft: '0.3vw' }}>
          Dispatcher Account Price : &nbsp;
        </div>
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setmonthlydap(event.target.value);
          }}
          value={monthlydap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setquarterlydap(event.target.value);
          }}
          value={quarterlydap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            sethalfylydap(event.target.value);
          }}
          value={halfylydap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setyearlydap(event.target.value);
          }}
          value={yearlydap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setonetimedap(event.target.value);
          }}
          value={onetimedap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <div style={{ fontSize: '2vh', marginLeft: '0.3vw' }}>
          Control Station Account Price : &nbsp;
        </div>
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setmonthlycsap(event.target.value);
          }}
          value={monthlycsap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setquarterlycsap(event.target.value);
          }}
          value={quarterlycsap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            sethalfylycsap(event.target.value);
          }}
          value={halfylycsap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setyearlycsap(event.target.value);
          }}
          value={yearlycsap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
        <input
          type="number"
          className="subformelements2"
          onChange={(event) => {
            setonetimecsap(event.target.value);
          }}
          value={onetimecsap}
          pattern="[0-9]+"
          title="Please only enter numberical values"
          required
        />
      </div>
      <br />
      <button style={{ width: '15vw' }} type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );
};
export default SetPrices;
