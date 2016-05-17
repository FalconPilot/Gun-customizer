const remote = require('electron').remote
const data = remote.getCurrentWindow().rendererSideName
const frame =   document.getElementById('frame')
const hub =     document.getElementById('hub')
const menu =    document.getElementById('menu')
const preview = document.getElementById('preview')
const list =    document.getElementById('sublist')
const loading = document.getElementById('loading')
const gunlist = document.getElementById('gunlist')
const button =  document.getElementById('change_gun')
const delay = getDelay()
const currentparts = []

// Get loading transition value

function getDelay() {
  style = window.getComputedStyle(loading).getPropertyValue('transition')
  str = style.split(' ')[1]
  value = parseInt(str.substring(0, str.length - 1).replace(/0./g, ''))
  return value *= 100
}

// Handle content loading

function loadContent() {
  weapons = data.weapons
  for (i = 0; i < weapons.length; i++) {
    option = document.createElement('option')
    option.value = i
    option.innerHTML = weapons[i].name.toUpperCase()
    gunlist.appendChild(option)
  }
  button.addEventListener("click", function() {
    switchLoading()
    setTimeout(function() {
      switchWeapon(document.getElementById('gunlist').value)
    }, delay)
  })
  switchWeapon(0)
}

// Parse piped parameters

function parseParams(args) {
  return args.split('|').slice(1)
}

// Switch part

function switchPart(args) {
  params = parseParams(args)
  wid = params[0]
  nid = params[1]
  pid = params[2]
  node = data.weapons[wid].nodelist[nid]
  part = node.partslist[pid]
  currentparts[nid] = pid
  img = document.getElementById("gun|" + node.name)
  img.src = part.src
}

// Switch preview

function switchPreview(args) {
  params = parseParams(args)
  wid = params[0]
  nid = params[1]
  pid = params[2]
  node = data.weapons[wid].nodelist[nid]
  img = document.getElementById('preview|' + node.name)
  oldpart = node.partslist[currentparts[nid]]
  newpart = node.partslist[pid]
  if (img.style.opacity === '') {
    img.style.opacity = '1.0'
    img.src = newpart.src
  } else {
    img.style.opacity = null
    img.src = oldpart.src
  }
}

// Switch node menu

function switchMenu(args) {
  list.innerHTML = ""
  params = parseParams(args)
  wid = params[0]
  nid = params[1]
  parts = data.weapons[wid].nodelist[nid].partslist
  for (i = 0; i < parts.length; i++) {
    item = document.createElement("div")
    item.id = "partswitch|" + wid + "|" + nid + "|" + i
    item.innerHTML = formatName(parts[i].name)
    item.addEventListener("click", function() {
      switchPart(this.id)
    })
    item.addEventListener("mouseover", function() {
      switchPreview(this.id)
    })
    item.addEventListener("mouseout", function() {
      switchPreview(this.id)
    })
    list.appendChild(item)
  }
}

// Load weapon

function switchWeapon(index) {
  frame.innerHTML = ""
  preview.innerHTML = ""
  weapon = data.weapons[index]
  for (i = 0; i < weapon.nodelist.length; i++) {
    node = weapon.nodelist[i]
    part = weapon.nodelist[i].partslist[0]
    img = document.createElement('img')
    preview_img = document.createElement('img')
    img.src = part.src
    preview_img.src = part.src
    img.style.zIndex = node.zlevel
    preview_img.style.zIndex = node.zlevel
    img.id = "gun|" + node.name
    preview_img.id = "preview|" + node.name
    currentparts.push(0)
    img.onload = function() {
      width = this.width
      height = this.height
      if (frame.style.width === '') {
        frame.style.width = width + "px"
        frame.style.height = height + "px"
      }
      preview_img = this.cloneNode(false)
      frame.appendChild(this)
    }
    preview_img.onload = function() {
      width = this.width
      height = this.height
      if (preview.style.width === '') {
        preview.style.width = width / 2 + "px"
        preview.style.height = height / 2 + "px"
        hub.style.height = height / 2 + "px"
        menu.style.width = "calc(80% - "  + width / 2 + "px)"
      }
      preview.appendChild(this)
    }
  }
  createMenu(index)
}

// Create parts menu

function createMenu(index) {
  menu.innerHTML = ""
  weapon = data.weapons[index]
  for (i = 0; i < weapon.nodelist.length; i++) {
    node = weapon.nodelist[i]
    item = document.createElement("div")
    item.innerHTML = formatName(node.name)
    item.className = "node_button"
    item.id = "nodeswitch|" + index + "|" + i
    item.addEventListener("click", function() {
      switchMenu(this.id)
    })
    menu.appendChild(item)
  }
  setTimeout(function() {
    switchLoading()
  }, 200)
}

// Format name

function formatName(string) {
  return string.replace(/_/g, ' ').toUpperCase()
}

// Switch loading status

function switchLoading() {
  nodes = loading.childNodes
  if (loading.style.zIndex != '') {
    loading.style.zIndex = null
    loading.style.opacity = null
    setTimeout(function() {
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType != 3) {
          nodes[i].style.animation = null
        }
      }
    }, delay)
  } else {
    loading.style.opacity = '0.0'
    setTimeout(function() {
      loading.style.zIndex = '-1'
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType != 3) {
          nodes[i].style.animation = 'none'
        }
      }
    }, delay)
  }
}

// Log all data

function logData() {
  weapons = data.weapons
  // Log weapons, nodes and parts
  for (i = 0; i < weapons.length; i++) {
    w_buff = weapons[i].nodelist
    console.log("|_Weapon : " + weapons[i].name)
    for (a = 0; a < w_buff.length; a++) {
      n_buff = w_buff[a].partslist
      console.log("|  |_Node : " + w_buff[a].name)
      for (b = 0; b < n_buff.length; b++) {
        console.log("|  |  |_Part : " + n_buff[b].name)
      }
      console.log("|  |")
    }
    console.log("|")
  }
  // Log current parts
  parts = currentparts
  for (i = 0; i < parts.length; i++) {
    console.log("Part at index " + i + " : " + parts[i])
  }
  console.log("Data log done !")
}
