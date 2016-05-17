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
  loadContent()
}

function loadContent() {
  weapons = loadParts()
}

// Weapon object

function Weapon(name) {
  this.name = name
  this.nodelist = []
}

// Node object

function GunNode(name) {
  this.name = name
  this.partslist = []
}

// Part object

function GunPart(src) {
  this.name = src.split('/').reverse()[0].split('.')[0]
  this.src = src
}

// Parts loading

function loadParts() {
  gunsdir = __dirname + '/resources/guns'
  guns = getDirectories(gunsdir)
  weapons = []
  for (i = 0; i < guns.length; i++) {
    weapons.push(new Weapon(guns[i]))
    gunbuffer = weapons[i]
    subdir = gunsdir + '/' + guns[i]
    nodes = getDirectories(subdir)
    for (a = 0; a < nodes.length; a++) {
      gunbuffer.nodelist.push(new GunNode(nodes[a]))
      nodebuffer = gunbuffer.nodelist[a]
      partsdir = subdir + '/' + nodes[a]
      parts = getImages(partsdir)
      for (b = 0; b < parts.length; b++) {
        nodebuffer.partslist.push(new GunPart(partsdir + '/' + parts[b]))
      }
    }
  }
  return weapons
}

// Get directories

function getDirectories(src) {
  return fs.readdirSync(src).filter(function(file) {
    return fs.statSync(path.join(src, file)).isDirectory()
  })
}

// Get images

function getImages(src) {
  return fs.readdirSync(src).filter(function(file) {
    return file.slice(-4) === '.png'
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
