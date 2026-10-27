const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("desktopShell",{platform:process.platform,version:"1.0.0"});
