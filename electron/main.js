// Bestinvoice desktop shell (Windows + macOS)
const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('Bestinvoice');
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 1024, minHeight: 680,
    title: 'Bestinvoice', backgroundColor: '#F3F4F6',
    icon: path.join(__dirname, 'app', 'icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'default' : 'default',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: false, spellcheck: false }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  // links open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); } });
}

// Save PDF straight from the print layout
ipcMain.handle('save-pdf', async (_e, { name, widthMm, heightMm }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: path.join(app.getPath('documents'), name || 'Bestinvoice.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (canceled || !filePath) return false;
  const data = await win.webContents.printToPDF({
    printBackground: true, preferCSSPageSize: true, margins: { marginType: 'none' },
    pageSize: { width: widthMm / 25.4, height: heightMm / 25.4 }
  });
  fs.writeFileSync(filePath, data);
  shell.openPath(filePath);
  return true;
});

// Automatic backups: latest copy + one per day (keeps 30 days)
const backupDir = () => path.join(app.getPath('userData'), 'backups');
ipcMain.on('auto-backup', (_e, json) => {
  try {
    const dir = backupDir(); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'bestinvoice-latest.json'), json);
    const day = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(path.join(dir, `bestinvoice-${day}.json`), json);
    const old = fs.readdirSync(dir).filter(f => /^bestinvoice-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
    while (old.length > 30) fs.unlinkSync(path.join(dir, old.shift()));
  } catch (err) { /* never block the app on backup errors */ }
});
// Printing: list printers and print silently with the template's paper size (our own dialog shows the preview)
ipcMain.handle('get-printers', async () => { try { return await win.webContents.getPrintersAsync(); } catch (e) { return []; } });
ipcMain.handle('print', (_e, o = {}) => new Promise(resolve => {
  const opts = { silent: !o.dialog, printBackground: true, margins: { marginType: 'none' }, landscape: !!o.landscape, color: o.color !== false, copies: o.copies || 1, dpi: { horizontal: 600, vertical: 600 } };
  if (o.deviceName) opts.deviceName = o.deviceName;
  if (o.pageSize) opts.pageSize = o.pageSize;
  win.webContents.print(opts, (ok, reason) => resolve({ ok, reason }));
}));
ipcMain.handle('open-backups', () => { fs.mkdirSync(backupDir(), { recursive: true }); return shell.openPath(backupDir()); });

const isMac = process.platform === 'darwin';
const menu = Menu.buildFromTemplate([
  ...(isMac ? [{ role: 'appMenu' }] : []),
  { label: 'File', submenu: [
    { label: 'Open backup folder / เปิดโฟลเดอร์สำรองข้อมูล', click: () => { fs.mkdirSync(backupDir(), { recursive: true }); shell.openPath(backupDir()); } },
    { type: 'separator' }, isMac ? { role: 'close' } : { role: 'quit' }
  ] },
  { role: 'editMenu' },
  { label: 'View', submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, { role: 'reload' }] },
  { role: 'windowMenu' }
]);

app.whenReady().then(() => {
  Menu.setApplicationMenu(menu);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (!isMac) app.quit(); });
