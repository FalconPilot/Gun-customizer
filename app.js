const electron      = require('electron')
const fs            = require('fs')
const path          = require('path')
const package       = require('./package.json')
const vocab         = require('./src/vocab.json')

const remote        = electron.remote
const app           = electron.app
const BrowserWindow = electron.BrowserWindow

let win

// Creating window

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    fullscreenable: true,
    title: package.productName,
    icon: __dirname + "/assets/misc/icon.png",
    webPreferences: {}
  })
  win.loadURL('file://' + __dirname + '/index.html')
  // win.webContents.openDevTools()
  win.on('closed', function() {
    app.quit()
  })
  finishLoading()
}

// Finish loading process

function finishLoading() {
  weapons = loadParts()
  data = new Data(weapons)
  win.rendererSideName = data
  win.webContents.on('did-finish-load', function() {
    win.webContents.executeJavaScript('initialize()')
  })
}

// Data object

function Data(weapons) {
  this.weapons = weapons
  this.pkg = package
  this.vocab = vocab
}

// Weapon object

function Weapon(name) {
  this.name = name
  this.nodelist = []
}

// Node object

function GunNode(name) {
  params = name.split('$')
  this.name = params[1]
  this.noderef = name
  this.zlevel = params[0]
  this.partslist = []
}

// Part object

function GunPart(src) {
  params = src.split('/').reverse()[0].split('.')[0].split('$')
  this.id = params[0]
  this.name = params[1]
  this.src = src
}

// Parts loading

function loadParts() {
  gunsdir = __dirname + '/assets/guns'
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
