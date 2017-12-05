const Playlist = require('./../models/Playlist.js');
const ConfigManager = require('./../managers/ConfigManager.js');
const path = require('path');
const $ = require('jquery');

class FilelistManager{

  constructor(playlistManager) {

    // inject managers
    this._playlistManager = playlistManager;
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
      that._playlistManager.addToCurrentPlaylist($(this).data('file'))
    })
  }

  load_filelist() {
    const fs = require('fs');

    var that = this;
    $('#files').html('')

    let items = fs.readdirSync(this._videos_dir)
    for(let i in items) {
      if ($.inArray(items[i].split('.').pop(), ['mov', 'mp4']) == 1) {
        this._playlist.add_video(items[i]);
        let item_html = `<tr>
          <td> ${items[i]} </td>
          <td>
            <button class="ui mini icon item button" data-file="${this._configManager.get_config('video_filepath')}/${items[i]}">
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