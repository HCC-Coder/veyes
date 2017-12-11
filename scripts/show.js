const ipcRenderer = require('electron').ipcRenderer
const $ = require('jquery')

ipcRenderer.on('play', (event, message) => {
  $('#player').attr('src', message)
  $('#player')[0].play()
})

ipcRenderer.on('stop', (event, message) => {
  $('#player').attr('src', '')
})


ipcRenderer.on('sound', (event, message) => {
  if (message) {
    $('#player')[0].muted = true
  } else {
    $('#player')[0].muted = false
  }
})

