const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data)
});