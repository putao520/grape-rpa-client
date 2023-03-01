const path = require("path");
const { windowManager } = require('../modules/windowManager');
const server = require("../../app/app");
require('./background')
require('../elementSelector/background')

let mainWindow;
function createMainWindow() {
    mainWindow = windowManager.main(
        "葡萄数字雇员",
        path.join(__dirname, 'preload.js'),
        undefined,
        undefined,
        ()=>{
            server.stop();
        }
    )
    server.setListenCallback(
        url=>mainWindow.loadURL(url).then(()=>{
            // Open the DevTools.
            if( process.env.NODE_ENV === 'development' ){
                mainWindow.webContents.openDevTools();
            }
        }),
        e=>console.log(e)
    )
}

module.exports = {
    mainWindow,
    createMainWindow
}
