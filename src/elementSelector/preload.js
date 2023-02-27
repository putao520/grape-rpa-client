const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, './inject.min.js'), 'utf8');
// console.log(content);
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('rpa',  {
    onIpcMessage: fn => {
        ipcRenderer.on( "message#", (event,...args)=>{
            fn(...args)
        })
    },
    sendIpcMessage: (data, target = 'main') => {
        ipcRenderer.send("transfer-message", "message#", target, data)
    }
})

window.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('script')
    s.innerHTML = `${content}`;
    document.body.appendChild(s)
})
