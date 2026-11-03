const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('bestinvoiceNative', {
  platform: process.platform,
  savePDF: (name, widthMm, heightMm) => ipcRenderer.invoke('save-pdf', { name, widthMm, heightMm }),
  autoBackup: json => ipcRenderer.send('auto-backup', json),
  openBackups: () => ipcRenderer.invoke('open-backups')
});
