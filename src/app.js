/* Bestinvoice — application shell and views */
const IC = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  printer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', upload:'<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>', edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>', x:'<path d="M18 6L6 18M6 6l12 12"/>',
  back:'<path d="M19 12H5M12 19l-7-7 7-7"/>', undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>', redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  grip:'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  type:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>', table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 10v10"/>',
  sum:'<path d="M18 4H6l6 8-6 8h12"/>', user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  building:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
  hash:'<path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18"/>', heading:'<path d="M6 4v16M18 4v16M6 12h12"/>',
  pen:'<path d="M3 21c3-1 5-3 7-6l7-7a2.1 2.1 0 0 0-3-3l-7 7c-3 2-5 4-6 7z"/><path d="M14 21h7"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', words:'<path d="M4 7h16M4 12h10M4 17h13"/>',
  note:'<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4"/>', shape:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16"/>',
  logo:'<circle cx="12" cy="12" r="9"/><path d="M8 14l3-4 2 3 1.5-2L17 14"/>',
  alignL:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>', alignC:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>', alignR:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  check:'<path d="M5 12l5 5L20 7"/>', calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  arrow:'<path d="M5 12h14M13 5l7 7-7 7"/>', wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="2.5"/><path d="M3 10h2M19 15h2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  pdf:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9.5 14.5L12 17l2.5-2.5"/>',
  chev:'<path d="M6 9l6 6 6-6"/>', shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2"/>', palette:'<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>', sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'
};
const ico = (n, s = 18) => `<svg class="i" viewBox="0 0 24 24" style="width:${s}px;height:${s}px">${IC[n] || ''}</svg>`;
const LOGO = '%%LOGO%%';

const UI = { view: 'dashboard', q: '', docType: 'all', docStatus: 'all', docPeriod: 'all', page: 1, ed: null, prevView: 'documents' };

/* ---------- small helpers ---------- */
function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }
function modal({ title, body, wide, onSave, saveLabel, onOpen, danger }) {
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.innerHTML = `<div class="modal${wide ? ' wide' : ''}"><div class="modal-h"><h3>${esc(title)}</h3><button class="btn ghost icon" data-x>${ico('x')}</button></div><div class="modal-b">${body}</div>${onSave ? `<div class="modal-f"><button class="btn" data-x>${t('cancel')}</button><button class="btn ${danger ? 'danger' : 'primary'}" data-ok>${esc(saveLabel || t('save'))}</button></div>` : ''}</div>`;
  const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
  ov.querySelectorAll('[data-x]').forEach(b => b.onclick = close);
  if (onSave) ov.querySelector('[data-ok]').onclick = () => { if (onSave(ov) !== false) close(); };
  document.body.appendChild(ov); document.addEventListener('keydown', onKey);
  if (onOpen) onOpen(ov);
  const f = ov.querySelector('input,textarea,select'); if (f) setTimeout(() => f.focus(), 30);
  return close;
}
function confirmBox(msg, okLabel) { return new Promise(res => { let done = false; modal({ title: '⚠', body: `<p style="margin:0;font-size:15px">${esc(msg)}</p>`, saveLabel: okLabel || t('delete'), danger: true, onSave: () => { done = true; res(true); } }); const ov = document.querySelector('.overlay:last-child'); new MutationObserver((m, o) => { if (!document.body.contains(ov)) { o.disconnect(); if (!done) res(false); } }).observe(document.body, { childList: true }); }); }
function dropdown(anchor, items) {
  $$('.dropdown').forEach(d => d.remove());
  const dd = document.createElement('div'); dd.className = 'dropdown';
  dd.innerHTML = items.map((it, i) => it === '-' ? '<hr>' : `<button data-i="${i}" class="${it.danger ? 'danger' : ''}">${it.icon ? ico(it.icon, 16) : ''}${esc(it.label)}</button>`).join('');
  document.body.appendChild(dd);
  const r = anchor.getBoundingClientRect();
  dd.style.top = Math.min(r.bottom + 4, innerHeight - dd.offsetHeight - 8) + 'px';
  dd.style.left = Math.max(8, Math.min(r.right - dd.offsetWidth, innerWidth - dd.offsetWidth - 8)) + 'px';
  dd.onclick = e => { const b = e.target.closest('button'); if (!b) return; dd.remove(); items[+b.dataset.i].run(); };
  setTimeout(() => document.addEventListener('mousedown', function h(e) { if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('mousedown', h); } }), 0);
}
function readImage(file, maxPx = 500) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => { const k = Math.min(1, maxPx / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/png')); }; img.onerror = rej; img.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });
}
function pickFile(accept) { return new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => res(i.files[0]); i.click(); }); }
function download(name, text, type = 'application/json') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
const sel = (opts, cur) => opts.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(cur) ? ' selected' : ''}>${esc(l)}</option>`).join('');
const docStatus = d => (d.type === 'invoice' && d.status === 'unpaid' && d.dueDate && d.dueDate < todayISO()) ? 'overdue' : d.status;
const pill = d => { const s = docStatus(d); return `<span class="pill ${s}">${t(s)}</span>`; };

/* ---------- shell ---------- */
function renderShell() {
  const co = S.settings.company;
  $('#app').innerHTML = `
  <aside class="side">
    <div class="brand"><img src="${LOGO}" alt=""><b>Best<span>invoice</span></b></div>
    <div class="co-card" data-act="go" data-v="settings"><div class="lg">${co.logo ? `<img src="${co.logo}" alt="">` : ico('building', 16)}</div><div style="min-width:0"><div class="nm">${esc(co.nameTh || co.nameEn || (LANG === 'th' ? 'ตั้งชื่อบริษัทของคุณ' : 'Set your company name'))}</div><div class="sb">${esc(co.branch || t('headOffice'))}</div></div></div>
    <div class="nav-label">${t('workspace')}</div>
    <nav class="nav">
      ${[['dashboard', 'dashboard'], ['documents', 'file', S.documents.length], ['customers', 'users', S.customers.length], ['products', 'box', S.products.length], ['designer', 'layout'], ['verify', 'shield'], ['settings', 'gear']].map(([v, i, c]) => `<button data-act="go" data-v="${v}" class="${UI.view === v || (v === 'documents' && UI.view === 'editor') ? 'on' : ''}">${ico(i)}${t(v)}${c !== undefined ? `<span class="cnt">${c}</span>` : ''}</button>`).join('')}
    </nav>
    <div class="side-foot">
      <div class="status-card"><b><span class="dot"></span>${t('ready')}</b><div style="margin-top:4px">${t('dataLocal')}</div><div>${t('dataSaved')}</div></div>
      <div class="lang-switch"><button data-act="lang" data-v="th" class="${LANG === 'th' ? 'on' : ''}">ไทย</button><button data-act="lang" data-v="en" class="${LANG === 'en' ? 'on' : ''}">EN</button></div>
    </div>
  </aside>
  <section class="main">
    <header class="topbar">
      <div class="crumb">${esc(t(UI.view === 'editor' ? 'documents' : UI.view))}</div>
      <div class="search"><input id="q" placeholder="${esc(t('search'))}" value="${esc(UI.q)}">${ico('search')}</div>
      <div class="sp"></div>
      <button class="btn icon" data-act="themepick" title="${esc(t('theme'))}">${ico('palette')}</button>
      <button class="btn primary" data-act="newdoc">${ico('plus')}<span>${t('newDoc')}</span></button>
    </header>
    <div class="content" id="content"></div>
  </section>`;
  $('#q').addEventListener('input', e => { UI.q = e.target.value; UI.page = 1; if (!['documents', 'customers', 'products'].includes(UI.view)) { UI.view = 'documents'; renderShell(); $('#q').focus(); const v = $('#q').value; $('#q').setSelectionRange(v.length, v.length); } renderView(); });
  renderView();
}
function go(v) { UI.view = v; UI.page = 1; if (v !== 'editor') UI.ed = null; renderShell(); $('#content').scrollTop = 0; }
function renderView() {
  const c = $('#content'); c.style.padding = '';
  ({ dashboard: viewDashboard, documents: viewDocuments, editor: viewEditor, customers: viewCustomers, products: viewProducts, designer: viewDesigner, verify: viewVerify, settings: viewSettings })[UI.view](c);
}

/* ---------- dashboard ---------- */
function viewDashboard(c) {
  const now = todayISO().slice(0, 7);
  const isRev = d => (d.type === 'receipt' || d.type === 'taxreceipt') && d.status === 'paid';
  const rev = S.documents.filter(d => isRev(d) && d.date.startsWith(now)).reduce((a, d) => a + calcDoc(d).total, 0);
  const unpaid = S.documents.filter(d => d.type === 'invoice' && d.status === 'unpaid');
  const out = unpaid.reduce((a, d) => a + calcDoc(d).total, 0);
  const months = []; const base = new Date();
  for (let i = 5; i >= 0; i--) { const d = new Date(base.getFullYear(), base.getMonth() - i, 1); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; months.push([k, (LANG === 'th' ? TH_MONTHS : EN_MONTHS)[d.getMonth()], S.documents.filter(x => isRev(x) && x.date.startsWith(k)).reduce((a, x) => a + calcDoc(x).total, 0)]); }
  const mx = Math.max(1, ...months.map(m => m[2]));
  const h = new Date().getHours(); const greet = t(h < 12 ? 'goodMorning' : h < 17 ? 'goodAfternoon' : 'goodEvening');
  const recent = [...S.documents].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).slice(0, 6);
  const co = S.settings.company;
  const steps = [[!!(co.nameTh || co.nameEn) && !!co.logo, 'qs1', 'settings'], [S.templates.some(x => x.edited), 'qs2', 'designer'], [S.documents.length > 0, 'qs3', 'newdoc']];
  c.innerHTML = `
    <div class="hero"><div><h1>${greet} 👋</h1><p>${t('dashSub')}</p></div>
      <div class="quick">${['receipt', 'taxreceipt', 'invoice', 'quotation'].map(ty => `<button class="btn${ty === 'receipt' ? ' primary' : ''}" data-act="newdoc" data-type="${ty}">${ico(ty === 'receipt' ? 'plus' : 'file', 16)}${t(ty)}</button>`).join('')}</div></div>
    <div class="stats">
      ${[['revenueMonth', '฿' + money(rev), t('fromPaid'), 'wallet', 'var(--accent-50)', 'var(--accent-600)'], ['outstanding', '฿' + money(out), unpaid.length + ' ' + t('unpaidDocs'), 'clock', 'var(--blue-50)', 'var(--blue)'], ['docsMonth', S.documents.filter(d => d.date.startsWith(now)).length, t('allTypes'), 'file', 'var(--amber-50)', 'var(--amber)'], ['totalCustomers', S.customers.length, t('inYourList'), 'users', 'var(--green-50)', 'var(--green)']]
        .map(([k, v, s, i, bg, fg]) => `<div class="card stat"><div class="lb"><span class="ic" style="background:${bg};color:${fg}">${ico(i, 16)}</span>${t(k)}</div><div class="v">${v}</div><div class="s">${esc(s)}</div></div>`).join('')}
    </div>
    <div class="dash-grid">
      <div class="card"><div class="card-h"><h3>${t('recentDocs')}</h3><button class="btn sm" data-act="go" data-v="documents">${t('viewAll')} ${ico('arrow', 14)}</button></div>
        ${recent.length ? `<div class="tbl-wrap"><table class="tbl"><tbody>${recent.map(d => `<tr data-act="opendoc" data-id="${d.id}"><td><div class="who"><span class="av">${esc(initials(d.customer.name))}</span><div style="min-width:0"><b>${esc(d.customer.name || '—')}</b><small>${esc(d.number)} · ${fmtDate(d.date, LANG)}</small></div></div></td><td><span class="type-tag">${t(d.type)}</span></td><td class="r">฿${money(calcDoc(d).total)}</td><td>${pill(d)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty">${ico('file', 28)}<b>${t('noDocs')}</b>${t('noDocsSub')}</div>`}
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="card"><div class="card-h"><h3>${t('revenue6m')}</h3></div><div class="card-b"><div class="bars">${months.map((m, i) => `<div class="b${i === 5 ? ' cur' : ''}"><em>${m[2] ? (m[2] >= 1000 ? Math.round(m[2] / 1000) + 'k' : Math.round(m[2])) : ''}</em><i style="height:${Math.max(3, m[2] / mx * 100)}%"></i><span>${m[1]}</span></div>`).join('')}</div></div></div>
        <div class="card"><div class="card-h"><h3>${t('quickStart')}</h3></div><div class="card-b" style="display:flex;flex-direction:column;gap:10px">${steps.map(([done, k, v], i) => `<button class="btn" style="justify-content:flex-start;height:auto;padding:10px 12px" data-act="${v === 'newdoc' ? 'newdoc' : 'go'}" data-v="${v}"><span class="av" style="width:26px;height:26px;${done ? 'background:var(--accent);color:#fff' : ''}">${done ? ico('check', 14) : i + 1}</span>${t(k)}</button>`).join('')}</div></div>
      </div>
    </div>`;
}

/* ---------- documents list ---------- */
function filteredDocs() {
  const q = UI.q.trim().toLowerCase(); const now = new Date();
  const ym = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const thisM = ym(now), lastM = ym(new Date(now.getFullYear(), now.getMonth() - 1, 1)), thisY = String(now.getFullYear());
  return S.documents.filter(d => {
    if (UI.docStatus !== 'all' && docStatus(d) !== UI.docStatus) return false;
    if (UI.docPeriod === 'thisMonth' && !d.date.startsWith(thisM)) return false;
    if (UI.docPeriod === 'lastMonth' && !d.date.startsWith(lastM)) return false;
    if (UI.docPeriod === 'thisYear' && !d.date.startsWith(thisY)) return false;
    if (q && !(d.number + ' ' + d.customer.name + ' ' + d.items.map(i => i.desc).join(' ') + ' ' + (d.reference || '')).toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number));
}
function viewDocuments(c) {
  const base = filteredDocs();
  const list = UI.docType === 'all' ? base : base.filter(d => d.type === UI.docType);
  const per = 12, pages = Math.max(1, Math.ceil(list.length / per)); UI.page = Math.min(UI.page, pages);
  const rows = list.slice((UI.page - 1) * per, UI.page * per);
  c.innerHTML = `
    <div class="page-head"><div><h1>${t('documents')}</h1><p>${t('docsSub')}</p></div></div>
    <div class="tabs">${['all', 'receipt', 'taxreceipt', 'invoice', 'quotation'].map(ty => `<button data-act="doctype" data-v="${ty}" class="${UI.docType === ty ? 'on' : ''}">${t(ty)}<b>${ty === 'all' ? base.length : base.filter(d => d.type === ty).length}</b></button>`).join('')}</div>
    <div class="toolbar">
      <select class="inp" style="width:auto" data-uichange="docPeriod">${sel([['all', t('allTime')], ['thisMonth', t('thisMonth')], ['lastMonth', t('lastMonth')], ['thisYear', t('thisYear')]], UI.docPeriod)}</select>
      <select class="inp" style="width:auto" data-uichange="docStatus">${sel([['all', t('allStatus')], ['paid', t('paid')], ['unpaid', t('unpaid')], ['overdue', t('overdue')], ['draft', t('draft')], ['cancelled', t('cancelled')]], UI.docStatus)}</select>
      <div class="sp"></div>
    </div>
    <div class="card">
      ${rows.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('docNo')}</th><th>${t('date')}</th><th>${t('customer')}</th><th>${t('type')}</th><th class="r">${t('amount')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
      ${rows.map(d => `<tr data-act="opendoc" data-id="${d.id}"><td style="font-weight:600;white-space:nowrap">${esc(d.number)}</td><td class="muted" style="white-space:nowrap">${fmtDate(d.date, LANG)}</td><td><div class="who"><span class="av">${esc(initials(d.customer.name))}</span><b title="${esc(d.customer.name)}">${esc(d.customer.name || '—')}</b></div></td><td><span class="type-tag">${t(d.type)}</span></td><td class="r" style="font-weight:500">฿${money(calcDoc(d).total)}</td><td>${pill(d)}</td><td style="width:40px"><button class="menu-btn" data-act="docmenu" data-id="${d.id}">${ico('more')}</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="foot"><span>${t('showing', { a: rows.length, b: list.length })}</span><div style="display:flex;gap:6px;align-items:center"><button class="btn sm" data-act="pg" data-v="-1" ${UI.page <= 1 ? 'disabled' : ''}>‹</button><span style="padding:0 8px">${UI.page} / ${pages}</span><button class="btn sm" data-act="pg" data-v="1" ${UI.page >= pages ? 'disabled' : ''}>›</button></div></div>`
      : `<div class="empty">${ico('file', 30)}<b>${t('noDocs')}</b>${t('noDocsSub')}<div style="margin-top:16px"><button class="btn primary" data-act="newdoc">${ico('plus')}${t('newDoc')}</button></div></div>`}
    </div>`;
}
function docMenu(anchor, d) {
  dropdown(anchor, [
    { label: t('edit'), icon: 'edit', run: () => openDoc(d.id) },
    { label: t('printOriginal'), icon: 'printer', run: () => printNow(d, false) },
    { label: t('printCopy'), icon: 'printer', run: () => printNow(d, true) },
    { label: t('duplicate'), icon: 'copy', run: () => duplicateDoc(d) },
    '-',
    ...(d.status !== 'paid' ? [{ label: t('paid'), icon: 'check', run: () => { d.status = 'paid'; save(); renderView(); } }] : [{ label: t('unpaid'), icon: 'clock', run: () => { d.status = 'unpaid'; save(); renderView(); } }]),
    { label: t('cancelled'), icon: 'x', run: () => { d.status = 'cancelled'; save(); renderView(); } },
    '-',
    { label: t('delete'), icon: 'trash', danger: true, run: async () => { if (await confirmBox(t('confirmDelete'))) { S.documents = S.documents.filter(x => x.id !== d.id); save(); toast(t('deleted')); renderShell(); } } }
  ]);
}
function duplicateDoc(d) { const n = clone(d); n.id = uid(); n.date = todayISO(); n.number = nextNumber(n.type, n.date); n.createdAt = Date.now(); n.items.forEach(i => i.id = uid()); S.documents.push(n); save(); toast(t('duplicated')); openDoc(n.id); }

/* ---------- editor ---------- */
function newDoc(type = 'receipt') { UI.prevView = UI.view === 'editor' ? UI.prevView : UI.view; UI.ed = { doc: newDocObject(type), isNew: true, stored: false }; UI.view = 'editor'; renderShell(); }
function openDoc(id) { const d = S.documents.find(x => x.id === id); if (!d) return; UI.prevView = UI.view === 'editor' ? UI.prevView : UI.view; UI.ed = { doc: d, isNew: false, stored: true }; UI.view = 'editor'; renderShell(); }
function touchDoc() { const ed = UI.ed; if (!ed.stored) { S.documents.push(ed.doc); ed.stored = true; } save(); }

function templateSelect(d) {
  const cur = templateFor(d).id;
  const opt = biz => Object.entries(PRESET_DEFS).filter(([, v]) => !!v.biz === biz).map(([k, v]) => `<option value="preset:${k}">${v.icon ? v.icon + ' ' : '＋ '}${esc(presetName(k))}</option>`).join('');
  return `<select class="inp" data-f="templateId"><optgroup label="${esc(t('myTemplates'))}">${sel(S.templates.map(x => [x.id, x.name]), cur)}</optgroup><optgroup label="${esc(t('addFromPreset'))} — ${esc(t('bizTemplates'))}">${opt(true)}</optgroup><optgroup label="${esc(t('addFromPreset'))} — ${esc(t('basicTemplates'))}">${opt(false)}</optgroup></select>`;
}
function extraInput(f, d) {
  const v = (d.extra || {})[f.k] ?? ''; const lab = esc(LANG === 'en' ? f.en : f.th);
  if (f.type === 'nights' || f.type === 'rooms') return `<div class="field"><span>${lab}</span><div class="stepper"><button class="btn icon" data-act="edstep" data-k="${f.k}" data-v="-1">−</button><input class="inp num" data-ex="${f.k}" data-extype="${f.type}" value="${esc(v || 1)}" inputmode="numeric"><button class="btn icon" data-act="edstep" data-k="${f.k}" data-v="1">+</button></div></div>`;
  const date = ['date', 'checkin', 'checkout'].includes(f.type);
  return `<label class="field"><span>${lab}</span><input class="inp${f.type === 'number' ? ' num' : ''}" ${date ? 'type="date"' : ''} data-ex="${f.k}" data-extype="${f.type}" value="${esc(v)}" ${f.type === 'number' ? 'inputmode="numeric"' : ''}></label>`;
}
function productChips(q) {
  q = (q || '').trim().toLowerCase(); const d = UI.ed && UI.ed.doc;
  const list = S.products.filter(p => !q || (p.name + ' ' + p.sku).toLowerCase().includes(q)).slice(0, 40);
  return list.map(p => { const n = d ? d.items.filter(it => it.desc === p.name).reduce((a, it) => a + num(it.qty), 0) : 0;
    return `<button class="pchip${n ? ' in' : ''}" data-act="edaddprod" data-id="${p.id}">${ico('plus', 13)}<span>${esc(p.name)}</span><em>฿${money(p.price, p.price % 1 ? 2 : 0)}</em>${n ? `<i>×${n}</i>` : ''}</button>`; }).join('')
    + `<button class="pchip new" data-act="ednewprod">${ico('plus', 13)}${t('newProductChip')}</button>`;
}
function addProductToDoc(p) {
  const d = UI.ed.doc; const tpl = templateFor(d); const ng = (tpl.extraFields || []).find(f => f.type === 'nights');
  const rm = (tpl.extraFields || []).find(f => f.type === 'rooms'); const ex = d.extra || {};
  const stay = isNightly(p.unit) && ng;
  const same = d.items.find(it => it.desc === p.name && num(it.price) === num(p.price));
  if (same) same.qty = num(same.qty) + 1;
  else { const empty = d.items.find(it => !it.desc.trim() && !num(it.price)); const it = empty || { id: uid(), discount: 0 }; Object.assign(it, { desc: p.name, unit: p.unit, price: p.price, qty: stay && rm ? (parseInt(ex[rm.k]) || 1) : 1 }); if (stay) it.nights = parseInt(ex[ng.k]) || 1; if (!empty) d.items.push(it); }
  touchDoc(); const st = $('#content').scrollTop; renderView(); $('#content').scrollTop = st; toast('✓ ' + t('added'));
}
function custMatches(q) { q = q.trim().toLowerCase(); return S.customers.filter(c => !q || (c.name + ' ' + c.taxId + ' ' + c.phone + ' ' + (c.contact || '')).toLowerCase().includes(q)).slice(0, 8); }
function showCustList() {
  const ta = $('[data-combo]'), box = $('#cust-list'); if (!ta || !box) return;
  const q = ta.value.trim(), ms = custMatches(q); const exact = S.customers.some(c => c.name.trim() === q);
  const re = q ? new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig') : null;
  const hl = s => re ? esc(s).replace(re, m => `<mark>${m}</mark>`) : esc(s);
  UI.custOpts = [...ms.map(c => c.id), ...(q && !exact ? ['__new'] : [])];
  if (UI.custIdx >= UI.custOpts.length) UI.custIdx = UI.custOpts.length - 1;
  let h = ms.map((c, i) => `<div class="opt${i === UI.custIdx ? ' on' : ''}" data-pick="${c.id}"><span class="av">${esc(initials(c.name))}</span><div style="min-width:0"><b>${hl(c.name)}</b><small>${esc([c.taxId, c.phone, c.contact].filter(Boolean).join(' · '))}</small></div></div>`).join('');
  if (q && !exact) h += `<div class="opt add${UI.custIdx === ms.length ? ' on' : ''}" data-pick="__new"><span class="av" style="background:var(--accent);color:#fff">+</span><b>${esc(t('addAsNew', { x: q.slice(0, 60) }))}</b></div>`;
  box.innerHTML = h; box.hidden = !h;
}
function pickCustomer(id) {
  const d = UI.ed.doc; $('#cust-list') && ($('#cust-list').hidden = true);
  if (id === '__new') return addCustomerFromDoc();
  const c = S.customers.find(x => x.id === id); if (!c) return;
  d.customerId = c.id; d.customer = { name: c.name, taxId: c.taxId, branch: c.branch, address: c.address, phone: c.phone }; touchDoc(); renderView();
}
function addCustomerFromDoc() {
  const d = UI.ed.doc;
  editCustomer(null, { ...d.customer }, c => { d.customerId = c.id; d.customer = { name: c.name, taxId: c.taxId, branch: c.branch, address: c.address, phone: c.phone }; touchDoc(); });
}

function viewEditor(c) {
  const ed = UI.ed; if (!ed) return go('documents');
  const d = ed.doc; const k = calcDoc(d);
  const tpl = templateFor(d); const xf = tpl.extraFields || []; const hasStay = xf.some(f => f.type === 'checkin');
  c.innerHTML = `
    <div class="page-head" style="margin-bottom:18px"><div style="display:flex;gap:12px;align-items:center"><button class="btn icon" data-act="edback" title="${t('back')}">${ico('back')}</button><div><h1 style="font-size:24px">${ed.isNew && !ed.stored ? t('newDocTitle') : esc(d.number)}</h1><p style="margin-top:2px">${t(d.type)} · ${pill(d)}</p></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="edconvert">${ico('copy', 16)}${t('convertTo')}</button><button class="btn primary" data-act="edsave">${ico('check', 16)}${t('save')}</button></div></div>
    <div class="editor">
      <div class="form">
        <div class="card card-b sec"><h4><span class="n">1</span>${t('s1')}</h4>
          <div class="seg" style="margin-bottom:14px">${['receipt', 'taxreceipt', 'invoice', 'quotation'].map(ty => `<button data-act="edtype" data-v="${ty}" class="${d.type === ty ? 'on' : ''}">${t(ty)}</button>`).join('')}</div>
          <div class="grid g3">
            <label class="field"><span>${t('docNo')}</span><input class="inp" data-f="number" value="${esc(d.number)}"></label>
            <label class="field"><span>${t('date')}</span><input class="inp" type="date" data-f="date" value="${d.date}"></label>
            ${d.type === 'invoice' || d.type === 'quotation' ? `<label class="field"><span>${t('dueDate')}</span><input class="inp" type="date" data-f="dueDate" value="${d.dueDate || ''}"></label>` : `<label class="field"><span>${t('status')}</span><select class="inp" data-f="status" data-rerender>${sel(['paid', 'unpaid', 'draft', 'cancelled'].map(s => [s, t(s)]), d.status)}</select></label>`}
            <label class="field"><span>${t('reference')}</span><input class="inp" data-f="reference" value="${esc(d.reference)}"></label>
            <label class="field"><span>${t('docLang')}</span><select class="inp" data-f="docLang">${sel([['th', t('langTh')], ['en', t('langEn')], ['both', t('langBoth')]], d.docLang)}</select></label>
            <label class="field"><span>${t('template')}</span>${templateSelect(d)}</label>
            ${d.type === 'invoice' || d.type === 'quotation' ? `<label class="field"><span>${t('status')}</span><select class="inp" data-f="status" data-rerender>${sel(['paid', 'unpaid', 'draft', 'cancelled'].map(s => [s, t(s)]), d.status)}</select></label>` : ''}
          </div></div>
        ${xf.length ? `<div class="card card-b sec" id="extra-sec"><h4><span class="n">${ico(hasStay ? 'calendar' : 'note', 13)}</span>${t(hasStay ? 'stayInfo' : 'extraInfo')}<span class="type-tag" style="margin-left:auto">${esc(tpl.name)}</span></h4>
          <div class="grid g3">${xf.map(f => extraInput(f, d)).join('')}</div>${xf.some(f => f.type === 'checkout') ? `<div class="words-hint" style="margin-top:12px">${ico('clock', 13)} ${t('checkoutAuto')}</div>` : ''}</div>` : ''}
        <div class="card card-b sec"><h4><span class="n">2</span>${t('s2')}</h4>
          <div class="grid" style="gap:12px">
            <div class="field"><span>${t('custName')}</span>
              <div class="combo"><textarea class="inp" rows="1" data-f="customer.name" data-grow data-combo autocomplete="off" placeholder="${esc(t('typeToSearch'))}">${esc(d.customer.name)}</textarea>
                <button class="btn primary icon" style="height:40px;width:40px;flex:none" data-act="edaddcust" title="${esc(t('addNewCustomer'))}">${ico('plus')}</button>
                <div class="combo-list" id="cust-list" hidden></div></div>
              <small>${d.customerId ? '✓ ' + (LANG === 'th' ? 'เลือกจากรายชื่อลูกค้าแล้ว' : 'Picked from your customers') : t('longOk')}</small></div>
            <label class="field"><span>${t('address')}</span><textarea class="inp" rows="2" data-f="customer.address" data-grow>${esc(d.customer.address)}</textarea></label>
            <div class="grid g3"><label class="field"><span>${t('taxId')}</span><input class="inp" data-f="customer.taxId" value="${esc(d.customer.taxId)}" inputmode="numeric"></label><label class="field"><span>${t('branch')}</span><input class="inp" data-f="customer.branch" value="${esc(d.customer.branch)}" placeholder="${t('headOffice')}"></label><label class="field"><span>${t('phone')}</span><input class="inp" data-f="customer.phone" value="${esc(d.customer.phone)}"></label></div>
          </div></div>
        <div class="card card-b sec"><h4><span class="n">3</span>${t('s3')}</h4>
          <div class="irows" id="items-body">${d.items.map((it, i) => { const nightly = hasStay && isPerNight(it); return `<div class="irow" data-row="${i}">
            <span class="h" title="${t('dragToSort')}">${ico('grip', 16)}</span>
            <textarea class="inp desc" rows="1" list="dl-products" data-it="${i}" data-k="desc" data-grow placeholder="${t('desc')}">${esc(it.desc)}</textarea>
            <button class="menu-btn del" data-act="eddelitem" data-i="${i}" title="${t('removeItem')}">${ico('x', 16)}</button>
            <label class="mini"><small>${nightly ? t('qtyRooms') : t('qty')}</small><input class="inp sm num" data-it="${i}" data-k="qty" value="${it.qty}" inputmode="decimal"></label>
            <label class="mini"><small>${t('unit')}</small><input class="inp sm" data-it="${i}" data-k="unit" value="${esc(it.unit)}"></label>
            <label class="mini"><small>${t('price')}</small><input class="inp sm num" data-it="${i}" data-k="price" value="${it.price}" inputmode="decimal"></label>
            <div class="amt"><small>${t('lineTotal')}</small><b data-amt="${i}">${money(lineAmount(it))}</b></div>
            ${hasStay ? `<label class="pn${nightly ? ' on' : ''}"><input type="checkbox" data-it="${i}" data-k="perNight" ${nightly ? 'checked' : ''}><i></i>${t('perNight')}${nightly ? ` <em data-nh="${i}">${esc(perNightText(it))}</em>` : ''}</label>` : ''}
          </div>`; }).join('')}</div>
          <datalist id="dl-products">${S.products.map(p => `<option value="${esc(p.name)}">${money(p.price)} / ${esc(p.unit)}</option>`).join('')}</datalist>
          <button class="btn sm" data-act="edadditem" style="margin-top:6px">${ico('plus', 15)}${t('addItem')}</button>
          <div class="qa"><div class="qa-h"><span>${ico('sparkle', 14)} ${t('quickAdd')}</span>${S.products.length > 8 ? `<input class="inp sm" id="qa-filter" placeholder="${esc(t('filterProducts'))}" style="width:170px">` : ''}</div>
            <div class="chips" id="qa-chips">${productChips('')}</div></div>
        </div>
        <div class="card card-b sec"><h4><span class="n">4</span>${t('s4')}</h4>
          <div class="grid g2">
            <label class="field"><span>${t('vatMode')}</span><select class="inp" data-f="vatMode">${sel([['exclusive', t('vatEx') + ` (${S.settings.vatRate}%)`], ['inclusive', t('vatIn') + ` (${S.settings.vatRate}%)`], ['none', t('vatNone')]], d.vatMode)}</select></label>
            <label class="field"><span>${t('whtRate')}</span><select class="inp" data-f="whtRate">${sel([[0, t('none')], [1, '1%'], [2, '2%'], [3, '3%'], [5, '5%']], d.whtRate)}</select></label>
            <div class="field" style="grid-column:1/-1"><span>${t('discountBill')}</span><div id="disc-list">${discountRows(d)}</div>
              <div><button class="btn sm" data-act="eddiscadd" style="margin-top:6px">${ico('plus', 15)}${t('addDiscount')}</button></div></div>
            <label class="field"><span>${t('payMethod')}</span><select class="inp" data-f="payMethod">${sel([['', '—'], ['cash', t('cash')], ['transfer', t('transfer')], ['cheque', t('cheque')], ['card', t('card')]], d.payMethod)}</select></label>
            <label class="field" style="grid-column:1/-1"><span>${t('notes')}</span><textarea class="inp" rows="2" data-f="notes" data-grow>${esc(d.notes)}</textarea></label>
          </div>
          <div class="sum" id="sum"></div>
          <div class="words-hint" id="words"></div>
        </div>
      </div>
      <div class="preview-col">
        <div class="preview-bar"><b>${t('print')}</b><div class="sp"></div>
          <label class="switch qr-sw" title="${esc(t('qrThisDoc'))}"><input type="checkbox" data-docqr ${qrOn(d) ? 'checked' : ''}><i></i>${ico('qr', 15)} QR</label>
          <button class="btn sm" data-act="edpdf">${ico('pdf', 15)}${t('savePdf')}</button>
          <button class="btn sm" data-act="edprint" data-copy="0">${ico('printer', 15)}${t('printOriginal')}</button>
          <button class="btn sm" data-act="edprint" data-copy="1">${ico('copy', 15)}${t('printCopy')}</button></div>
        <div class="preview-box" id="pv"><div class="preview-scale" id="pv-scale"></div></div>
      </div>
    </div>`;
  updateEditorTotals(); renderPreview();
  $$('[data-grow]', c).forEach(autoGrow);
  wireItemDrag();
}
function autoGrow(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 2 + 'px'; }
function perNightText(it) { return `${money(it.price, it.price % 1 ? 2 : 0)} × ${money(it.qty, 0)} ${t('qtyRooms')} × ${nightsOf(it)} ${t('nightsCol')} = ${money(lineAmount(it))}`; }
function discountRows(d) {
  const list = discountsOf(d);
  if (!list.length) return `<div class="disc-none">${t('noDiscount')}</div>`;
  return list.map((dc, i) => `<div class="disc-row"><input class="inp sm" data-dc="${i}" data-dk="label" value="${esc(dc.label || '')}" placeholder="${esc(t('disc'))}">
    <div class="seg"><button data-act="eddisctype" data-i="${i}" data-v="percent" class="${dc.type === 'percent' ? 'on' : ''}">%</button><button data-act="eddisctype" data-i="${i}" data-v="amount" class="${dc.type !== 'percent' ? 'on' : ''}">฿</button></div>
    <input class="inp sm num" data-dc="${i}" data-dk="value" value="${dc.value || ''}" placeholder="0" inputmode="decimal">
    <span class="dc-amt" data-dcamt="${i}">−${money(discAmount(d, i))}</span>
    <button class="menu-btn" data-act="eddiscdel" data-i="${i}" title="${esc(t('delete'))}">${ico('x', 16)}</button></div>`).join('');
}
function discAmount(d, i) { // amount of discount line i after the lines before it
  const sub = calcDoc({ ...d, discounts: discountsOf(d).slice(0, i), vatMode: 'none', whtRate: 0 }).afterDiscount; const dc = discountsOf(d)[i];
  return r2(dc.type === 'percent' ? sub * num(dc.value) / 100 : num(dc.value));
}
function ensureDiscList(d) { if (!Array.isArray(d.discounts)) { d.discounts = discountsOf(d).map(x => ({ ...x })); d.discount = 0; } return d.discounts; }
function updateEditorTotals() {
  const d = UI.ed.doc, k = calcDoc(d);
  const rows = [[t('subtotal'), k.subtotal]];
  for (const dc of k.discounts) rows.push([(dc.label || t('disc')) + (dc.type === 'percent' ? ` ${dc.value}%` : ''), -dc.amount]);
  if (k.discount) rows.push([t('afterDiscount'), k.afterDiscount]);
  discountsOf(d).forEach((dc, i) => { const el = $(`[data-dcamt="${i}"]`); if (el) el.textContent = '−' + money(discAmount(d, i)); });
  d.items.forEach((it, i) => { const nh = $(`[data-nh="${i}"]`); if (nh) nh.textContent = perNightText(it); });
  if (d.vatMode === 'inclusive') rows.push([t('beforeVat'), k.beforeVat]);
  if (d.vatMode !== 'none') rows.push([`${t('vat')} ${k.rate}%`, k.vat]);
  let h = rows.map(r => `<span>${esc(r[0])}</span><span class="r">${money(r[1])}</span>`).join('');
  h += `<span class="tot">${t('grandTotal')}</span><span class="r tot">฿${money(k.total)}</span>`;
  if (k.wht) h += `<span>${t('wht')} ${d.whtRate}%</span><span class="r">${money(-k.wht)}</span><b>${t('netPay')}</b><b class="r">฿${money(k.net)}</b>`;
  $('#sum').innerHTML = h;
  $('#words').textContent = (d.docLang === 'en' ? englishText(k.total) : bahtText(k.total));
  d.items.forEach((it, i) => { const el = $(`[data-amt="${i}"]`); if (el) el.textContent = money(lineAmount(it)); });
}
let pvTimer = null;
function renderPreview(now) {
  clearTimeout(pvTimer);
  pvTimer = setTimeout(() => {
    const box = $('#pv'), sc = $('#pv-scale'); if (!box || !UI.ed) return;
    const d = UI.ed.doc, tpl = templateFor(d);
    buildPages(sc, d, tpl, { copy: S.settings.printCopy ? 'original' : null });
    const sheet = sheetFor(tpl); if (sheet) sc.innerHTML = wrapSheets(sc.innerHTML, sheet); // show exactly what comes out of the printer
    const pages = [...sc.children]; pages.forEach((pg, i) => { pg.style.boxShadow = '0 4px 18px rgba(0,0,0,.1)'; if (i) pg.style.marginTop = '24px'; });
    const page = pages[0]; const total = sc.scrollHeight;
    const k = (box.clientWidth - 36) / page.offsetWidth;
    sc.style.transform = `scale(${k})`; sc.style.width = page.offsetWidth + 'px';
    box.style.height = total * k + 36 + 'px';
  }, now ? 0 : 110);
}
function setPath(obj, path, val) { const ks = path.split('.'); let o = obj; while (ks.length > 1) o = o[ks.shift()]; o[ks[0]] = val; }
function wireItemDrag() {
  const body = $('#items-body'); if (!body) return; let from = null;
  body.addEventListener('dragstart', e => { const r = e.target.closest && e.target.closest('.irow'); if (!r) return; from = +r.dataset.row; r.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'row'); });
  body.addEventListener('dragover', e => { e.preventDefault(); $$('.irow.over', body).forEach(x => x.classList.remove('over')); const r = e.target.closest('.irow'); if (r) r.classList.add('over'); });
  body.addEventListener('dragend', () => $$('.irow', body).forEach(x => x.classList.remove('drag', 'over')));
  body.addEventListener('drop', e => { e.preventDefault(); const r = e.target.closest('.irow'); if (!r || from === null) return; const to = +r.dataset.row; const items = UI.ed.doc.items; const [m] = items.splice(from, 1); items.splice(to, 0, m); from = null; touchDoc(); renderView(); });
  // only allow dragging from the grip handle
  $$('.irow', body).forEach(r => { r.draggable = false; r.querySelector('.h').addEventListener('mousedown', () => r.draggable = true); r.addEventListener('dragend', () => r.draggable = false); });
}
function convertDoc(d, type) {
  const n = clone(d); n.id = uid(); n.type = type; n.date = todayISO(); n.number = nextNumber(type, n.date); n.createdAt = Date.now();
  n.reference = d.number; n.status = type === 'receipt' || type === 'taxreceipt' ? 'paid' : type === 'quotation' ? 'draft' : 'unpaid';
  n.dueDate = type === 'invoice' || type === 'quotation' ? addDays(n.date, 30) : ''; n.notes = S.settings.notes[type] || d.notes;
  if (!UI.ed.stored) touchDoc();
  S.documents.push(n); save(); toast(t('convertDone')); openDoc(n.id);
}
/* Desktop app: our own print dialog (Windows' dialog can't preview Electron pages and ignores the paper orientation) */
const PRINT_SIZES = { A4: ['A4', false], A4L: ['A4', true], A5: ['A5', false], A5L: ['A5', true] };
async function openPrintDialog(doc, withCopy) {
  const tpl = templateFor(doc);
  const { pw, ph, sheet } = printDoc(doc, withCopy);
  const pages = $('#print-root').innerHTML;
  const PS = () => { const s = sheetFor(tpl); if (s) return { pageSize: s.pageSize, landscape: s.landscape }; const ps = PRINT_SIZES[tpl.paper]; return { landscape: ps ? ps[1] : false, pageSize: ps ? ps[0] : { width: Math.round(pw * 1000), height: Math.round(ph * 1000) } }; };
  let printers = []; try { printers = await window.bestinvoiceNative.getPrinters() || []; } catch (e) {}
  const def = (printers.find(p => p.name === S.settings.printer) || printers.find(p => p.isDefault) || printers[0] || {}).name || '';
  const nPages = $$('#print-root > *').length;
  const paperName = sheet ? (sheet.dir === 'col' ? t('sheetA4Top') : t('sheetA4Left')) : paperLabel(tpl.paper);
  const canHalf = tpl.paper === 'A5' || tpl.paper === 'A5L';
  modal({ title: t('printTitle'), wide: true, saveLabel: t('print'),
    body: `<div class="pd"><div class="pd-prev"><div class="pd-scale" id="pd-scale">${pages}</div></div>
      <div class="pd-opt">
        <label class="field"><span>${t('printer')}</span>${printers.length ? `<select class="inp" id="pd-printer">${sel(printers.map(p => [p.name, (p.displayName || p.name) + (p.isDefault ? ' ★' : '')]), def)}</select>` : `<div class="hint">${t('noPrinter')}</div>`}</label>
        <div class="grid g2"><label class="field"><span>${t('copies')}</span><input class="inp num" id="pd-copies" type="number" min="1" max="99" value="1"></label>
          <label class="field"><span>${t('colorMode')}</span><select class="inp" id="pd-color">${sel([['1', t('colorOn')], ['0', t('colorOff')]], S.settings.printColor === false ? '0' : '1')}</select></label></div>
        <div class="pd-paper">${ico('file', 16)}<div><b>${esc(paperName)}</b><small>${t('paperAuto')}</small></div></div>
        ${canHalf ? `<label class="switch" style="font-size:13px"><input type="checkbox" id="pd-half" ${sheet ? 'checked' : ''}><i></i>${t('a5OnA4')}</label>` : ''}
        <div class="hint">${t('paperHint', { p: sheet ? 'A4' : esc(paperName.replace(/ \(.*\)/, '')) })} · ${nPages} ${LANG === 'en' ? 'sheet(s)' : 'แผ่น'}${sheet && withCopy ? ' · ' + t('copyBottom') : ''}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="pd-pdf">${ico('pdf', 15)}${t('savePdf')}</button><button class="btn sm ghost" id="pd-sys">${t('systemDialog')}</button></div>
      </div></div>`,
    onOpen: ov => {
      const sc = $('#pd-scale', ov), box = sc.parentElement, pg = sc.firstElementChild;
      const half = $('#pd-half', ov); if (half) half.onchange = () => { S.settings.a5OnA4 = half.checked; save(); ov.remove(); openPrintDialog(doc, withCopy); if (UI.view === 'editor') renderPreview(true); };
      const k = Math.min(1, (box.clientWidth - 24) / pg.offsetWidth, 536 / pg.offsetHeight); sc.style.transform = `scale(${k})`; sc.style.width = pg.offsetWidth + 'px';
      sc.style.marginLeft = Math.max(0, (box.clientWidth - 24 - pg.offsetWidth * k) / 2) + 'px';
      box.style.height = Math.min(560, sc.scrollHeight * k + 24) + 'px';
      $('#pd-pdf', ov).onclick = () => { ov.remove(); savePdf(doc); };
      $('#pd-sys', ov).onclick = async () => { ov.remove(); printDoc(doc, withCopy); await window.bestinvoiceNative.print({ dialog: true, ...PS() }); };
    },
    onSave: ov => {
      const opts = { deviceName: $('#pd-printer', ov) ? $('#pd-printer', ov).value : '', copies: Math.max(1, parseInt($('#pd-copies', ov).value) || 1), color: $('#pd-color', ov).value === '1', ...PS() };
      S.settings.printer = opts.deviceName; S.settings.printColor = opts.color; save();
      toast(t('printing'));
      printDoc(doc, withCopy);
      window.bestinvoiceNative.print(opts).then(r => toast(r && r.ok ? t('printed') : t('printFail') + (r && r.reason ? ' (' + r.reason + ')' : ''))).catch(() => toast(t('printFail')));
    } });
}
async function savePdf(d) {
  if (window.bestinvoiceNative && window.bestinvoiceNative.savePDF) {
    await FONTS_READY;
    const { pw, ph } = printDoc(d, false);
    const ok = await window.bestinvoiceNative.savePDF(`${d.number}.pdf`, pw, ph);
    if (ok) toast(t('saved'));
  } else {
    toast(LANG === 'th' ? 'เลือกเครื่องพิมพ์ “บันทึกเป็น PDF / Save as PDF”' : 'Choose “Save as PDF” as the printer');
    printNow(d, false);
  }
}

/* ---------- customers & products ---------- */
function viewCustomers(c) {
  const q = UI.q.trim().toLowerCase();
  const list = S.customers.filter(x => !q || (x.name + ' ' + x.taxId + ' ' + x.phone + ' ' + x.contact).toLowerCase().includes(q));
  c.innerHTML = `<div class="page-head"><div><h1>${t('customers')}</h1><p>${t('custSub')}</p></div><button class="btn primary" data-act="custedit">${ico('plus')}${t('addCustomer')}</button></div>
  <div class="card">${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('custName')}</th><th>${t('taxId')}</th><th>${t('phone')}</th><th class="r">${t('docsCount')}</th><th class="r">${t('totalSpent')}</th><th></th></tr></thead><tbody>
  ${list.map(x => { const ds = S.documents.filter(d => d.customerId === x.id && d.status !== 'cancelled'); return `<tr data-act="custedit" data-id="${x.id}"><td><div class="who"><span class="av">${esc(initials(x.name))}</span><div style="min-width:0"><b title="${esc(x.name)}">${esc(x.name)}</b><small>${esc(x.contact || x.address || '').slice(0, 60)}</small></div></div></td><td class="muted">${esc(x.taxId)}</td><td class="muted">${esc(x.phone)}</td><td class="r">${ds.length}</td><td class="r">฿${money(ds.filter(d => d.type === 'receipt' || d.type === 'taxreceipt').reduce((a, d) => a + calcDoc(d).total, 0))}</td><td style="width:40px"><button class="menu-btn" data-act="custmenu" data-id="${x.id}">${ico('more')}</button></td></tr>`; }).join('')}
  </tbody></table></div>` : `<div class="empty">${ico('users', 30)}<b>${t('noCustomers')}</b></div>`}</div>`;
}
function editCustomer(id, prefill, onDone) {
  const x = S.customers.find(c => c.id === id) || { id: uid(), name: '', taxId: '', branch: '', address: '', phone: '', email: '', contact: '', ...(prefill || {}) };
  const isNew = !S.customers.includes(x);
  modal({ title: t(isNew ? 'addCustomer' : 'editCustomer'), body: `<div class="grid">
    <label class="field"><span>${t('custName')}</span><textarea class="inp" rows="2" name="name">${esc(x.name)}</textarea><small>${t('longOk')}</small></label>
    <div class="grid g2"><label class="field"><span>${t('taxId')}</span><input class="inp" name="taxId" value="${esc(x.taxId)}"></label><label class="field"><span>${t('branch')}</span><input class="inp" name="branch" value="${esc(x.branch)}" placeholder="${t('headOffice')}"></label></div>
    <label class="field"><span>${t('address')}</span><textarea class="inp" rows="3" name="address">${esc(x.address)}</textarea></label>
    <div class="grid g3"><label class="field"><span>${t('phone')}</span><input class="inp" name="phone" value="${esc(x.phone)}"></label><label class="field"><span>${t('email')}</span><input class="inp" name="email" value="${esc(x.email)}"></label><label class="field"><span>${t('contact')}</span><input class="inp" name="contact" value="${esc(x.contact)}"></label></div></div>`,
    onSave: ov => { const f = {}; $$('[name]', ov).forEach(i => f[i.name] = i.value.trim()); if (!f.name) { $('[name=name]', ov).focus(); return false; } Object.assign(x, f); if (isNew) S.customers.push(x); if (onDone) onDone(x); save(); toast(t('saved')); renderShell(); }
  });
}
function viewProducts(c) {
  const q = UI.q.trim().toLowerCase();
  const list = S.products.filter(x => !q || (x.name + ' ' + x.sku).toLowerCase().includes(q));
  c.innerHTML = `<div class="page-head"><div><h1>${t('products')}</h1><p>${t('prodSub')}</p></div><button class="btn primary" data-act="prodedit">${ico('plus')}${t('addProduct')}</button></div>
  <div class="card">${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('prodName')}</th><th>${t('sku')}</th><th>${t('unit')}</th><th class="r">${t('price')}</th><th></th></tr></thead><tbody>
  ${list.map(x => `<tr data-act="prodedit" data-id="${x.id}"><td><div class="who"><span class="av" style="border-radius:10px">${ico('box', 16)}</span><b>${esc(x.name)}</b></div></td><td class="muted">${esc(x.sku)}</td><td class="muted">${esc(x.unit)}</td><td class="r">฿${money(x.price)}</td><td style="width:40px"><button class="menu-btn" data-act="prodmenu" data-id="${x.id}">${ico('more')}</button></td></tr>`).join('')}
  </tbody></table></div>` : `<div class="empty">${ico('box', 30)}<b>${t('noProducts')}</b></div>`}</div>`;
}
function editProduct(id, onDone) {
  const x = S.products.find(c => c.id === id) || { id: uid(), name: '', sku: '', unit: '', price: 0 };
  const isNew = !S.products.includes(x);
  modal({ title: t(isNew ? 'addProduct' : 'editProduct'), body: `<div class="grid"><label class="field"><span>${t('prodName')}</span><textarea class="inp" rows="2" name="name">${esc(x.name)}</textarea></label>
    <div class="grid g3"><label class="field"><span>${t('sku')}</span><input class="inp" name="sku" value="${esc(x.sku)}"></label><label class="field"><span>${t('unit')}</span><input class="inp" name="unit" value="${esc(x.unit)}"></label><label class="field"><span>${t('price')}</span><input class="inp num" name="price" value="${x.price}" inputmode="decimal"></label></div></div>`,
    onSave: ov => { const f = {}; $$('[name]', ov).forEach(i => f[i.name] = i.value.trim()); if (!f.name) return false; f.price = num(f.price); Object.assign(x, f); if (isNew) S.products.push(x); save(); toast(t('saved')); if (onDone) onDone(x); else renderShell(); }
  });
}

/* ---------- settings ---------- */
function viewSettings(c) {
  const s = S.settings, co = s.company;
  const img = (key, label) => `<div class="field"><span>${label}</span><div style="display:flex;gap:12px;align-items:center"><div style="width:72px;height:72px;border:1px dashed var(--border-strong);border-radius:12px;display:grid;place-items:center;overflow:hidden;background:var(--surface-2)">${co[key] ? `<img src="${co[key]}" style="max-width:100%;max-height:100%">` : ico('image', 22)}</div><button class="btn sm" data-act="setimg" data-k="${key}">${ico('upload', 15)}${t('upload')}</button>${co[key] ? `<button class="btn sm ghost danger" data-act="rmimg" data-k="${key}">${t('remove')}</button>` : ''}</div></div>`;
  c.innerHTML = `<div class="page-head"><div><h1>${t('settings')}</h1><p>${t('setSub')}</p></div></div>
  <div style="display:grid;gap:20px;max-width:980px">
    <div class="card"><div class="card-h"><h3>${ico('building')} ${t('company')}</h3></div><div class="card-b grid">
      <label class="field"><span>${t('companyTh')}</span><textarea class="inp" rows="2" data-s="company.nameTh" data-grow>${esc(co.nameTh)}</textarea><small>${t('longOk')}</small></label>
      <label class="field"><span>${t('companyEn')}</span><textarea class="inp" rows="1" data-s="company.nameEn" data-grow>${esc(co.nameEn)}</textarea></label>
      <div class="grid g2"><label class="field"><span>${t('taxId')}</span><input class="inp" data-s="company.taxId" value="${esc(co.taxId)}"></label><label class="field"><span>${t('branch')}</span><input class="inp" data-s="company.branch" value="${esc(co.branch)}" placeholder="${t('headOffice')}"></label></div>
      <label class="field"><span>${t('address')}</span><textarea class="inp" rows="2" data-s="company.address" data-grow>${esc(co.address)}</textarea></label>
      <div class="grid g3"><label class="field"><span>${t('phone')}</span><input class="inp" data-s="company.phone" value="${esc(co.phone)}"></label><label class="field"><span>${t('email')}</span><input class="inp" data-s="company.email" value="${esc(co.email)}"></label><label class="field"><span>${t('website')}</span><input class="inp" data-s="company.website" value="${esc(co.website)}"></label></div>
      <div class="grid g2">${img('logo', t('logo'))}${img('signature', t('signature'))}</div>
    </div></div>
    <div class="card"><div class="card-h"><h3>${ico('file')} ${t('docSettings')}</h3></div><div class="card-b grid">
      <div class="grid g3"><label class="field"><span>${t('vatRate')}</span><input class="inp num" data-s="vatRate" data-num value="${s.vatRate}"></label>
        <label class="field"><span>${t('defaultVat')}</span><select class="inp" data-s="vatMode">${sel([['exclusive', t('vatEx')], ['inclusive', t('vatIn')], ['none', t('vatNone')]], s.vatMode)}</select></label>
        <label class="field"><span>${t('docLang')}</span><select class="inp" data-s="docLang">${sel([['th', t('langTh')], ['en', t('langEn')], ['both', t('langBoth')]], s.docLang)}</select></label></div>
      <div style="display:flex;gap:24px;flex-wrap:wrap"><label class="switch"><input type="checkbox" data-s="buddhistYear" ${s.buddhistYear ? 'checked' : ''}><i></i>${t('buddhistYear')}</label><label class="switch"><input type="checkbox" data-s="showQR" ${s.showQR !== false ? 'checked' : ''}><i></i>${t('showQR')}</label><label class="switch"><input type="checkbox" data-s="printCopy" ${s.printCopy ? 'checked' : ''}><i></i>${t('showCopyTag')}</label><label class="switch"><input type="checkbox" data-s="a5OnA4" ${s.a5OnA4 !== false ? 'checked' : ''}><i></i>${t('a5OnA4')}</label></div>
      <div class="field"><span>${t('numbering')}</span><div class="grid g4">${['receipt', 'taxreceipt', 'invoice', 'quotation'].map(ty => `<label class="field"><small>${t(ty)}</small><input class="inp" data-s="prefixes.${ty}" value="${esc(s.prefixes[ty])}"></label>`).join('')}</div><small id="num-hint">${t('numberingHint', { x: nextNumber('receipt') })}</small></div>
      <div class="grid g2">${['receipt', 'taxreceipt', 'invoice', 'quotation'].map(ty => `<label class="field"><span>${t('defaultNotes')} — ${t(ty)}</span><textarea class="inp" rows="2" data-s="notes.${ty}">${esc(s.notes[ty])}</textarea></label>`).join('')}</div>
    </div></div>
    <div class="card"><div class="card-h"><h3>${ico('gear')} ${t('appSettings')}</h3></div><div class="card-b grid">
      <div class="field"><span>${t('theme')}</span><div class="themes">${THEMES.map(k => `<button class="theme-sw${(S.settings.theme || 'minimal') === k ? ' on' : ''}" data-act="theme" data-v="${k}"><i class="sw-${k}"><b></b><s></s></i>${t('th_' + k)}</button>`).join('')}</div></div>
      <label class="field" style="max-width:320px"><span>${t('uiFont')}</span><select class="inp" data-uifont>${sel(Object.keys(FONTS).map(k => [k, FONT_LABELS[k]]), S.settings.uiFont || 'plex')}</select></label>
      <div class="field"><span>${t('uiLang')}</span><div class="seg" style="align-self:flex-start"><button data-act="lang" data-v="th" class="${LANG === 'th' ? 'on' : ''}">ไทย</button><button data-act="lang" data-v="en" class="${LANG === 'en' ? 'on' : ''}">English</button></div></div>
      <div class="field"><span>${t('backup')}</span><small>${t('backupHint')}</small><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><button class="btn" data-act="export">${ico('download', 16)}${t('exportBackup')}</button><button class="btn" data-act="import">${ico('upload', 16)}${t('importBackup')}</button><button class="btn" data-act="sample">${ico('sparkle', 16)}${t('loadSample')}</button>${window.bestinvoiceNative ? `<button class="btn" data-act="openbackups">${ico('layers', 16)}${LANG === 'th' ? 'เปิดโฟลเดอร์สำรองอัตโนมัติ' : 'Open auto-backup folder'}</button>` : ''}<button class="btn danger" data-act="reset">${ico('trash', 16)}${t('resetAll')}</button></div></div>
      <div class="hint">Bestinvoice 1.9 · macOS · Windows · ${LANG === 'th' ? 'ใช้งานได้แบบออฟไลน์' : 'Works offline'}</div>
    </div></div>
  </div>`;
  $$('[data-grow]', c).forEach(autoGrow);
}

/* ---------- global events ---------- */
const ACT = {
  go: el => el.dataset.v === 'newdoc' ? newDoc() : go(el.dataset.v),
  lang: el => { LANG = S.settings.lang = el.dataset.v; save(); document.documentElement.lang = LANG; renderShell(); },
  newdoc: el => newDoc(el.dataset.type || (UI.docType !== 'all' ? UI.docType : 'receipt')),
  opendoc: el => openDoc(el.dataset.id),
  docmenu: (el, e) => { e.stopPropagation(); docMenu(el, S.documents.find(d => d.id === el.dataset.id)); },
  doctype: el => { UI.docType = el.dataset.v; UI.page = 1; renderView(); },
  pg: el => { UI.page += +el.dataset.v; renderView(); },
  edback: () => go(UI.prevView && UI.prevView !== 'editor' ? UI.prevView : 'documents'),
  edsave: () => { touchDoc(); toast(t('saved')); go(UI.prevView && UI.prevView !== 'editor' ? UI.prevView : 'documents'); },
  edtype: el => { const d = UI.ed.doc; if (d.type === el.dataset.v) return; const old = d.type; d.type = el.dataset.v; if (d.number.startsWith(S.settings.prefixes[old] || '§')) d.number = nextNumber(d.type, d.date); if ((d.type === 'invoice' || d.type === 'quotation') && !d.dueDate) d.dueDate = addDays(d.date, 30); if (d.notes === (S.settings.notes[old] || '')) d.notes = S.settings.notes[d.type] || ''; if (UI.ed.stored) save(); renderView(); },
  edadditem: () => { UI.ed.doc.items.push({ id: uid(), desc: '', qty: 1, unit: '', price: 0, discount: 0 }); renderView(); const tas = $$('#items-body textarea'); tas[tas.length - 1].focus(); },
  eddelitem: el => { const d = UI.ed.doc; d.items.splice(+el.dataset.i, 1); if (!d.items.length) d.items.push({ id: uid(), desc: '', qty: 1, unit: '', price: 0, discount: 0 }); if (UI.ed.stored) save(); renderView(); },
  vfcheck: () => showVerify($('#vf-text').value),
  vfcam: () => scanFromCamera(),
  vfimg: async () => { const f = await pickFile('image/*'); if (f) scanFromImage(f); },
  eddiscadd: () => { const d = UI.ed.doc; ensureDiscList(d).push({ type: 'percent', value: '', label: '' }); touchDoc(); $('#disc-list').innerHTML = discountRows(d); const v = $$('#disc-list [data-dk="value"]'); v[v.length - 1].focus(); updateEditorTotals(); renderPreview(); },
  eddiscdel: el => { const d = UI.ed.doc; ensureDiscList(d).splice(+el.dataset.i, 1); touchDoc(); $('#disc-list').innerHTML = discountRows(d); updateEditorTotals(); renderPreview(); },
  eddisctype: el => { const d = UI.ed.doc; ensureDiscList(d)[+el.dataset.i].type = el.dataset.v; touchDoc(); $('#disc-list').innerHTML = discountRows(d); updateEditorTotals(); renderPreview(); },
  edaddcust: () => addCustomerFromDoc(),
  edaddprod: el => addProductToDoc(S.products.find(p => p.id === el.dataset.id)),
  ednewprod: () => editProduct(null, p => { addProductToDoc(p); }),
  edstep: el => { const inp = $(`[data-ex="${el.dataset.k}"]`); inp.value = Math.max(1, (parseInt(inp.value) || 1) + +el.dataset.v); inp.dispatchEvent(new Event('input', { bubbles: true })); },
  theme: el => setTheme(el.dataset.v),
  themepick: el => dropdown(el, THEMES.map(k => ({ label: (S.settings.theme === k ? '✓ ' : '') + t('th_' + k), icon: 'sparkle', run: () => setTheme(k) }))),
  edsavecust: () => { const d = UI.ed.doc; if (!d.customer.name.trim()) return; const c = { id: uid(), name: d.customer.name.trim(), taxId: d.customer.taxId, branch: d.customer.branch, address: d.customer.address, phone: d.customer.phone, email: '', contact: '' }; S.customers.push(c); d.customerId = c.id; touchDoc(); toast(t('saved')); renderShell(); },
  edprint: el => { touchDoc(); printNow(UI.ed.doc, el.dataset.copy === '1'); },
  edpdf: () => { touchDoc(); savePdf(UI.ed.doc); },
  edconvert: el => dropdown(el, ['receipt', 'taxreceipt', 'invoice', 'quotation'].filter(x => x !== UI.ed.doc.type).map(x => ({ label: t(x), icon: 'file', run: () => convertDoc(UI.ed.doc, x) }))),
  custedit: el => editCustomer(el.dataset.id),
  custmenu: (el, e) => { e.stopPropagation(); const x = S.customers.find(c => c.id === el.dataset.id); dropdown(el, [{ label: t('edit'), icon: 'edit', run: () => editCustomer(x.id) }, { label: t('newDoc'), icon: 'plus', run: () => { newDoc('receipt'); const d = UI.ed.doc; d.customerId = x.id; d.customer = { name: x.name, taxId: x.taxId, branch: x.branch, address: x.address, phone: x.phone }; renderView(); } }, '-', { label: t('delete'), icon: 'trash', danger: true, run: async () => { if (await confirmBox(t('confirmDelete'))) { S.customers = S.customers.filter(c => c !== x); save(); renderShell(); } } }]); },
  prodedit: el => editProduct(el.dataset.id),
  prodmenu: (el, e) => { e.stopPropagation(); const x = S.products.find(c => c.id === el.dataset.id); dropdown(el, [{ label: t('edit'), icon: 'edit', run: () => editProduct(x.id) }, '-', { label: t('delete'), icon: 'trash', danger: true, run: async () => { if (await confirmBox(t('confirmDelete'))) { S.products = S.products.filter(c => c !== x); save(); renderShell(); } } }]); },
  setimg: async el => { const f = await pickFile('image/*'); if (!f) return; S.settings.company[el.dataset.k] = await readImage(f, el.dataset.k === 'logo' ? 600 : 500); save(); renderShell(); },
  rmimg: el => { S.settings.company[el.dataset.k] = ''; save(); renderShell(); },
  openbackups: () => window.bestinvoiceNative.openBackups(),
  export: () => download(`bestinvoice-backup-${todayISO()}.json`, JSON.stringify(S, null, 1)),
  import: async () => { const f = await pickFile('.json,application/json'); if (!f) return; try { const data = JSON.parse(await f.text()); if (!data.settings || !data.documents) throw 0; if (!(await confirmBox(t('confirmImport'), t('importBackup')))) return; S = data; save(); loadAfterReplace(); toast(t('imported')); } catch (e) { toast(t('badFile')); } },
  sample: () => { const keep = S.settings.lang; S = blankState(); S.settings.lang = keep; seedSample(); save(); loadAfterReplace(); },
  reset: async () => { if (!(await confirmBox(t('confirmReset'), t('resetAll')))) return; const keep = S.settings.lang; S = blankState(); S.settings.lang = keep; save(); loadAfterReplace(); }
};
function loadAfterReplace() { ensureSecret(); try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} loadState(); UI.ed = null; go('dashboard'); }

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.tagName === 'TR' && e.target.closest('button,input,select,textarea,a')) return;
  const fn = ACT[el.dataset.act] || (window.DACT && DACT[el.dataset.act]);
  if (fn) fn(el, e);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.uichange) { UI[el.dataset.uichange] = el.value; UI.page = 1; renderView(); return; }
  if (el.dataset.k === 'perNight' && UI.ed) { const d = UI.ed.doc, it = d.items[+el.dataset.it]; it.perNight = el.checked; if (!el.checked) delete it.nights; syncStay(d, templateFor(d)); touchDoc(); const st = $('#content').scrollTop; renderView(); $('#content').scrollTop = st; return; }
  if (el.dataset.uifont !== undefined) { S.settings.uiFont = el.value; applyUiFont(); save(); return; }
  if (el.dataset.docqr !== undefined && UI.ed) { UI.ed.doc.showQR = el.checked; touchDoc(); renderPreview(true); toast(t(el.checked ? 'qrOnMsg' : 'qrOffMsg')); return; }
  if (el.dataset.dsqr !== undefined) { S.settings.showQR = el.checked; save(); if (window.dCanvas) dCanvas(); toast(t(el.checked ? 'qrOnMsg' : 'qrOffMsg')); return; }
  if (el.dataset.f === 'templateId' && UI.ed) {
    const d = UI.ed.doc; let v = el.value;
    if (v.startsWith('preset:')) { const tp = makeTemplate(v.slice(7)); S.templates.push(tp); v = tp.id; }
    d.templateId = v; const tp = templateFor(d); ensureExtra(d);
    if (tp.presetNotes && (!d.notes || Object.values(S.settings.notes).includes(d.notes))) d.notes = tp.presetNotes;
    touchDoc(); renderView(); return;
  }
  if (el.dataset.actChange === 'edcust') {
    const d = UI.ed.doc, c = S.customers.find(x => x.id === el.value);
    d.customerId = c ? c.id : ''; if (c) d.customer = { name: c.name, taxId: c.taxId, branch: c.branch, address: c.address, phone: c.phone };
    if (UI.ed.stored || c) touchDoc(); renderView(); return;
  }
  if (el.dataset.f && (el.dataset.rerender !== undefined || el.dataset.f === 'date' || el.tagName === 'SELECT')) {
    if (el.dataset.f === 'date') { const d = UI.ed.doc; if (!UI.ed.stored && !d._numEdited) d.number = nextNumber(d.type, d.date); }
    if (el.dataset.rerender !== undefined) renderView(); else { updateEditorTotals(); renderPreview(true); }
  }
  if (el.dataset.s !== undefined && el.type === 'checkbox') { setPath(S.settings, el.dataset.s, el.checked); save(); }
  if (el.dataset.it !== undefined && el.dataset.k === 'desc') {
    const p = S.products.find(x => x.name === el.value); const it = UI.ed.doc.items[+el.dataset.it];
    if (p && it) { if (!num(it.price)) it.price = p.price; if (!it.unit) it.unit = p.unit; touchDoc(); renderView(); }
  }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.matches('[data-grow]')) autoGrow(el);
  if (el.id === 'qa-filter') { $('#qa-chips').innerHTML = productChips(el.value); return; }
  if (el.dataset.dc !== undefined && UI.ed) {
    const d = UI.ed.doc, dc = ensureDiscList(d)[+el.dataset.dc]; dc[el.dataset.dk] = el.dataset.dk === 'value' ? (el.value.trim() === '' ? '' : num(el.value)) : el.value;
    touchDoc(); updateEditorTotals(); renderPreview(); return;
  }
  if (el.dataset.ex !== undefined && UI.ed) {
    const d = UI.ed.doc, tp = templateFor(d); d.extra = d.extra || {}; d.extra[el.dataset.ex] = el.value;
    if (['checkin', 'nights', 'checkout', 'rooms'].includes(el.dataset.extype)) {
      syncStay(d, tp, el.dataset.extype);
      $$('[data-ex]').forEach(i => { if (i !== el && ['checkin', 'nights', 'checkout', 'rooms'].includes(i.dataset.extype)) i.value = d.extra[i.dataset.ex] ?? ''; });
      d.items.forEach((it, i) => { for (const k of ['qty', 'nights']) { const q = $(`[data-it="${i}"][data-k="${k}"]`); if (q && document.activeElement !== q) q.value = it[k] ?? ''; } });
    }
    touchDoc(); updateEditorTotals(); renderPreview(); return;
  }
  if (el.dataset.f === 'templateId') return;
  if (el.dataset.f && UI.ed) {
    const d = UI.ed.doc; let v = el.value;
    if (el.dataset.combo !== undefined) { const c = S.customers.find(x => x.id === d.customerId); if (!c || c.name !== el.value) d.customerId = ''; UI.custIdx = -1; showCustList(); }
    if (['discount', 'whtRate'].includes(el.dataset.f)) v = num(v);
    if (el.dataset.f === 'number') d._numEdited = true;
    setPath(d, el.dataset.f, v); touchDoc(); updateEditorTotals(); renderPreview();
  } else if (el.dataset.it !== undefined && UI.ed) {
    const it = UI.ed.doc.items[+el.dataset.it]; const k = el.dataset.k;
    if (k === 'perNight') return;
    it[k] = k === 'nights' ? (el.value.trim() === '' ? '' : num(el.value)) : ['qty', 'price', 'discount'].includes(k) ? (el.value.trim() === '' ? 0 : num(el.value)) : el.value;
    if (['desc', 'unit', 'price', 'qty'].includes(k)) { const tp = templateFor(UI.ed.doc); const before = it.nights; syncStay(UI.ed.doc, tp); if ((before === undefined) !== (it.nights === undefined)) { touchDoc(); const st = $('#content').scrollTop; const f = document.activeElement; const sel = f && f.selectionStart; renderView(); $('#content').scrollTop = st; const nf = $(`[data-it="${el.dataset.it}"][data-k="${k}"]`); if (nf) { nf.focus(); try { nf.setSelectionRange(sel, sel); } catch (e) {} } return; } }
    touchDoc(); updateEditorTotals(); renderPreview();
  } else if (el.dataset.s !== undefined && el.type !== 'checkbox') {
    setPath(S.settings, el.dataset.s, el.dataset.num !== undefined ? num(el.value) : el.value); save();
    if (el.dataset.s.startsWith('company.name') || el.dataset.s === 'company.branch') { const nm = $('.co-card .nm'); if (nm) nm.textContent = S.settings.company.nameTh || S.settings.company.nameEn; }
    if (el.dataset.s.startsWith('prefixes.')) { const h = $('#num-hint'); if (h) h.textContent = t('numberingHint', { x: nextNumber('receipt') }); }
  }
});
window.addEventListener('resize', () => { if (UI.view === 'editor') renderPreview(); if (UI.view === 'designer' && window.dFit) dFit(); });
window.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && UI.view === 'editor') { e.preventDefault(); touchDoc(); printNow(UI.ed.doc, false); } });

/* ---------- themes ---------- */
const THEMES = ['minimal', 'pastel', 'modern', 'classic', 'glass'];
function applyUiFont() { const k = S.settings.uiFont || 'plex'; document.documentElement.style.setProperty('--font', `${FONTS[k] || FONTS.plex},'Plex Thai','Leelawadee UI','Thonburi',system-ui,sans-serif`); }
function setTheme(k) { S.settings.theme = k; document.documentElement.dataset.theme = k; save(); if (UI.view === 'settings') renderView(); }

/* customer combobox keyboard / mouse */
document.addEventListener('focusin', e => { if (e.target.matches('[data-combo]')) { UI.custIdx = -1; showCustList(); } });
document.addEventListener('focusout', e => { if (e.target.matches('[data-combo]')) setTimeout(() => { const b = $('#cust-list'); if (b) b.hidden = true; }, 160); });
document.addEventListener('mousedown', e => { const o = e.target.closest('#cust-list .opt'); if (o) { e.preventDefault(); pickCustomer(o.dataset.pick); } });
document.addEventListener('keydown', e => {
  if (!e.target.matches('[data-combo]')) return; const box = $('#cust-list'); if (!box || box.hidden) return;
  const n = (UI.custOpts || []).length; if (!n) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); UI.custIdx = (UI.custIdx + 1) % n; showCustList(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); UI.custIdx = (UI.custIdx - 1 + n) % n; showCustList(); }
  else if (e.key === 'Enter' && UI.custIdx >= 0) { e.preventDefault(); pickCustomer(UI.custOpts[UI.custIdx]); }
  else if (e.key === 'Escape') box.hidden = true;
});

/* ---------- boot ---------- */
let FONTS_READY = Promise.resolve();
function preloadFonts() {
  if (!document.fonts) return Promise.resolve();
  const loads = []; document.fonts.forEach(f => loads.push(f.load().catch(() => {})));
  return Promise.all(loads).then(() => document.fonts.ready);
}
function boot() {
  loadState(); document.documentElement.lang = LANG; document.documentElement.dataset.theme = S.settings.theme || 'minimal'; applyUiFont();
  ensureSecret();
  FONTS_READY = preloadFonts();
  renderShell();
  FONTS_READY.then(() => { if (UI.view === 'editor') renderPreview(true); if (UI.view === 'designer') dCanvas(); });
}
document.addEventListener('DOMContentLoaded', boot);
