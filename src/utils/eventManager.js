
export default {
    emit(event, data = null) {
      if (this.dataSource[event]) {
        const callbacksIDs = Object.keys(this.dataSource[event]);
  
        callbacksIDs.forEach((callbackID) => {
          const callback = this.dataSource[event][callbackID];
          callback(data);
        });
      }
    },
    on(event, callback) {
      const callbackID = Math.random().toString(36).slice(-5);
  
      if (!this.dataSource[event]) {
        this.dataSource[event] = {};
      }
  
      this.dataSource[event][callbackID] = callback;
      return callbackID;
    },
    unsubscribe(event, callbackID) {
      if (this.dataSource[event] && this.dataSource[event][callbackID]) {
        delete this.dataSource[event][callbackID];
      }
    },
    dataSource: {},
  };
  