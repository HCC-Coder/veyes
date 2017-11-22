const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');
const $ = require('jquery');
const jQuery = $;
const path = require('path');

class FilelistManager{

  constructor() {
    this._videos_dir = path.resolve('./resources/videos');
    this._playlist_filename = 'default'
    this._playlist = new Playlist([]);
  }

  loadFilelist() {
    var that = this;
    $('#files').html('')

    let items = fs.readdirSync(this._videos_dir)
    for(let i in items) {
      if ($.inArray(items[i].split('.').pop(), ['mov', 'mp4']) == 1) {
        this._playlist.add_video(items[i]);
        let item_html = `<tr>
          <td> ${items[i]} </td>
          <td>
            <button class="ui mini icon item button" data-file="${items[i]}">
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