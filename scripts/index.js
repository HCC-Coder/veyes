const PlaylistManager = require('./scripts/managers/PlaylistManager.js');
const FilelistManager = require('./scripts/managers/FilelistManager.js');
const ControllerManager = require('./scripts/managers/ControllerManager.js');
const ShowManager = require('./scripts/managers/ShowManager.js');

const $ = require('jquery');
const jQuery = $;
require('./semantic/dist/semantic.min.js');

var fm;
var pm;
var cm;
var sm;
$(function(){
  init_player()
  init_semantic()
})

function init_player()
{
  pm = new PlaylistManager()
  fm = new FilelistManager(pm)
  cm = new ControllerManager(pm.current_playlist)
  sm = new ShowManager(cm)
}


function init_semantic()
{
  $('.ui.dropdown').dropdown();
  $('.ui.progress').progress();
}
