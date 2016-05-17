const remote = require('electron').remote

// Handle content loading

function loadContent() {
  data = remote.getCurrentWindow().rendererSideName
  weapons = data['weapons']
  defaultweapon = weapons[0]
}

// Switch loading status

function switchLoading(id) {
  elem = document.getElementById(id)
  if (elem.style.zIndex != '') {
    elem.style.animation = null
    elem.style.zIndex = null
    elem.style.opacity = null
  } else {
    elem.style.opacity = '0.0'
    elem.style.animation = 'none'
    elem.style.zIndex = '-1'
  }
}
