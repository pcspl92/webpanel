import axios from 'axios';

export default axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_BACK_END_PORT}/api`,
  withCredentials: true,
});
