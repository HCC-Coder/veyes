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
  let mgs = {}
  pm = new PlaylistManager(mgs)
  mgs.pm = pm;
  fm = new FilelistManager(pm)
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
}
