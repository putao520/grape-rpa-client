const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const { createModelWindow } = require('../util/modelWindow')
const {saveWindowsSize, loadWindowsSize} = require("../modules/windowsSize");
const path = require("path");
function windowManager(){
    const windows = {}
    this.model = async (name, title, url, preloader, width, height) => {
        const rect = loadWindowsSize(name);
        const win = await createModelWindow(name, title, url, preloader,
            width ? width : rect.width,
            height ? height : rect.height)
        win.on('close', () => {
            saveWindowsSize(name, win)
        })
        win.on('closed', () => {
            delete windows[name]
        })
        windows[name] = win
        return win
    }

    this.main = (title, preloader, width, height, closeCallback) => {
        const rect = loadWindowsSize('main');
        const mainWindow = new BrowserWindow({
            autoHideMenuBar: true,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                webSecurity: false,
                preload: preloader
            },
            title: title,
            fullscreenable: true,
            // titleBarStyle: "hidden",
            width: width ? width : rect.width,
            height: height ? height : rect.height,
            icon: __dirname + "/icon.ico"
        });
        mainWindow.on('close', function() {
            saveWindowsSize('main', mainWindow)
            if( closeCallback ){
                closeCallback()
            }
        });
        mainWindow.on('closed', function() {
            delete windows['main']
        });
        windows['main'] = mainWindow
        return mainWindow
    }

    this.getMainWindow = () => {
        return windows['main']
    }

    this.get = (name) => {
        return windows[name]
    }
}
const handle = new windowManager()
module.exports = {
    windowManager: handle
}
