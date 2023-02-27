const localStore = require('../util/LocalStore');
const { screen } = require('electron')

function saveWindowsSize(name, win) {
    const size = win.getSize()
    localStore.set(`windows.${name}.width`, size[0]);
    localStore.set(`windows.${name}.height`, size[1]);
}

function loadWindowsSize(name) {
    return {
        width: localStore.get(`windows.${name}.width`) || screen.width/2,
        height: localStore.get(`windows.${name}.height`) || screen.height/2
    }
}

module.exports = {
    saveWindowsSize,
    loadWindowsSize
}
