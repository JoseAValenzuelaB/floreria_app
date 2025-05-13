// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const os = require("os");

contextBridge.exposeInMainWorld('electronAPI', {
  printHTML: (orderDetail) => ipcRenderer.send('print-html', orderDetail),
  printTicket: (orderDetail) => ipcRenderer.send('print-order', orderDetail),
  printBarCode: (barCode) => ipcRenderer.send('print-barcode', barCode),
  getOSInfo: () => ({
    platform: os.platform(),
    version: os.release(),
    arch: os.arch(),
  }),
});
