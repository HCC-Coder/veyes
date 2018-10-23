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

ipcRenderer.on('PW-unload', (event, message) => {
  $('.line').text('')
  $('.theme .loop').hide();
  $('.theme .loop').each(function() {
    $(this).get(0).pause();
  });
})

ipcRenderer.on('PW-unload-line', (event, message) => {
  $('.line').text('').hide()
})

ipcRenderer.on('slide', (event, message) => {
  $('.theme .loop').each(function() {
    $(this).get(0).pause();
  });


  $('#'+message.theme+' .loop').show();
  $('#'+message.theme+' .loop').each(function() {
    $(this).get(0).play();
  });

  mgs.sm.setTheme(message.theme);
  for(var i in message.lines) {
    let j = parseInt(i)+1;
    if (message.lines[i]) {
      $('.line'+j).html(message.lines[i]).show()
    } else {
      $('.line'+j).hide()
    }
  }
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

ipcRenderer.on('overlay-mode', (event, message) => {
  $('#overlay-video').css({'mix-blend-mode': message});
})

ipcRenderer.on('overlay', (event, message) => {
  let path = mgs.dm.document_path +'/backdrop/overlay'+ message + '.mp4';
  $('#overlay-video').attr('src', path);
  $('#overlay').show();
})

ipcRenderer.on('overlay-clear', (event, message) => {
  $('#overlay-video').attr('src', '');
  $('#overlay').hide();
})

ipcRenderer.on('image-load', (event, message) => {
  $('#image-player').attr('src', message).show()
})
ipcRenderer.on('image-unload', (event, message) => {
  $('#image-player').attr('src', '').hide()
})

ipcRenderer.on('video-load', (event, message) => {
  $('#player').attr('src', message).show()
})
ipcRenderer.on('video-play', (event, message) => {
  $('#player')[0].play()
})
ipcRenderer.on('video-stop', (event, message) => {
  $('#player')[0].currentTime = 0;
  $('#player')[0].pause()
})
ipcRenderer.on('video-loop', (event, message) => {
  if ($('#player').prop('loop')) {
    $('#player').prop('loop', false);
  } else {
    $('#player').prop('loop', true);
  }
})
ipcRenderer.on('video-unload', (event, message) => {
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

