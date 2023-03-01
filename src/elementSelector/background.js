const { ipcMain } = require('electron')
const { windowManager } = require('../modules/windowManager');
const { DebugWarp } = require('./extraTools');

ipcMain.on('send-tools-command', (event, command, ...args) =>{
    const target = 'elementSelector'
    const win = windowManager.get(target)
    DebugWarp(target).send(command, ...args).then(data=>{
        if( win ){
            win.webContents.send("tools#result", data)
        }
    })
})

/*
ipcMain.on('init-tools-command', (event) =>{
    DebugWarp('elementSelector')
})
*/
