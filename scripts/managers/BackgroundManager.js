const Playlist = require('./../models/Playlist.js');

const {app} = require('electron').remote
const BACKGROUND_FILEPATH = app.getPath('appData') + '/backgrounds/'
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

class BackgroundManager{

  constructor(mgs) {

    this.mgs = mgs

    // default value
    this._background_filename = 'default'
    this._items = {}

    // init
    this.init_default_background_storage()
    this.init_load_background_from_storage()
    this.init_event()

    this.load_current_background()
  }

  get current_background() {
    return this._items[this._background_filename + '.json']
  }

  init_event()
  {
    var that = this

    $('#background .btn-background-remove').hide()
    $('#btn-background-edit').unbind('click').click(function(){
      var $this = $(this)
      if ($this.text() == 'done') {
        $this.removeClass('red').text('edit')
        $('.btn-background-play').show()
        $('.btn-background-remove').hide()
      } else {
        $this.addClass('red').text('done')
        $('.btn-background-play').hide()
        $('.btn-background-remove').show()
      }
    })

    $('#background .btn-background-remove').unbind('click').click(function(){
      that.current_background.delete_video($(this).data('id'))
      that.load_current_background()
      that.save_backgrounds_to_storage()
    })

    $('#background .btn-background-play').unbind('click').click(function(){

      that.current_background.set_to_be_played($(this).data('id'))
      that.mgs.sm.show_window.webContents.send('background', that.current_background.to_be_played)
      that.highlight_active()
    })
  }
  highlight_active()
  {
    let nth = this.current_background.to_be_played_index + 1;
    $('#background tr').removeClass('active')
    $('#background tr.play-item:nth-child('+nth+')').addClass('active')
  }

  init_default_background_storage()
  {
    if (!fs.existsSync(BACKGROUND_FILEPATH + this._background_filename + '.json')) {
      fs.mkdirSync(BACKGROUND_FILEPATH)
      jsonfile.writeFileSync(BACKGROUND_FILEPATH + this._background_filename + '.json', [])
    }
  }

  init_load_background_from_storage()
  {
    $('#dropdown-backgrounds').html('');
    let files = fs.readdirSync(BACKGROUND_FILEPATH);
    for(var i in files) {
      if (files[i] != '.gitignore') {
        let item_html = `<option value="${files[i]}"> ${files[i]} </option>`;
        $('#dropdown-backgrounds').append(item_html)
        this._items[files[i]] = new Playlist(jsonfile.readFileSync(BACKGROUND_FILEPATH + files[i]));
      }
    }
  }

  load_current_background() {
    var that = this;
    $('#background').html('')
    let items = this.current_background.get_array();
    for(let i in items) {
      let item_html = `<tr class="play-item" data-id="${i}">
        <td>${parseInt(i)+1}</td>
        <td>
          <h5 class="ui header">
            ${path.basename(items[i])}
            <span class="ui mini label">${items[i].substr(0, items[i].lastIndexOf('/'))}</span>
          </h5>
        </td>
        <td>
          <button class='ui mini icon play button btn-background-play' data-id="${i}"> <i class='play icon'></i> </button>
          <button class='ui mini icon remove red button btn-background-remove' data-id="${i}"> <i class='trash icon'></i> </button>
        </td>
      </tr>`
      $('#background').append(item_html)
    }
    this.init_event()
    this.highlight_active()
  }

  addToCurrentPlaylist(filename){
    this.current_background.add_video(filename)
    this.save_backgrounds_to_storage()
    this.load_current_background()
  }

  save_backgrounds_to_storage() {
    for(let filename in this._items){
      let item = this._items[filename];
      jsonfile.writeFileSync(BACKGROUND_FILEPATH + filename, item.get_array())
    }
  }
}

module.exports = BackgroundManager