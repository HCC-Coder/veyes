const fs = require('fs')
const jsonfile = require('jsonfile')
const {app} = require('electron').remote

const CONFIG_FILEPATH = app.getPath('appData') + '/veyes-config.json'

class ConfigManager
{
    constructor()
    {
        if (!fs.existsSync(CONFIG_FILEPATH)) {
          jsonfile.writeFileSync(CONFIG_FILEPATH, {})
        }

        this._config = jsonfile.readFileSync(CONFIG_FILEPATH)
    }

    get_config(key, default_value)
    {
        default_value = default_value || null;
        return this._config[key] || default_value;
    }

    set_config(key, value)
    {
        this._config[key] = value;
        jsonfile.writeFileSync(CONFIG_FILEPATH, this._config)
    }
}
module.exports = ConfigManager