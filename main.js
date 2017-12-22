const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const url = require('url')

let obj_wins = {
  'ctrl' : null,
  'show' : null
};

function createWindow () {

  // CTRL
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  obj_wins.ctrl = new BrowserWindow({
    x:0, y:0, width: width, height: height,
    icon: path.join(__dirname, 'icons/64x64.png')
  })

  obj_wins.ctrl.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  obj_wins.ctrl.webContents.openDevTools()
  obj_wins.ctrl.obj_wins = obj_wins;

  // Emitted when the window is closed.
  obj_wins.ctrl.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    obj_wins.ctrl = null
    app.exit(0);
  })

  obj_wins.show = new BrowserWindow({
    x:0, y:0,
    closable: false,
    // alwaysOnTop: true,
    focusable: false,
    webSecurity: false,
    show: false,
    hasShadow: false,
    resizable: false,
    frame: false,
    backgroundColor: '#000'
  })
  obj_wins.show.loadURL(url.format({
    pathname: path.resolve(app.getAppPath(), 'show.html'),
    protocol: 'file:',
    slashes: true
  }))
  obj_wins.show.webContents.openDevTools()

  obj_wins.show.on('closed', () => {
    obj_wins.show = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (obj_wins.ctrl === null) {
    createWindow()
  }
})
