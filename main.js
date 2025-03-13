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

ipcMain.handle('save-thumbnail', async (event, filePath, dataUrl) => {
    if (!dataUrl) return;
    try {
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        await fs.promises.writeFile(filePath, buffer);
        return { success: true, path: filePath };
    } catch (error) {
        console.error("Error saving thumbnail:", error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('remove-thumbnail', async (event, filePath) => {
    try {
        await fs.promises.unlink(filePath);
        return { success: true, path: filePath };
    } catch (error) {
        console.error("Error removing thumbnail:", error);
        return { success: false, error: error.message };
    }
});