const electron = require('electron')

const PlaylistManager = require('./scripts/managers/PlaylistManager.js');
const InfoManager = require('./scripts/managers/InfoManager.js');
const BackgroundManager = require('./scripts/managers/BackgroundManager.js');
const DocumentManager = require('./scripts/managers/DocumentManager.js');
const ControllerManager = require('./scripts/managers/ControllerManager.js');
const ShowManager = require('./scripts/managers/ShowManager.js');

const $ = require('jquery');
const jQuery = $;
require('./semantic/dist/semantic.min.js');

const that_show_window = electron.remote.getCurrentWindow().obj_wins.show;

var dm;
var pm;
var im;
var bm;
var cm;
var sm;

$(function(){
  init_player()
  init_semantic()

  $('#input-countdown').change(function(){
    that_show_window.webContents.send('countdown', $( this ).val());
  })
  $('#input-countdown-bottom').change(function(){
    that_show_window.webContents.send('countdown-bottom', $( this ).val());
  })
  $('#btn-countdown-clear').click(function() {
    $('#input-countdown').val(0);
    that_show_window.webContents.send('countdown', 0);    
  })
})

function init_player()
{
  let mgs = {}
  dm = new DocumentManager(mgs)
  mgs.dm = dm;
  pm = new PlaylistManager(mgs)
  mgs.pm = pm;
  im = new InfoManager(mgs)
  mgs.im = im;
  bm = new BackgroundManager(mgs)
  mgs.bm = bm;
  cm = new ControllerManager(mgs)
  mgs.cm = cm;
  sm = new ShowManager(mgs)
  mgs.sm = sm;
}


function init_semantic()
{
  $('.ui.dropdown').dropdown();
  $('.ui.progress').progress();

  $('#btn-insta-wall').checkbox({'onChecked': function(){
    let tag = $('#input-hashtag').val();
    that_show_window.webContents.send('insta_show', {v: true, tag: tag});
  },
  'onUnchecked': function(){
    let tag = $('#input-hashtag').val();
    that_show_window.webContents.send('insta_show', {v: false, tag: tag});
  }})
}
