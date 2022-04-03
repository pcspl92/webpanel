import React, { useState } from 'react';
import * as yup from 'yup';
import '../css/AddAgent.css';
import axios from '../utils/axios';

const AddAgent = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subagentname, setsubagentname] = useState('');
  const [contactnum, setcontact] = useState('');
  const [errors, setErrors] = useState({});

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

  const reset = () => {
    setusername('');
    setpassword('');
    setConfirmPassword('');
    setsubagentname('');
    setcontact('');
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
      .matches(/.*\S.*/, 'Password cannot contain whitespace')
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
      .matches(/^[a-zA-Z][a-zA-Z ]+$/, 'Invalid Sub-Agent name')

      .min(3, 'Sub-Agent name must be 3-5 characters long')
      .max(5, 'Sub-Agent name must be 3-5 characters long'),
    contact_number: yup
      .string()
      .required('This field is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });

  const validate = async (data) => {
    const formData = { ...data, confirm_password: confirmPassword };
    await schema.validate(formData, { abortEarly: false });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      username,
      password,
      display_name: subagentname,
      contact_number: contactnum,
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
      await validate(data);
      const response = await axios.post('/subagent/', data);
      setErrors({});

      if (response.data.message) {
        alert(response.data.message);
      }
      reset();
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

    setDisabled(false);
  };

  return (
    <form
      onSubmit={onSubmit}
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
          <label htmlFor="id1">Account Username :</label>
        </span>
        <input
          type="text"
          id="id1"
          onChange={(event) => {
            setusername(event.target.value);
          }}
          value={username}
        />
        <div className="text-danger fw-600">{errors?.username}</div>
        <span>
          <label htmlFor="id2">Password :</label>
        </span>
        <input
          type="password"
          id="id2"
          onChange={(e) => setpassword(e.target.value)}
          value={password}
        />
        <div className="text-danger fw-600">{errors?.password}</div>
        <span>
          <label htmlFor="id3">Confirm Password :</label>
        </span>
        <input
          type="password"
          id="id3"
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
          value={confirmPassword}
        />
        <div className="text-danger fw-600">{errors?.confirm_password}</div>
        <span>
          <label htmlFor="id4">Sub - Agent Name :</label>
        </span>
        <input
          type="text"
          id="id4"
          onChange={(event) => {
            setsubagentname(event.target.value);
          }}
          value={subagentname}
        />
        <div className="text-danger fw-600">{errors?.display_name}</div>
        <span>
          <label htmlFor="id5">Contact Number :</label>
        </span>
        <input
          type="number"
          id="id5"
          min="0"
          onChange={(event) => {
            setcontact(event.target.value);
          }}
          value={contactnum}
        />
        <div className="text-danger fw-600">{errors?.contact_number}</div>
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
            <span style={{ fontSize: '2vh' }}>
              &nbsp;PTT User Price : &nbsp;
            </span>
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setmonthlyppt(event.target.value);
              }}
              value={monthlyptt}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlyppt(event.target.value);
              }}
              value={quarterlyptt}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylyppt(event.target.value);
              }}
              value={halfylyptt}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlyppt(event.target.value);
              }}
              value={yearlyptt}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimeppt(event.target.value);
              }}
              value={onetimeptt}
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
              value={monthlydap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlydap(event.target.value);
              }}
              value={quarterlydap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylydap(event.target.value);
              }}
              value={halfylydap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlydap(event.target.value);
              }}
              value={yearlydap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimedap(event.target.value);
              }}
              value={onetimedap}
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
              value={monthlycsap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setquarterlycsap(event.target.value);
              }}
              value={quarterlycsap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                sethalfylycsap(event.target.value);
              }}
              value={halfylycsap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setyearlycsap(event.target.value);
              }}
              value={yearlycsap}
            />
            <input
              type="text"
              className="subformelements"
              onChange={(event) => {
                setonetimecsap(event.target.value);
              }}
              value={onetimecsap}
            />
          </div>
        </div>
      </div>
      <br />
      <button style={{ width: '15vw' }} type="submit" disabled={disabled}>
        Save
      </button>
    </form>
  );
};

export default AddAgent;
