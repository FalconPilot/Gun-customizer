const remote = require('electron').remote

// Handle content loading

function loadContent() {
  data = remote.getCurrentWindow().rendererSideName
  weapons = data['weapons']
  defaultweapon = weapons[0]
  logData(data)
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
