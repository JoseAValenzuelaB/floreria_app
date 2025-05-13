import { combineReducers } from 'redux';
import viewsContainer from './views';


const containers = {
  reducers: combineReducers({
    app: viewsContainer.reducer,
  }),
  routes: [
    ...viewsContainer.routes,
  ],
  sagas: {
    developers: viewsContainer.saga,
  },
};


export default containers;
