const ConfigManager = require('./../managers/ConfigManager.js');

class DocumentManager{

  constructor(mgs) {

    // inject managers
    this._configManager = new ConfigManager();

    // init
    this.init_document_path_config()
  }

  init_document_path_config()
  {
    if (!this._configManager.get_config('path_document')) {
      this.update_document_path_config()
    }
  }

  update_document_path_config()
  {
    const {dialog} = require('electron').remote;
    var path_document = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    this._configManager.set_config('path_document', path_document[0]);
  }

  get document_path()
  {
    return this._configManager.get_config('path_document');
  }

}

module.exports = DocumentManager