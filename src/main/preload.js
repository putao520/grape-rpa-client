const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('rpa',  {
    openElementSelector: (url, xpath, batchMode) => {
        ipcRenderer.send('open-element-selector', url, xpath, batchMode)
    },
    onIpcMessage: fn => {
        ipcRenderer.on( "message#", (event, ...args) =>{
            fn(...args)
        } )
    },
    sendIpcMessage: (data, target = 'main') => {
        ipcRenderer.send("transfer-message", "message#", target, data)
    }
})


