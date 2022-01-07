import React, { useState, useEffect, useRef } from 'react';
import '../css/Recharge.css';
import axios from '../utils/axios';
import { useAuth } from '../hooks/useAuth';

const RechargeAgent = () => {
  const [agentid, setagentid] = useState('0');
  const [agentlist, setagentlist] = useState([]);
  const [recharge, setrecharge] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const subBalance = useRef(0);
  const { user } = useAuth();

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
      amount: recharge,
    };

    try {
      await axios.put(`/subagent/${agentid}/recharge`, data);
      reset();
      setDisabled(false);
    } catch (err) {
      console.log(err.response.data);
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
              subBalance.current = subBalance.current = agentlist.filter(
                (agent) => agent.id === Number(event.target.value)
              )[0]?.balance;
            }}
            required
          >
            <option val="0">Select a Option </option>
            {agentlist.map((val) => {
              return (
                <option key={val.id} value={val.id}>
                  {val.display_name}
                </option>
              );
            })}
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
              setrecharge(event.target.value);
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
    </form>
  );
};

export default RechargeAgent;
