const { ipcMain } = require('electron')

ipcMain.on('transfer-message', (event, channel, data) => {
    event.sender.send(channel, data)
})

module.export = ipcMain
