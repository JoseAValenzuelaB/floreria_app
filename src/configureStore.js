import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import createSagaMiddleware from 'redux-saga';
import containers from './container';


export default () => {
  const initialState = window.INITIAL_STATE;

  const axiosInstance = axios.create({
    baseURL: '/api',
  });

  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, thunk.withExtraArgument(axiosInstance)];
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    containers.reducers,
    initialState,
    compose(...enhancers),
  );

  // run all sagas
  Object.keys(containers.sagas).forEach((sagasName) => {
    const currentSaga = containers.sagas[sagasName];
    sagaMiddleware.run(currentSaga);
  });

  return store;
};
