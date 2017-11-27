const jsonfile = require('jsonfile');
const Playlist = require('./../models/Playlist.js');
const fs = require('fs');

class PlaylistManager{

  constructor() {
    this._playlist_filename = 'default'
    this._items = {};

    if (!fs.existsSync('playlists/' + this._playlist_filename + '.json')) {
      jsonfile.writeFileSync('playlists/' + this._playlist_filename + '.json', [])
    }

    this.initPlaylistFromStorage()
    this.loadCurrentPlaylist()
    // this._playlist = new Playlist('default');
  }

  get current_playlist() {
    return this._items[this._playlist_filename + '.json']
  }

  initPlaylistFromStorage()
  {
    let files = fs.readdirSync('playlists');
    for(var i in files) {
      if (files[i] != '.gitignore') {
        this._items[files[i]] = new Playlist(jsonfile.readFileSync('playlists/' + files[i]));
      }
    }
  }

  loadCurrentPlaylist() {
    var that = this;
    $('#playlist').html('')
    let items = this.current_playlist.get_array();
    for(let i in items) {
      let item_html = `<tr class="play-item" data-id="${i}">
        <td>${parseInt(i)+1}</td>
        <td>${items[i]}</td>
        <td><button class='ui mini icon remove button' data-id="${i}"> <i class='trash icon'></i> </button></td>
      </tr>`
      $('#playlist').append(item_html)
    }
    $('#playlist .remove.button').click(function(){
      that.current_playlist.delete_video($(this).data('id'))
      that.loadCurrentPlaylist()
      that.savePlaylists()
    })
    $('#playlist .play-item').click(function(){
      $('#playlist tr').removeClass('positive')
      $(this).addClass('positive')
      that.current_playlist.set_to_be_played($(this).data('id'))
    })
  }

  addToCurrentPlaylist(filename){
    this.current_playlist.add_video(filename)
    this.savePlaylists()
    this.loadCurrentPlaylist()
  }

  savePlaylists() {
    for(let filename in this._items){
      let item = this._items[filename];
      jsonfile.writeFileSync('playlists/' + filename, item.get_array())
    }
  }
}

module.exports = PlaylistManager