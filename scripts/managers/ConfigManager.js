const fs = require('fs')
const jsonfile = require('jsonfile')
const {app} = require('electron').remote

/****
 *
 *  CONFIGURATION MANAGER
 *  persist a json file as app's configuration
 *
 **/

class ConfigManager
{
    constructor()
    {
        this.CONFIG_FILEPATH = app.getPath('appData') + '/veyes-config.json'

        if (!fs.existsSync(this.CONFIG_FILEPATH)) {
          jsonfile.writeFileSync(this.CONFIG_FILEPATH, {})
        }

        this._config = jsonfile.readFileSync(this.CONFIG_FILEPATH)
    }

    get_config(key, default_value)
    {
        default_value = default_value || null;
        return this._config[key] || default_value;
    }

    set_config(key, value)
    {
        this._config[key] = value;
        jsonfile.writeFileSync(this.CONFIG_FILEPATH, this._config)
    }
}
module.exports = ConfigManager