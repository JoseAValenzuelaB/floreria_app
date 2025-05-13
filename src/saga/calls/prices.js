import axios from 'axios';
import { API_URL } from '../../utils/constants';


export function createPrice(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/prices/save`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function getPrices() {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/prices`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getPriceByID(priceId, session) {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/prices/${priceId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    },
  });
}

export function updatePrice(priceId, body) {
  return () => axios({
    method: 'put',
    url: `${API_URL}/api/prices/${priceId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function deletePrice(priceId, session) {
  return () => axios({
    method: 'delete',
    url: `${API_URL}/api/prices/${priceId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    }
  });
}