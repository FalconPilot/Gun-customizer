const electron = require('electron')
const fs = require('fs')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

// Creating window

function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,
    title: 'Gun customizer',
    webPreferences: {

    }
  })
  win.loadURL('file://' + __dirname + '/index.html')
  win.webContents.openDevTools()
  win.on('closed', function() {
    app.quit()
  })
  loadParts()
}

// Parts loading

function loadParts() {
  gunsdir = __dirname + '/resources/guns'
  guns = getDirectories(gunsdir)
  for (i = 0; i < guns.length; i++) {
    console.log(guns[i])
  }
}

// Get directories

function getDirectories(src) {
  return fs.readdirSync(src).filter(function(file) {
    return fs.statSync(path.join(src, file)).isDirectory()
  })
}

// App event listeners

app.on('ready', function() {
  createWindow()
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
