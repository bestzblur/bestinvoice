/* Bestinvoice — document renderer (shared by preview, print and designer) */
const FONTS = { plex: "'Plex Thai'", sarabun: "'Sarabun Thai'" };
function lum(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1;
  const n = parseInt(m[1], 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
}
const onColor = bg => (bg && bg !== 'transparent' && lum(bg) < .45) ? '#FFFFFF' : '#111111';
const resolveColor = (v, tpl) => (!v || v === 'accent') ? tpl.accent : v === 'accentSoft' ? `color-mix(in srgb, ${tpl.accent} 9%, white)` : v;

function sampleDoc() {
  const d = {
    id: 'sample', type: 'taxreceipt', number: 'RT' + String(new Date().getFullYear() + 543).slice(-2) + '11-0001', date: todayISO(), dueDate: addDays(todayISO(), 30), reference: 'PO-2026-118',
    status: 'paid', customer: { name: 'บริษัท ตัวอย่าง ลูกค้า อินเตอร์เทรด แอนด์ เซอร์วิส จำกัด', taxId: '0105560000000', branch: 'สำนักงานใหญ่', address: '123 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120', phone: '02-000-0000' },
    items: [
      { id: 'a', desc: 'ออกแบบโลโก้และอัตลักษณ์องค์กร', qty: 1, unit: 'งาน', price: 15000, discount: 0 },
      { id: 'b', desc: 'ดูแลเว็บไซต์รายเดือน (พ.ย.)', qty: 1, unit: 'เดือน', price: 4500, discount: 0 },
      { id: 'c', desc: 'ถ่ายภาพสินค้า', qty: 12, unit: 'ภาพ', price: 350, discount: 200 }
    ],
    discount: 0, vatMode: 'exclusive', vatRate: S.settings.vatRate, whtRate: 3, payMethod: 'transfer', notes: 'ขอบคุณที่ใช้บริการ', docLang: S.settings.docLang
  };
  return d;
}

function L(key, lang) { return docL(key, lang); }
function L2(key, lang) { // two-line label for headers in bilingual mode
  const p = DOC_LABELS[key]; if (!p) return esc(key);
  if (lang === 'both') return `${esc(p[0])}<small>${esc(p[1])}</small>`;
  return esc(lang === 'en' ? p[1] : p[0]);
}

function blockStyle(b, tpl) {
  const p = b.p || {};
  const st = [`left:${b.x}mm`, `top:${b.y}mm`, `width:${b.w}mm`, `height:${b.h}mm`, `font-size:${p.size || tpl.base}pt`];
  if (p.align) st.push(`text-align:${p.align}`);
  if (p.color) st.push(`color:${p.color}`);
  if (p.bold) st.push('font-weight:700');
  if (p.bg) st.push(`background:${resolveColor(p.bg, tpl)}`);
  if (p.border) st.push(`border:.3mm solid ${p.borderColor || '#9aa1ab'}`);
  if (p.pad) st.push(`padding:${p.pad}mm`);
  if (p.radius) st.push(`border-radius:${p.radius}mm`);
  return st.join(';');
}

function renderBlock(b, ctx) {
  const { doc, co, calc, lang, tpl } = ctx; const p = b.p || {};
  const main = v => lang === 'en' ? v[1] : v[0];
  switch (b.type) {
    case 'logo':
      if (co.logo) return `<img class="fit" src="${co.logo}" alt="">`;
      return ctx.design ? `<div style="width:100%;height:100%;border:.3mm dashed #c5cad1;border-radius:2mm;display:grid;place-items:center;color:#9aa1ab;font-size:8pt">LOGO</div>` : '';
    case 'company': {
      const nmMain = lang === 'en' ? (co.nameEn || co.nameTh) : (co.nameTh || co.nameEn);
      const nmSub = lang === 'en' ? '' : (p.showEn !== false && co.nameTh && co.nameEn ? co.nameEn : '');
      const ratio = (p.nameSize || 13) / (p.size || tpl.base);
      let h = `<div style="font-size:${ratio}em;font-weight:700;line-height:1.25">${esc(nmMain || (ctx.design ? (LANG === 'th' ? 'ชื่อบริษัทของคุณ' : 'Your company name') : ''))}</div>`;
      if (nmSub) h += `<div style="font-weight:600;margin-top:.4mm">${esc(nmSub)}</div>`;
      if (p.showAddress !== false && co.address) h += `<div style="margin-top:.8mm">${nl2br(co.address)}</div>`;
      if (p.showTaxId !== false && co.taxId) h += `<div>${esc(L('taxId', lang))} ${esc(co.taxId)}${co.branch ? ' &nbsp;' + esc(L('branch', lang)) + ' ' + esc(co.branch) : ''}</div>`;
      if (p.showContact !== false && (co.phone || co.email)) h += `<div>${co.phone ? esc(L('tel', lang)) + ' ' + esc(co.phone) : ''}${co.phone && co.email ? ' &nbsp;' : ''}${co.email ? esc(co.email) : ''}${co.website ? ' &nbsp;' + esc(co.website) : ''}</div>`;
      return `<div class="fit-inner">${h}</div>`;
    }
    case 'title': {
      const col = p.accentColor ? `color:${tpl.accent}` : '';
      let h;
      if (p.title) h = `<div style="${col}">${esc(p.title)}</div>`;
      else {
        const pr = DOC_LABELS[doc.type];
        h = lang === 'both' ? `<div style="${col};line-height:1.2">${esc(pr[0])}</div><div style="font-size:.6em;letter-spacing:.06em;opacity:.85;${col}">${esc(pr[1])}</div>` : `<div style="${col}">${esc(main(pr))}</div>`;
      }
      if (p.copyTag && ctx.copy) h += `<div class="copy-tag" style="${col}">${esc(L(ctx.copy, lang))}</div>`;
      return h;
    }
    case 'docinfo': {
      const rows = [[L('no', lang), doc.number], [L('date', lang), fmtDate(doc.date, lang === 'en' ? 'en' : 'th')]];
      if (p.showDue !== false && doc.dueDate && (doc.type === 'invoice' || doc.type === 'quotation')) rows.push([L(doc.type === 'quotation' ? 'validUntil' : 'due', lang), fmtDate(doc.dueDate, lang === 'en' ? 'en' : 'th')]);
      if (p.showRef !== false && doc.reference) rows.push([L('ref', lang), doc.reference]);
      if (p.inline) return rows.map(r => `<span class="k">${esc(r[0])}</span> ${esc(r[1])}`).join(' &nbsp;·&nbsp; ');
      const jc = p.align === 'right' ? 'justify-content:end' : p.align === 'center' ? 'justify-content:center' : '';
      return `<div class="kv" style="${jc}">${rows.map(r => `<span class="k">${esc(r[0])}</span><span style="font-weight:600;text-align:left">${esc(r[1])}</span>`).join('')}</div>`;
    }
    case 'customer': {
      const c = doc.customer || {};
      const head = p.label || L(doc.type === 'receipt' || doc.type === 'taxreceipt' ? 'billTo' : 'customer', lang);
      let h = `<div class="k" style="font-size:.88em;margin-bottom:.6mm">${esc(head)}</div>`;
      h += `<div style="font-weight:700;font-size:1.08em;line-height:1.3">${esc(c.name || (ctx.design ? '—' : ''))}</div>`;
      if (c.address) h += `<div>${nl2br(c.address)}</div>`;
      if (c.taxId || c.branch) h += `<div>${c.taxId ? esc(L('taxId', lang)) + ' ' + esc(c.taxId) : ''}${c.branch ? ' &nbsp;' + esc(L('branch', lang)) + ' ' + esc(c.branch) : ''}</div>`;
      if (c.phone) h += `<div>${esc(L('tel', lang))} ${esc(c.phone)}</div>`;
      return h;
    }
    case 'items': {
      const items = (doc.items || []).filter(it => it.desc || num(it.price) || ctx.design);
      const hasDisc = items.some(it => num(it.discount));
      const hb = resolveColor(p.headerBg, tpl), ht = p.headerText || onColor(hb);
      const bd = p.grid ? 'border:.2mm solid #b9bfc7;' : '';
      if (p.compact) {
        let h = `<table class="it"><thead><tr style="border-bottom:.25mm dashed #111"><th style="padding:1mm 0">${L2('desc', lang)}</th><th class="r" style="padding:1mm 0">${L2('amount', lang)}</th></tr></thead><tbody>`;
        for (const it of items) h += `<tr><td style="padding:.8mm 0;border:0">${esc(it.desc)}<div class="k" style="font-size:.9em">${money(it.qty, num(it.qty) % 1 ? 2 : 0)} × ${money(it.price)}${num(it.discount) ? ' − ' + money(it.discount) : ''}</div></td><td class="r" style="padding:.8mm 0;border:0">${money(lineAmount(it))}</td></tr>`;
        return h + `</tbody></table><div style="border-top:.25mm dashed #111;margin-top:1mm"></div>`;
      }
      const cols = [];
      if (p.showNo !== false) cols.push(['idx', 'c', '11mm']);
      cols.push(['desc', '', '']);
      cols.push(['qty', 'c', '15mm']);
      if (p.showUnit !== false) cols.push(['unit', 'c', '14mm']);
      cols.push(['price', 'r', '22mm']);
      if (hasDisc) cols.push(['disc', 'r', '17mm']);
      cols.push(['amount', 'r', '24mm']);
      let h = `<table class="it"><thead><tr style="background:${hb};color:${ht}">` + cols.map(c => `<th class="${c[1]}" style="${c[2] ? 'width:' + c[2] + ';' : ''}${bd}">${L2(c[0], lang)}</th>`).join('') + `</tr></thead><tbody>`;
      const rows = items.map((it, i) => {
        const cell = { idx: (ctx.rowOffset || 0) + i + 1, desc: nl2br(it.desc), qty: money(it.qty, num(it.qty) % 1 ? 2 : 0), unit: esc(it.unit), price: money(it.price), disc: num(it.discount) ? money(it.discount) : '', amount: money(lineAmount(it)) };
        return `<tr style="${p.striped && i % 2 ? 'background:#F6F7F9' : ''}">` + cols.map(c => `<td class="${c[1]}" style="${bd}">${cell[c[0]]}</td>`).join('') + '</tr>';
      });
      for (let i = items.length; i < (ctx.rowOffset ? 0 : (ctx.fillTo !== undefined ? Math.min(ctx.fillTo, p.minRows || 0) : (p.minRows || 0))); i++) rows.push('<tr>' + cols.map(() => `<td style="${bd}">&nbsp;</td>`).join('') + '</tr>');
      return h + rows.join('') + '</tbody></table>';
    }
    case 'totals': {
      const rows = [[L('subtotal', lang), calc.subtotal]];
      if (calc.discount) rows.push([L('discount', lang), -calc.discount], [L('afterDiscount', lang), calc.afterDiscount]);
      if (doc.vatMode === 'inclusive') rows.push([L('beforeVat', lang), calc.beforeVat]);
      if (doc.vatMode !== 'none') rows.push([`${L('vat', lang)} ${calc.rate}%`, calc.vat]);
      const hl = resolveColor(p.highlight, tpl);
      let h = `<div class="tt">` + rows.map(r => `<span class="k">${esc(r[0])}</span><span class="r">${money(r[1])}</span>`).join('');
      h += `<span class="grand" style="background:${hl};color:${onColor(hl)};grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:3mm"><span class="bl" style="line-height:1.2">${L2('grand', lang)}</span><span style="white-space:nowrap;font-size:1.1em">${money(calc.total)}</span></span>`;
      if (calc.wht) h += `<span class="k">${esc(L('wht', lang))} ${num(doc.whtRate)}%</span><span class="r">${money(-calc.wht)}</span><span style="font-weight:700">${esc(L('net', lang))}</span><span class="r" style="font-weight:700">${money(calc.net)}</span>`;
      return h + '</div>';
    }
    case 'words': {
      const th = bahtText(calc.total), en = englishText(calc.total);
      const txt = lang === 'en' ? en : lang === 'th' ? th : null;
      if (txt) return `<div style="font-weight:600">(${esc(txt)})</div>`;
      return `<div style="font-weight:600">(${esc(th)})</div><div style="font-size:.85em;opacity:.8">(${esc(en)})</div>`;
    }
    case 'extra': {
      const fs = tpl.extraFields || []; const ex = doc.extra || {};
      if (!fs.length) return ctx.design ? `<span style="color:#9aa1ab">${LANG === 'th' ? 'ยังไม่มีช่องข้อมูลเพิ่มเติม — ตั้งค่าได้ที่แผงด้านขวา' : 'No extra fields yet — add them in the right panel'}</span>` : '';
      const lab = f => lang === 'en' ? f.en : lang === 'th' ? f.th : `${f.th} / ${f.en}`;
      const val = f => { const v = ex[f.k]; if (v === undefined || v === '') return ctx.design ? '—' : ''; if (f.type === 'date' || f.type === 'checkin' || f.type === 'checkout') return fmtDate(v, lang === 'en' ? 'en' : 'th'); if (f.type === 'nights') return `${v} ${lang === 'en' ? (+v === 1 ? 'night' : 'nights') : 'คืน'}`; return v; };
      const rows = fs.filter(f => ctx.design || (ex[f.k] !== undefined && ex[f.k] !== ''));
      if (p.inline) return rows.map(f => `<span class="k">${esc(lab(f))}</span> <b>${esc(val(f))}</b>`).join(' &nbsp;·&nbsp; ');
      return `<div class="kv">${rows.map(f => `<span class="k">${esc(lab(f))}</span><span style="font-weight:600">${esc(val(f))}</span>`).join('')}</div>`;
    }
    case 'qr': {
      if (!qrOn(doc) && !ctx.design) return '';
      const txt = ctx.design && !doc.number ? 'BIV1|SAMPLE' : qrPayload(doc, calc);
      const cap = p.caption !== false;
      return `<div style="display:flex;flex-direction:column;align-items:center;height:100%;gap:.6mm"><div style="flex:1;min-height:0;width:100%">${qrSvg(txt)}</div>${cap ? `<div style="font-size:6.5pt;line-height:1.15;text-align:center;color:#555;white-space:nowrap">${esc(lang === 'en' ? 'Scan to verify' : lang === 'th' ? 'สแกนเพื่อตรวจสอบ' : 'สแกนตรวจสอบ / Verify')}</div>` : ''}</div>`;
    }
    case 'notes':
      if (!doc.notes && !ctx.design) return '';
      return `<div class="k" style="font-weight:600;margin-bottom:.5mm">${esc(p.label || L('notes', lang))}</div><div>${nl2br(doc.notes || (ctx.design ? '…' : ''))}</div>`;
    case 'payment': {
      const opts = ['cash', 'transfer', 'cheque', 'card'];
      return `<div class="pay"><b>${esc(L('payBy', lang))}</b>` + opts.map(o => `<span><i>${doc.payMethod === o ? '✓' : ''}</i>${esc(L(o, lang))}</span>`).join('') + '</div>';
    }
    case 'signature': {
      const n = Math.max(1, Math.min(4, p.count || 2)); const labels = p.labels || [];
      let h = '<div class="sig">';
      for (let i = 0; i < n; i++) {
        const lab = labels[i] || 'receiver';
        const text = DOC_LABELS[lab] ? L(lab, lang) : lab;
        const img = i === 0 && p.useSig && co.signature ? `<img src="${co.signature}" alt="">` : '';
        h += `<div><div class="ln">${img}</div><div style="display:flex;justify-content:center"><span>(</span><span style="flex:0 1 72%"></span><span>)</span></div><div style="font-weight:600;margin-top:.5mm">${esc(text)}</div>${p.dateLine ? `<div class="k" style="margin-top:.6mm">${esc(L('dateLine', lang))} ____/____/______</div>` : ''}</div>`;
      }
      return h + '</div>';
    }
    case 'text':
      return nl2br(fillFields(toCanonical(p.text || ''), ctx)) || (ctx.design ? `<span style="color:#9aa1ab">${LANG === 'th' ? 'ข้อความ…' : 'Text…'}</span>` : '');
    case 'shape': {
      if (p.kind === 'line') return `<div style="position:absolute;left:0;right:0;top:50%;border-top:${p.thickness || .3}mm ${p.dashed ? 'dashed' : 'solid'} ${p.stroke || '#ccc'};transform:translateY(-50%)"></div>`;
      const fill = p.accentFill ? tpl.accent : (p.fill || 'transparent');
      return `<div style="position:absolute;inset:0;background:${fill};border:${p.thickness || 0}mm solid ${p.stroke || 'transparent'};border-radius:${p.radius || 0}mm"></div>`;
    }
    case 'image':
      if (p.src) return `<img class="fit" src="${p.src}" alt="">`;
      return ctx.design ? `<div style="width:100%;height:100%;border:.3mm dashed #c5cad1;border-radius:2mm;display:grid;place-items:center;color:#9aa1ab;font-size:8pt">${LANG === 'th' ? 'รูปภาพ' : 'Image'}</div>` : '';
  }
  return '';
}

function renderPage(doc, tpl, opts = {}) {
  const lang = doc.docLang || S.settings.docLang || 'both';
  const ctx = { doc, co: S.settings.company, calc: opts.calc || calcDoc(doc), lang, tpl, design: !!opts.design, copy: opts.copy, rowOffset: opts.rowOffset || 0, fillTo: opts.fillTo };
  const [pw, ph] = PAPERS[tpl.paper] || PAPERS.A4;
  let h = `<div class="page${opts.grid ? ' grid-on' : ''}" data-paper="${tpl.paper}" style="width:${pw}mm;height:${ph}mm;--doc-font:${FONTS[tpl.font] || FONTS.plex};font-size:${tpl.base}pt">`;
  for (const b of tpl.blocks) {
    if (b.p && b.p.hidden && !opts.design) continue;
    if (opts.hideBelow !== undefined && b.y >= opts.hideBelow - .5) continue;
    const cls = ['blk', 'blk-' + b.type];
    if (b.type === 'items') cls.push('items-blk');
    if (opts.design && b.id === opts.selected) cls.push('sel');
    if (opts.design && b.p && b.p.hidden) cls.push('hid');
    const fit = b.p && b.p.fit ? ' data-fit="1"' : '';
    let inner = renderBlock(b, ctx);
    if (b.type === 'items') inner = `<div class="items-inner">${inner}</div>`;
    if (opts.design) inner += `<span class="tagname">${esc(t('b_' + b.type))}</span>`;
    h += `<div class="${cls.join(' ')}" data-id="${b.id}" data-y="${b.y}" data-h="${b.h}"${fit} style="${blockStyle(b, tpl)}">${inner}</div>`;
  }
  if (opts.pageNo) h += `<div style="position:absolute;right:${tpl.paper === 'A5' ? 8 : 12}mm;bottom:5mm;font-size:7.5pt;color:#888">${esc(L('page', lang))} ${opts.pageNo[0]}/${opts.pageNo[1]}</div>`;
  return h + '</div>';
}

/* Post-layout: shrink long names to fit, grow the items table and push blocks below it down */
function applyFlow(pageEl, opts = {}) {
  pageEl.querySelectorAll('[data-fit]').forEach(el => {
    let fs = parseFloat(el.style.fontSize) || 9, guard = 0;
    while (el.scrollHeight > el.clientHeight + 1 && fs > 5 && guard++ < 60) { fs -= .25; el.style.fontSize = fs + 'pt'; }
  });
  if (opts.design) return;
  const it = pageEl.querySelector('.items-blk');
  let extra = 0;
  if (it) {
    const need = it.firstElementChild.offsetHeight, have = it.offsetHeight;
    const delta = need - have;
    if (delta > 0) {
      const bottom = parseFloat(it.dataset.y) + parseFloat(it.dataset.h);
      pageEl.querySelectorAll('.blk').forEach(b => { if (b !== it && parseFloat(b.dataset.y) >= bottom - .5) b.style.top = `calc(${b.dataset.y}mm + ${delta}px)`; });
      it.style.height = need + 'px'; extra = delta;
    }
  }
  // grow the page if content runs past the bottom (slips grow; A4 continues onto the next sheet)
  let maxBottom = 0;
  pageEl.querySelectorAll('.blk').forEach(b => { maxBottom = Math.max(maxBottom, b.offsetTop + b.offsetHeight); });
  const pxPerMm = pageEl.offsetWidth / (PAPERS[pageEl.dataset.paper] || PAPERS.A4)[0];
  if (pageEl.dataset.paper === '80mm') pageEl.style.height = (maxBottom / pxPerMm + 5) + 'mm';
  else if (maxBottom > pageEl.offsetHeight) pageEl.style.height = (maxBottom / pxPerMm + 10) + 'mm';
  return extra;
}

/* Render a document into `container`, splitting long item lists across pages.
   Footer blocks (totals, signatures…) stay on the last page; header blocks repeat on every page. */
function buildPages(container, doc, tpl, opts = {}) {
  const itB = tpl.blocks.find(b => b.type === 'items' && !(b.p && b.p.hidden));
  container.innerHTML = renderPage(doc, tpl, { ...opts, fillTo: itB && itB.p.minRows ? 0 : undefined });
  const pg = container.firstElementChild;
  if (tpl.paper === '80mm' || !itB) { applyFlow(pg); return 1; }
  applyFlow(pg, { design: true }); // autofit only
  const el = pg.querySelector('.items-blk'); const pxmm = pg.offsetWidth / PAPERS[tpl.paper][0]; const ph = PAPERS[tpl.paper][1];
  const itemsBottom = itB.y + itB.h;
  const below = tpl.blocks.filter(b => b !== itB && !(b.p && b.p.hidden) && b.y >= itemsBottom - .5);
  const belowSpan = below.length ? Math.max(...below.map(b => b.y + b.h)) - itemsBottom : 0;
  const maxLast = Math.max(itB.h, ph - itB.y - belowSpan - 6) * pxmm;
  const need = el.firstElementChild.offsetHeight;
  if (need <= maxLast) {
    if (itB.p.minRows) { // add empty ruled rows only as far as the space allows
      const nRows = el.querySelectorAll('tbody tr').length, rowH = 7.5 * pxmm * (tpl.base / 10);
      const fit = Math.max(0, Math.floor((Math.max(maxLast, itB.h * pxmm) - need) / rowH));
      container.innerHTML = renderPage(doc, tpl, { ...opts, fillTo: Math.min(itB.p.minRows, nRows + fit) });
    }
    applyFlow(container.firstElementChild); return 1;
  }
  const rows = [...el.querySelectorAll('tbody tr')]; const head = el.querySelector('thead'); const headH = head ? head.offsetHeight : 0;
  const rh = rows.map(r => r.offsetHeight); const maxFull = (ph - itB.y - 14) * pxmm;
  // fill each page as far as it goes; the last page must also leave room for the footer blocks
  const n0 = rows.length, chunks = []; let i = 0;
  while (i < n0) {
    let rem = headH; for (let k = i; k < n0; k++) rem += rh[k];
    if (rem <= maxLast) { chunks.push([i, n0]); break; }
    let j = i, h = headH; while (j < n0 && h + rh[j] <= maxFull) { h += rh[j]; j++; }
    if (j >= n0) j = Math.max(i + 1, n0 - 1);
    if (j === i) j = i + 1;
    chunks.push([i, j]); i = j;
  }
  const items = (doc.items || []).filter(it => it.desc || num(it.price));
  const calc = calcDoc(doc), n = chunks.length;
  container.innerHTML = chunks.map(([a, b], k) => renderPage({ ...doc, items: items.slice(a, b) }, tpl, { ...opts, calc, rowOffset: a, pageNo: [k + 1, n], hideBelow: k < n - 1 ? itemsBottom : undefined })).join('');
  container.querySelectorAll('.page').forEach(p => applyFlow(p));
  return n;
}

function templateFor(doc) { return S.templates.find(x => x.id === doc.templateId) || S.templates.find(x => x.id === S.settings.defaultTemplate) || S.templates[0]; }

/* Print one document (optionally original + copy) */
function printDoc(doc, withCopy) {
  const tpl = templateFor(doc);
  const root = $('#print-root');
  const copies = withCopy ? ['original', 'copy'] : [S.settings.printCopy ? 'original' : null];
  root.style.cssText = 'display:block;position:absolute;left:-10000px;top:0';
  let html = '';
  for (const c of copies) { const tmp = document.createElement('div'); root.innerHTML = ''; root.appendChild(tmp); buildPages(tmp, doc, tpl, { copy: c }); html += tmp.innerHTML; }
  root.innerHTML = html;
  const [pw, ph0] = PAPERS[tpl.paper]; const first = root.querySelector('.page');
  const ph = tpl.paper === '80mm' ? Math.ceil(first.offsetHeight / (first.offsetWidth / pw)) : ph0;
  $('#page-style').textContent = `@page{size:${pw}mm ${ph}mm;margin:0}`;
  root.style.cssText = '';
  return { pw, ph };
}
async function printNow(doc, withCopy) {
  await FONTS_READY;
  printDoc(doc, withCopy);
  const title = document.title; document.title = `${doc.number} ${doc.customer.name || ''}`.trim();
  setTimeout(() => { window.print(); document.title = title; }, 60);
}
