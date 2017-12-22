const electron = require('electron')

const PlaylistManager = require('./scripts/managers/PlaylistManager.js');
const BackgroundManager = require('./scripts/managers/BackgroundManager.js');
const FilelistManager = require('./scripts/managers/FilelistManager.js');
const ControllerManager = require('./scripts/managers/ControllerManager.js');
const ShowManager = require('./scripts/managers/ShowManager.js');

const $ = require('jquery');
const jQuery = $;
require('./semantic/dist/semantic.min.js');

const that_show_window = electron.remote.getCurrentWindow().obj_wins.show;

var fm;
var pm;
var bm;
var cm;
var sm;
$(function(){
  init_player()
  init_semantic()

  $('#input-countdown').change(function(){
    that_show_window.webContents.send('countdown', $( this ).val());
  })
  $('#btn-countdown-clear').click(function() {
    $('#input-countdown').val(0);
    that_show_window.webContents.send('countdown', 0);    
  })
})

function init_player()
{
  let mgs = {}
  pm = new PlaylistManager(mgs)
  mgs.pm = pm;
  bm = new BackgroundManager(mgs)
  mgs.bm = bm;
  fm = new FilelistManager(mgs)
  mgs.fm = fm;
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
    that_show_window.webContents.send('insta_show', true);
  },
  'onUnchecked': function(){
    that_show_window.webContents.send('insta_show', false);
  }})
}
