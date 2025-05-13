import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import AppRouter from './Router';
import DeliveryNotification from './components/DeliveriesNotifications';


const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRouter />
        <DeliveryNotification />
      </Provider>
    );
  }
}

export default App;
