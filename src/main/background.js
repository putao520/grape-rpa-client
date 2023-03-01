const { ipcMain } = require('electron')
const path = require("path");
const { windowManager } = require('../modules/windowManager');
const { extraFunctionRegister } = require('../elementSelector/extraTools');

// 打开元素选择器
ipcMain.on('open-element-selector', (event, url, xpath, batchMode) => {
    windowManager.model('elementSelector',
        '元素选择器',
        url,
        path.join(__dirname, '../elementSelector/preload.js')
    ).then( win=>{
		// 初始化赋能
		extraFunctionRegister(win)
    })
})

// 转发消息
ipcMain.on('transfer-message', (event, channel, target, data ) => {
    const win = windowManager.get(target)
    if( win ){
       win.webContents.send(channel, data)
    }
})
