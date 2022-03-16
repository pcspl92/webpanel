import React, { useState, useEffect } from 'react';
import generator from 'generate-password-browser';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import '../css/companyModify.css';
import axios from '../utils/axios';

const CompanyModify = () => {
  const [sagentlist, setsagentlist] = useState([]);
  const [companylist, setcompanylist] = useState([]);
  const [active, setactive] = useState(true);
  const [type, setType] = useState('modify');
  const [contactNumber, setcontact] = useState('');
  const [compnewname, setcompnewname] = useState('');
  const [password, setPassword] = useState('');
  const [generated, setGenerated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subagent, setSubagent] = useState(0);
  const [company, setCompany] = useState(0);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (user.type === 'agent') {
        const subagents = await axios.get('/subagent/names');
        setsagentlist(subagents.data);
      }
      const companies = await axios.get('/company/');
      setcompanylist(companies.data);
      setLoading(false);
    })();
  }, []);

  const validateForm = async (data) => {
    const schema = yup.object().shape({
      password: yup.string().required('Password is required'),
      display_name: yup.string().required('Company name is requried'),
      contact_number: yup
        .string()
        .required()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
      agent_id: yup.number().min(1, 'Select a sub-agent'),
      company_id: yup.number().min(1, 'Select a company'),
    });
    await schema.validate(data, { abortEarly: false });
  };

  const reset = () => {
    setPassword('');
    setcompnewname('');
    setcontact('');
    setactive(true);
    setGenerated(false);
    setSubagent(0);
    setCompany(0);
    setType('modify');
  };

  const modifyCompany = async () => {
    const data = {
      password,
      display_name: compnewname,
      contact_number: contactNumber,
      agent_id: Number(subagent),
      status: active ? 'active' : 'paused',
    };

    try {
      await validateForm({ ...data, company_id: Number(company) });
      const response = await axios.put(`/company/${company}`, data);
      if (response.data.message) {
        alert(response.data.message);
      }
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

  const relieveCompany = async () => {
    if (!+company) setErrors({ company_id: 'Select a company' });
    else await axios.put(`/company/${company}/relieve`);
  };

  const deleteCompany = async () => {
    if (!+company) setErrors({ company_id: 'Select a company' });
    else {
      await axios.delete(`/company/${company}`);
      setcompanylist(companylist.filter((com) => com.id !== +company));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    switch (type) {
      case 'modify':
        await modifyCompany();
        break;
      case 'relieve':
        await relieveCompany();
        break;
      case 'delete':
        await deleteCompany();
        break;
      default:
        break;
    }

    reset();
  };

  const generatePassword = () => {
    const pwd = generator.generate({
      length: 8,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    setPassword(pwd);
  };

  const form = () => (
    <form className="CMmodifyback" onSubmit={onSubmit}>
      <div style={{ fontWeight: 'bolder', fontSize: '4vh' }}>
        MODIFY COMPANY
      </div>
      <br />
      <br />
      <div className="CMmodifyform">
        <div>
          <span>
            <label htmlFor="company">Select Company :&nbsp;&nbsp;&nbsp; </label>
          </span>
          <select
            id="company"
            onChange={(event) => {
              setCompany(event.target.value);
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
        <div className="text-danger fw-500">{errors?.company_id}</div>

        <div className="mt-3 me-2">
          <button type="submit" onClick={() => setType('delete')}>
            Delete
          </button>
          &nbsp; &nbsp; &nbsp;
          {user.type === 'subagent' ? (
            <button type="submit" onClick={() => setType('relieve')}>
              Relieve
            </button>
          ) : null}
        </div>
        <div className="mt-3 me-5">
          <span>
            <label htmlFor="status">Status :&nbsp;&nbsp;&nbsp;</label>
          </span>
          <span>
            <span
              className={active ? 'CMactiveclass' : 'CMinactiveclass'}
              style={{
                borderTopLeftRadius: '10%',
                borderBottomLeftRadius: '10%',
              }}
              onClick={() => {
                setactive(!active);
              }}
            >
              Active
            </span>
            <span
              className={!active ? 'CMactiveclass' : 'CMinactiveclass'}
              style={{
                borderTopRightRadius: '10%',
                borderBottomRightRadius: '10%',
              }}
              onClick={() => {
                setactive(!active);
              }}
            >
              Paused
            </span>
          </span>
        </div>
        <div className="mt-3">
          <span>Password : &nbsp; </span>
          <button
            type="button"
            style={{ width: '13vw' }}
            onClick={() => {
              setGenerated(true);
              generatePassword();
            }}
          >
            RESET
          </button>
        </div>
        <div className="text-danger fw-500">{errors?.password}</div>
        {generated && (
          <div className="mt-3 me-5">New Generated Password : {password}</div>
        )}
        <div className="mt-3">
          <span>
            <label htmlFor="display_name">
              Company Name :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="display_name"
            onChange={(event) => {
              setcompnewname(event.target.value);
            }}
            value={compnewname}
          />
        </div>
        <div className="text-danger fw-500">{errors?.display_name}</div>
        <div className="mt-3 ">
          <span>
            <label htmlFor="contact_number">
              Contact Number :&nbsp;&nbsp;&nbsp;
            </label>
          </span>
          <input
            type="text"
            id="contact_number"
            onChange={(event) => {
              setcontact(event.target.value);
            }}
            value={contactNumber}
          />
        </div>
        <div className="text-danger fw-500">{errors?.contact_number}</div>
        <div className="mt-3">
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
            <option value={0}>Select Sub Agent</option>
            {sagentlist.map((val) => (
              <option key={val.id} value={val.id}>
                {val.display_name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-danger fw-500">{errors?.agent_id}</div>
      </div>
      <button className="mt-3" type="submit" disabled={disabled}>
        UPDATE
      </button>
    </form>
  );

  if (loading) {
    return (
      <div className="CMmodifyback">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return <div>{!loading && form()}</div>;
};
export default CompanyModify;
