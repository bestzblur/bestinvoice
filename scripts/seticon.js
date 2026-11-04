// Sets the Windows .exe icon and version info without needing Wine.
const ResEdit = require('resedit'); const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const exePath = path.join(root, 'release/Bestinvoice-win32-x64/Bestinvoice.exe');
const exe = ResEdit.NtExecutable.from(fs.readFileSync(exePath), { ignoreCert: true });
const res = ResEdit.NtExecutableResource.from(exe);
const ico = ResEdit.Data.IconFile.from(fs.readFileSync(path.join(root, 'electron/build/icon.ico')));
const groups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
const id = groups.length ? groups[0].id : 1, lang = groups.length ? groups[0].lang : 1033;
ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, id, lang, ico.icons.map(i => i.data));
const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];
if (vi) { vi.setStringValues({ lang: 1033, codepage: 1200 }, { ProductName: 'Bestinvoice', FileDescription: 'Bestinvoice', CompanyName: 'Bestinvoice', OriginalFilename: 'Bestinvoice.exe' }); vi.setFileVersion(1, 13, 0, 0, 1033); vi.setProductVersion(1, 13, 0, 0, 1033); vi.outputToResourceEntries(res.entries); }
res.outputResource(exe); fs.writeFileSync(exePath, Buffer.from(exe.generate()));
console.log('icon set');
