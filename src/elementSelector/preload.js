const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, './inject.min.js'), 'utf8');

const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('rpa',  {
    onIpcMessage: fn => {
        ipcRenderer.on( "message#", (event,...args)=>{
            fn(...args)
        })
    },
    sendIpcMessage: (data, target = 'main') => {
        ipcRenderer.send("transfer-message", "message#", target, data)
    },
    extraToolsCommand: (cb, command, ...args) =>{
		ipcRenderer.once("tools#result", (event,...args)=>{
			cb(args[0])
		})
		ipcRenderer.send('send-tools-command', command, ...args)
    },
	/*
    extraToolsInit: () =>{
        ipcRenderer.send('init-tools-command')
    }
	*/
})

window.addEventListener('DOMContentLoaded', () => {
    // 注入脚本
    const s = document.createElement('script')
    s.innerHTML = `${content}`;
    document.body.appendChild(s)
})

