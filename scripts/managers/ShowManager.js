const electron = require('electron')
const {BrowserWindow, app} = require('electron').remote
const path = require('path')
const url = require('url')

const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;

class ShowManager{

  constructor(mgs) {
    var that = this;
    this._choose_screen_id = 0;
    this.showing_slide_index = null;
    this.mgs = mgs
    this._cm = mgs.cm

    this._preview$ = $('#preview');
    this._preview  = $('#preview')[0];
    this._show_window = null

    this.detect_screen()
    this.init_ui_event()
    this.init_video_event()
    this.resize_preview()

    this._show_window = electron.remote.getCurrentWindow().obj_wins.show;

    $('#btn-cast').click(function(){
      var btn = $(this);
      var btn_icon = $(this).children('.icon');
      if(btn_icon.hasClass('unhide')) {
        btn_icon.removeClass('unhide').addClass('hide')
        btn.removeClass('active')
        that.hide_show()
      } else {
        btn_icon.removeClass('hide').addClass('unhide')
        btn.addClass('active')
        that.start_show()
      }
    });
  }

  get show_window()
  {
    return this._show_window;
  }

  start_show()
  {
    this._show_window.setBounds(this.choosen_screen_obj.bounds, false);
    this._show_window.show()
    this._show_window.webContents.send('sound', false)
  }

  hide_show()
  {
    if (this._show_window) {
      this._show_window.hide()
      this._show_window.webContents.send('sound', true)
    }
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
    let ratio = (this.choosen_screen_obj.bounds.height / this.choosen_screen_obj.bounds.width)*100;
    $('#preview-container').css('padding-bottom', ratio + '%');
  }

  detect_screen()
  {
    var that = this;
    const eScreen = electron.screen
    this._displays = eScreen.getAllDisplays().reverse()

    $('#select-screen').html('');
    for (let i in this._displays) {
      let option_html = `<option value="${i}"> ${this._displays.length-i}. ${this._displays[i].size.width} x ${this._displays[i].size.height} </option>`
      $('#select-screen').append(option_html)
    }
  }

  goto_previous_slide()
  {
    if (
      this.showing_slide_index === null
      ) {
      this.showing_slide_index = 0;
    } else if(this.showing_slide_index > 0) {
      this.showing_slide_index--;
    }
    this.activate_slide();
  }


  goto_next_slide()
  {
    if (this.showing_slide_index === null) {
      this.showing_slide_index = 0;
    } else if (this.showing_slide_index < $('#info .item').length - 1) {
      this.showing_slide_index++;
    }
    this.activate_slide();
  }

  activate_slide()
  {
    let target_slide = $('#info .item').eq(this.showing_slide_index);

    $('#info .item').removeClass('active');
    target_slide.addClass('active');
    this.refocus_info();


    let order = target_slide.closest('section').data('order')-1;
    let line_order = target_slide.data('line-order');

    console.log(order, line_order);
    let theme = this.mgs.im.theme_content[order].slides[0];
    if (typeof this.mgs.im.theme_content[order].slides[line_order] != 'undefined') {
      theme = this.mgs.im.theme_content[order].slides[line_order];
    }

    let content = {
      "lines":target_slide.data('lines').split(','),
      "theme":theme,
      "order":order,
      "line-order":line_order
    };
    this._show_window.webContents.send('slide', content)
  }

  refocus_info()
  {
    let current_top = $('#info').scrollTop();
    let target_top = $('#info .item').eq(this.showing_slide_index).offset().top;
    let final_top = current_top + target_top - 200;
    $('#info').stop().animate({scrollTop: final_top}, 200);
  }

  init_ui_event()
  {
    var that = this;
    $('#btn-detect-screen').click(function(){
      that.detect_screen()
    })

    $('#select-screen').change(function(){
      that._choose_screen_id = $(this).val()
      that.resize_preview()
    })

    $(window).keydown(function(e){
      console.log(e.which);
      switch(e.which) {
        case 38: that.goto_previous_slide(); break; // up
        case 40: that.goto_next_slide(); break; // down
        case 37: that.goto_previous_slide(); break; // left
        case 39: that.goto_next_slide(); break; // right
        case 87: that._show_window.webContents.send('fx-flash'); break;
        case 66: that._show_window.webContents.send('fx-blackout'); break;
        case 88: that._show_window.webContents.send('fx-invert'); break;
        case 77: that._show_window.webContents.send('fx-mono'); break;
      }
    })
    $(window).keyup(function(e){
      switch(e.which) {
        case 87: that._show_window.webContents.send('fx-flash-clear'); break;
        case 66: that._show_window.webContents.send('fx-blackout-clear'); break;
      }
    })

    $('#info li.item').click(function(){

      that.showing_slide_index = $(this).index('#info li.item');
      that.activate_slide()
    });
  }
}

module.exports = ShowManager