import * as actionsTypes from './types';
import { produce } from 'immer';

import _ from 'lodash';
import { openingCash } from './actions';

const INITIAL_STATE = {
  products: [],
  users: [],
  productDetail: null,
  orders: [],
  clients: [],
  prices: [],
  events: [],
  upcomingDeliveries: [],
  userData: null,
  orderDetail: {},
  cashReport: {},
  loadings: {
    products: false,
    productDetail: false,
    orders: false,
    orderDetail: false,
    users: false,
    userData: false,
    cashReport: false,
    authorize: false,
    withdrawal: false,
    clients: false,
    prices: false,
    opening_cash: false,
    events: false,
    upcomingDeliveries: false,
  }
};


const setLoading = (draft, action) => {
  const { prop, value } = action.payload;
  const loadings = { ...draft.loadings };
  loadings[prop] = value;
  draft.loadings = loadings;
};

const resetData = (draft) => {
  Object.keys(INITIAL_STATE).forEach(key => {
    draft[key] = INITIAL_STATE[key];
  });
};

export default produce((draft, action) => {
  switch (action.type) {
  case actionsTypes.RESET_DATA:
    resetData(draft);
    break;
  case actionsTypes.SET_LOADING:
    setLoading(draft, action);
    break;
  case actionsTypes.SET_PRODUCTS:
    draft.products = action.payload;
    break;
  case actionsTypes.SET_PRODUCT:
    draft.productDetail = action.payload;
    break;
  case actionsTypes.SET_USERS:
    draft.users = action.payload;
    break;
  case actionsTypes.SET_ORDERS:
    draft.orders = action.payload;
    break;
  case actionsTypes.SET_ORDER_DETAIL:
    draft.orderDetail = action.payload;
    break;
  case actionsTypes.SET_USER_DATA:
    draft.userData = action.payload;
    break;
  case actionsTypes.SET_CASH_REPORT:
    draft.cashReport = action.payload;
    break;
  case actionsTypes.SET_CLIENTS:
    draft.clients = action.payload;
    break;
  case actionsTypes.SET_PRICES:
    draft.prices = action.payload;
    break;
  case actionsTypes.SET_EVENTS:
    draft.events = action.payload;
    break;
  case actionsTypes.SET_DELIVERIES:
    draft.upcomingDeliveries = action.payload;
    break;
  default:
    break;
  }
}, INITIAL_STATE);
