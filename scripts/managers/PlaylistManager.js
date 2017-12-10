const Playlist = require('./../models/Playlist.js');

const jsonfile = require('jsonfile');
const fs = require('fs');

class PlaylistManager{

  constructor(mgs) {

    this.mgs = mgs
    // default value
    this._playlist_filename = 'default'
    this._items = {}

    // init
    this.init_default_playlist_storage()
    this.init_load_playlists_from_storage()
    this.init_event()

    this.load_current_playlist()
  }

  get current_playlist() {
    return this._items[this._playlist_filename + '.json']
  }

  init_event()
  {
    var that = this

    $('#playlist .btn-playlist-remove').hide()
    $('#btn-playlist-edit').unbind('click').click(function(){
      var $this = $(this)
      if ($this.text() == 'done') {
        $this.removeClass('red').text('edit')
        $('.btn-playlist-play').show()
        $('.btn-playlist-remove').hide()
      } else {
        $this.addClass('red').text('done')
        $('.btn-playlist-play').hide()
        $('.btn-playlist-remove').show()
      }
    })

    $('#playlist .btn-playlist-remove').unbind('click').click(function(){
      that.current_playlist.delete_video($(this).data('id'))
      that.load_current_playlist()
      that.save_playlists_to_storage()
    })
    $('#playlist .play-item').unbind('click').click(function(){
      that.current_playlist.set_to_be_played($(this).data('id'))
      that.highlight_active()
    })
    $('#playlist .btn-playlist-play').unbind('click').click(function(){
      console.log(that.mgs)
      that.current_playlist.set_to_be_played($(this).data('id'))
      that.highlight_active()
      that.mgs.cm.stop()
      that.mgs.cm.play()
      
    })
  }
  highlight_active()
  {
    let nth = this.current_playlist.to_be_played_index + 1;
    $('#playlist tr').removeClass('positive')
    $('#playlist tr.play-item:nth-child('+nth+')').addClass('positive')
  }

  init_default_playlist_storage()
  {
    if (!fs.existsSync('playlists/' + this._playlist_filename + '.json')) {
      jsonfile.writeFileSync('playlists/' + this._playlist_filename + '.json', [])
    }
  }

  init_load_playlists_from_storage()
  {
    $('#dropdown-playlists').html('');
    let files = fs.readdirSync('playlists');
    for(var i in files) {
      if (files[i] != '.gitignore') {
        let item_html = `<option value="${files[i]}"> ${files[i]} </option>`;
        $('#dropdown-playlists').append(item_html)
        this._items[files[i]] = new Playlist(jsonfile.readFileSync('playlists/' + files[i]));
      }
    }
  }

  load_current_playlist() {
    var that = this;
    $('#playlist').html('')
    let items = this.current_playlist.get_array();
    for(let i in items) {
      let item_html = `<tr class="play-item" data-id="${i}">
        <td>${parseInt(i)+1}</td>
        <td>${items[i]}</td>
        <td>
          <button class='ui mini icon play button btn-playlist-play' data-id="${i}"> <i class='play icon'></i> </button>
          <button class='ui mini icon remove red button btn-playlist-remove' data-id="${i}"> <i class='trash icon'></i> </button>
        </td>
      </tr>`
      $('#playlist').append(item_html)
    }
    this.init_event()
    this.highlight_active()
  }

  addToCurrentPlaylist(filename){
    this.current_playlist.add_video(filename)
    this.save_playlists_to_storage()
    this.load_current_playlist()
  }

  save_playlists_to_storage() {
    for(let filename in this._items){
      let item = this._items[filename];
      jsonfile.writeFileSync('playlists/' + filename, item.get_array())
    }
  }
}

module.exports = PlaylistManager