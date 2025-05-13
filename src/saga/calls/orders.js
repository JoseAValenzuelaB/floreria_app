import axios from 'axios';
import { API_URL } from '../../utils/constants';


export function createOrder(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/orders/save/`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function getOrders() {
  return () => axios({
    method: 'get',
    url: `${API_URL}/api/orders/`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getOrderByID(orderId) {

  return () => axios({
    method: 'get',
    url: `${API_URL}/api/orders/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function updateOrder(orderId, body, session) {
  return () => axios({
    method: 'put',
    url: `${API_URL}/api/orders/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': session
    },
    data: body
  });
}

export function paySubmittedOrder(orderId, body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/orders/pay-order/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: { cashier: body.cashier, bank_account: body.bankAccount, is_credit: body.isCredit, total: body.total, payment_amount: body.paymentAmount, payment_type: body.paymentType, client: body.client }
  });
}

export function sendCreditPayment(orderId, body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/orders/pay-credit/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function makeWithdrawal(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/orders/withdrawal/`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function openingCash(body) {
  return () => axios({
    method: 'post',
    url: `${API_URL}/api/sale_notes/create/`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

export function deleteOrder(orderId, session) {
  return () => axios({
    method: 'delete',
    url: `${API_URL}/api/orders/delete/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session
    }
  });
}