const { ipcMain } = require('electron')
const path = require("path");
const { windowManager } = require('../modules/windowManager');

// 打开元素选择器
ipcMain.on('open-element-selector', (event, url, xpath, batchMode) => {
    windowManager.model('elementSelector',
        '元素选择器',
        url,
        path.join(__dirname, '../elementSelector/preload.js')
    ).then( win=>{

    })
})

// 转发消息
ipcMain.on('transfer-message', (event, channel, target, data ) => {
    const win = windowManager.get(target)
    if( win ){
       win.webContents.send(channel, data)
    }
})
