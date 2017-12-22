const electron = require('electron')
const jsonfile = require('jsonfile')
const Playlist = require('./../models/Playlist.js')
const fs = require('fs')
const $ = require('jquery')
const jQuery = $
const path = require('path')

class ControllerManager{

  constructor(mgs) {
    var that = this;
    this.mgs = mgs;
    this._playlist = mgs.pm.current_playlist;
    this._preview$ = $('#preview');
    this._preview  = $('#preview')[0];
    this._is_playing = false;

    this.init_ui_event()
    this._show_window = electron.remote.getCurrentWindow().obj_wins.show;
  }

  play_previous()
  {
    this._playlist.go_previous()
    this.mgs.pm.highlight_active()
    this.stop()
    this.play()
  }

  play_next()
  {
    this._playlist.go_next()
    this.mgs.pm.highlight_active()
    this.stop()
    this.play()
  }

  play()
  {
    if (this._preview$.attr('src') == '') {
      this._preview$.attr('src', this._playlist.to_be_played);
    }
    this._is_playing = true;
    this._preview$.show()
    this._preview.play()
    $('#control-play .icon').removeClass('play').addClass('stop')
    this._show_window.webContents.send('play', this._playlist.to_be_played)
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
    $('#control-play .icon').removeClass('stop').addClass('play')
    this._is_playing = false;
    this._show_window.webContents.send('stop')

  }

  init_ui_event()
  {
    var that = this;
    $('#control-play').click(function(){
      if (that._is_playing) {
        that.stop();
        // that.pause();
      } else {
        that.play();
      }
    })

    $('#control-next').click(function(){
      that.play_next()
    })
    $('#control-prev').click(function(){
      that.play_previous()
    })
  }
}

module.exports = ControllerManager