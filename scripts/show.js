const ipcRenderer = require('electron').ipcRenderer
const $ = require('jquery')
const jQuery = $;

const DocumentManager = require('./scripts/managers/DocumentManager.js');
const ThemeManager = require('./scripts/managers/ThemeManager.js');
const StageManager = require('./scripts/managers/StageManager.js');

const CountdownUtility = require('./scripts/managers/CountdownUtility.js');
const countdownUtility = new CountdownUtility();
var countdownTimeInterval = null;

const Freewall = require('freewall').Freewall;
require('promise');
require('jquery.marquee');

var mgs = {}
$(function(){
  let dm = new DocumentManager(mgs)
  mgs.dm = dm;
  let tm = new ThemeManager(mgs)
  mgs.tm = tm;
  let sm = new StageManager(mgs)
  mgs.sm = sm;

});

ipcRenderer.on('slide', (event, message) => {
  mgs.sm.setTheme(message.theme);
  $('.line1').text(message.lines[0])
  $('.line2').text(message.lines[1])
})

ipcRenderer.on('fx-mono', (event, message) => {
  $('#fx-mono').toggle();
})
ipcRenderer.on('fx-invert', (event, message) => {
  $('#fx-invert').toggle();
})
ipcRenderer.on('fx-flash', (event, message) => {
  $('#fx-flash').show();
})
ipcRenderer.on('fx-blackout', (event, message) => {
  $('#fx-blackout').show();
})
ipcRenderer.on('fx-flash-clear', (event, message) => {
  $('#fx-flash').hide();
})
ipcRenderer.on('fx-blackout-clear', (event, message) => {
  $('#fx-blackout').hide();
})


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

