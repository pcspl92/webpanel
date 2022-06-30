import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from '../utils/axios';
import '../css/companyCreate.css';

const CompanyCreate = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [compname, setcompname] = useState('');
  const [contnum, setcontnum] = useState('');
  const [subagent, setSubagent] = useState('0');
  const [sagentlist, setsagentlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const schema = yup.object().shape({
    username: yup
      .string()
      .typeError('Username must be string')
      .matches(/[^\s*].*[^\s*]/g, '* This field cannot contain only blankspaces')
      .required('This field is required')
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
      .typeError('Company name must be string')
      .matches(/[^\s*].*[^\s*]/g, '* This field cannot contain only blankspaces')
      .required('This field is required')
      .min(10, 'Company name must be 10-90 characters long')
      .max(90, 'Company name must be 10-90 characters long'),
      contact_number: yup
      .string()
      .required()
      .matches(
        /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
        "Contact number is not valid"
      ),
      // agent:yup.number().required("Agent name is required")
      subagent_id:yup.number().moreThan(0,"Sub Agent name is required")
  });

  const validate = async (data) => {
    const formData = { ...data, confirm_password: confirmPassword };
    await schema.validate(formData, { abortEarly: false });
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/subagent/names');
      setsagentlist(
        data.filter(
          (val) =>
            (val.status==="active"))
      );
      //setsagentlist(data);
      setLoading(false);
    })();
  }, []);

  const reset = () => {
    setusername('');
    setPassword('');
    setcompname('');
    setcontnum('');
    setconfirmPassword('');
    setSubagent(0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const data = {
      username,
      password,
      display_name: compname,
      contact_number: contnum,
      subagent_id: subagent,
    };
    
    try {
      setErrors({});
      await validate(data);
      console.log(username.length);
      const response = await axios.post('/company/', data); 
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

  const form = () => (
    <form className="CCpassback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        CREATE NEW COMPANY
      </div>
      <div className="CCformarea">
        <div>
          <span>
            <label htmlFor="username">Account Username : &nbsp;</label>
          </span>
          <input
            type="text"
            id="username"
            onChange={(event) => {
              setusername(event.target.value);
            }}
            value={username}
            required
          />
        </div>
        <br />

        <div className="text-danger fw-600">{errors?.username}</div>

        <br />
        <div>
          <span>
            <label htmlFor="password"> Password : &nbsp;</label>
          </span>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
        </div>
        <br />

        <div className="text-danger fw-600">{errors?.password}</div>

        <br />
        <div>
          <span>
            <label htmlFor="confirm">Confirm Password : &nbsp;</label>
          </span>
          <input
            type="password"
            id="confirm"
            onChange={(event) => {
              setconfirmPassword(event.target.value);
            }}
            value={confirmPassword}
            required
          />
        </div>
        <br />

        <div className="text-danger fw-600">{errors?.confirm_password}</div>

        <br />
        <div>
          <span>
            <label htmlFor="display_name">Company Name : &nbsp;</label>
          </span>
          <input
            type="text"
            id="display_name"
            onChange={(event) => {
              setcompname(event.target.value);
            }}
            value={compname}
            required
          />
        </div>
        <br />

        <div className="text-danger fw-600">{errors?.display_name}</div>

        <br />
        <div>
          <span>
            <label htmlFor="contact">Contact Number : &nbsp;</label>
          </span>
          <input
            type="tel"
            id="contact"
            onChange={(event) => {
              setcontnum(event.target.value);
            }}
            value={contnum}
            required
          />
        </div>
        <br />
        <div className="text-danger fw-600">{errors?.contact_number}</div>

        <br />
        <div>
          <span>
            <label htmlFor="subagent">Sub-Agent :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="subagent"
            onChange={(event) => {
              setSubagent(event.target.value);
            }}
            value={subagent}
            required
          >
            <option value="0">Select a Sub Agent</option>

            {sagentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
          <div className="text-danger fw-600">{errors?.subagent_id}</div>
        </div>
      </div>
      <br />
      <button type="submit" disabled={disabled}>
        Save
      </button>
    </form>
  );
  if (loading) {
    return (
      <div className="CCpassback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && form()}</div>;
};
export default CompanyCreate;
