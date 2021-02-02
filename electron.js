const url = require("url")
const path = require("path")
const Electron = require("electron")

const frame = {
    "width": 500, // in pixels
    "height": 800, // in pixels
}

let browser = undefined
const file = url.format({
    "protocol": "file:", "slashes": true,
    "pathname": path.join(Electron.app.getAppPath(), "electron.html")
})

Electron.app.on("ready", function() {
    browser = new Electron.BrowserWindow({
        "width": frame.width, "height": frame.height,
        "webPreferences": {"webSecurity": false}
    })
    browser.on("closed", () => browser = undefined)
    browser.loadURL(file)
    browser.removeMenu()

    Electron.dialog.showOpenDialog({"properties": ["openFile"]}).then((response) => {
        if(response.canceled == true) return

        const filePath = response.filePaths[0]
        if(filePath == undefined) return

        process.chdir(path.dirname(filePath))
        require(filePath)
    })
})

Electron.app.on("window-all-closed", function() {
    Electron.app.quit()
})
