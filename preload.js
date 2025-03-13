const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data),
    saveThumbnail: (filePath, dataUrl) => ipcRenderer.invoke('save-thumbnail', filePath, dataUrl),
    removeThumbnail: (filePath) => ipcRenderer.invoke('remove-thumbnail', filePath)
});