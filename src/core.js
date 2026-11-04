/* Bestinvoice — core: utilities, storage, money maths, presets */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = s => esc(s).replace(/\n/g, '<br>');
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const clone = o => JSON.parse(JSON.stringify(o));
const num = v => { const n = parseFloat(String(v ?? '').replace(/,/g, '')); return isFinite(n) ? n : 0; };
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
const money = (n, d = 2) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const todayISO = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const initials = s => { const w = String(s || '?').replace(/^(บริษัท|ห้างหุ้นส่วน(จำกัด|สามัญ)?|หจก\.?|บจก\.?|นาย|นาง(สาว)?|คุณ)\s*/,'').trim().split(/\s+/); return ((w[0]||'?')[0] + (w[1] ? w[1][0] : '')).toUpperCase(); };

const TH_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const EN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(iso, lang, style = 'short') {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const be = S.settings.buddhistYear;
  if (style === 'num') return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${lang === 'en' && !be ? y : (be ? y + 543 : y)}`;
  if (lang === 'en') return `${d} ${EN_MONTHS[m - 1]} ${be ? y + 543 : y}`;
  return `${d} ${TH_MONTHS[m - 1]} ${be ? y + 543 : y}`;
}

/* ---------- Thai baht text: uses baht.js (see baht.js) ---------- */
function bahtText(amount) {
  const v = r2(Math.abs(num(amount)));
  return BahtJS.convert(v.toFixed(2)) || 'ศูนย์บาทถ้วน';
}
const EN_ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const EN_TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function enRead(n) {
  if (n < 20) return EN_ONES[n];
  if (n < 100) return EN_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + EN_ONES[n % 10] : '');
  if (n < 1000) return EN_ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + enRead(n % 100) : '');
  for (const [v, w] of [[1e9,'Billion'],[1e6,'Million'],[1e3,'Thousand']])
    if (n >= v) return enRead(Math.floor(n / v)) + ' ' + w + (n % v ? ' ' + enRead(n % v) : '');
  return '';
}
function englishText(amount) {
  amount = r2(Math.abs(num(amount)));
  const baht = Math.floor(amount), satang = Math.round((amount - baht) * 100);
  let s = (baht ? enRead(baht) : 'Zero') + ' Baht';
  s += satang ? ' and ' + enRead(satang) + ' Satang' : ' Only';
  return s;
}

/* ---------- money maths ---------- */
const isNightly = unit => /คืน|night/i.test(String(unit || ''));
const nightsOf = it => (it.nights !== undefined && it.nights !== '' && num(it.nights) > 0) ? num(it.nights) : 1;
function lineAmount(it) { return r2(num(it.qty) * num(it.price) * nightsOf(it) - num(it.discount)); }
function calcDoc(doc) {
  const rate = num(doc.vatRate ?? S.settings.vatRate);
  const subtotal = r2((doc.items || []).reduce((a, it) => a + lineAmount(it), 0));
  const discount = r2(num(doc.discount));
  const afterDiscount = r2(subtotal - discount);
  let vat = 0, beforeVat = afterDiscount, total = afterDiscount;
  if (doc.vatMode === 'exclusive') { vat = r2(afterDiscount * rate / 100); total = r2(afterDiscount + vat); }
  else if (doc.vatMode === 'inclusive') { beforeVat = r2(afterDiscount * 100 / (100 + rate)); vat = r2(afterDiscount - beforeVat); }
  const wht = r2(beforeVat * num(doc.whtRate) / 100);
  return { rate, subtotal, discount, afterDiscount, beforeVat, vat, total, wht, net: r2(total - wht) };
}

/* ---------- readable data fields (used in free-text blocks) ---------- */
const FIELDS = [
  ['company_name','ชื่อบริษัท','Company name', c => c.co.nameTh || c.co.nameEn],
  ['company_name_en','ชื่อบริษัทภาษาอังกฤษ','Company name (EN)', c => c.co.nameEn],
  ['company_address','ที่อยู่บริษัท','Company address', c => c.co.address],
  ['company_tax_id','เลขผู้เสียภาษีบริษัท','Company tax ID', c => c.co.taxId],
  ['company_phone','โทรศัพท์บริษัท','Company phone', c => c.co.phone],
  ['company_email','อีเมลบริษัท','Company email', c => c.co.email],
  ['company_website','เว็บไซต์บริษัท','Company website', c => c.co.website],
  ['customer_name','ชื่อลูกค้า','Customer name', c => c.doc.customer.name],
  ['customer_address','ที่อยู่ลูกค้า','Customer address', c => c.doc.customer.address],
  ['customer_tax_id','เลขผู้เสียภาษีลูกค้า','Customer tax ID', c => c.doc.customer.taxId],
  ['customer_phone','โทรศัพท์ลูกค้า','Customer phone', c => c.doc.customer.phone],
  ['doc_title','ชื่อเอกสาร','Document title', c => docTitle(c.doc.type, c.lang)],
  ['doc_number','เลขที่เอกสาร','Document number', c => c.doc.number],
  ['doc_date','วันที่เอกสาร','Document date', c => fmtDate(c.doc.date, c.lang === 'en' ? 'en' : 'th')],
  ['due_date','วันครบกำหนด','Due date', c => fmtDate(c.doc.dueDate, c.lang === 'en' ? 'en' : 'th')],
  ['reference','เลขอ้างอิง','Reference', c => c.doc.reference],
  ['subtotal','รวมเป็นเงิน','Subtotal', c => money(c.calc.subtotal)],
  ['vat','ภาษีมูลค่าเพิ่ม','VAT', c => money(c.calc.vat)],
  ['grand_total','ยอดรวมทั้งสิ้น','Grand total', c => money(c.calc.total)],
  ['net_total','ยอดชำระสุทธิ','Net payable', c => money(c.calc.net)],
  ['amount_words','ยอดเงินตัวอักษร','Amount in words', c => c.lang === 'en' ? englishText(c.calc.net) : bahtText(c.calc.net)],
  ['payment_method','วิธีชำระเงิน','Payment method', c => c.doc.payMethod ? docL(c.doc.payMethod, c.lang) : ''],
  ['notes','หมายเหตุ','Notes', c => c.doc.notes],
  ['today','วันที่วันนี้','Today', c => fmtDate(todayISO(), c.lang === 'en' ? 'en' : 'th')]
];
const fieldToken = (f, lang) => '{' + (lang === 'en' ? f[2] : f[1]) + '}';
function toCanonical(text) { // readable tokens (either language) -> {key}
  let s = String(text || '');
  for (const f of FIELDS) { s = s.split('{' + f[1] + '}').join('{{' + f[0] + '}}').split('{' + f[2] + '}').join('{{' + f[0] + '}}'); }
  return s;
}
function toReadable(text, lang) { let s = String(text || ''); for (const f of FIELDS) s = s.split('{{' + f[0] + '}}').join(fieldToken(f, lang)); return s; }
function fillFields(text, ctx) { return String(text || '').replace(/\{\{(\w+)\}\}/g, (m, k) => { const f = FIELDS.find(x => x[0] === k); return f ? (f[3](ctx) ?? '') : m; }); }

function docL(key, lang) { const p = DOC_LABELS[key]; if (!p) return key; return lang === 'en' ? p[1] : lang === 'th' ? p[0] : p[0] + ' / ' + p[1]; }
function docTitle(type, lang) { const p = DOC_LABELS[type]; return lang === 'en' ? p[1] : lang === 'th' ? p[0] : p[0]; }

/* ---------- paper sizes & auto layout (all units mm / pt) ---------- */
const PAPERS = { A4: [210, 297], A4L: [297, 210], A5: [148, 210], A5L: [210, 148], '80mm': [80, 220], slipL: [210, 99] };
const PAPER_LABEL = {
  A4: ['A4 แนวตั้ง (210×297)', 'A4 portrait (210×297)'], A4L: ['A4 แนวนอน (297×210)', 'A4 landscape (297×210)'],
  A5: ['A5 แนวตั้ง (148×210)', 'A5 portrait (148×210)'], A5L: ['A5 แนวนอน (210×148)', 'A5 landscape (210×148)'],
  '80mm': ['สลิป 80 มม. แนวตั้ง', '80 mm slip (portrait)'], slipL: ['สลิปแนวนอน (210×99)', 'Landscape slip (210×99)']
};
const paperLabel = k => (PAPER_LABEL[k] || [k, k])[LANG === 'en' ? 1 : 0];
const PAPER_SPEC = {
  A4: { m: 14, fs: 1, L: 22, hh: 34, rh: 30, th: 44, sh: 28 }, A4L: { m: 12, fs: .95, L: 20, hh: 28, rh: 26, th: 40, sh: 24 },
  A5: { m: 9, fs: .82, L: 15, hh: 27, rh: 23, th: 34, sh: 22 }, A5L: { m: 9, fs: .8, L: 14, hh: 22, rh: 21, th: 30, sh: 18 },
  '80mm': { m: 4, fs: .8 }, slipL: { m: 7, fs: .74 }
};
const BASE_SIZE = { company: 9, title: 16, docinfo: 9, customer: 9.5, extra: 9, items: 9.5, totals: 9.5, words: 9.5, notes: 8.5, payment: 9, signature: 9, text: 9 };
const r1 = n => Math.round(n * 10) / 10;

/* Re-arrange a template for a paper size. Known blocks get a fresh layout; anything else is scaled. */
function autoLayout(tpl, paper) {
  paper = paper || tpl.paper;
  const [W, H] = PAPERS[paper], old = PAPERS[tpl.paper] || PAPERS.A4, sp = PAPER_SPEC[paper];
  const m = sp.m, cw = W - 2 * m, st = tpl.style || 'minimal';
  const vis = b => b && !(b.p && b.p.hidden);
  const one = ty => tpl.blocks.find(b => b.type === ty);
  const placed = new Set();
  const put = (b, x, y, w, h, extra) => { if (!b) return; Object.assign(b, { x: r1(x), y: r1(y), w: r1(w), h: r1(Math.max(h, .3)) }); if (extra) Object.assign(b.p, extra); placed.add(b); };
  for (const b of tpl.blocks) if (BASE_SIZE[b.type]) b.p.size = r1(BASE_SIZE[b.type] * sp.fs * (b.type === 'title' && st === 'band' ? 1.1 : 1));
  const company = one('company'); if (company) company.p.nameSize = r1(13 * sp.fs);
  tpl.base = r1(9.5 * sp.fs);
  const band = tpl.blocks.find(b => b.type === 'shape' && b.p.role === 'band'), divider = tpl.blocks.find(b => b.type === 'shape' && b.p.role === 'divider');
  const logo = one('logo'), title = one('title'), info = one('docinfo'), cust = one('customer'), extra = one('extra'), pay = one('payment');
  const items = one('items'), totals = one('totals'), words = one('words'), notes = one('notes'), sig = one('signature');
  const thanks = tpl.blocks.filter(b => b.type === 'text' && b.p.role === 'thanks');
  const qr = one('qr'), hasQr = vis(qr);
  const nExtra = (tpl.extraFields || []).length;
  if (items) Object.assign(items.p, { compact: paper === '80mm', showUnit: paper !== '80mm' && W >= 140 });
  if (info) info.p.inline = paper === '80mm';

  if (paper === '80mm') {
    let y = m;
    if (vis(logo)) { put(logo, W / 2 - 8, y, 16, 13); y += 14; } else put(logo, W / 2 - 8, y, 16, 13);
    put(company, m, y, cw, 22, { align: 'center', color: st === 'band' ? '#FFFFFF' : company && company.p.color }); y += 23;
    put(band, 0, 0, W, y);
    put(divider, m, y, cw, .3, { dashed: true }); y += 2;
    put(title, m, y, cw, 10, { align: 'center', color: st === 'band' ? '' : title && title.p.color }); y += 11;
    put(info, m, y, cw, 9, { align: 'center' }); y += 10;
    put(cust, m, y, cw, 12, { border: false }); y += 13;
    if (extra) { const h = Math.max(6, nExtra * 3.6 + 2); put(extra, m, y, cw, h, { border: false }); y += h + 1; }
    put(items, m, y, cw, 40); y += 42;
    put(totals, m, y, cw, 34); y += 35;
    put(words, m, y, cw, 8, { align: 'center', alignGrand: false, padX: 0 }); y += 9;
    put(pay, m, y, cw, 6, { follow: '' }); y += 7;
    put(notes, m, y, cw, 10, { follow: '' }); y += 11;
    for (const tx of thanks) { put(tx, m, y, cw, 10, { align: 'center' }); y += 11; }
    if (qr) { put(qr, W / 2 - 14, y, 28, hasQr ? 32 : 0); if (hasQr) y += 34; }
    put(sig, m, y, cw, 22, { count: 1 });
  } else if (paper === 'slipL') {
    const fy = H - m - 22;
    put(logo, m, m, 12, 12); const cx = m + (vis(logo) ? 14 : 0);
    put(company, cx, m, cw * .56 - (cx - m), 19, { align: 'left', color: st === 'band' ? '#FFFFFF' : company && company.p.color });
    put(title, m + cw * .6, m, cw * .4, 9, { align: 'right' });
    put(info, m + cw * .6, m + 10, cw * .4, 8, { align: 'right', inline: true });
    put(band, 0, 0, W, m + 20);
    put(divider, m, m + 20.5, cw, .3);
    const y = m + 22;
    put(cust, m, y, cw * .56, 14, { border: false, pad: 0 });
    if (extra) put(extra, m + cw * .6, y, cw * .4, 14, { border: false, pad: 0, align: 'left' }); else put(pay, m + cw * .6, y, cw * .4, 6);
    put(items, m, y + 16, cw, fy - y - 18);
    put(totals, m + cw * .62, fy, cw * .38, 22);
    put(words, m, fy, cw * .58, 7, { align: 'left' });
    put(qr, m + cw * .58 - 20, fy - .5, hasQr ? 20 : 0, hasQr ? 24.5 : 0);
    put(words, m, fy, cw * .58 - (hasQr ? 22 : 0), 7, { align: 'left', alignGrand: false, padX: 0 });
    put(sig, m, fy + 8, cw * .58 - (hasQr ? 22 : 0), 14, { count: Math.min(2, (sig && sig.p.count) || 2), dateLine: false });
    if (pay && !placed.has(pay)) put(pay, m, fy - 4, 0, 0, { hidden: true });
    put(notes, m, fy, 0, 0, { hidden: true });
    for (const tx of thanks) put(tx, m, fy, 0, 0, { hidden: true });
  } else {
    let y = m; const rightW = cw * .42, rightX = m + cw - rightW;
    if (st === 'classic') {
      if (vis(logo)) { put(logo, W / 2 - sp.L / 2, y, sp.L, sp.L); y += sp.L + 1.5; } else put(logo, W / 2 - sp.L / 2, y, sp.L, sp.L);
      put(company, m + cw * .08, y, cw * .84, sp.hh - 6, { align: 'center' }); y += sp.hh - 5;
      put(divider, m, y, cw, .5); y += 2.5;
      const th = 14 * sp.fs + 3; put(title, m + cw * .2, y, cw * .6, th, { align: 'center' }); y += th + 3;
      const rx = m + cw * .64, rw = cw * .36, rh = sp.rh + (nExtra > 2 ? 6 : 0);
      put(cust, m, y, cw * .61, rh, { border: true, pad: 2.5 });
      if (extra) { put(info, rx, y, rw, rh * .38, { border: true, pad: 2, align: 'left' }); put(extra, rx, y + rh * .42, rw, rh * .58, { border: true, pad: 2, align: 'left' }); }
      else put(info, rx, y, rw, rh, { border: true, pad: 2.5, align: 'left' });
      y += rh + 4;
    } else {
      const hh = sp.hh, isBand = st === 'band';
      put(logo, m, y, sp.L, sp.L);
      const cx = m + (vis(logo) ? sp.L + 4 : 0);
      put(company, cx, y, cw * .57 - (cx - m), hh, { align: 'left', color: isBand ? '#FFFFFF' : company && company.p.color });
      put(title, rightX, y, rightW, hh * .55, { align: 'right', color: isBand ? '#FFFFFF' : title && title.p.color });
      if (!isBand) put(info, rightX, y + hh * .58, rightW, hh * .45, { align: 'right' });
      y += hh + (isBand ? 6 : 2.5);
      put(band, 0, 0, W, m + hh + 2);
      if (!isBand) { put(divider, m, y, cw, .4); y += 3; }
      const rh = sp.rh + (nExtra > 3 ? 6 : 0);
      put(cust, m, y, cw * .56, rh, { border: false, pad: 0 });
      let ry = y;
      if (isBand) { put(info, rightX, ry, rightW, Math.min(rh * .4, 12), { align: 'right' }); ry += Math.min(rh * .4, 12) + 1; }
      if (extra) put(extra, rightX, ry, rightW, y + rh - ry, { align: 'left', border: false, bg: 'accentSoft', pad: 2, radius: 1.5 });
      else if (pay && !isBand) put(pay, rightX, ry, rightW, Math.min(16, y + rh - ry));
      y += rh + 4;
    }
    const land = W > H, hasSig = vis(sig);
    const sigH = hasSig && !land ? sp.sh : 0, footH = sp.th;
    const itemsH = Math.max(18, H - m - sigH - (sigH ? 4 : 0) - footH - 4 - y);
    put(items, m, y, cw, itemsH); y += itemsH + 4;
    const tw = cw * (land ? .34 : .38), sw = land && hasSig ? cw * .3 : 0; let lw = cw - tw - sw - (sw ? 8 : 0) - cw * (land ? 0 : .04);
    if (sw) put(sig, m + lw + 4, y + 2, sw, footH - 2, { count: Math.min(2, sig.p.count || 2), dateLine: false });
    put(totals, m + cw - tw, y, tw, footH);
    const qs = hasQr ? r1(Math.min(footH - 2, 22 * sp.fs + 4)) : 0;
    if (qr) put(qr, m + lw - qs, y, qs ? qs - 3.5 : 0, qs);
    const lw0 = lw; lw = lw - (qs ? qs + 2 : 0);
    const wy = y + 11 * sp.fs, wh = 10 * sp.fs + 1;
    put(words, m, wy, lw, wh, { alignGrand: true, pad: 0, padX: 2.5, align: 'center' });
    let ly = wy + wh + 2;
    if (pay && !placed.has(pay)) { put(pay, m, ly, lw, 7 * sp.fs, { follow: 'words' }); ly += 7 * sp.fs + 2; }
    put(notes, m, ly, lw, Math.max(8, y + footH - ly), { follow: 'words' });
    for (const tx of thanks) put(tx, m, ly, lw, 0, { hidden: true });
    if (!placed.has(sig)) put(sig, m, H - m - sigH, cw, sigH);
  }
  for (const b of tpl.blocks) if (!placed.has(b)) { const kx = W / old[0], ky = H / old[1]; b.x = r1(b.x * kx); b.w = r1(b.w * kx); b.y = r1(b.y * ky); b.h = r1(Math.max(b.h * ky, .3)); }
  tpl.paper = paper;
  return tpl;
}

/* ---------- extra header fields (check-in, table no., plate no. …) ---------- */
const F = (k, th, en, type = 'text') => ({ k, th, en, type });
const EXTRA_TYPES = ['text', 'number', 'date', 'checkin', 'nights', 'rooms', 'checkout'];

/* ---------- template presets ---------- */
function B(type, x, y, w, h, p = {}) { return { id: uid(), type, x, y, w, h, p }; }
const PRESET_DEFS = {
  minimal:    { th: 'มินิมอล', en: 'Minimal', style: 'minimal', paper: 'A4', accent: '#13A387', font: 'plex' },
  classic:    { th: 'คลาสสิก', en: 'Classic', style: 'classic', paper: 'A4', accent: '#1F3A5F', font: 'sarabun', items: { grid: true, minRows: 8 }, sig: ['payer', 'receiver'] },
  modern:     { th: 'โมเดิร์น', en: 'Modern', style: 'band', paper: 'A4', accent: '#6D5BD0', font: 'plex', items: { headerBg: '#F1EFFC', headerText: '#3B2F86', striped: true, showNo: false }, sig: ['customerSign', 'receiver', 'authorized'] },
  a5:         { th: 'ครึ่ง A4 (A5)', en: 'Half A4 (A5)', style: 'minimal', paper: 'A5', accent: '#13A387', font: 'plex' },
  slip:       { th: 'สลิป 80 มม.', en: '80 mm slip', style: 'minimal', paper: '80mm', accent: '#111111', font: 'plex', thanks: 'ขอบคุณที่ใช้บริการ\nThank you!', items: { headerBg: 'transparent', headerText: '#111111' }, noSig: true },
  // business templates
  hotel:      { biz: 1, icon: '🏨', th: 'โรงแรม / รีสอร์ท', en: 'Hotel / Resort', style: 'band', paper: 'A4', accent: '#A47E3B', font: 'plex', sig: ['customerSign', 'receiver'],
                extra: [F('checkin', 'วันเช็คอิน', 'Check-in', 'checkin'), F('checkout', 'วันเช็คเอาท์', 'Check-out', 'checkout'), F('nights', 'จำนวนคืน', 'Nights', 'nights'), F('rooms', 'จำนวนห้อง', 'Rooms', 'rooms'), F('room', 'เลขห้อง', 'Room no.')],
                notes: 'เช็คอิน 14:00 น. / เช็คเอาท์ 12:00 น.', items: { headerBg: '#F6EFE2', headerText: '#5E4520', striped: true } },
  restaurant: { biz: 1, icon: '🍜', th: 'ร้านอาหาร / คาเฟ่', en: 'Restaurant / Café', style: 'minimal', paper: '80mm', accent: '#D9622B', font: 'plex', thanks: 'ขอบคุณที่มาอุดหนุน\nThank you, see you again!',
                extra: [F('table', 'โต๊ะ', 'Table'), F('guests', 'จำนวนลูกค้า', 'Guests', 'number')], items: { headerBg: 'transparent', headerText: '#111111' }, noSig: true },
  retail:     { biz: 1, icon: '🛍️', th: 'ร้านค้าปลีก', en: 'Retail shop', style: 'minimal', paper: 'A5', accent: '#2F7BEA', font: 'plex', sig: ['receiver'] },
  service:    { biz: 1, icon: '💼', th: 'บริการ / เอเจนซี่', en: 'Services / Agency', style: 'minimal', paper: 'A4', accent: '#13A387', font: 'plex', extra: [F('project', 'โครงการ', 'Project'), F('period', 'ระยะเวลางาน', 'Period')] },
  clinic:     { biz: 1, icon: '🩺', th: 'คลินิก / สุขภาพ', en: 'Clinic / Health', style: 'classic', paper: 'A5', accent: '#0E8A9E', font: 'plex', sig: ['receiver'],
                extra: [F('hn', 'เลขผู้ป่วย (HN)', 'Patient no. (HN)'), F('visit', 'วันที่รับบริการ', 'Visit date', 'date'), F('doctor', 'แพทย์ผู้ตรวจ', 'Doctor')] },
  garage:     { biz: 1, icon: '🚗', th: 'อู่ซ่อมรถ / คาร์แคร์', en: 'Car service', style: 'classic', paper: 'A4', accent: '#C2410C', font: 'sarabun', items: { grid: true }, sig: ['customerSign', 'receiver'],
                extra: [F('plate', 'ทะเบียนรถ', 'Plate no.'), F('car', 'ยี่ห้อ / รุ่น', 'Make / model'), F('mileage', 'เลขไมล์ (กม.)', 'Mileage (km)', 'number')] },
  tutor:      { biz: 1, icon: '🎓', th: 'โรงเรียน / กวดวิชา', en: 'School / Tutoring', style: 'band', paper: 'A5L', accent: '#4F46E5', font: 'plex', sig: ['receiver'],
                extra: [F('student', 'ชื่อนักเรียน', 'Student'), F('course', 'คอร์สเรียน', 'Course'), F('term', 'ภาคเรียน / รอบ', 'Term')] },
  rental:     { biz: 1, icon: '🏢', th: 'ให้เช่า / อพาร์ตเมนต์', en: 'Rental / Apartment', style: 'minimal', paper: 'slipL', accent: '#0F766E', font: 'plex', sig: ['payer', 'receiver'],
                extra: [F('room', 'ห้อง / ยูนิต', 'Room / unit'), F('month', 'ประจำเดือน', 'For month'), F('meter', 'มิเตอร์น้ำ/ไฟ', 'Water / power meter')] }
};
const presetName = k => (PRESET_DEFS[k] ? (LANG === 'en' ? PRESET_DEFS[k].en : PRESET_DEFS[k].th) : k);
function makeTemplate(key) {
  const d = PRESET_DEFS[key] || PRESET_DEFS.minimal;
  const blocks = [];
  if (d.style === 'band') blocks.push(B('shape', 0, 0, 1, 1, { kind: 'rect', accentFill: true, thickness: 0, stroke: 'transparent', role: 'band' }));
  blocks.push(B('logo', 0, 0, 1, 1), B('company', 0, 0, 1, 1, { showEn: true, showAddress: true, showTaxId: true, showContact: true, fit: true }));
  blocks.push(B('title', 0, 0, 1, 1, { fit: true, bold: true, accentColor: d.style !== 'band', copyTag: d.paper !== '80mm' }));
  blocks.push(B('docinfo', 0, 0, 1, 1, { showDue: true, showRef: true }));
  if (d.style !== 'band') blocks.push(B('shape', 0, 0, 1, 1, { kind: 'line', stroke: d.style === 'classic' ? d.accent : (d.paper === '80mm' ? '#111111' : '#E3E6EA'), thickness: .4, role: 'divider' }));
  blocks.push(B('customer', 0, 0, 1, 1, { fit: true }));
  if (d.extra) blocks.push(B('extra', 0, 0, 1, 1, { fit: true }));
  blocks.push(B('payment', 0, 0, 1, 1, {}));
  blocks.push(B('items', 0, 0, 1, 1, { headerBg: 'accent', showNo: true, showUnit: true, ...(d.items || {}) }));
  blocks.push(B('words', 0, 0, 1, 1, { fit: true, bg: d.style === 'minimal' && d.paper !== '80mm' ? 'accentSoft' : '', pad: d.style === 'minimal' && d.paper !== '80mm' ? 2.2 : 0, radius: 1.5 }));
  blocks.push(B('totals', 0, 0, 1, 1, {}));
  blocks.push(B('notes', 0, 0, 1, 1, {}));
  blocks.push(B('qr', 0, 0, 1, 1, { caption: true }));
  if (d.thanks) blocks.push(B('text', 0, 0, 1, 1, { text: d.thanks, role: 'thanks' }));
  if (!d.noSig) blocks.push(B('signature', 0, 0, 1, 1, { count: (d.sig || ['receiver', 'authorized']).length, labels: d.sig || ['receiver', 'authorized'], dateLine: true, useSig: true }));
  const tpl = { id: uid(), preset: key, name: LANG === 'en' ? d.en : d.th, style: d.style, paper: d.paper, accent: d.accent, font: d.font, base: 9.5, extraFields: clone(d.extra || []), presetNotes: d.notes || '', blocks };
  return autoLayout(tpl, d.paper);
}
const PRESETS = Object.fromEntries(Object.keys(PRESET_DEFS).map(k => [k, () => makeTemplate(k)]));

/* check-in / nights / check-out stay in sync */
function syncStay(doc, tpl, changed) {
  const fs = (tpl && tpl.extraFields) || []; const ex = doc.extra = doc.extra || {};
  const ci = fs.find(f => f.type === 'checkin'), co = fs.find(f => f.type === 'checkout'), ng = fs.find(f => f.type === 'nights');
  if (!ci) return;
  if (!ex[ci.k]) ex[ci.k] = doc.date || todayISO();
  const nights = ng ? Math.max(1, parseInt(ex[ng.k]) || 1) : 1;
  if (co && (changed === 'checkout') && ex[co.k] && ex[ci.k]) {
    const n = Math.round((new Date(ex[co.k]) - new Date(ex[ci.k])) / 864e5);
    if (ng) ex[ng.k] = Math.max(1, n);
    if (n < 1) ex[co.k] = addDays(ex[ci.k], 1);
  } else if (co) ex[co.k] = addDays(ex[ci.k], nights);
  const rm = fs.find(f => f.type === 'rooms');
  if (rm) ex[rm.k] = Math.max(1, parseInt(ex[rm.k]) || 1);
  if (ng) {
    ex[ng.k] = Math.max(1, parseInt(ex[ng.k]) || 1);
    // room lines: amount = price × rooms (qty) × nights
    for (const it of doc.items) if (isNightly(it.unit)) { it.nights = ex[ng.k]; if (rm && (changed === 'rooms' || it.qty === undefined || it.qty === '')) it.qty = ex[rm.k]; }
  }
}
function ensureExtra(doc) { const tpl = templateFor(doc); doc.extra = doc.extra || {}; syncStay(doc, tpl); }

/* ---------- storage ---------- */
const STORE_KEY = 'bestinvoice.data.v1';
let S = null;
function blankState() {
  const tpl = makeTemplate('minimal');
  return {
    version: 1,
    settings: {
      lang: 'th', theme: 'minimal', showQR: true, vatRate: 7, vatMode: 'exclusive', buddhistYear: true, docLang: 'both', defaultTemplate: tpl.id, printCopy: false,
      prefixes: { receipt: 'RC', taxreceipt: 'RT', invoice: 'IV', quotation: 'QT' },
      notes: { receipt: '', taxreceipt: '', invoice: 'กรุณาชำระเงินภายในวันที่ครบกำหนด', quotation: 'ใบเสนอราคานี้มีอายุ 30 วัน' },
      company: { nameTh: '', nameEn: '', taxId: '', branch: '', address: '', phone: '', email: '', website: '', logo: '', signature: '' }
    },
    customers: [], products: [], documents: [], templates: [tpl]
  };
}
function loadState() {
  let raw = null;
  try { raw = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (raw) { try { S = JSON.parse(raw); } catch (e) { S = null; } }
  if (!S || !S.settings) { S = blankState(); seedSample(); }
  const b = blankState();
  S.settings = { ...b.settings, ...S.settings, company: { ...b.settings.company, ...S.settings.company }, prefixes: { ...b.settings.prefixes, ...S.settings.prefixes }, notes: { ...b.settings.notes, ...S.settings.notes } };
  for (const k of ['customers', 'products', 'documents', 'templates']) S[k] = S[k] || [];
  if (!S.templates.length) S.templates.push(makeTemplate('minimal'));
  LANG = S.settings.lang || 'th';
}
let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); }
    catch (e) { toast('⚠ ' + (LANG === 'th' ? 'พื้นที่เก็บข้อมูลเต็ม — ลองลดขนาดรูปโลโก้ หรือดาวน์โหลดไฟล์สำรอง' : 'Storage is full — use a smaller logo or download a backup')); }
    if (window.bestinvoiceNative && window.bestinvoiceNative.autoBackup) window.bestinvoiceNative.autoBackup(JSON.stringify(S));
  }, 250);
}

/* ---------- numbering ---------- */
function nextNumber(type, iso) {
  const pre = (S.settings.prefixes[type] || 'DOC');
  const [y, m] = (iso || todayISO()).split('-');
  const yy = S.settings.buddhistYear ? String(+y + 543).slice(-2) : y.slice(-2);
  const head = `${pre}${yy}${m}-`;
  let max = 0;
  for (const d of S.documents) if (d.number && d.number.startsWith(head)) max = Math.max(max, parseInt(d.number.slice(head.length)) || 0);
  return head + String(max + 1).padStart(4, '0');
}

/* ---------- sample data ---------- */
function seedSample() {
  const c = S.settings.company;
  Object.assign(c, {
    nameTh: 'บริษัท เบสท์ ครีเอทีฟ โซลูชั่นส์ แอนด์ เทรดดิ้ง อินเตอร์เนชั่นแนล จำกัด (สำนักงานใหญ่)',
    nameEn: 'Best Creative Solutions & Trading International Co., Ltd.',
    taxId: '0105567000123', branch: 'สำนักงานใหญ่', address: '88/8 อาคารเบสท์ทาวเวอร์ ชั้น 12 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
    phone: '02-123-4567', email: 'billing@bestcreative.co.th', website: 'www.bestcreative.co.th'
  });
  const cs = [
    ['บริษัท สยามดิจิทัล มาร์เก็ตติ้ง จำกัด', '0105560011223', 'สำนักงานใหญ่', '199 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310', '02-555-0101', 'คุณมานพ'],
    ['ห้างหุ้นส่วนจำกัด เชียงใหม่ ฟู้ด แอนด์ เบฟเวอเรจ', '0503558004455', '00001', '45 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200', '053-222-333', 'คุณศิริพร'],
    ['คุณปิยะนุช ทองดี', '', '', '12/3 หมู่ 5 ต.บางเมือง อ.เมือง จ.สมุทรปราการ 10270', '081-234-5678', ''],
    ['Northwind Trading Co., Ltd.', '0105561099887', 'Head office', '1 Wireless Road, Lumpini, Pathumwan, Bangkok 10330', '02-650-1000', 'Mr. James'],
    ['บริษัท ภูเก็ต รีสอร์ท แมเนจเม้นท์ จำกัด', '0835562001234', 'สำนักงานใหญ่', '77 ถนนหาดป่าตอง ต.ป่าตอง อ.กะทู้ จ.ภูเก็ต 83150', '076-340-111', 'คุณวิชัย']
  ];
  S.customers = cs.map(x => ({ id: uid(), name: x[0], taxId: x[1], branch: x[2], address: x[3], phone: x[4], contact: x[5], email: '' }));
  const ps = [['ออกแบบโลโก้และอัตลักษณ์องค์กร', 'งาน', 15000], ['ดูแลเว็บไซต์รายเดือน', 'เดือน', 4500], ['ถ่ายภาพสินค้า (ต่อภาพ)', 'ภาพ', 350], ['พิมพ์นามบัตร 2 หน้า', 'กล่อง', 450], ['ค่าโฆษณาออนไลน์', 'แคมเปญ', 8000], ['ที่ปรึกษาการตลาด', 'ชั่วโมง', 2500], ['ห้องดีลักซ์ วิวทะเล', 'คืน', 3200], ['อาหารเช้า (ต่อท่าน)', 'ท่าน', 350]];
  S.products = ps.map((x, i) => ({ id: uid(), name: x[0], unit: x[1], price: x[2], sku: 'P' + String(i + 1).padStart(3, '0') }));
  const now = new Date(); const types = ['receipt', 'taxreceipt', 'invoice', 'quotation'];
  const plan = [[0, 'taxreceipt', 'paid'], [0, 'receipt', 'paid'], [0, 'invoice', 'unpaid'], [0, 'quotation', 'draft'], [1, 'taxreceipt', 'paid'], [1, 'receipt', 'paid'], [1, 'invoice', 'unpaid'], [2, 'taxreceipt', 'paid'], [2, 'receipt', 'paid'], [3, 'taxreceipt', 'paid'], [3, 'receipt', 'cancelled'], [4, 'receipt', 'paid'], [5, 'taxreceipt', 'paid']];
  plan.forEach(([back, type, status], i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - back, Math.max(1, Math.min(27, now.getDate() - (i % 5) * 2)));
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const cu = S.customers[i % S.customers.length];
    const items = [0, 1, 2].slice(0, 1 + (i % 3)).map(k => { const p = S.products[(i + k) % S.products.length]; return { id: uid(), desc: p.name, qty: 1 + ((i + k) % 3), unit: p.unit, price: p.price, discount: 0 }; });
    const doc = newDocObject(type, iso);
    Object.assign(doc, { status, customerId: cu.id, customer: { name: cu.name, taxId: cu.taxId, branch: cu.branch, address: cu.address, phone: cu.phone }, items, payMethod: i % 2 ? 'cash' : 'transfer', whtRate: i === 0 ? 3 : 0 });
    S.documents.push(doc);
  });
}
function newDocObject(type = 'receipt', iso = todayISO()) {
  const doc = {
    id: uid(), type, number: '', date: iso, dueDate: type === 'invoice' || type === 'quotation' ? addDays(iso, 30) : '', reference: '',
    status: type === 'receipt' || type === 'taxreceipt' ? 'paid' : type === 'quotation' ? 'draft' : 'unpaid',
    customerId: '', customer: { name: '', taxId: '', branch: '', address: '', phone: '' },
    items: [{ id: uid(), desc: '', qty: 1, unit: '', price: 0, discount: 0 }],
    discount: 0, vatMode: S.settings.vatMode, vatRate: S.settings.vatRate, whtRate: 0, payMethod: type === 'quotation' ? '' : 'cash',
    notes: S.settings.notes[type] || '', docLang: S.settings.docLang, templateId: S.settings.defaultTemplate, createdAt: Date.now(), extra: {}
  };
  if (typeof templateFor === 'function') { const tp = templateFor(doc); syncStay(doc, tp); if (tp.presetNotes && !doc.notes) doc.notes = tp.presetNotes; }
  doc.number = nextNumber(type, iso);
  return doc;
}
