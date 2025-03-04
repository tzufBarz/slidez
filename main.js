const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 960, height: 540,
        webPreferences: {
            nodeIntegration: false, // Better security
            contextIsolation: true,
            preload: __dirname + '/preload.js' // Bridge between main and renderer
        }
    });
    mainWindow.loadFile('editor.html');
});

ipcMain.handle('save-file', async (event, filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});