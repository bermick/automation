import axios from 'axios';
import { getAccessToken } from './auth';

const BASE_URL = 'http://localhost:3333';

export {getPrivateDevices, validateDeviceID, validateExistingUser};

function getPrivateDevices(userData) {
  const url = `${BASE_URL}/api/lights`;
  return axios.get(url,
  		{
	      params: {user: userData.email},
  		  headers: { Authorization: `Bearer ${getAccessToken()}` }
  		})
  		.then(response => response.data);
}

function validateDeviceID(deviceToInsert) {
  const url = `${BASE_URL}/api/register/device`;
  return axios.post(url,
  	deviceToInsert,
  	{ headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}

function validateExistingUser(userData) {
  const url = `${BASE_URL}/api/register/user`;
  return axios.post(url,
  	userData,
  	{ headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}