/* Bestinvoice — bill verification QR (signed code) + verify page */
if (typeof qrcode !== 'undefined') qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

/* compact synchronous SHA-256 (hex) */
function sha256(str) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = new TextEncoder().encode(str); const l = bytes.length;
  const n = (((l + 9) >> 6) + 1) << 4; const w = new Uint32Array(n);
  for (let i = 0; i < l; i++) w[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  w[l >> 2] |= 0x80 << (24 - (l % 4) * 8); w[n - 1] = l * 8;
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const r = (x, k) => (x >>> k) | (x << (32 - k)); const W = new Uint32Array(64);
  for (let j = 0; j < n; j += 16) {
    for (let i = 0; i < 64; i++) W[i] = i < 16 ? w[j + i] : (r(W[i-2],17) ^ r(W[i-2],19) ^ (W[i-2] >>> 10)) + W[i-7] + (r(W[i-15],7) ^ r(W[i-15],18) ^ (W[i-15] >>> 3)) + W[i-16];
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (r(e,6) ^ r(e,11) ^ r(e,25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
      const t2 = ((r(a,2) ^ r(a,13) ^ r(a,22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h = h.map((v, i) => (v + [a, b, c, d, e, f, g, hh][i]) >>> 0);
  }
  return h.map(v => v.toString(16).padStart(8, '0')).join('');
}
/* QR on/off: per document if set, otherwise the default in Settings */
const qrOn = doc => doc.showQR !== undefined ? !!doc.showQR : S.settings.showQR !== false;
function ensureSecret() {
  if (S.settings.verifySecret) return;
  let s = ''; try { const a = new Uint8Array(16); crypto.getRandomValues(a); s = [...a].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) { s = uid() + uid() + uid(); }
  S.settings.verifySecret = s; save();
}
function verifyCode(number, date, total) {
  const hx = sha256(`${S.settings.verifySecret}|${number}|${date}|${Number(total).toFixed(2)}`).slice(0, 12).toUpperCase();
  return hx.match(/.{4}/g).join('-');
}
function qrPayload(doc, calc) {
  const total = calc.total;
  return `✅ บิลเลขที่ ${doc.number} ผ่านการตรวจสอบ\nยอด ${money(total)} บาท\nBIV1|${doc.number}|${doc.date}|${total.toFixed(2)}|${verifyCode(doc.number, doc.date, total)}`;
}
function qrSvg(text) {
  try {
    const q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make();
    const n = q.getModuleCount(); let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + 1} ${r + 1}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n + 2} ${n + 2}" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges" style="width:100%;height:100%;display:block"><rect width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  } catch (e) { return ''; }
}

/* parse + check a scanned QR text */
function checkScan(text) {
  const m = /BIV1\|([^|\n]+)\|(\d{4}-\d{2}-\d{2})\|([\d.]+)\|([A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4})/.exec(String(text || ''));
  if (!m) return { state: 'bad', msg: LANG === 'th' ? 'ไม่พบรหัสตรวจสอบของ Bestinvoice ในข้อความนี้' : 'No Bestinvoice verification code found in this text' };
  const [, number, date, total, code] = m;
  if (verifyCode(number, date, total) !== code) return { state: 'bad', number, msg: LANG === 'th' ? 'รหัสตรวจสอบไม่ถูกต้อง — บิลนี้ไม่ได้ออกจากโปรแกรมของคุณ หรือยอดเงิน/วันที่ถูกแก้ไข' : 'Code does not match — this bill was not issued by your Bestinvoice, or its amount/date was altered' };
  const doc = S.documents.find(d => d.number === number);
  if (!doc) return { state: 'warn', number, date, total, msg: LANG === 'th' ? 'รหัสถูกต้อง ออกโดยบริษัทของคุณ แต่ไม่พบเอกสารนี้ในเครื่องนี้' : 'Code is valid and was issued by your company, but this document is not on this computer' };
  if (doc.status === 'cancelled') return { state: 'warn', number, date, total, doc, msg: LANG === 'th' ? 'รหัสถูกต้อง แต่บิลนี้ถูกยกเลิกแล้ว' : 'Code is valid, but this bill has been cancelled' };
  if (Math.abs(calcDoc(doc).total - num(total)) > .005) return { state: 'warn', number, date, total, doc, msg: LANG === 'th' ? 'รหัสถูกต้อง แต่ยอดในระบบถูกแก้ไขหลังจากพิมพ์บิล' : 'Code is valid, but the amount was edited after printing' };
  return { state: 'ok', number, date, total, doc, msg: LANG === 'th' ? `บิลเลขที่ ${number} ผ่านการตรวจสอบ` : `Bill ${number} is verified` };
}

function viewVerify(c) {
  c.innerHTML = `<div class="page-head"><div><h1>${t('verify')}</h1><p>${t('verifySub')}</p></div></div>
  <div style="display:grid;gap:20px;max-width:820px">
    <div class="card card-b">
      <div class="field"><span>${t('verifyPaste')}</span><textarea class="inp" id="vf-text" rows="4" placeholder="BIV1|…"></textarea></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
        <button class="btn primary" data-act="vfcheck">${ico('check', 16)}${t('verifyBtn')}</button>
        <button class="btn" data-act="vfcam">${ico('camera', 16)}${t('verifyCam')}</button>
        <button class="btn" data-act="vfimg">${ico('image', 16)}${t('verifyImg')}</button>
      </div>
      <div id="vf-result" style="margin-top:16px"></div>
    </div>
    <div class="hint">${t('verifyHint')}</div>
  </div>`;
  const ta = $('#vf-text'); ta.addEventListener('input', () => { if (/BIV1\|.+\|[A-F0-9-]{14}/.test(ta.value)) showVerify(ta.value); });
}
function showVerify(text) {
  const r = checkScan(text); const el = $('#vf-result'); if (!el) return;
  const col = { ok: ['var(--green-50)', 'var(--green)', '✓'], warn: ['var(--amber-50)', 'var(--amber)', '!'], bad: ['var(--red-50)', 'var(--red)', '✕'] }[r.state];
  el.innerHTML = `<div class="verify-res" style="background:${col[0]};border-color:${col[1]}"><span class="vr-ic" style="background:${col[1]}">${col[2]}</span><div><b style="color:${col[1]}">${esc(r.msg)}</b>
    ${r.number ? `<div class="vr-meta">${esc(t('docNo'))} <b>${esc(r.number)}</b>${r.date ? ` · ${fmtDate(r.date, LANG)}` : ''}${r.total ? ` · ฿${money(r.total)}` : ''}${r.doc ? ` · ${esc(r.doc.customer.name || '')}` : ''}</div>` : ''}
    ${r.doc ? `<button class="btn sm" style="margin-top:10px" data-act="opendoc" data-id="${r.doc.id}">${ico('file', 14)}${t('edit')}</button>` : ''}</div></div>`;
}
function decodeImageData(img) { try { return jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' }); } catch (e) { return null; } }
function scanFromImage(file) {
  const fr = new FileReader();
  fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 1400 / Math.max(im.width, im.height)); const cv = document.createElement('canvas'); cv.width = im.width * k; cv.height = im.height * k; const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, cv.width, cv.height); const r = decodeImageData(cx.getImageData(0, 0, cv.width, cv.height)); if (r) { $('#vf-text').value = r.data; showVerify(r.data); } else toast(t('verifyNoQr')); }; im.src = fr.result; };
  fr.readAsDataURL(file);
}
async function scanFromCamera() {
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); }
  catch (e) { toast(t('verifyNoCam')); return; }
  let stop = false;
  const close = modal({ title: t('verifyCam'), body: `<video id="vf-video" playsinline muted style="width:100%;border-radius:12px;background:#000"></video><p class="hint" style="margin-top:10px">${t('verifyAim')}</p>` });
  const v = $('#vf-video'); v.srcObject = stream; await v.play().catch(() => {});
  const cv = document.createElement('canvas'); const cx = cv.getContext('2d', { willReadFrequently: true });
  const end = () => { stop = true; stream.getTracks().forEach(tr => tr.stop()); };
  new MutationObserver((mm, o) => { if (!document.body.contains(v)) { o.disconnect(); end(); } }).observe(document.body, { childList: true });
  const tick = () => {
    if (stop) return;
    if (v.videoWidth) { cv.width = v.videoWidth; cv.height = v.videoHeight; cx.drawImage(v, 0, 0); const r = decodeImageData(cx.getImageData(0, 0, cv.width, cv.height)); if (r && r.data) { end(); close(); $('#vf-text').value = r.data; showVerify(r.data); return; } }
    setTimeout(tick, 220);
  };
  tick();
}
