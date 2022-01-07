import React, { useState } from 'react';
import '../css/AddAgent.css';
import Axios from 'axios';

const AddAgent = () => {
  let parentagentid = 1;
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [subagentname, setsubagentname] = useState('');
  const [contactnum, setcontact] = useState('');
  //Setting PTT User Price
  const [monthlyptt, setmonthlyppt] = useState(0);
  const [quarterlyptt, setquarterlyppt] = useState(0);
  const [halfylyptt, sethalfylyppt] = useState(0);
  const [yearlyptt, setyearlyppt] = useState(0);
  const [onetimeptt, setonetimeppt] = useState(0);
  //Setting Dispatcher Account Price
  const [monthlydap, setmonthlydap] = useState(0);
  const [quarterlydap, setquarterlydap] = useState(0);
  const [halfylydap, sethalfylydap] = useState(0);
  const [yearlydap, setyearlydap] = useState(0);
  const [onetimedap, setonetimedap] = useState(0);
  //Setting Control Station Account Price
  const [monthlycsap, setmonthlycsap] = useState(0);
  const [quarterlycsap, setquarterlycsap] = useState(0);
  const [halfylycsap, sethalfylycsap] = useState(0);
  const [yearlycsap, setyearlycsap] = useState(0);
  const [onetimecsap, setonetimecsap] = useState(0);
  const addagent = () => {
    Axios.post('https://localhost:3002/createagent', {}).then(() => {
      console.log('success');
    });
  };
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',

        height: '90vh',
        width: '79vw',
        
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h3>CREATE NEW SUB AGENT</h3>

      <div
        style={{
          width: '40vw',
          textAlign: 'end',
          alignSelf: 'end',
          marginRight: '35vw',
        }}
      >
        <span>
          <label for="id1">Account Username :</label>
        </span>
        <input
          type="text"
          id="id1"
          onChange={(event) => {
            setusername(event.target.value);
          }}
          required
        />
        <br /> <br />
        <span>
          <label for="id2">Password :</label>
        </span>
        <input type="password" id="id2" />
        <br /> <br />
        <span>
          <label for="id3">Confirm Password :</label>
        </span>
        <input
          type="password"
          id="id3"
          onChange={(event) => {
            setpassword(event.target.value);
          }}
          required
        />
        <br /> <br />
        <span>
          <label for="id4">Sub - Agent Name :</label>
        </span>
        <input
          type="text"
          id="id4"
          onChange={(event) => {
            setsubagentname(event.target.value);
          }}
          required
        />
        <br /> <br />
        <span>
          <label for="id5">Contact Number :</label>
        </span>
        <input
          type="text"
          id="id5"
          onChange={(event) => {
            setcontact(event.target.value);
          }}
        />
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
            marginLeft: '17vw',
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
            <span style={{ fontSize: '2vh' }}>
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
            <span style={{ fontSize: '2vh' }}>
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
      <button style={{ width: '15vw' }} onClick={addagent}>
        Save
      </button>
    </form>
  );
};

export default AddAgent;
