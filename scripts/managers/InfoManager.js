const jsonfile = require('jsonfile');
const path = require('path');

class InfoManager{

  constructor(mgs) {

    this.THEME_FILEPATH = path.resolve(mgs.dm.document_path, 'theme.js');
    this.theme_content = jsonfile.readFileSync(this.THEME_FILEPATH);

    this.INFO_FILEPATH = path.resolve(mgs.dm.document_path, 'info.js');
    let info_content = jsonfile.readFileSync(this.INFO_FILEPATH);
    for(var i in info_content) {
      if (info_content[i].type == "PW") {
        this.add_pw(info_content[i]);
      }
    }

    this._show_window = electron.remote.getCurrentWindow().obj_wins.show;


    this.init_event()
  }

  add_pw(content_pw)
  {
    let line_order = {order:0};

    let sectionates_html = '';

    if (content_pw.arrangement) {
      let content_arrangements = content_pw.arrangement;
      for(var i in content_arrangements) {
        sectionates_html += this.add_pw_section(content_arrangements[i], line_order);
      }
    }

    let row_html = `
      <section id="info-s${content_pw.order}" class="section" data-order="${content_pw.order}">
        <h1 class="zz-h1"> <i class="cloud icon"></i> ${content_pw.title} <span class="ui mini grey label">Default</span> </h1>
        <ul class="sectionate">
          ${sectionates_html}
        </ul>
      </section>
    `;
    $('#info').append(row_html);
  }

  add_pw_section(content_pw_arrangement, line_order)
  {

    let row_lines = '';
    for(var i in content_pw_arrangement.lyrics) {
      row_lines += this.add_pw_line(content_pw_arrangement.lyrics[i], line_order);
    }

    return `
    <li>
      <span>${content_pw_arrangement.section}</span>
      <ul>
        ${row_lines}
      </ul>
    </li>
    `;
  }

  add_pw_line(lyric, line_order)
  {
    let row_html = `
    <li class="item" data-lines="${lyric.join(',')}" data-line-order="${line_order.order++}">${lyric[0]} <br> ${lyric[1]}</li>
    `;
    return row_html;
  }

  cast_type_icon(type)
  {
    return {'PW':'cloud','Video':'video','Image':'image','Verse':'book'}[type];
  }

  init_event()
  {
    let that = this;
    $('#playlist tr.item').dblclick(function(){
      $('#playlist tr.item td.action').html('');
      $(this).children('.action').html('<i class="play icon"></i>');
      $('#playlist tr.item').removeClass('attention');
      $(this).addClass('attention');
    });

    $('#info li.item').click(function(){
      $('#info li.item').removeClass('active');
      $(this).addClass('active');
      let order = $(this).closest('section').data('order');
      let line_order = $(this).data('line-order');

      let theme = that.theme_content[order].slides[0];
      if (typeof that.theme_content[order].slides[line_order] != 'undefined') {
        theme = that.theme_content[order].slides[line_order];
      }

      let content = {
        "lines":$(this).data('lines').split(','),
        "theme":theme,
        "order":order,
        "line-order":line_order
      };
      that._show_window.webContents.send('slide', content)
    });
  }
}

module.exports = InfoManager