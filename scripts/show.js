const ipcRenderer = require('electron').ipcRenderer
const $ = require('jquery')
const jQuery = $;

const CountdownUtility = require('./scripts/managers/CountdownUtility.js');
const countdownUtility = new CountdownUtility();
var countdownTimeInterval = null;

const Freewall = require('freewall').Freewall;
require('promise');
require('jquery.marquee');

ipcRenderer.on('play', (event, message) => {
  $('#player').attr('src', message).show()
  $('#player')[0].play()
})

ipcRenderer.on('stop', (event, message) => {
  $('#player').attr('src', '').hide()
})


ipcRenderer.on('sound', (event, message) => {
  if (message) {
    $('#player')[0].muted = true
  } else {
    $('#player')[0].muted = false
  }
})


ipcRenderer.on('background', (event, message) => {
  $('body').css('background-image', 'url("' + message.replace(/\\/g, "/") + '")')
})

ipcRenderer.on('countdown-bottom', (event, message) => {
  $('#countdown').css('bottom', message)
})

ipcRenderer.on('countdown', (event, message) => {

  var input_countdown_till = message;
  var date_till = countdownUtility.setTodayTillTime(input_countdown_till);

  clearInterval(countdownTimeInterval);

  countdownTimeInterval = setInterval(function(){
    var obj_time_remaining = countdownUtility.getTimeRemaining(date_till);
    if (obj_time_remaining.total > 0) {
      let str_countdown = countdownUtility.updateCountdown(obj_time_remaining);
      $('#countdown').show().text(str_countdown);
    } else {
      $('#countdown').hide().text('');
    }
  },1000);
})

