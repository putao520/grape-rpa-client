'use strict';
const electron = require('electron');
const app = electron.app;
let {mainWindow, createMainWindow} = require('./src/main/main.js');

if (require('electron-squirrel-startup')) {
    app.quit();
}

if( app.isPackaged ){
    // 产品模式
    const autoUpdater = require('./autoUpdater')
}

app.commandLine.appendSwitch("--disable-http-cache");

// this should be placed at top of main.js to handle squirrel setup events quickly
if (handleSquirrelEvent()) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

if (!app.requestSingleInstanceLock()) {
  // 检测到本次未取得锁，即有已存在的实例在运行，则本次启动立即退出，不重复启动。
  app.quit()
}

function _quit(){
  if (process.platform !== 'darwin') {
    app.quit();
 }
}
/*
function quitApp(){
  server.stopServer().then(()=>{
    _quit();
  }).catch(e=>_quit())
}
*/
// Called when Electron has finished initialization and is ready to create browser windows.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    _quit();
});

app.on('activate', function() {
    if (mainWindow === null) {
        createMainWindow();
    }
});

///////////////////////////////////////////////////////
// All this Squirrel stuff is for the Windows installer
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  // const squirrelEvent = '--squirrel-install'
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
}
