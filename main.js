const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200, height: 800,
        webPreferences: {
            nodeIntegration: false, // Better security
            contextIsolation: true,
            preload: __dirname + '/preload.js' // Bridge between main and renderer
        }
    });
    mainWindow.loadFile('editor.html');
});