
const Playlist = require('./scripts/models/Playlist.js');
const PlaylistManager = require('./scripts/managers/PlaylistManager.js');
const FilelistManager = require('./scripts/managers/FilelistManager.js');
const ControllerManager = require('./scripts/managers/ControllerManager.js');
const ShowManager = require('./scripts/managers/ShowManager.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;
require('./semantic/dist/semantic.min.js');

var file_list = new Playlist([]);
var pm;
var cm;
var sm;
$(function(){
  init_files()
  init_semantic()
  init_playlist()
})

function init_playlist()
{
  pm = new PlaylistManager()
  cm = new ControllerManager(pm.current_playlist)
  sm = new ShowManager()
}


function init_semantic()
{
  $('.ui.dropdown').dropdown();
  $('.ui.progress').progress();
}

function init_files()
{
  let fm = new FilelistManager();
  fm.loadFilelist();
  $('#files .item.button').click(function(){
    $this = $(this);
    pm.addToCurrentPlaylist($this.data('file'))
  })
}