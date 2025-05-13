import axios from 'axios';
import { API_URL } from '../../utils/constants';


export function createProduct(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/products/save`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function getProducts() {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/products`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getProductByID(productId, session) {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/products/${productId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    },
  });
}

export function updateProduct(productId, body) {
  return () => axios({
    method: 'put',
    url: `${API_URL}/api/products/${productId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function deleteProduct(productId, session) {
  return () => axios({
    method: 'delete',
    url: `${API_URL}/api/products/delete/${productId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    }
  });
}