const Playlist = require('./../models/Playlist.js');
const ConfigManager = require('./../managers/ConfigManager.js');
const path = require('path');
const $ = require('jquery');

class FilelistManager{

  constructor(mgs) {

    // inject managers
    this._playlistManager = mgs.pm;
    this._backgroundManager = mgs.bm;
    this._configManager = new ConfigManager();

    // default values
    this._playlist_filename = 'default'
    this._playlist = new Playlist([]);

    // init
    this.init_file_path_config()
    this.init_event()
  }

  init_event()
  {
    let that = this;
    $('#video-filepath').click(function(){
      that.update_file_path_config();
    })
  }

  init_file_path_config()
  {
    if (!this._configManager.get_config('video_filepath')) {
      this.update_file_path_config()
    }
    this.reload_file_list()
  }

  update_file_path_config()
  {
    const {dialog} = require('electron').remote;
    var video_filepath = dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    this._configManager.set_config('video_filepath', video_filepath[0]);
    this.reload_file_list()
  }

  reload_file_list()
  {
    this._videos_dir = path.resolve(this._configManager.get_config('video_filepath'));
    $('#video-filepath').text(this._videos_dir)
    this.load_filelist()

    var that = this;
    $('#files .item.button').click(function(){
      let $this = $(this).closest('tr')
      if ($this.data('type') == 'video') {
        that._playlistManager.addToCurrentPlaylist($this.data('path'))
      } else if ($this.data('type') == 'image') {
        that._backgroundManager.addToCurrentPlaylist($this.data('path'))
      }
    })
  }

  load_filelist() {
    const fs = require('fs');

    var that = this;
    $('#files').html('')

    let items = fs.readdirSync(this._videos_dir)
    for(let i in items) {
      let item_ext = items[i].split('.').pop()
      let item_path = path.resolve(this._videos_dir, items[i])
      if ($.inArray(item_ext, ['mov', 'mp4', 'flv', 'm4v', 'avi', 'wma']) !== -1) {
        let item_html = `<tr data-type="video" data-path="${item_path}">
          <td>
            <i class="circular purple video icon"> </i>
            ${items[i]}
          </td>
          <td>
            <button class="ui mini icon item button">
              <i class="upload icon"></i>
            </button>
          </td>
        </tr>`
        $('#files').append(item_html)
      } else if ($.inArray(item_ext, ['jpg']) !== -1) {
        let item_html = `<tr data-type="image" data-path="${item_path}">
          <td>
            <i class="circular orange image icon"> </i>
            ${items[i]}
          </td>
          <td>
            <button class="ui mini icon item button">
              <i class="upload icon"></i>
            </button>
          </td>
        </tr>`
        $('#files').append(item_html)
      }
    }
  }
}

module.exports = FilelistManager