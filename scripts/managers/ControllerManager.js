const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;
const path = require('path');

class ControllerManager{

  constructor(playlist) {
    var that = this;
    this._playlist = playlist;
    this._preview$ = $('#preview');
    this._preview  = $('#preview')[0];
    this._is_playing = false;

    this.init_ui_event()
  }

  set_show_window(show_window)
  {
    this._show_window = show_window
  }

  play()
  {
    if (this._preview$.attr('src') == '') {
      this._preview$.attr('src', this._playlist.to_be_played);
    }
    this._is_playing = true;
    this._preview$.show()
    this._preview.play()
    $('#control-play .icon').removeClass('play').addClass('pause')
    console.log(this._show_window)
    this._show_window.webContents.send('ping', 'whoooooooh!')
  }
  pause()
  {
    this._preview.pause()
    $('#control-play .icon').removeClass('pause').addClass('play')
    this._is_playing = false;
  }
  stop()
  {
    this._preview$.hide()
    this._preview.currentTime = 0
    this._preview$.attr('src', '');
    $('#control-play .icon').removeClass('pause').addClass('play')
    this._is_playing = false;
  }

  init_ui_event()
  {
    var that = this;
    $('#control-play').click(function(){
      if (that._is_playing) {
        that.pause();
      } else {
        that.play();
      }
    })
    $('#control-stop').click(function(){
      that.stop();
    })
  }
}

module.exports = ControllerManager