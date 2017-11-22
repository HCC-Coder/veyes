const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;
const path = require('path');
const electron = require('electron');

class ShowManager{

  constructor() {
    var that = this;
    this._choose_screen_id = 0;

    this.detect_screen()
    this.init_ui_event()
    this.resize_preview()
  }

  get choosen_screen_obj()
  {
    return this._displays[this._choose_screen_id];
  }

  resize_preview()
  {
    let ratio = (this.choosen_screen_obj.bounds.width / this.choosen_screen_obj.bounds.height)*100;
    $('#preview-container').css('padding-bottom', ratio);
  }

  detect_screen()
  {
    var that = this;
    const eScreen = electron.screen
    this._displays = eScreen.getAllDisplays()

    $('#show-screen').html('');
    for (let i in this._displays) {
      let option_html = `<option value="${i}"> ${parseInt(i)+1}. ${this._displays[i].size.width} x ${this._displays[i].size.height} </option>`
      $('#show-screen').append(option_html)
    }
    console.log(this._displays);
  }

  init_ui_event()
  {
    var that = this;
    $('#btn-detect').click(function(){
      that.detect_screen()
    })

    $('#show-screen').change(function(){
      that._choose_screen_id = $(this).val()
      that.resize_preview()
    })
  }
}

module.exports = ShowManager