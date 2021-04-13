import axios from 'axios';
import config from '@/configs';

const instance = axios.create({
  baseURL: config.productive.api,
});

export default instance;
