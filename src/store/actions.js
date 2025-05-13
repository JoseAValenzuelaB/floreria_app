import * as actionsTypes from './types';


export const getProducts = (params) => ({
  type: actionsTypes.GET_PRODUCTS,
  payload: params,
});

export const saveProduct = (params) => ({
  type: actionsTypes.SAVE_PRODUCT,
  payload: params,
});

export const getProductByID = (params) => ({
  type: actionsTypes.GET_PRODUCT,
  payload: params,
});

export const updateProductByID = (params) => ({
  type: actionsTypes.UPDATE_PRODUCT,
  payload: params,
});

export const saveOrder = (params) => ({
  type: actionsTypes.SAVE_ORDER,
  payload: params,
});

export const getOrders = (params) => ({
  type: actionsTypes.GET_ORDERS,
  payload: params,
});

export const getOrderDetail = (params) => ({
  type: actionsTypes.GET_ORDER_DETAIL,
  payload: params,
});

export const updateOrderDetail = (params) => ({
  type: actionsTypes.UPDATE_ORDER_DETAIL,
  payload: params,
});

export const sendCreditPayment = (params) => ({
  type: actionsTypes.SEND_PAYMENT,
  payload: params,
});

export const paySubmittedOrder = (params) => ({
  type: actionsTypes.PAY_SUBMITTED_ORDER,
  payload: params,
});

export const makeWithdrawal = (params) => ({
  type: actionsTypes.MAKE_WITHDRAWAL,
  payload: params,
});

export const openingCash = (params) => ({
  type: actionsTypes.OPENING_CASH,
  payload: params,
});

// USERS

export const getUsers = (params) => ({
  type: actionsTypes.GET_USERS,
  payload: params
});

export const saveUser = (params) => ({
  type: actionsTypes.SAVE_USER,
  payload: params
});

export const updateUserByID = (params) => ({
  type: actionsTypes.UPDATE_USER,
  payload: params
});

export const deleteUser = (params) => ({
  type: actionsTypes.DELETE_USER,
  payload: params
});

export const loginUser = (params) => ({
  type: actionsTypes.LOGIN_USER,
  payload: params
});

export const authorizeUser = (params) => ({
  type: actionsTypes.AUTHORIZE_USER,
  payload: params
});

export const getUserBySession = (params) => ({
  type: actionsTypes.GET_USER_BY_SESSION,
  payload: params
});

export const getCashReport = (params) => ({
  type: actionsTypes.GET_CASH_REPORT,
  payload: params
});

export const getClients = (params) => ({
  type: actionsTypes.GET_CLIENTS,
  payload: params
});

export const saveClient = (params) => ({
  type: actionsTypes.CREATE_CLIENTS,
  payload: params
});

export const editClient = (params) => ({
  type: actionsTypes.EDIT_CLIENTS,
  payload: params
});

export const deleteClient = (params) => ({
  type: actionsTypes.DELETE_CLIENTS,
  payload: params
});

export const getPrices = (params) => ({
  type: actionsTypes.GET_PRICES,
  payload: params
});

export const savePrice = (params) => ({
  type: actionsTypes.SAVE_PRICE,
  payload: params
});

export const updatePriceByID = (params) => ({
  type: actionsTypes.UPDATE_PRICE,
  payload: params
});

export const deletePriceByID = (params) => ({
  type: actionsTypes.DELETE_PRICE,
  payload: params
});

export const addNewEvent = (params) => ({
  type: actionsTypes.NEW_EVENT,
  payload: params
});

export const getEvents = (params) => ({
  type: actionsTypes.GET_EVENTS,
  payload: params
});

export const editEvent = (params) => ({
  type: actionsTypes.EDIT_EVENT,
  payload: params
});

export const removeEvent = (params) => ({
  type: actionsTypes.REMOVE_EVENT,
  payload: params
});

export const getUpcomingDeliveries = (params) => ({
  type: actionsTypes.GET_DELIVERIES,
  payload: params
});