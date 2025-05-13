import * as actionsTypes from '../store/types';
import eventManager from '../utils/eventManager';
import * as calls from './calls';
import { call, put } from 'redux-saga/effects';
import userSession from './selectors';


export function* saveProduct(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: true } });

    const request = calls.createProduct(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("product_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: false } });
  }
}

export function* getProducts() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: true } });
    const request = calls.getProducts();
    const response = yield call(request);
    const serverResponse = response.data;
    
    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_PRODUCTS, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'products', value: false } });
  }
}

export function* getProductDetail(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: true } });
    const request = calls.getProductByID(action.id, action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_PRODUCT, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: false } });
  }
}

export function* updateProduct(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: true } });

    const request = calls.updateProduct(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("product_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'productDetail', value: false } });
  }
}

export function* saveOrder(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: true } });

    const request = calls.createOrder(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("order_saved", serverResponse.data);
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  }
}

export function* updateOrder(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: true } });

    const request = calls.updateOrder(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("order_saved", serverResponse.data);
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  }
}

export function* getOrders() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: true } });
    const request = calls.getOrders();
    const response = yield call(request);
    const serverResponse = response.data;
    
    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_ORDERS, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  }
}

export function* getOrderDetail(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: true } });
    const request = calls.getOrderByID(action.payload.id);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_ORDER_DETAIL, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: false } });
  } catch (error) {
    console.log("MESAGE: ", error)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: false } });
  }
}

export function* sendCreditPayment(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: true } });
    const request = calls.sendCreditPayment(action.payload.id, action.payload.payment);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("credit_payment_succesfull")
      yield put({ type: actionsTypes.SET_ORDER_DETAIL, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: false } });
  } catch (error) {
    console.log("MESAGE: ", error)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orderDetail', value: false } });
  }
}

// USERS

export function* saveUser(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: true } });

    const request = calls.createUser(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("user_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  }
}

export function* getUsers() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: true } });

    const request = calls.getUsers();
    const response = yield call(request);
    const serverResponse = response.data;
    
    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_USERS, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  }
}

export function* deleteUser(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: true } });
    const request = calls.deleteUser(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_PRODUCT, payload: serverResponse.data });
      eventManager.emit("user_deleted");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  }
}

export function* updateUser(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: true } });

    const request = calls.updateUser(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("user_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'users', value: false } });
  }
}

export function* userLogin(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'login', value: true } });

    const request = calls.userLogin(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    eventManager.emit('login_response', serverResponse);
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'login', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'login', value: false } });
  }
}


export function* authorizeUser(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'authorize', value: true } });

    const request = calls.authorizeUser(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    eventManager.emit('authorize_response', serverResponse);
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'authorize', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'authorize', value: false } });
  }
}

export function* getUserBySession(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'userData', value: true } });

    const request = calls.getUserBySession(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid && serverResponse.data) {
      yield put({ type: actionsTypes.SET_USER_DATA, payload: serverResponse.data });
    } else {
      window.localStorage.removeItem("session");
      // eventManager.emit('navigate', '/');
      throw new Error(serverResponse.message);
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'userData', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'userData', value: false } });
  }
}


export function* getCashReport(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'cashReport', value: true } });

    const request = calls.getCashReport(action.payload, userSession);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid && serverResponse.data) {
      yield put({ type: actionsTypes.SET_CASH_REPORT, payload: serverResponse.data });
    } else {
      throw new Error(serverResponse.message);
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'cashReport', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'cashReport', value: false } });
  }
}

export function* paySubmittedOrder(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: true } });

    const request = calls.paySubmittedOrder(action.payload.id, action.payload.payment);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("payment_succesfull")
    } else {
      throw new Error(serverResponse.message);
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'orders', value: false } });
  }
}

export function* makeWithdrawal(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'withdrawal', value: true } });

    const request = calls.makeWithdrawal(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid && serverResponse.data) {
      eventManager.emit("withdrawal_succesfull")
    } else {
      throw new Error(serverResponse.message);
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'withdrawal', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'withdrawal', value: false } });
  }
}

export function* openingCash(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'opening_cash', value: true } });

    const request = calls.openingCash(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("opening_cash_succesfully", serverResponse);
    } else {
      throw new Error(serverResponse.message);
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'opening_cash', value: false } });
  } catch (error) {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'opening_cash', value: false } });
  }
}

// CLIENTS

export function* createClient(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: true } });

    const request = calls.createClient(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("client_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  }
}

export function* getClients() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: true } });
    const request = calls.getClients();
    const response = yield call(request);
    const serverResponse = response.data;
    
    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_CLIENTS, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  }
}

// export function* getProductDetail(action) {
//   try {
//     yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: true } });
//     const request = calls.getProductByID(action.id, action.payload);
//     const response = yield call(request);
//     const serverResponse = response.data;

//     if (serverResponse.isValid) {
//       yield put({ type: actionsTypes.SET_PRODUCT, payload: serverResponse.data });
//     } else {
//       console.log("MESAGE: ", serverResponse.message)
//     }

//     yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
//   } catch (error) {
//     console.log("MESAGE: ", serverResponse.message)
//     yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
//   }
// }

export function* editClient(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: true } });

    const request = calls.updateClient(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("client_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'clients', value: false } });
  }
}


// PRICES

export function* createPrice(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: true } });

    const request = calls.createPrice(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("price_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  }
}

export function* getPrices() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: true } });
    const request = calls.getPrices();
    const response = yield call(request);
    const serverResponse = response.data;
    
    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_PRICES, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  }
}

export function* editPrice(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: true } });

    const request = calls.updatePrice(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("client_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  }
}

export function* deletePrice(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: true } });
    console.log("PAYLOAD: ", action.payload);
    const request = calls.deletePrice(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("price_deleted");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'prices', value: false } });
  }
}

//EVENTS

export function* addNewEvent(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: true } });
    console.log("EVENT WORKER: ", action.payload)
    const request = calls.createEvent(action.payload);
    const response = yield call(request);
    const serverResponse = response.data;
    console.log("serverResponse", serverResponse)
    if (serverResponse.isValid) {
      eventManager.emit("event_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  }
}

export function* getEvents(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: true } });

    const request = calls.getEvents();
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("client_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  }
}

export function* editEvent(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: true } });

    const request = calls.updateEvent(action.payload.id, action.payload.newValues);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      eventManager.emit("event_saved");
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  }
}

export function* deleteEvent(action) {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: true } });
    const request = calls.deleteEvent(action.id, action.payload);
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_PRODUCT, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'events', value: false } });
  }
}

export function* getUpcomingDeliveries() {
  try {
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'upcomnigDeliveries', value: true } });
    const request = calls.getUpcomingDeliveries();
    const response = yield call(request);
    const serverResponse = response.data;

    if (serverResponse.isValid) {
      yield put({ type: actionsTypes.SET_DELIVERIES, payload: serverResponse.data });
    } else {
      console.log("MESAGE: ", serverResponse.message)
    }

    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'upcomnigDeliveries', value: false } });
  } catch (error) {
    console.log("MESAGE: ", serverResponse.message)
    yield put({ type: actionsTypes.SET_LOADING, payload: { prop: 'upcomnigDeliveries', value: false } });
  }
}