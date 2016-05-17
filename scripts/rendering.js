const remote = require('electron').remote
const data = remote.getCurrentWindow().rendererSideName
const frame = document.getElementById('frame')
const loading = document.getElementById('loading')
const gunlist = document.getElementById('gunlist')
const button = document.getElementById('change_gun')

// Handle content loading

function loadContent() {
  weapons = data['weapons']
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
    }, 600)
  })
  switchWeapon(0)
}


// Load default weapon

function switchWeapon(index) {
  frame.innerHTML = ""
  weapon = data['weapons'][index]
  for (i = 0; i < weapon.nodelist.length; i++) {
    part = weapon.nodelist[i].partslist[0]
    img = document.createElement('img')
    img.src = part.src
    img.style.zIndex = weapon.nodelist[i].zlevel
    img.onload = function() {
      if (frame.style.width === '') {
        frame.style.width = this.width + "px"
        frame.style.height = this.height + "px"
      }
      frame.appendChild(this)
    }
  }
  setTimeout(function() {
    switchLoading()
  }, 200)
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
    }, 600)
  } else {
    loading.style.opacity = '0.0'
    setTimeout(function() {
      loading.style.zIndex = '-1'
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType != 3) {
          nodes[i].style.animation = 'none'
        }
      }
    }, 600)
  }
}

// Log all data

function logData(data) {
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
  console.log("Data log done !")
}
