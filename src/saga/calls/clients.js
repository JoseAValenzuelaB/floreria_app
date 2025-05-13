import axios from 'axios';
import { API_URL } from '../../utils/constants';


export function createClient(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/clients/save/`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function getClients() {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/clients/`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getClientByID(clientId, session) {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/clients/${clientId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    },
  });
}

export function updateClient(clientId, body) {
  return () => axios({
    method: 'put',
    url: `${API_URL}/api/clients/${clientId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function deleteClient(clientId, session) {
  return () => axios({
    method: 'delete',
    url: `${API_URL}/api/clients/delete/${clientId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    }
  });
}