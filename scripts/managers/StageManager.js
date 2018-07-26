
class StageManager{

  constructor() {
    this.theme = '';
  }

  setTheme(theme) {
    if (this.theme !== theme) {
      $('#themes-container .theme').hide();
      $('#themes-container #'+theme).show();
    }
  }

}

module.exports = StageManager