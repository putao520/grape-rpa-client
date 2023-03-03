const {windowManager} = require("../modules/windowManager")

const DebuggerCache = {}
function DebugWarp(target){
    const debug = DebuggerCache[target] ?
        DebuggerCache[target] :
        windowManager.get(target).webContents.debugger
    this.send = (command, ...args) => {
        return debug.sendCommand(command, ...args)
    }
    if( !debug.isAttached() ){
        debug.attach()
    }
    return this
}

function extraFunctionRegister(win){
	const debug = win.webContents.debugger
	if( !debug.isAttached() ){
        debug.attach()
    }
    const map = []
    // getEventListeners
    map.push(debug.sendCommand('Runtime.evaluate',
        {
            expression: `window.getEventListeners = getEventListeners;`,
            includeCommandLineAPI: true,
        }
    ))
    // monitorEvents
    map.push(debug.sendCommand('Runtime.evaluate',
        {
            expression: `window.monitorEvents = monitorEvents;`,
            includeCommandLineAPI: true,
        }
    ))
    // unmonitorEvents
    map.push(debug.sendCommand('Runtime.evaluate',
        {
            expression: `window.unmonitorEvents = unmonitorEvents;`,
            includeCommandLineAPI: true,
        }
    ))
    Promise.all(map).then(arr=>{
        // console.log("赋能成功")
    })
}

module.exports = {
    DebugWarp,
	extraFunctionRegister
}
