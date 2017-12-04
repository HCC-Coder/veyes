const ipcRenderer = require('electron').ipcRenderer
const $ = require('jquery')

ipcRenderer.on('play', (event, message) => {
  $('#player').attr('src', message)
  $('#player')[0].play()
})

ipcRenderer.on('stop', (event, message) => {
  $('#player').attr('src', '')
})