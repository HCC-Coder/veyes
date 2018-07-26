const fs = require('fs');
const path = require('path');
const $ = require('jquery')

class ThemeManager{

  constructor(mgs) {

    // CSS
    this.THEMECSS_FILEPATH = path.resolve(mgs.dm.document_path, 'theme.css');
    let content_css = fs.readFileSync(this.THEMECSS_FILEPATH, 'utf8');
    content_css = content_css.split('ASSET_PATH').join(mgs.dm.document_path);//.replace('ASSET_PATH', mgs.dm.document_path);
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = content_css;
    document.body.appendChild(css);

    this.THEMEHTML_FILEPATH = path.resolve(mgs.dm.document_path, 'theme.html');
    let content_html = fs.readFileSync(this.THEMEHTML_FILEPATH, 'utf8');
    content_html = content_html.split('ASSET_PATH').join(mgs.dm.document_path);
    $('#themes-container').html(content_html);

  }
}

module.exports = ThemeManager