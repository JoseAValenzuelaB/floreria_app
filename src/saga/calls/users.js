// src/api/users.js

import axios from 'axios';
import { API_URL } from '../../utils/constants';

// Create a new user
export function createUser(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/users/save`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

// Get all users
export function getUsers() {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/users/`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Get a user by ID
export function getUserByID(userId, session) {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/users/${userId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session,
    },
  });
}

// Update a user by ID
export function updateUser(userId, body) {
  return () => axios({
    method: 'put',
    url: `${API_URL}/api/users/${userId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

// Delete a user by ID
export function deleteUser(userId, session) {
  return () => axios({
    method: 'delete',
    url: `${API_URL}/api/users/${userId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session,
    },
  });
}

export function userLogin(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/auth/login`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
}

export function authorizeUser(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/auth/authorize-action`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
}

export function getUserBySession(session) {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/users/by_session`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    },
  });
}


export function getCashReport(body, session) {

  return () => axios({
    method: 'post',
    url: `${API_URL}/api/orders/get_cash_closing_report/`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    },
    data: body
  });
}
