const electron = require('electron')
const {BrowserWindow} = require('electron').remote
const path = require('path')
const url = require('url')

const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;

class ShowManager{

  constructor(cm) {
    var that = this;
    this._choose_screen_id = 0;
    this._cm = cm

    this._preview$ = $('#preview');
    this._preview  = $('#preview')[0];
    this._show_window = null

    this.detect_screen()
    this.init_ui_event()
    this.init_video_event()
    this.resize_preview()

    $('#btn-start').click(this.start_show.bind(that));
  }

  get show_window()
  {
    return this._show_window;
  }

  start_show()
  {
    if (!this._show_window) {
      this._show_window = new BrowserWindow({
        x:0, y:0,
        // closable: false,
        hasShadow: false,
        resizable: false,
        frame: false,
        backgroundColor: '#000'
      })
      this._show_window.loadURL(url.format({
        pathname: path.resolve('./show.html'),
        protocol: 'file:',
        slashes: true
      }))
      this._show_window.webContents.openDevTools()

      this._show_window.on('closed', () => {
        this._show_window = null
      })
    }
    this._show_window.setBounds(this.choosen_screen_obj.bounds, false);
    this._show_window.show()
    this._cm.set_show_window(this._show_window)
  }

  init_video_event()
  {
    // this._preview.addEventListener('timeupdate', this.timeupdate.bind(this));
    setInterval(this.timeupdate.bind(this), 100)
  }

  timeupdate()
  {
    var that = this;
    if (that._preview.duration) {
      let label_current_time = that.seconds_to_minutes_label(that._preview.currentTime)
      let label_duration = that.seconds_to_minutes_label(that._preview.duration)
      $('#label-current-time').text( label_current_time + ' / ' + label_duration);
      $('#progress-timeline').progress({
        percent: (that._preview.currentTime/that._preview.duration)*100
      });
    }
  }

  seconds_to_minutes_label(seconds)
  {
    let total_time_sec = Math.ceil(seconds)
    let time_min = Math.floor(total_time_sec / 60)
    let time_sec_remain = total_time_sec % 60
    return time_min + ":" + ("00" + time_sec_remain).substr(-2,2)
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