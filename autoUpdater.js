const { app, autoUpdater, dialog } = require('electron')
const server = 'http://101.200.218.142:9008'
const url = `${server}/rpa`

autoUpdater.setFeedURL({ url })

setInterval(() => {
    autoUpdater.checkForUpdates()
}, 6000000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['重启', '稍后'],
        title: '更新提醒',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
            '新版本已经下载，是否线路重启应用程序完成更新？'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
            autoUpdater.quitAndInstall()
        }
    })
})

autoUpdater.on('error', (message) => {
    console.error('更新应用时发生错误', message)
    console.error(message)
})

module.exports = autoUpdater
