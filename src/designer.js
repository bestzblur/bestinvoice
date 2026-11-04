/* Bestinvoice — drag & drop receipt designer */
const PX_MM = 96 / 25.4;
const D = { tplId: null, sel: null, multi: [], zoom: 'fit', z: 1, grid: true, undo: [], redo: [], docId: 'sample' };
const BLOCK_TYPES = [
  ['company', 'building', 90, 30, { nameSize: 13, showEn: true, showAddress: true, showTaxId: true, showContact: true, fit: true }],
  ['logo', 'logo', 22, 22, {}],
  ['title', 'heading', 60, 16, { fit: true, size: 16, bold: true, accentColor: true, align: 'right', copyTag: true }],
  ['docinfo', 'hash', 60, 20, { align: 'right', showDue: true, showRef: true }],
  ['customer', 'user', 110, 28, { fit: true }],
  ['items', 'table', 182, 80, { showUnit: true, showNo: true }],
  ['totals', 'sum', 64, 40, {}],
  ['words', 'words', 110, 10, { fit: true }],
  ['payment', 'card', 100, 8, {}],
  ['notes', 'note', 110, 20, { size: 8.5 }],
  ['signature', 'pen', 182, 28, { count: 2, labels: ['receiver', 'authorized'], dateLine: true }],
  ['text', 'type', 60, 12, { text: '' }],
  ['shape', 'shape', 80, 0.5, { kind: 'line', stroke: '#D0D5DB', thickness: 0.4 }],
  ['image', 'image', 30, 30, {}],
  ['extra', 'calendar', 70, 24, { fit: true }],
  ['qr', 'qr', 22, 26, { caption: true }]
];
const curTpl = () => S.templates.find(x => x.id === D.tplId) || S.templates[0];
const selBlock = () => curTpl().blocks.find(b => b.id === D.sel);
function previewDocument() { if (D.docId !== 'sample') { const d = S.documents.find(x => x.id === D.docId); if (d) return d; } const s = sampleDoc(curTpl()); s.docLang = S.settings.docLang; return s; }

function pushUndo() { const tp = curTpl(); D.undo.push(JSON.stringify(tp)); if (D.undo.length > 80) D.undo.shift(); D.redo = []; tp.edited = true; }
function applySnapshot(json) { const tp = curTpl(); const o = JSON.parse(json); Object.assign(tp, o); if (!tp.blocks.find(b => b.id === D.sel)) D.sel = null; save(); dRender(); }
function dUndo() { if (!D.undo.length) return; D.redo.push(JSON.stringify(curTpl())); applySnapshot(D.undo.pop()); }
function dRedo() { if (!D.redo.length) return; D.undo.push(JSON.stringify(curTpl())); applySnapshot(D.redo.pop()); }

function viewDesigner(c) {
  if (!S.templates.find(x => x.id === D.tplId)) { D.tplId = S.settings.defaultTemplate; if (!S.templates.find(x => x.id === D.tplId)) D.tplId = S.templates[0].id; D.undo = []; D.redo = []; }
  c.innerHTML = `<div class="designer">
    <div class="d-left">
      <h5>${t('blocks')}</h5>
      <div class="pal">${BLOCK_TYPES.map(([ty, icn]) => `<div class="pal-item" draggable="true" data-add="${ty}"><span class="ic">${ico(icn, 16)}</span><div><b>${t('b_' + ty)}</b><small>${t('b_' + ty + '_d')}</small></div></div>`).join('')}</div>
      <h5>${t('layers')}</h5><div class="layer-list" id="d-layers"></div>
    </div>
    <div class="d-center">
      <div class="d-toolbar" id="d-toolbar"></div>
      <div class="d-canvas-wrap" id="d-wrap"><div id="d-sizer" style="position:relative"><div class="d-stage" id="d-stage"></div></div></div>
    </div>
    <div class="d-right" id="d-props"></div>
  </div>`;
  wireDesigner();
  dRender();
}

function dToolbar() {
  const tp = curTpl(); const isDef = S.settings.defaultTemplate === tp.id;
  const docs = [...S.documents].sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);
  $('#d-toolbar').innerHTML = `
    <select class="inp sm" style="width:auto;max-width:200px;font-weight:600" id="d-tpl">${sel(S.templates.map(x => [x.id, x.name + (x.id === S.settings.defaultTemplate ? ' ★' : '')]), tp.id)}</select>
    <button class="btn sm" data-act="dnew">${ico('plus', 15)}${t('newTemplate')}</button>
    <button class="btn sm icon" data-act="dtplmenu" title="…">${ico('more', 16)}</button>
    ${isDef ? `<span class="type-tag" style="background:var(--accent-50);color:var(--accent-600)">★ ${t('isDefault')}</span>` : `<button class="btn sm" data-act="ddefault">★ ${t('setDefault')}</button>`}
    <span style="width:1px;height:22px;background:var(--border);margin:0 4px"></span>
    <button class="btn sm icon" data-act="dundo" title="${t('undo')} (Ctrl/⌘+Z)" ${D.undo.length ? '' : 'disabled'}>${ico('undo', 16)}</button>
    <button class="btn sm icon" data-act="dredo" title="${t('redo')}" ${D.redo.length ? '' : 'disabled'}>${ico('redo', 16)}</button>
    <select class="inp sm" style="width:auto" id="d-paper" title="${t('paper')}">${sel(Object.keys(PAPERS).map(k => [k, paperLabel(k)]), tp.paper)}</select>
    <select class="inp sm" style="width:auto" id="d-zoom" title="${t('zoom')}">${sel([['fit', t('zoom') + ': Fit'], ['0.5', '50%'], ['0.75', '75%'], ['1', '100%'], ['1.25', '125%'], ['1.5', '150%']], String(D.zoom))}</select>
    <label class="switch" style="font-size:12.5px"><input type="checkbox" id="d-grid" ${D.grid ? 'checked' : ''}><i></i>${t('showGrid')}</label>
    <div style="flex:1"></div>
    <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--text-2)">${t('previewWith')}
      <select class="inp sm" style="width:auto;max-width:190px" id="d-doc">${sel([['sample', t('sampleData')], ...docs.map(d => [d.id, d.number + ' · ' + (d.customer.name || '').slice(0, 22)])], D.docId)}</select></label>`;
}

function dLayers() {
  const tp = curTpl();
  $('#d-layers').innerHTML = [...tp.blocks].reverse().map(b => `<button data-layer="${b.id}" class="${b.id === D.sel || D.multi.includes(b.id) ? 'on' : ''}">${ico((BLOCK_TYPES.find(x => x[0] === b.type) || [])[1] || 'shape', 15)}${esc(t('b_' + b.type))}<span class="eye" data-eye="${b.id}">${ico(b.p.hidden ? 'eyeoff' : 'eye', 15)}</span></button>`).join('');
}

function dFit() {
  const tp = curTpl(); const [pw, ph] = PAPERS[tp.paper];
  const wrap = $('#d-wrap'); if (!wrap) return;
  D.z = D.zoom === 'fit' ? Math.min(1.4, (wrap.clientWidth - 64) / (pw * PX_MM), tp.paper === '80mm' ? 2 : 9) : +D.zoom;
  const stage = $('#d-stage'); stage.style.transform = `scale(${D.z})`; stage.style.transformOrigin = 'top left';
  const page = stage.querySelector('.page');
  $('#d-sizer').style.width = pw * PX_MM * D.z + 'px'; $('#d-sizer').style.height = (page ? page.offsetHeight : ph * PX_MM) * D.z + 'px';
}
window.dFit = dFit;

function dCanvas() {
  const tp = curTpl(); const doc = previewDocument();
  const stage = $('#d-stage');
  D.multi = D.multi.filter(id => tp.blocks.some(b => b.id === id));
  stage.innerHTML = renderPage(doc, tp, { design: true, selected: D.sel, multi: D.multi, grid: D.grid, copy: 'original' });
  applyFlow(stage.querySelector('.page'), { design: true });
  if (D.multi.length > 1) {
    const bs = tp.blocks.filter(b => D.multi.includes(b.id));
    const x1 = Math.min(...bs.map(b => b.x)), y1 = Math.min(...bs.map(b => b.y)), x2 = Math.max(...bs.map(b => b.x + b.w)), y2 = Math.max(...bs.map(b => b.y + b.h));
    const g = document.createElement('div'); g.id = 'd-groupbox'; g.style.cssText = `left:${x1}mm;top:${y1}mm;width:${x2 - x1}mm;height:${y2 - y1}mm`;
    g.innerHTML = `<span>${D.multi.length} ${LANG === 'th' ? 'กล่อง' : 'blocks'}</span>`; stage.appendChild(g);
  }
  const b = selBlock();
  if (b) {
    const box = document.createElement('div'); box.id = 'd-selbox';
    box.style.cssText = `position:absolute;left:${b.x}mm;top:${b.y}mm;width:${b.w}mm;height:${Math.max(b.h, .1)}mm;pointer-events:none;z-index:35`;
    box.innerHTML = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(d => `<div class="hd ${d}" data-hd="${d}" style="pointer-events:auto;transform:scale(${1 / D.z})"></div>`).join('');
    stage.appendChild(box);
  }
  dFit();
}

function dProps() {
  const tp = curTpl(); const b = selBlock(); const P = $('#d-props');
  if (D.multi.length > 1) {
    const btn = (k, ic, lab) => `<button class="btn sm" data-galign="${k}" title="${esc(lab)}">${ico(ic, 15)}${esc(lab)}</button>`;
    P.innerHTML = `<h5>${t('properties')}</h5>
      <div class="prop-group"><b>${D.multi.length} ${LANG === 'th' ? 'กล่องที่เลือก' : 'blocks selected'}</b><div class="hint">${t('groupHint')}</div></div>
      <div class="prop-group"><b>${t('alignGroup')}</b><div class="galign">
        ${btn('left', 'alignL', t('gaLeft'))}${btn('hcenter', 'alignC', t('gaHCenter'))}${btn('right', 'alignR', t('gaRight'))}
        ${btn('top', 'alignL', t('gaTop'))}${btn('vcenter', 'alignC', t('gaVCenter'))}${btn('bottom', 'alignR', t('gaBottom'))}
        ${D.multi.length > 2 ? btn('hdist', 'layout', t('gaHDist')) + btn('vdist', 'layout', t('gaVDist')) : ''}</div></div>
      <div class="prop-group"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><button class="btn sm" data-act="dgroupdup">${ico('copy', 15)}${t('duplicate')}</button><button class="btn sm danger" data-act="dgroupdel">${ico('trash', 15)}${t('delete')}</button></div></div>`;
    return;
  }
  const field = (label, html) => `<label class="field"><span>${label}</span>${html}</label>`;
  const numIn = (attr, key, val, step = 0.5) => `<input class="inp sm num" type="number" step="${step}" ${attr}="${key}" value="${val ?? ''}">`;
  const tog = (key, label, on) => `<label class="switch" style="margin-bottom:8px;font-size:12.5px"><input type="checkbox" data-pp="${key}" ${on ? 'checked' : ''}><i></i>${label}</label>`;
  const color = (attr, key, val, def) => `<div style="display:flex;gap:4px"><input type="color" class="inp" ${attr}="${key}" value="${/^#[0-9a-f]{6}$/i.test(val || '') ? val : def}"><button class="btn sm icon" title="Reset" data-reset="${attr}:${key}">↺</button></div>`;
  if (!b) {
    P.innerHTML = `<h5>${t('pageSettings')}</h5>
      <div class="prop-group"><div class="grid" style="gap:10px">
        ${field(t('templateName'), `<input class="inp sm" data-tp="name" value="${esc(tp.name)}">`)}
        <div class="field"><span>${t('paper')}</span><div class="papers">${Object.keys(PAPERS).map(k => { const [w, h] = PAPERS[k]; const sc = 34 / Math.max(w, h); return `<button class="paper-btn${tp.paper === k ? ' on' : ''}" data-paper="${k}" title="${esc(paperLabel(k))}"><i style="width:${Math.max(8, w * sc)}px;height:${Math.max(8, Math.min(h, k === '80mm' ? 300 : h) * sc)}px"></i><small>${esc(paperLabel(k).replace(/ \(.*\)/, ''))}</small></button>`; }).join('')}</div></div>
        ${field(LANG === 'th' ? 'รูปแบบหัวบิล' : 'Header style', `<select class="inp sm" data-tpstyle>${sel([['minimal', LANG === 'th' ? 'มินิมอล (ชิดซ้าย)' : 'Minimal (left)'], ['classic', LANG === 'th' ? 'คลาสสิก (กึ่งกลาง มีกรอบ)' : 'Classic (centered, boxed)'], ['band', LANG === 'th' ? 'แถบสีด้านบน' : 'Color band']], tp.style || 'minimal')}</select>`)}
        ${field(t('docLangTpl'), `<select class="inp sm" data-tpopt="docLang">${sel([['', t('followDoc')], ['th', t('langTh')], ['en', t('langEn')], ['both', t('langBoth')]], tp.docLang || '')}</select>`)}
        ${field(t('dateStyle'), `<select class="inp sm" data-tpopt="dateStyle">${sel([['', t('dsShort')], ['long', t('dsLong')]], tp.dateStyle || '')}</select>`)}
        <label class="switch" style="font-size:12.5px"><input type="checkbox" data-tpopt="intMoney" ${tp.intMoney ? 'checked' : ''}><i></i>${t('intMoney')}</label>
        <button class="btn sm" data-act="drelayout">${ico('layout', 15)}${t('relayout')}</button>
        <div class="prop-row">${field(t('accent'), `<input type="color" class="inp" data-tp="accent" value="${tp.accent}">`)}${field(t('baseSize'), numIn('data-tp', 'base', tp.base))}</div>
        <div class="field"><span>${t('docFont')}</span><div class="fonts">${Object.keys(FONTS).map(k => `<button class="font-btn${(tp.font || 'plex') === k ? ' on' : ''}" data-font="${k}" style="font-family:${FONTS[k]},sans-serif"><b>ใบเสร็จ 123</b><small>${FONT_LABELS[k]}</small></button>`).join('')}</div></div>
      </div></div>
      <div class="prop-group"><b>${t('extraFields')}</b>
        <div class="xf-list">${(tp.extraFields || []).map((f, i) => `<div class="xf-row" title=""><input class="inp sm" data-xf="${i}" data-xk="th" value="${esc(f.th)}" placeholder="ไทย"><input class="inp sm" data-xf="${i}" data-xk="en" value="${esc(f.en)}" placeholder="English"><select class="inp sm" data-xf="${i}" data-xk="type">${sel(EXTRA_TYPES.map(x => [x, t('ft_' + x)]), f.type)}</select><button class="menu-btn" data-xfdel="${i}" title="${t('delete')}">${ico('x', 14)}</button><label class="xf-hide"><input type="checkbox" data-xfhide="${i}" ${f.hidePrint ? 'checked' : ''}> ${t('hidePrintF')}</label></div>`).join('')}</div>
        <button class="btn sm" data-act="dxfadd" style="margin-top:6px">${ico('plus', 14)}${t('addField')}</button>
        <div class="hint" style="margin-top:8px">${LANG === 'th' ? 'ช่องเหล่านี้จะขึ้นให้กรอกตอนออกเอกสาร และแสดงในกล่อง “ข้อมูลเพิ่มเติม” บนหัวบิล' : 'These fields appear in the document editor and print in the “Extra details” block.'}</div></div>
      <div class="prop-group"><div class="hint">${ico('sparkle', 14)} ${t('selectHint')}</div></div>
      <div class="prop-group"><b>${t('tips')}</b><div class="hint">${t('tipText')}</div></div>`;
    return;
  }
  const p = b.p; let spec = '';
  const align = `<div class="align-btns">${[['left', 'alignL'], ['center', 'alignC'], ['right', 'alignR']].map(([v, i]) => `<button data-align="${v}" class="${(p.align || 'left') === v ? 'on' : ''}">${ico(i, 16)}</button>`).join('')}</div>`;
  switch (b.type) {
    case 'company': spec = `<div class="prop-row">${field(LANG === 'th' ? 'ขนาดชื่อบริษัท (pt)' : 'Company name size (pt)', numIn('data-pp', 'nameSize', p.nameSize || 13))}</div>${tog('showEn', t('showNameEn'), p.showEn !== false)}${tog('showAddress', t('showAddress'), p.showAddress !== false)}${tog('showTaxId', t('showTaxId'), p.showTaxId !== false)}${tog('showContact', t('showContact'), p.showContact !== false)}${tog('fit', t('autoFit'), p.fit)}<div class="hint">${t('longOk')}</div>`; break;
    case 'title': spec = `${field(t('customTitle'), `<input class="inp sm" data-pp="title" value="${esc(p.title || '')}">`)}<div style="height:8px"></div>${tog('accentColor', LANG === 'th' ? 'ใช้สีหลัก' : 'Use accent color', p.accentColor)}${tog('copyTag', t('showCopyTag'), p.copyTag)}`; break;
    case 'docinfo': spec = `${tog('showDue', t('showDue'), p.showDue !== false)}${tog('showRef', t('showRef'), p.showRef !== false)}${tog('inline', LANG === 'th' ? 'แสดงบรรทัดเดียว' : 'Single line', p.inline)}`; break;
    case 'customer': spec = field(t('label') + (LANG === 'th' ? ' (เว้นว่าง = อัตโนมัติ)' : ' (blank = automatic)'), `<input class="inp sm" data-pp="label" value="${esc(p.label || '')}">`); break;
    case 'notes': spec = field(t('label'), `<input class="inp sm" data-pp="label" value="${esc(p.label || '')}">`); break;
    case 'items': spec = `${p.stayQty ? `<div class="prop-row">${field(LANG === 'th' ? 'คำเรียกจำนวนคืน' : 'Word for nights', `<input class="inp sm" data-pp="nightWord" value="${esc(p.nightWord || '')}" placeholder="คืน">`)}</div>` : ''}${tog('stayQty', LANG === 'th' ? 'ช่องจำนวนแสดง “ห้อง / คืน” (โรงแรม)' : 'Qty cell shows rooms / nights (hotel)', p.stayQty)}${p.stayQty ? tog('hideNights', LANG === 'th' ? 'ไม่แสดงจำนวนคืนในตาราง (สรุปที่หัวบิล)' : 'Hide nights in the table (shown in header)', p.hideNights) : ''}${tog('autoSize', LANG === 'th' ? 'ปรับขนาดตัวอักษรตารางอัตโนมัติ (รายการน้อย = ตัวใหญ่)' : 'Auto-size table text (few items = larger)', p.autoSize)}${tog('bahtCol', LANG === 'th' ? 'คอลัมน์ “บาท” ท้ายตาราง' : '“THB” column at the end', p.bahtCol)}${tog('book', LANG === 'th' ? 'แบบสมุดใบเสร็จ (ไม่มีเส้นแถว, เส้นล่างสีหลัก)' : 'Receipt-book style', p.book)}<div class="prop-row">${field(t('headerColor'), color('data-pp', 'headerBg', resolveColor(p.headerBg, tp), tp.accent))}${field(t('color'), color('data-pp', 'headerText', p.headerText || onColor(resolveColor(p.headerBg, tp)), '#ffffff'))}</div><div class="prop-row">${field(t('minRows'), numIn('data-pp', 'minRows', p.minRows || 0, 1))}</div>${tog('showNo', t('showNo'), p.showNo !== false)}${tog('showUnit', t('showUnit'), p.showUnit !== false)}${tog('striped', t('striped'), p.striped)}${tog('grid', LANG === 'th' ? 'เส้นตารางทุกช่อง' : 'Cell borders', p.grid)}${tog('compact', LANG === 'th' ? 'แบบย่อ (สำหรับสลิป)' : 'Compact (for slips)', p.compact)}<div class="hint">${LANG === 'th' ? 'ถ้ารายการเยอะเกินกรอบ ตารางจะยืดลง และดันกล่องที่อยู่ด้านล่างลงให้อัตโนมัติ' : 'If items overflow, the table grows and pushes the blocks below it down automatically.'}</div>`; break;
    case 'totals': spec = field(LANG === 'th' ? 'รูปแบบ' : 'Style', `<select class="inp sm" data-pp="variant">${sel([['', LANG === 'th' ? 'รายการยอด + แถบยอดรวม' : 'Rows + total bar'], ['box', LANG === 'th' ? 'กรอบ “จำนวนเงิน … รวมเงิน … บาท”' : 'Box: amount in words … total']], p.variant || '')}</select>`) + '<div style="height:8px"></div>' + field(t('highlight'), color('data-pp', 'highlight', resolveColor(p.highlight, tp), tp.accent)); break;
    case 'signature': {
      const keys = ['receiver', 'payer', 'authorized', 'customerSign'];
      spec = field(t('sigCount'), `<select class="inp sm" data-pp="count" data-int>${sel([[1, '1'], [2, '2'], [3, '3'], [4, '4']], p.count || 2)}</select>`) + `<div style="height:8px"></div><b style="font-size:12px;color:var(--text-2)">${t('sigLabels')}</b>`;
      for (let i = 0; i < (p.count || 2); i++) { const v = (p.labels || [])[i] || 'receiver'; const isKey = keys.includes(v); spec += `<div style="display:flex;gap:4px;margin-top:6px"><select class="inp sm" data-siglabel="${i}" style="flex:1">${sel([...keys.map(k => [k, docL(k, LANG === 'en' ? 'en' : 'th')]), ['__custom', LANG === 'th' ? '✎ พิมพ์เอง…' : '✎ Custom…']], isKey ? v : '__custom')}</select></div>${isKey ? '' : `<input class="inp sm" style="margin-top:4px" data-sigtext="${i}" value="${esc(v)}">`}`; }
      spec += `<div style="height:10px"></div>${tog('dateLine', t('showDateLine'), p.dateLine)}${tog('useSig', t('useSigImg'), p.useSig)}`; break;
    }
    case 'text': spec = field(t('content'), `<textarea class="inp" rows="4" data-pptext>${esc(toReadable(p.text || '', LANG))}</textarea>`) + `<small style="font-size:11.5px;color:var(--muted)">${t('insertField')}</small><div class="chips">${FIELDS.map(f => `<button class="chip" data-field="${f[0]}">${esc(LANG === 'en' ? f[2] : f[1])}</button>`).join('')}</div>`; break;
    case 'shape': spec = `<div class="seg" style="margin-bottom:10px"><button data-kind="line" class="${p.kind === 'line' ? 'on' : ''}">${t('line')}</button><button data-kind="rect" class="${p.kind !== 'line' ? 'on' : ''}">${t('rect')}</button></div>
      <div class="prop-row">${field(t('stroke'), color('data-pp', 'stroke', p.stroke, '#d0d5db'))}${field(t('thickness'), numIn('data-pp', 'thickness', p.thickness ?? .3, .1))}</div>
      ${p.kind !== 'line' ? `<div class="prop-row">${field(t('fill'), color('data-pp', 'fill', p.fill, '#f1f8f6'))}${field(t('radius'), numIn('data-pp', 'radius', p.radius || 0, .5))}</div>${tog('accentFill', LANG === 'th' ? 'ใช้สีหลักเป็นสีเติม' : 'Fill with accent color', p.accentFill)}` : tog('dashed', LANG === 'th' ? 'เส้นประ' : 'Dashed', p.dashed)}`; break;
    case 'image': spec = `<button class="btn sm" data-act="dimg">${ico('upload', 15)}${t('chooseImage')}</button>`; break;
    case 'qr': spec = `<label class="switch" style="margin-bottom:8px;font-size:12.5px"><input type="checkbox" data-dsqr ${S.settings.showQR !== false ? 'checked' : ''}><i></i>${t('showQR')}</label>${tog('caption', t('showCaption'), p.caption !== false)}<div class="hint" style="margin-bottom:8px">${t('qrHowTo')}</div><div class="hint">${t('verifyHint')}</div>`; break;
    case 'logo': spec = `<div class="hint">${LANG === 'th' ? 'เปลี่ยนโลโก้ได้ที่หน้า ตั้งค่า › ข้อมูลบริษัท' : 'Change the logo in Settings › Company'}</div>`; break;
  }
  P.innerHTML = `<h5>${t('properties')}</h5>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span class="av" style="border-radius:9px;width:30px;height:30px">${ico((BLOCK_TYPES.find(x => x[0] === b.type) || [])[1], 15)}</span><div><b style="font-size:14px">${t('b_' + b.type)}</b><div style="font-size:11.5px;color:var(--muted)">${t('b_' + b.type + '_d')}</div></div></div>
    ${spec ? `<div class="prop-group">${spec}</div>` : ''}
    <div class="prop-group"><b>${t('text')}</b>
      <div class="prop-row">${field(t('fontSize'), numIn('data-pp', 'size', p.size || tp.base))}${field(t('color'), color('data-pp', 'color', p.color, '#111111'))}</div>
      ${field(t('blockFont'), `<select class="inp sm" data-pp="font">${sel([['', t('followTpl')], ...Object.keys(FONTS).map(k => [k, FONT_LABELS[k]])], p.font || '')}</select>`)}<div style="height:8px"></div>
      ${field(t('align'), align)}<div style="height:8px"></div>${tog('bold', t('bold'), p.bold)}${b.type === 'words' ? tog('alignGrand', t('alignGrand'), p.alignGrand) : ''}${b.type === 'notes' || b.type === 'payment' ? tog('follow', t('followWords'), p.follow === 'words') : ''}
    </div>
    <div class="prop-group"><b>${LANG === 'th' ? 'กรอบและพื้นหลัง' : 'Box & background'}</b>
      <div class="prop-row">${field(t('bg'), color('data-pp', 'bg', p.bg === 'accent' ? tp.accent : p.bg, '#ffffff'))}${field(t('padding'), numIn('data-pp', 'pad', p.pad || 0))}</div>
      <div class="prop-row">${field(t('radius'), numIn('data-pp', 'radius', p.radius || 0))}</div>${tog('border', t('border'), p.border)}
    </div>
    <div class="prop-group"><b>${t('position')}</b>
      <div class="prop-row">${field(t('posX'), numIn('data-dp', 'x', b.x))}${field(t('posY'), numIn('data-dp', 'y', b.y))}</div>
      <div class="prop-row">${field(t('width'), numIn('data-dp', 'w', b.w))}${field(t('height'), numIn('data-dp', 'h', b.h))}</div>
    </div>
    <div class="prop-group">${tog('hidden', t('hideOnDoc'), p.hidden)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
        <button class="btn sm" data-act="dfront">${ico('layers', 15)}${t('bringFront')}</button><button class="btn sm" data-act="dback">${t('sendBack')}</button>
        <button class="btn sm" data-act="ddup">${ico('copy', 15)}${t('duplicate')}</button><button class="btn sm danger" data-act="ddel">${ico('trash', 15)}${t('delete')}</button>
      </div></div>`;
}

function toggleMulti(id) {
  const set = new Set(D.multi.length ? D.multi : (D.sel ? [D.sel] : []));
  set.has(id) ? set.delete(id) : set.add(id);
  D.multi = [...set]; D.sel = D.multi.length === 1 ? D.multi[0] : null; if (D.multi.length < 2) D.multi = [];
}
const pageMm = ev => { const r = $('#d-stage .page').getBoundingClientRect(); return { x: (ev.clientX - r.left) / (PX_MM * D.z), y: (ev.clientY - r.top) / (PX_MM * D.z) }; };
function startMarquee(e, additive) {
  const tp = curTpl(), st = $('#d-stage'), p0 = pageMm(e); let mq = null, moved = false;
  const base = additive ? (D.multi.length ? D.multi : (D.sel ? [D.sel] : [])) : [];
  const hits = (a) => tp.blocks.filter(b => { const x1 = Math.min(p0.x, a.x), x2 = Math.max(p0.x, a.x), y1 = Math.min(p0.y, a.y), y2 = Math.max(p0.y, a.y);
    const inter = b.x < x2 && b.x + b.w > x1 && b.y < y2 && b.y + Math.max(b.h, .5) > y1;
    const contains = b.x <= x1 && b.x + b.w >= x2 && b.y <= y1 && b.y + b.h >= y2; // e.g. a background band under the marquee
    return inter && !contains; }).map(b => b.id);
  const move = ev => {
    const p = pageMm(ev); if (!moved && Math.abs(p.x - p0.x) + Math.abs(p.y - p0.y) < 1) return;
    if (!mq) { mq = document.createElement('div'); mq.className = 'marquee'; st.appendChild(mq); moved = true; }
    mq.style.cssText = `left:${Math.min(p0.x, p.x)}mm;top:${Math.min(p0.y, p.y)}mm;width:${Math.abs(p.x - p0.x)}mm;height:${Math.abs(p.y - p0.y)}mm`;
    const ids = new Set([...base, ...hits(p)]);
    $$('#d-stage .blk').forEach(el => el.classList.toggle('sel', ids.has(el.dataset.id)));
  };
  const up = ev => {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up);
    if (!moved) { if (D.sel || D.multi.length) { D.sel = null; D.multi = []; dRender(); } return; }
    const ids = [...new Set([...base, ...hits(pageMm(ev))])];
    D.multi = ids.length > 1 ? ids : []; D.sel = ids.length === 1 ? ids[0] : null; dRender();
  };
  addEventListener('pointermove', move); addEventListener('pointerup', up);
}
function startGroupDrag(e) {
  const tp = curTpl(); const bs = tp.blocks.filter(b => D.multi.includes(b.id)); const orig = bs.map(b => ({ b, x: b.x, y: b.y }));
  const p0 = { x: e.clientX, y: e.clientY }; let moved = false;
  const els = bs.map(b => $(`#d-stage .blk[data-id="${b.id}"]`)); const g = $('#d-groupbox'); const g0 = g ? { l: parseFloat(g.style.left), t: parseFloat(g.style.top) } : null;
  const move = ev => {
    let dx = (ev.clientX - p0.x) / (PX_MM * D.z), dy = (ev.clientY - p0.y) / (PX_MM * D.z);
    if (!moved && Math.abs(dx) + Math.abs(dy) < .4) return;
    if (!moved) { moved = true; pushUndo(); bs.forEach(b => { b.p.alignGrand = false; b.p.follow = ''; b.p.attach = ''; }); }
    if (!ev.altKey) { dx = Math.round(dx * 2) / 2; dy = Math.round(dy * 2) / 2; }
    orig.forEach((o, i) => { o.b.x = r2(o.x + dx); o.b.y = r2(o.y + dy); if (els[i]) { els[i].style.left = o.b.x + 'mm'; els[i].style.top = o.b.y + 'mm'; } });
    if (g) { g.style.left = (g0.l + dx) + 'mm'; g.style.top = (g0.t + dy) + 'mm'; }
  };
  const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (moved) { save(); dCanvas(); dProps(); dToolbar(); } };
  addEventListener('pointermove', move); addEventListener('pointerup', up);
}
function groupAlign(how) {
  const tp = curTpl(); const bs = tp.blocks.filter(b => D.multi.includes(b.id)); if (bs.length < 2) return;
  pushUndo();
  const x1 = Math.min(...bs.map(b => b.x)), x2 = Math.max(...bs.map(b => b.x + b.w)), y1 = Math.min(...bs.map(b => b.y)), y2 = Math.max(...bs.map(b => b.y + b.h));
  for (const b of bs) {
    if (how === 'left') b.x = x1; if (how === 'right') b.x = r2(x2 - b.w); if (how === 'hcenter') b.x = r2((x1 + x2) / 2 - b.w / 2);
    if (how === 'top') b.y = y1; if (how === 'bottom') b.y = r2(y2 - b.h); if (how === 'vcenter') b.y = r2((y1 + y2) / 2 - b.h / 2);
    b.p.alignGrand = false; b.p.follow = ''; b.p.attach = '';
  }
  if (how === 'hdist' || how === 'vdist') {
    const k = how === 'hdist' ? 'x' : 'y', s = how === 'hdist' ? 'w' : 'h'; const sorted = [...bs].sort((a, b) => a[k] - b[k]);
    const total = sorted.reduce((a, b) => a + b[s], 0), span = (how === 'hdist' ? x2 - x1 : y2 - y1), gap = (span - total) / (sorted.length - 1);
    let pos = how === 'hdist' ? x1 : y1; for (const b of sorted) { b[k] = r2(pos); pos += b[s] + gap; }
  }
  save(); dRender();
}
function changePaper(paper) {
  const tp = curTpl(); if (tp.paper === paper) return;
  pushUndo(); autoLayout(tp, paper); D.sel = null; save(); dRender(); toast(t('autoLayoutHint'));
}
function setTplStyle(tp, st) {
  tp.style = st;
  const band = tp.blocks.find(b => b.type === 'shape' && b.p.role === 'band'), div = tp.blocks.find(b => b.type === 'shape' && b.p.role === 'divider');
  if (st === 'band' && !band) tp.blocks.unshift(B('shape', 0, 0, 1, 1, { kind: 'rect', accentFill: true, thickness: 0, stroke: 'transparent', role: 'band' }));
  if (st !== 'band' && band) { tp.blocks = tp.blocks.filter(b => b !== band); for (const b of tp.blocks) if (b.type === 'company' || b.type === 'title') delete b.p.color; }
  if (st !== 'band' && !div) tp.blocks.push(B('shape', 0, 0, 1, 1, { kind: 'line', stroke: st === 'classic' ? tp.accent : '#E3E6EA', thickness: .4, role: 'divider' }));
  if (st === 'band' && div) tp.blocks = tp.blocks.filter(b => b !== div);
  for (const b of tp.blocks) { if (b.type === 'title') b.p.accentColor = st !== 'band'; if ((b.type === 'customer' || b.type === 'docinfo' || b.type === 'extra') && st !== 'classic') { b.p.border = false; b.p.pad = b.type === 'extra' ? 2 : 0; } }
  autoLayout(tp);
}
function dRender() { dToolbar(); dLayers(); dCanvas(); dProps(); }
function dRefresh() { save(); dLayers(); dCanvas(); }

function addBlock(type, x, y) {
  const spec = BLOCK_TYPES.find(b => b[0] === type); const tp = curTpl(); const [pw, ph] = PAPERS[tp.paper];
  pushUndo();
  const w = Math.min(spec[2], pw - 8), h = spec[3];
  const b = { id: uid(), type, x: Math.max(0, Math.min(pw - w, Math.round(x ?? (pw - w) / 2))), y: Math.max(0, Math.min(ph - h, Math.round(y ?? 40))), w, h, p: clone(spec[4]) };
  tp.blocks.push(b); D.sel = b.id; save(); dRender();
}

function snapCandidates(tp, skipId) {
  const [pw, ph] = PAPERS[tp.paper]; const xs = [0, pw / 2, pw, 14, pw - 14], ys = [0, ph / 2, ph, 14, ph - 14];
  for (const o of tp.blocks) if (o.id !== skipId && !(o.p && o.p.hidden)) { xs.push(o.x, o.x + o.w / 2, o.x + o.w); ys.push(o.y, o.y + o.h / 2, o.y + o.h); }
  return { xs, ys };
}
function showGuides(gx, gy) {
  $$('#d-stage .guide').forEach(g => g.remove());
  const st = $('#d-stage');
  for (const x of gx) { const g = document.createElement('div'); g.className = 'guide v'; g.style.left = x + 'mm'; st.appendChild(g); }
  for (const y of gy) { const g = document.createElement('div'); g.className = 'guide h'; g.style.top = y + 'mm'; st.appendChild(g); }
}

function wireDesigner() {
  const wrap = $('#d-wrap');
  // palette drag & click
  $$('.pal-item').forEach(el => {
    el.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', 'bi-block:' + el.dataset.add); e.dataTransfer.effectAllowed = 'copy'; });
    el.addEventListener('click', () => addBlock(el.dataset.add));
  });
  wrap.addEventListener('dragover', e => { e.preventDefault(); $('#d-stage').classList.add('dragover'); });
  wrap.addEventListener('dragleave', e => { if (!wrap.contains(e.relatedTarget)) $('#d-stage').classList.remove('dragover'); });
  wrap.addEventListener('drop', e => {
    e.preventDefault(); $('#d-stage').classList.remove('dragover');
    const v = e.dataTransfer.getData('text/plain'); if (!v.startsWith('bi-block:')) return;
    const type = v.slice(9); const r = $('#d-stage .page').getBoundingClientRect(); const spec = BLOCK_TYPES.find(b => b[0] === type);
    addBlock(type, (e.clientX - r.left) / (PX_MM * D.z) - spec[2] / 2, (e.clientY - r.top) / (PX_MM * D.z) - spec[3] / 2);
  });

  // pointer: select / move / resize
  wrap.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const hd = e.target.closest('.hd'); const blkEl = e.target.closest('#d-stage .blk');
    const tp = curTpl();
    if (!hd && !blkEl) { // rubber-band selection on empty space
      if (!(e.target.closest('#d-stage') || e.target === wrap || e.target.id === 'd-sizer')) return;
      e.preventDefault(); startMarquee(e, e.shiftKey || e.ctrlKey || e.metaKey); return;
    }
    if (blkEl && !hd && (e.shiftKey || e.ctrlKey || e.metaKey)) { e.preventDefault(); toggleMulti(blkEl.dataset.id); dRender(); return; }
    if (blkEl && !hd && D.multi.length > 1 && D.multi.includes(blkEl.dataset.id)) { e.preventDefault(); startGroupDrag(e); return; }
    if (blkEl && !hd && (blkEl.dataset.id !== D.sel || D.multi.length)) { D.sel = blkEl.dataset.id; D.multi = []; dLayers(); dProps(); dCanvas(); }
    const b = selBlock(); if (!b) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY, b: { ...b } }; const dir = hd ? hd.dataset.hd : null;
    const [pw, ph] = PAPERS[tp.paper]; const cand = snapCandidates(tp, b.id); let moved = false;
    const el = $(`#d-stage .blk[data-id="${b.id}"]`), box = $('#d-selbox');
    const move = ev => {
      const dx = (ev.clientX - start.x) / (PX_MM * D.z), dy = (ev.clientY - start.y) / (PX_MM * D.z);
      if (!moved && Math.abs(dx) + Math.abs(dy) < .4) return;
      if (!moved) { moved = true; pushUndo(); if (b.p.alignGrand) b.p.alignGrand = false; if (b.p.follow) b.p.follow = ''; if (b.p.attach && !dir) b.p.attach = ''; }
      const snap = !ev.altKey; const rnd = v => snap ? Math.round(v * 2) / 2 : Math.round(v * 10) / 10;
      let { x, y, w, h } = start.b; const gx = [], gy = [];
      if (!dir) {
        x = rnd(x + dx); y = rnd(y + dy);
        if (snap) {
          for (const [off, k] of [[0, 'l'], [w / 2, 'c'], [w, 'r']]) { const hit = cand.xs.find(c => Math.abs(c - (x + off)) < 1.5); if (hit !== undefined) { x = hit - off; gx.push(hit); break; } }
          for (const off of [0, h / 2, h]) { const hit = cand.ys.find(c => Math.abs(c - (y + off)) < 1.5); if (hit !== undefined) { y = hit - off; gy.push(hit); break; } }
        }
        x = Math.max(-w + 5, Math.min(pw - 5, x)); y = Math.max(-h + 2, Math.min(ph - 2, y));
      } else {
        if (dir.includes('e')) w = Math.max(3, rnd(w + dx));
        if (dir.includes('s')) h = Math.max(b.type === 'shape' ? .1 : 3, rnd(h + dy));
        if (dir.includes('w')) { const nx = rnd(x + dx); w = Math.max(3, w + (x - nx)); x = nx; }
        if (dir.includes('n')) { const ny = rnd(y + dy); h = Math.max(3, h + (y - ny)); y = ny; }
        if (snap) {
          if (dir.includes('e')) { const hit = cand.xs.find(c => Math.abs(c - (x + w)) < 1.5); if (hit !== undefined) { w = hit - x; gx.push(hit); } }
          if (dir.includes('s')) { const hit = cand.ys.find(c => Math.abs(c - (y + h)) < 1.5); if (hit !== undefined) { h = hit - y; gy.push(hit); } }
        }
      }
      Object.assign(b, { x: r2(x), y: r2(y), w: r2(w), h: r2(h) });
      for (const n of [el, box]) if (n) { n.style.left = b.x + 'mm'; n.style.top = b.y + 'mm'; n.style.width = b.w + 'mm'; n.style.height = Math.max(b.h, .1) + 'mm'; }
      showGuides(gx, gy);
    };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); showGuides([], []); if (moved) { save(); dCanvas(); dProps(); dToolbar(); } };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
  });

  // toolbar + props + layers (delegated, re-bound each render via container listeners)
  const center = $('.d-center'), props = $('#d-props'), left = $('.d-left');
  center.addEventListener('change', e => {
    if (e.target.id === 'd-tpl') { D.tplId = e.target.value; D.sel = null; D.undo = []; D.redo = []; dRender(); }
    if (e.target.id === 'd-paper') { changePaper(e.target.value); return; }
    if (e.target.id === 'd-zoom') { D.zoom = e.target.value === 'fit' ? 'fit' : +e.target.value; dFit(); }
    if (e.target.id === 'd-grid') { D.grid = e.target.checked; dCanvas(); }
    if (e.target.id === 'd-doc') { D.docId = e.target.value; dCanvas(); }
  });
  left.addEventListener('click', e => {
    const eye = e.target.closest('[data-eye]'); if (eye) { e.stopPropagation(); pushUndo(); const b = curTpl().blocks.find(x => x.id === eye.dataset.eye); b.p.hidden = !b.p.hidden; dRefresh(); dProps(); return; }
    const ly = e.target.closest('[data-layer]'); if (ly) { if (e.shiftKey || e.ctrlKey || e.metaKey) toggleMulti(ly.dataset.layer); else { D.sel = ly.dataset.layer; D.multi = []; } dRender(); }
  });
  let undoArmed = true;
  props.addEventListener('focusin', e => { if (e.target.matches('input,textarea,select')) undoArmed = true; });
  const armUndo = () => { if (undoArmed) { pushUndo(); undoArmed = false; } };
  props.addEventListener('input', e => {
    const el = e.target, tp = curTpl(), b = selBlock();
    if (el.dataset.xf !== undefined && el.tagName !== 'SELECT') { armUndo(); tp.extraFields[+el.dataset.xf][el.dataset.xk] = el.value; dRefresh(); return; }
    if (el.dataset.tp) { armUndo(); tp[el.dataset.tp] = el.dataset.tp === 'base' ? num(el.value) || 9 : el.value; if (el.dataset.tp === 'name') { save(); dToolbar(); return; } dRefresh(); return; }
    if (!b) return;
    if (el.dataset.dp) { armUndo(); b[el.dataset.dp] = num(el.value); dRefresh(); return; }
    if (el.dataset.pptext !== undefined) { armUndo(); b.p.text = toCanonical(el.value); dRefresh(); return; }
    if (el.dataset.sigtext !== undefined) { armUndo(); b.p.labels = b.p.labels || []; b.p.labels[+el.dataset.sigtext] = el.value || ' '; dRefresh(); return; }
    if (el.dataset.pp && el.type !== 'checkbox' && el.tagName !== 'SELECT') { armUndo(); const k = el.dataset.pp; b.p[k] = el.type === 'number' ? num(el.value) : el.value; dRefresh(); }
  });
  props.addEventListener('change', e => {
    const el = e.target, b = selBlock();
    if (el.dataset.tpopt) { pushUndo(); const tp = curTpl(); tp[el.dataset.tpopt] = el.type === 'checkbox' ? el.checked : el.value; save(); dRender(); return; }
    if (el.dataset.xfhide !== undefined) { pushUndo(); curTpl().extraFields[+el.dataset.xfhide].hidePrint = el.checked; dRefresh(); return; }
    if (el.dataset.xf !== undefined && el.tagName === 'SELECT') { pushUndo(); curTpl().extraFields[+el.dataset.xf].type = el.value; dRefresh(); return; }
    if (el.dataset.tpstyle !== undefined) { pushUndo(); setTplStyle(curTpl(), el.value); save(); dRender(); return; }
    if (!b) return;
    if (el.type === 'checkbox' && el.dataset.pp) { pushUndo(); b.p[el.dataset.pp] = el.dataset.pp === 'follow' ? (el.checked ? 'words' : '') : el.checked; dRefresh(); if (el.dataset.pp === 'hidden') dLayers(); return; }
    if (el.tagName === 'SELECT' && el.dataset.pp) { pushUndo(); b.p[el.dataset.pp] = el.dataset.int !== undefined ? +el.value : el.value; if (el.dataset.pp === 'count') { b.p.labels = b.p.labels || []; while (b.p.labels.length < b.p.count) b.p.labels.push('receiver'); } dRefresh(); dProps(); return; }
    if (el.dataset.siglabel !== undefined) { pushUndo(); b.p.labels = b.p.labels || []; b.p.labels[+el.dataset.siglabel] = el.value === '__custom' ? (LANG === 'th' ? 'ลงชื่อ' : 'Signature') : el.value; dRefresh(); dProps(); }
  });
  props.addEventListener('click', e => {
    const b = selBlock(); const tp = curTpl();
    const ga = e.target.closest('[data-galign]'); if (ga) { groupAlign(ga.dataset.galign); return; }
    const pb = e.target.closest('[data-paper]'); if (pb) { changePaper(pb.dataset.paper); return; }
    const fb = e.target.closest('[data-font]'); if (fb) { pushUndo(); tp.font = fb.dataset.font; save(); dRender(); return; }
    const xd = e.target.closest('[data-xfdel]'); if (xd) { pushUndo(); tp.extraFields.splice(+xd.dataset.xfdel, 1); save(); dRender(); return; }
    const al = e.target.closest('[data-align]'); if (al && b) { pushUndo(); b.p.align = al.dataset.align; dRefresh(); dProps(); return; }
    const kd = e.target.closest('[data-kind]'); if (kd && b) { pushUndo(); b.p.kind = kd.dataset.kind; if (kd.dataset.kind === 'rect' && b.h < 3) b.h = 12; if (kd.dataset.kind === 'line') b.h = .5; dRefresh(); dProps(); return; }
    const rs = e.target.closest('[data-reset]'); if (rs) { pushUndo(); const [attr, key] = rs.dataset.reset.split(':'); if (attr === 'data-pp' && b) delete b.p[key]; dRefresh(); dProps(); return; }
    const fd = e.target.closest('[data-field]'); if (fd && b) {
      const ta = $('[data-pptext]', props); const f = FIELDS.find(x => x[0] === fd.dataset.field); const tok = fieldToken(f, LANG);
      const s = ta.selectionStart ?? ta.value.length; ta.value = ta.value.slice(0, s) + tok + ta.value.slice(ta.selectionEnd ?? s); ta.focus(); ta.selectionStart = ta.selectionEnd = s + tok.length;
      pushUndo(); b.p.text = toCanonical(ta.value); dRefresh();
    }
  });
}

/* designer actions (picked up by the global click handler) */
window.DACT = {
  dundo: () => dUndo(), dredo: () => dRedo(),
  ddefault: () => { S.settings.defaultTemplate = curTpl().id; save(); dToolbar(); toast(t('saved')); },
  dnew: el => { const mk = k => ({ label: (PRESET_DEFS[k].icon ? PRESET_DEFS[k].icon + '  ' : '') + presetName(k) + '  ·  ' + paperLabel(PRESET_DEFS[k].paper).replace(/ \(.*\)/, ''), icon: PRESET_DEFS[k].icon ? null : 'layout', run: () => { const tp = makeTemplate(k); S.templates.push(tp); D.tplId = tp.id; D.sel = null; D.undo = []; D.redo = []; save(); dRender(); } });
    const keys = Object.keys(PRESET_DEFS); dropdown(el, [...keys.filter(k => PRESET_DEFS[k].biz).map(mk), '-', ...keys.filter(k => !PRESET_DEFS[k].biz).map(mk)]); },
  drelayout: () => { pushUndo(); autoLayout(curTpl()); save(); dRender(); },
  dxfadd: () => { const tp = curTpl(); pushUndo(); tp.extraFields = tp.extraFields || []; tp.extraFields.push(F('f' + Date.now().toString(36), LANG === 'th' ? 'หัวข้อใหม่' : 'New field', 'New field')); if (!tp.blocks.some(b => b.type === 'extra')) { tp.blocks.push(B('extra', 0, 0, 1, 1, { fit: true })); autoLayout(tp); } save(); dRender(); },
  dtplmenu: el => {
    const tp = curTpl();
    dropdown(el, [
      { label: t('renameTemplate'), icon: 'edit', run: () => modal({ title: t('renameTemplate'), body: `<input class="inp" id="tpl-name" value="${esc(tp.name)}">`, onSave: ov => { tp.name = $('#tpl-name', ov).value.trim() || tp.name; save(); dToolbar(); } }) },
      { label: t('duplicate'), icon: 'copy', run: () => { const n = clone(tp); n.id = uid(); n.name = tp.name + ' (2)'; n.blocks.forEach(b => b.id = uid()); S.templates.push(n); D.tplId = n.id; D.sel = null; save(); dRender(); } },
      ...(tp.preset ? [{ label: t('resetTemplate'), icon: 'undo', run: () => { pushUndo(); const f = makeTemplate(tp.preset); Object.assign(tp, { blocks: f.blocks, paper: f.paper, accent: f.accent, font: f.font, base: f.base, style: f.style, extraFields: f.extraFields }); D.sel = null; save(); dRender(); } }] : []),
      '-',
      { label: t('deleteTemplate'), icon: 'trash', danger: true, run: async () => { if (S.templates.length < 2) return toast(t('cantDeleteLast')); if (!(await confirmBox(t('confirmDelete')))) return; S.templates = S.templates.filter(x => x !== tp); if (S.settings.defaultTemplate === tp.id) S.settings.defaultTemplate = S.templates[0].id; D.tplId = S.settings.defaultTemplate; D.sel = null; save(); dRender(); } }
    ]);
  },
  dfront: () => { const tp = curTpl(), b = selBlock(); pushUndo(); tp.blocks = tp.blocks.filter(x => x !== b).concat(b); dRefresh(); },
  dback: () => { const tp = curTpl(), b = selBlock(); pushUndo(); tp.blocks = [b].concat(tp.blocks.filter(x => x !== b)); dRefresh(); },
  ddup: () => { const tp = curTpl(), b = selBlock(); pushUndo(); const n = clone(b); n.id = uid(); n.x += 4; n.y += 4; tp.blocks.push(n); D.sel = n.id; save(); dRender(); },
  dgroupdel: () => { const tp = curTpl(); pushUndo(); tp.blocks = tp.blocks.filter(b => !D.multi.includes(b.id)); D.multi = []; D.sel = null; save(); dRender(); },
  dgroupdup: () => { const tp = curTpl(); pushUndo(); const n = tp.blocks.filter(b => D.multi.includes(b.id)).map(b => { const c = clone(b); c.id = uid(); c.x += 4; c.y += 4; return c; }); tp.blocks.push(...n); D.multi = n.map(b => b.id); save(); dRender(); },
  ddel: () => { const tp = curTpl(); pushUndo(); tp.blocks = tp.blocks.filter(x => x.id !== D.sel); D.sel = null; save(); dRender(); },
  dimg: async () => { const f = await pickFile('image/*'); if (!f) return; const b = selBlock(); pushUndo(); b.p.src = await readImage(f, 900); dRefresh(); }
};

window.addEventListener('keydown', e => {
  if (UI.view !== 'designer' || document.querySelector('.overlay')) return;
  const inField = e.target.closest && e.target.closest('input,textarea,select,[contenteditable]');
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'z' && !inField) { e.preventDefault(); e.shiftKey ? dRedo() : dUndo(); return; }
  if (mod && e.key.toLowerCase() === 'y' && !inField) { e.preventDefault(); dRedo(); return; }
  if (inField) return;
  if (mod && e.key.toLowerCase() === 'a') { e.preventDefault(); D.multi = curTpl().blocks.map(b => b.id); D.sel = null; dRender(); return; }
  if (D.multi.length > 1) {
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); DACT.dgroupdel(); return; }
    if (e.key === 'Escape') { D.multi = []; dRender(); return; }
    if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); DACT.dgroupdup(); return; }
    const st = e.shiftKey ? 5 : 1; const m = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
    if (m) { e.preventDefault(); pushUndo(); for (const b of curTpl().blocks) if (D.multi.includes(b.id)) { b.x = r2(b.x + m[0]); b.y = r2(b.y + m[1]); b.p.attach = ''; } save(); dCanvas(); }
    return;
  }
  const b = selBlock(); if (!b) return;
  if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); DACT.ddup(); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); DACT.ddel(); return; }
  if (e.key === 'Escape') { D.sel = null; dRender(); return; }
  const step = e.shiftKey ? 5 : 1; const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (mv) { e.preventDefault(); pushUndo(); b.x = r2(b.x + mv[0]); b.y = r2(b.y + mv[1]); save(); dCanvas(); dProps(); }
});
