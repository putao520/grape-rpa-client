const { BrowserWindow } = require('electron');



async function createModelWindow(name, title, url, preloader, width, height){
    let win2 = new BrowserWindow({
        width: width,
        height: height,
        frame: true,
        autoHideMenuBar: true,
        enableRemoteModule: true,
        parent: BrowserWindow.getFocusedWindow(),//父窗口
        modal: true,//开启父子窗口
        title: title,
        resizable: true,//用户是否可以自己调整窗口大小
        hasShadow: true,//窗口是否有阴影
        webPreferences: {
            devTools: process.env.NODE_ENV === 'development',//客户端是否可以打开开发者工具     (客户端快捷键：ctrl+shift+i)
            nodeIntegration: true,//开启node模块
            enableRemoteModule: true, // 使用remote模块     electron12版本之后废除了,需要自己安装
            // contextIsolation: true,
            //解决axios跨域请求      不推荐，不安全，但简单好用
            webSecurity: false,
            preload: preloader,
        },
    })
    win2.removeMenu()//去掉菜单栏
    //子窗口显示的页面路由    在这里路由是/test
    await win2.loadURL(url);
    if( process.env.NODE_ENV === 'development' ){
        win2.webContents.openDevTools();
    }
    win2.on('ready-to-show', () => {

    })
    win2.webContents.setWindowOpenHandler( details=>{
        win2.loadURL(details.url)
        return { action: 'deny' }
    })
    return win2
}

module.exports = {
    createModelWindow
}
