
const Playlist = require('./scripts/managers/Playlist.js')
const fs = require('fs');
const $ = require('jquery');
const electron = require('electron');
const jQuery = $;
require('./semantic/dist/semantic.min.js');

var file_list = new Playlist();

$(function(){
  init_files()
  init_semantic()
  init_show()
})

function init_show()
{
  $('#btn-detect').click(function(){

    const eScreen = electron.screen
    let displays = eScreen.getAllDisplays()

    $('#show-screen').html('');
    for (let i in displays) {
      let option_html = `<option> ${parseInt(i)+1}. ${displays[i].size.height} </option>`
      $('#show-screen').append(option_html)
    }
    console.log(displays);
  })
}

function init_semantic()
{
  $('.ui.dropdown').dropdown();
  $('.ui.progress').progress();
}

function init_files()
{
  fs.readdir('resources/videos', function(err, items) {
    for(var i in items)
    {
      if ($.inArray(items[i].split('.').pop(), ['mov', 'mp4']) == 1) {
        file_list.add_video(items[i]);
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

    $('#files .item.button').click(function(){
      console.log(file_list)
      $this = $(this);
      let item_html = `<tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>`
      $('#playlist').append(item_html)
    })
  })
}