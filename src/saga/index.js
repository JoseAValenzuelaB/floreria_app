import { takeLatest, all } from 'redux-saga/effects';
import * as actionsTypes from '../store/types';
import * as workers from './workers';


export default function* watcherSaga() {
  yield all([
    takeLatest(actionsTypes.GET_PRODUCTS, workers.getProducts),
    takeLatest(actionsTypes.GET_PRODUCT, workers.getProductDetail),
    takeLatest(actionsTypes.SAVE_PRODUCT, workers.saveProduct),
    takeLatest(actionsTypes.UPDATE_PRODUCT, workers.updateProduct),
    takeLatest(actionsTypes.SAVE_ORDER, workers.saveOrder),
    takeLatest(actionsTypes.UPDATE_ORDER_DETAIL, workers.updateOrder),
    takeLatest(actionsTypes.GET_ORDERS, workers.getOrders),
    takeLatest(actionsTypes.GET_ORDER_DETAIL, workers.getOrderDetail),
    takeLatest(actionsTypes.SEND_PAYMENT, workers.sendCreditPayment),
    takeLatest(actionsTypes.GET_USERS, workers.getUsers),
    takeLatest(actionsTypes.SAVE_USER, workers.saveUser),
    takeLatest(actionsTypes.UPDATE_USER, workers.updateUser),
    takeLatest(actionsTypes.DELETE_USER, workers.deleteUser),
    takeLatest(actionsTypes.LOGIN_USER, workers.userLogin),
    takeLatest(actionsTypes.GET_USER_BY_SESSION, workers.getUserBySession),
    takeLatest(actionsTypes.GET_CASH_REPORT, workers.getCashReport),
    takeLatest(actionsTypes.PAY_SUBMITTED_ORDER, workers.paySubmittedOrder),
    takeLatest(actionsTypes.MAKE_WITHDRAWAL, workers.makeWithdrawal),
    takeLatest(actionsTypes.OPENING_CASH, workers.openingCash),
    takeLatest(actionsTypes.AUTHORIZE_USER, workers.authorizeUser),
    takeLatest(actionsTypes.GET_CLIENTS, workers.getClients),
    takeLatest(actionsTypes.CREATE_CLIENTS, workers.createClient),
    takeLatest(actionsTypes.EDIT_CLIENTS, workers.editClient),
    // takeLatest(actionsTypes.DELETE_CLIENTS, workers.deleteClient),
    takeLatest(actionsTypes.GET_PRICES, workers.getPrices),
    takeLatest(actionsTypes.SAVE_PRICE, workers.createPrice),
    takeLatest(actionsTypes.UPDATE_PRICE, workers.editPrice),
    takeLatest(actionsTypes.DELETE_PRICE, workers.deletePrice),
    takeLatest(actionsTypes.NEW_EVENT, workers.addNewEvent),
    takeLatest(actionsTypes.EDIT_EVENT, workers.editEvent),
    takeLatest(actionsTypes.REMOVE_EVENT, workers.deleteEvent),
    takeLatest(actionsTypes.GET_EVENTS, workers.getEvents),
    takeLatest(actionsTypes.GET_DELIVERIES, workers.getUpcomingDeliveries),
  ]);
}
