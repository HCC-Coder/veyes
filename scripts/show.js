const ipcRenderer = require('electron').ipcRenderer

console.log('show');
ipcRenderer.on('ping', (event, message) => {
  console.log('ping:' + message)
})