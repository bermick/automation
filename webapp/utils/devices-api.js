import axios from 'axios';
import { getAccessToken } from './auth';

const BASE_URL = 'http://localhost:3333';

export {getPrivateDevices, validateDeviceID};

function getPrivateDevices() {
  const url = `${BASE_URL}/api/lights`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}
function validateDeviceID(deviceToInsert) {
  const url = `${BASE_URL}/api/register/device`;
  return axios.post(url,
  	deviceToInsert,
  	{ headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}
