import React, { useState, useEffect, useRef } from 'react';
import '../css/Recharge.css';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

const RechargeAgent = () => {
  const [agentid, setagentid] = useState('0');
  const [agentlist, setagentlist] = useState([]);
  const [recharge, setrecharge] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  const subBalance = useRef(0);
  const { user, setBalance } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/names');
      setagentlist(data);
    })();
  }, []);

  const reset = () => {
    setagentid('');
    setrecharge('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      amount: Number(recharge),
    };
    if (!error.length) {
      try {
        await axios.put(`/subagent/${agentid}/recharge`, data);
        setBalance(user.balance - recharge);
        reset();
      } catch (err) {
        console.log(err.response.data);
      }

      setDisabled(false);
    }
  };

  if (!agentlist.length) return <div>Loading...</div>;

  return (
    <form className="rechargeback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        RECHARGE SUB-AGENT
      </div>
      <br />
      <br />
      <div>Available Balance :{user.balance}</div>
      <br />
      <div className="d-flex flex-column justify-content-end aligh-items-end">
        <div>
          <span>
            <label htmlFor="id1">Select Sub-Agent : </label>
          </span>
          <select
            id="id1"
            onChange={(event) => {
              setagentid(event.target.value);
              // eslint-disable-next-line no-multi-assign
              subBalance.current = subBalance.current = agentlist.filter(
                (agent) => agent.id === Number(event.target.value)
              )[0]?.balance;
            }}
            required
          >
            <option val="0">Select a Option </option>
            {agentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>Sub Agent Current Balance : {subBalance.current}</div> <br />
        <div>
          <span>
            <label htmlFor="id1">Recharge Amount :</label>
          </span>
          <input
            type="text"
            id="id1"
            onChange={(event) => {
              if (event.target.value > user.balance) {
                setError(
                  'The recharge amount cannot be greater than the available balance'
                );
                setrecharge(event.target.value);
              } else {
                setrecharge(event.target.value);
                setError('');
              }
            }}
            value={recharge}
            required
          />
        </div>
        <br />
        <div>
          Sub Agent Current Balance After Recharge:{' '}
          {subBalance.current + Number(recharge)}
        </div>
      </div>
      <br />
      <button className="p-1" type="submit" disabled={disabled}>
        Recharge
      </button>
      <br />
      <div className="text-danger fw-500">{error}</div>
    </form>
  );
};

export default RechargeAgent;
