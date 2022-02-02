import axios from 'axios';

export default axios.create({
  baseURL: `http://${process.env.REACT_APP_AXIOS_HOST}:${process.env.REACT_APP_BACK_END_PORT}/api`,
  withCredentials: true,
});
