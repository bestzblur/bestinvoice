// Package the desktop app for Windows and macOS (run `npm run app` first).
// Needs: npm i -D @electron/packager@18 resedit@2
const path = require('path');
const { packager } = require('@electron/packager');
const root = path.join(__dirname, '..');
(async () => {
  for (const [platform, arch] of [['win32', 'x64'], ['darwin', 'arm64'], ['darwin', 'x64']]) {
    const out = await packager({
      dir: path.join(root, 'electron'), out: path.join(root, 'release'), overwrite: true,
      platform, arch, electronVersion: '33.4.11', name: 'Bestinvoice', executableName: 'Bestinvoice',
      appBundleId: 'com.bestinvoice.app', appCategoryType: 'public.app-category.business',
      icon: platform === 'darwin' ? path.join(root, 'electron/build/icon.icns') : undefined,
      ignore: [/^\/build($|\/)/, /^\/release($|\/)/, /^\/node_modules($|\/)/],
      asar: true, prune: false, appCopyright: 'Bestinvoice', appVersion: require('../electron/package.json').version,
      extendInfo: { NSCameraUsageDescription: 'Bestinvoice uses the camera to scan bill QR codes for verification.' },
      win32metadata: { CompanyName: 'Bestinvoice', FileDescription: 'Bestinvoice', ProductName: 'Bestinvoice', InternalName: 'Bestinvoice' }
    });
    console.log('built', out);
  }
})().catch(e => { console.error(e); process.exit(1); });
