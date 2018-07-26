const jsonfile = require('jsonfile');
const path = require('path');

class PlaylistManager{

  constructor(mgs) {

    this.PLAYLIST_FILEPATH = path.resolve(mgs.dm.document_path, 'playlist.js');
    let content = jsonfile.readFileSync(this.PLAYLIST_FILEPATH);
    for(var i in content) {
      this.add_item(content[i]);
    }

    this.init_event()
  }

  add_item(row)
  {
    let row_html = `
    <tr class="item" data-order="${row.order}">
      <td>${row.order}.</td>
      <td><i class="${this.cast_type_icon(row.type)} icon"></i></td>
      <td>${row.title}</td>
      <td class="action"></td>
    </tr>
    `;
    $('#playlist tbody').append(row_html);
  }

  cast_type_icon(type)
  {
    return {'PW':'cloud','Video':'video','Image':'image','Verse':'book'}[type];
  }

  init_event()
  {
    $('#playlist tr.item').dblclick(function(){
      $('#playlist tr.item td.action').html('');
      $(this).children('.action').html('<i class="play icon"></i>');
      $('#playlist tr.item').removeClass('attention');
      $(this).addClass('attention');
    });

    $('#playlist tr.item').click(function(){
      let order = $(this).data('order');
      let target_top = $("#info-s" + order).offset().top + $("#info").scrollTop();
      $('#playlist tr.item').removeClass('active');
      $(this).addClass('active');
      $('#info').animate({
        scrollTop: target_top
      }, 120);
    });
  }
}

module.exports = PlaylistManager