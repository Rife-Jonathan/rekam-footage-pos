// Rekam satu ALUR POS Toko Sembako Berkah (instance toko-sembako; JANGAN murah-pangan) untuk Recordly (salinan gaya ../rekam.js DentalCare; kursor OS asli → Recordly mencatat klik).
//   node rekam.js <alur>            (lihat ALUR di bawah; shotlist: SHOTLIST-POS.md)
//   DRY=1 node rekam.js <alur>      → latihan: POST/PUT/DELETE diblokir (kecuali /pos/quote), aksi ubah = hover, flag tidak ditunggu
// Cetak SIAP → tunggu POS/flag/mulai.flag → jalankan alur → cetak SELESAI → tunggu berhenti.flag (Chrome ditutup setelah Stop).
const { chromium } = require('E:/Content-Machine/node_modules/playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const PY = 'C:/Users/RIFE/AppData/Local/Programs/Python/Python310/python.exe';
const BASE = 'https://toko-sembako.nusawebsite.com';
const DIR = 'E:/Rakazo/growth/video/recordly/POS/flag/';
const OUT = 'E:/Rakazo/growth/video/recordly/POS/out/';
const DRY = process.env.DRY === '1';
// Playwright Content-Machine minta chromium-1234 (belum terunduh) → pakai chromium yang sudah ada
const CHROME = process.env.CHROME || 'C:/Users/RIFE/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const AKUN = { owner: 'owner', kasir1: 'kasir1', kasir2: 'kasir2' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(DIR, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });

const mouse = spawn(PY, ['-u', __dirname + '/../mouse_server.py'], { stdio: ['pipe', 'pipe', 'inherit'] });
const tunggu = [];
mouse.stdout.on('data', (d) => { for (const _ of String(d).trim().split('\n')) (tunggu.shift() || (() => {}))(); });
const kirim = (s) => new Promise((r) => { tunggu.push(r); mouse.stdin.write(s + '\n'); });

let page;
async function pusat(target, dy = 0, dx = 0) {
  const loc = typeof target === 'string' ? page.locator(target).first() : target;
  await loc.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
  // tunggu posisi stabil (keranjang/quote bisa menggeser tata letak sesaat) — uji 19 Okt: klik PROSES meleset ke bawah tombol
  let b = await loc.boundingBox({ timeout: 2500 });
  for (let i = 0; i < 8; i++) { await sleep(120); const b2 = await loc.boundingBox({ timeout: 2500 }); if (b && b2 && b2.x === b.x && b2.y === b.y && b2.height === b.height) break; b = b2; }
  if (!b) throw new Error('tidak ketemu: ' + target);
  const o = await page.evaluate(() => ({
    x: window.screenX + (window.outerWidth - window.innerWidth) / 2,
    y: window.screenY + (window.outerHeight - window.innerHeight) - (window.outerWidth - window.innerWidth) / 2,
  }));
  const xy = [Math.round(o.x + b.x + b.width / 2 + dx), Math.round(o.y + b.y + b.height / 2 + dy)];
  if (DRY) { // latihan: catat elemen yang benar-benar ada di bawah titik kursor
    const kena = await page.evaluate(([cx, cy]) => { const e = document.elementFromPoint(cx, cy); return e ? (e.closest('button')?.innerText || e.innerText || e.tagName).slice(0, 30).replace(/\s+/g, ' ') : '-'; }, [xy[0] - o.x, xy[1] - o.y]);
    console.log('     titik', xy.join(','), '→', kena);
  }
  return xy;
}
const langkah = async (nama, fn) => { const t = Date.now(); try { await fn(); } catch (e) { console.error('lewati', nama, e.message.split('\n')[0]); } console.log('  ', nama, ((Date.now() - t) / 1000).toFixed(1)); };

// ---- gerak (sama dengan helper YT002): meluncur 0,9 dtk → klik → geser kecil pelan sampai tenggat ----
let cur = [960, 560];
const ke = async (x, y, dur) => { await kirim(`move ${x} ${y} ${dur}`); cur = [x, y]; };
const POLA = [[14, 8], [2, 18], [-12, 10], [-4, -6], [10, -10], [0, 0]];
async function geserSampai(dl) {
  const [bx, by] = cur; let i = 0;
  for (;;) {
    const sisa = dl - Date.now(); if (sisa < 150) { if (sisa > 0) await sleep(sisa); return; }
    const t = Math.min(1000, sisa), t0 = Date.now(); const [dx, dy] = POLA[i++ % POLA.length];
    await kirim(`move ${bx + dx} ${by + dy} ${((t * 0.75) / 1000).toFixed(2)}`);
    const pakai = Date.now() - t0; if (pakai < t) await sleep(t - pakai);
  }
}
const geser = (ms) => geserSampai(Date.now() + ms);
const hover = async (t, ms = 1500, dur = 0.9, dy = 0, dx = 0) => { const dl = Date.now() + dur * 1000 + ms; const [x, y] = await pusat(t, dy, dx); await ke(x, y, dur); await nyata(String(t).slice(0, 40)); await geserSampai(dl); };
// meluncur → baca ulang posisi target (tata letak bisa bergeser selama kursor meluncur) → klik di posisi terbaru
const tekan = async (t, ms = 1600, dur = 0.9, dy = 0, dx = 0) => {
  const dl = Date.now() + dur * 1000 + Math.max(ms, 500);
  const [x, y] = await pusat(t, dy, dx); await kirim(`move ${x} ${y} ${dur}`);
  const [x2, y2] = await pusat(t, dy, dx); if (Math.abs(x2 - x) + Math.abs(y2 - y) > 4) console.log('     koreksi', x, y, '→', x2, y2);
  await kirim(`click ${x2} ${y2} 0.12`); cur = [x2, y2]; await geserSampai(dl);
};
// DRY: elemen di bawah kursor OS ASLI (dari event mousemove) → bukti klik akan kena
const nyata = async (lbl) => { if (!DRY) return; const r = await page.evaluate(() => { const m = window.__m; if (!m) return '-'; const e = document.elementFromPoint(m[0], m[1]); return m.join(',') + ' ' + (e ? (e.closest('button')?.innerText || e.innerText || e.tagName).slice(0, 30).replace(/\s+/g, ' ') : '-'); }); console.log('     kursor-nyata', lbl, r); };
// klik OS lalu pastikan tertangani: bila dialog masih terbuka setelah 0,7 dtk (klik OS tak diproses — uji 19 Okt kursor 'not-allowed'), klik sintetis
const tekanPasti = async (loc, ms, dur) => { await tekan(loc, 0, dur); await sleep(700); if (!DRY && await loc.isVisible().catch(() => false)) { console.error('CADANGAN klik sintetis'); await loc.click({ timeout: 3000 }).catch(() => {}); } await geser(ms); };
const ubah = (t, ms, dur, dy) => (DRY ? hover(t, ms, dur, dy) : tekan(t, ms, dur, dy)); // aksi yang MENGUBAH DATA
const ketik = async (teks, delay = 110) => { let selesai = false; const p = page.keyboard.type(teks, { delay }).then(() => { selesai = true; }); while (!selesai) await geser(300); await p; };

const kartu = (nama) => page.locator(`button.prod[aria-label^="${nama},"]`).first();
const dialog = () => page.locator('[role=dialog]').last();

const ALUR = {
  // KLIP UJI — SHOTLIST-POS.md #5 · target 22 dtk (alur ±19 dtk; sesi menambah ±2 dtk)
  'kasir-timbang': { awal: '/pos', akun: 'owner', async jalan() {
    await langkah('bawang merah', () => tekan(kartu('Bawang Merah'), 800));
    await langkah('ketik 0,75', async () => { await page.locator('#jml').waitFor({ timeout: 3000 }); await ketik('0,75'); await geser(700); });
    await langkah('tambah 1', () => tekan(dialog().locator('button[type=submit]'), 700, 0.7));
    await langkah('minyak', () => tekan(kartu('Minyak Kita 1 L'), 600, 0.9));
    await langkah('ketik 1', async () => { await page.locator('#jml').waitFor({ timeout: 3000 }); await ketik('1'); await geser(400); });
    await langkah('tambah 2', () => tekan(dialog().locator('button[type=submit]'), 700, 0.7));
    await langkah('tunai', () => tekan(page.locator('[aria-label="Metode pembayaran"] button', { hasText: 'Tunai' }), 500, 0.8));
    await langkah('uang pas', async () => { await page.locator('button.chip:has-text("Uang pas"):not([disabled])').waitFor({ timeout: 4000 }); await tekan('button.chip:has-text("Uang pas")', 800, 0.8); });
    await sleep(300); // quote/kembalian selesai dihitung → tata letak keranjang diam
    await langkah('proses', () => ubah('button.btn--pay', 1200, 0.9));
    await langkah('struk', async () => {
      if (!DRY) { try { await page.waitForURL(/\/receipt\//, { timeout: 4000 }); } catch { console.error('GAGAL BAYAR: tidak pindah ke struk'); await page.locator('button.btn--pay').click(); await page.waitForURL(/\/receipt\//, { timeout: 6000 }); } }
      // setelan toko = 80 mm → tampilkan struk 58 mm (tombol lebar kertas; hanya tampilan, tidak menyimpan setelan)
      await sleep(200); await tekan(page.locator('button[aria-pressed]', { hasText: '58' }), 900, 0.9); await hover('.receipt-stage', 1500, 0.9, -40); // +0,8 dtk: take 19 Okt 21,3 dtk < target 22
    });
  } },

  // ================= 18 klip sisa (SHOTLIST-POS.md). target = durasi klip; alur dipad ke target−1,6 dtk =================
  // klip DIPOTONG 0,5 dtk setelah klik MASUK (POS/potong.sh): dashboard owner menampilkan kartu "Hari ini" merah + layar muat kosong
  'login-pemilik': { awal: '/login', akun: null, async jalan() {
    await langkah('fitur timbang', () => hover('.login-hero b:has-text("Timbang per gram")', 1300, 0.9));
    await langkah('fitur stok', () => hover('.login-hero b:has-text("Stok selalu sinkron")', 1100, 0.7));
    await langkah('username', async () => { await tekan('#u', 400); await ketik('owner', 160); await geser(300); });
    await langkah('password', async () => { await tekan('#p', 400); await ketik('password', 120); await geser(400); });
    await langkah('masuk', () => tekan('button[type=submit]', 1500, 0.9));
  } },
  'dashboard-ringkasan': { awal: '/dashboard', target: 18,
    // kartu "Hari ini" (merah) harus di luar layar: halaman terlalu pendek untuk digulir → tambah ruang kosong di bawah, gulir 228 (kartu berakhir di y 276, topbar 64).
    // Data Kemarin/30 hari dimuat dulu (cache) supaya grafik tidak kosong saat di-zoom.
    async siap() {
      await page.locator('text=Perlu perhatian').waitFor();
      for (const t of ['Kemarin', '30 hari', '7 hari']) { await page.click(`button:text-is("${t}")`); await page.waitForLoadState('networkidle'); await sleep(500); }
      await page.addStyleTag({ content: 'main{padding-bottom:420px!important}' });
      await page.evaluate(() => window.scrollTo(0, 228)); await sleep(400);
      console.log('scrollY', await page.evaluate(() => window.scrollY));
    },
    async jalan() {
      await langkah('donut', () => hover('h2:has-text("Penjualan per Kategori")', 1200, 0.9, 130, 0));
      await langkah('terlaris', () => hover(page.locator('tr', { hasText: 'Pisang Ambon' }).first(), 1200, 0.9));
      await langkah('kemarin', () => tekan('button:text-is("Kemarin")', 1500, 0.9));
      await langkah('30 hari', () => tekan('button:text-is("30 hari")', 1600, 0.7));
      await langkah('grafik', () => hover('#h-line', 1200, 0.9, 200, 300));
      await langkah('perlu perhatian', () => hover('text=Cabai Rawit', 1400, 1.0));
    } },
  'produk-multisatuan': { awal: '/products', target: 18, async jalan() {
    await langkah('hover baris', () => hover(page.locator('tr', { hasText: 'Bawang Merah' }).first(), 1000, 0.9));
    await langkah('ubah', () => tekan('a[aria-label="Ubah Bawang Merah"]', 1700, 0.9));
    await langkah('data utama', () => hover('#pf-sell', 900, 0.9));
    await langkah('gulir', async () => { await kirim('roda -4'); await geser(500); await kirim('roda -2'); await geser(500); });
    await langkah('satuan kg', () => hover(page.locator('select[name="rows.2.unit_id"]'), 1200, 0.9));
    await langkah('tipe harga', () => hover(page.locator('select[name="rows.1.pricing_type"]'), 1200, 0.8));
    await langkah('harga', () => hover('h2:has-text("Satuan produk")', 1000, 0.8));
  } },
  'produk-kategori-satuan': { awal: '/categories', target: 14, async jalan() {
    await langkah('sayur', () => hover(page.locator('tr', { hasText: 'Sayur' }).first(), 1100, 0.9));
    await langkah('sembako', () => hover(page.locator('tr', { hasText: 'Sembako' }).first(), 1000, 0.7));
    await langkah('menu satuan', () => tekan('a[href="/units"]', 1500, 0.9));
    await langkah('kilogram', () => hover(page.locator('tr', { hasText: 'Kilogram' }).first(), 1400, 0.9));
    await langkah('sak', () => hover(page.locator('tr', { hasText: 'Sak 25 kg' }).first(), 1200, 0.8));
  } },
  'kasir-diskon-qris': { awal: '/pos', akun: 'kasir1', target: 24, async jalan() {
    await langkah('telur', () => tekan(kartu('Telur Ayam'), 500));
    await langkah('1 kg', async () => { await page.locator('#jml').waitFor({ timeout: 3000 }); await ketik('1'); await geser(300); });
    await langkah('tambah', () => tekan(dialog().locator('button[type=submit]'), 600, 0.7));
    await langkah('gula', () => tekan(kartu('Gula Pasir'), 500, 0.9));
    await langkah('2 kg', async () => { await page.locator('#jml').waitFor({ timeout: 3000 }); await ketik('2'); await geser(300); });
    await langkah('tambah', () => tekan(dialog().locator('button[type=submit]'), 600, 0.7));
    await langkah('diskon', () => tekan('.cart button:has-text("Diskon")', 500, 0.9));
    await langkah('persen', () => tekan(dialog().locator('button[aria-pressed]', { hasText: 'Persen' }), 400, 0.7));
    await langkah('5%', async () => { await page.locator('#diskon-nilai').click(); await ketik('5'); await geser(300); });
    await langkah('terapkan', () => tekan(dialog().locator('button[type=submit]'), 700, 0.7));
    await langkah('qris', () => tekan(page.locator('[aria-label="Metode pembayaran"] button', { hasText: 'QRIS' }), 700, 0.8));
    await sleep(300);
    await langkah('proses', () => ubah('button.btn--pay', 1000, 0.9));
    await langkah('struk', async () => { if (!DRY) await page.waitForURL(/\/receipt\//, { timeout: 6000 }); await hover('.receipt-stage', 1200, 0.9, -40); });
  } },
  'kasir-hold': { awal: '/pos', akun: 'kasir1', target: 20, async jalan() {
    await langkah('beras', () => tekan(kartu('Beras Premium'), 500));
    await langkah('5 kg', async () => { await page.locator('#jml').waitFor({ timeout: 3000 }); await ketik('5'); await geser(300); });
    await langkah('tambah', () => tekan(dialog().locator('button[type=submit]'), 600, 0.7));
    await langkah('hold', () => tekan('button:has-text("Hold")', 500, 0.9));
    await langkah('nama', async () => { await page.locator('#tahan-nama').waitFor({ timeout: 3000 }); await ketik('Bu Sri'); await geser(300); });
    await langkah('tahan', () => (DRY ? hover(dialog().locator('button[type=submit]'), 1100, 0.7) : tekanPasti(dialog().locator('button[type=submit]'), 600, 0.7)));
    await langkah('daftar tahan', () => tekan('button:has-text("Daftar Tahan")', 1000, 0.9));
    await langkah('lanjutkan', () => (DRY ? hover(page.locator('button[aria-label="Lanjutkan Bu Sri"]'), 800, 0.9) : tekanPasti(page.locator('button[aria-label="Lanjutkan Bu Sri"]'), 300, 0.9)));
    // take 19 Okt: resume butuh ±2 dtk → tunggu dialog tertutup, tampilkan keranjang yang kembali
    await langkah('keranjang kembali', async () => { if (!DRY) await page.locator('[role=dialog]').waitFor({ state: 'detached', timeout: 8000 }).catch(() => {}); await hover(page.locator('#keranjang tbody tr, #keranjang table').first(), 1500, 0.9); });
  } },
  'struk-58mm': { awal: '/receipt/' + (process.env.RID || '0'), target: 12, async jalan() {
    await langkah('kop', () => hover('.receipt-stage', 1200, 0.9, -120));
    await langkah('80', () => tekan(page.locator('button[aria-pressed]', { hasText: '80' }), 1300, 0.9));
    await langkah('58', () => tekan(page.locator('button[aria-pressed]', { hasText: '58' }), 1300, 0.8));
    await langkah('cetak', () => hover('button:has-text("Cetak")', 1000, 0.8));
    await langkah('baru', () => hover('a:has-text("Transaksi Baru"), button:has-text("Transaksi Baru")', 900, 0.8));
  } },
  'penjualan-detail': { awal: '/sales', target: 18, async jalan() {
    await langkah('baris 2', () => hover(page.locator('tbody tr').nth(2), 900, 0.9));
    await langkah('baris 1', () => hover(page.locator('tbody tr').nth(1), 800, 0.7));
    await langkah('buka', () => tekan(page.locator('tbody tr').first().locator('a').first(), 1600, 0.8));
    await langkah('rincian', () => hover('text=Rincian barang', 1000, 0.9, 60, 300));
    await langkah('pergerakan', () => hover('text=Pergerakan stok', 1100, 0.9, 50, 300));
    await langkah('cetak ulang', () => tekan('a:has-text("Cetak Ulang Struk")', 1500, 1.0));
    await langkah('struk', () => hover('.receipt-stage', 900, 0.9, -40));
  } },
  'stok-kartu': { awal: '/inventory', target: 16, async jalan() {
    await langkah('nilai', () => hover('text=Nilai', 1000, 0.9));
    await langkah('habis', () => hover(page.locator('tr', { hasText: 'Cabai Rawit' }).first(), 1100, 0.9));
    await langkah('riwayat', () => tekan('a[aria-label="Riwayat stok Bawang Merah"]', 1600, 0.9));
    await langkah('baris jual', () => hover(page.locator('tbody tr', { hasText: 'Penjualan' }).first(), 1400, 0.9));
    await langkah('baris beli', () => hover(page.locator('tbody tr').nth(3), 1000, 0.8));
  } },
  'stok-opname': { awal: '/inventory/adjustment', target: 18,
    async siap() { await page.selectOption('#pp', { label: (await page.locator('#pp option', { hasText: 'Tomat' }).first().innerText()).trim() }); await sleep(800); },
    async jalan() {
      await langkah('produk', () => hover('#pp', 900, 0.9));
      await langkah('stok sistem', () => hover('#ss', 800, 0.8));
      await langkah('aktual', async () => {
        const s = +((await page.inputValue('#ss')).replace(/\D/g, '')) || 0; this.nilai = String(Math.max(0, s - 250));
        await tekan('#sa', 300, 0.8); await page.keyboard.press('Control+A'); await ketik(this.nilai, 100); await geser(300);
      });
      await langkah('alasan', async () => { await hover('#als', 400, 0.8); await page.selectOption('#als', 'SELISIH_OPNAME'); await geser(500); });
      await langkah('catatan', async () => { await tekan('#ct', 200, 0.8); await ketik('Opname mingguan', 70); });
      await langkah('simpan', () => tekan('button:has-text("Simpan Penyesuaian")', 900, 0.9));
      await langkah('konfirmasi', () => ubah(dialog().locator('button:has-text("Sesuaikan Stok")'), 1600, 0.8));
    } },
  'pembelian-baru': { awal: '/purchases/new', target: 20, async jalan() {
    await langkah('supplier', async () => { await hover('#po-supplier', 300, 0.9); await page.selectOption('#po-supplier', { label: 'PT Sumber Tani' }); await geser(500); });
    await langkah('nota', async () => { await tekan('#po-invoice', 200, 0.8); await ketik('NOTA-1019-778', 60); });
    await langkah('produk', async () => { await tekan('#po-produk-0', 200, 0.9); await ketik('Bawang M', 80); await page.locator('[role=option]').first().waitFor({ timeout: 4000 }); await tekan(page.locator('[role=option]').first(), 500, 0.7); });
    await langkah('jumlah', async () => { await tekan('#po-qty-0', 200, 0.8); await page.keyboard.press('Control+A'); await ketik('20'); });
    await langkah('satuan', async () => { await hover('#po-unit-0', 300, 0.8); const o = await page.locator('#po-unit-0 option').allInnerTexts(); const kg = o.find((x) => /kilo/i.test(x)); if (kg) await page.selectOption('#po-unit-0', { label: kg }); await geser(500); });
    await langkah('harga', () => hover('#po-harga-0', 700, 0.8));
    await langkah('simpan', () => ubah('button:has-text("Simpan Pembelian")', 1300, 0.9, 0));
    await langkah('detail', async () => { if (!DRY) await page.waitForURL(/\/purchases\/\d+/, { timeout: 6000 }); await hover('text=Pergerakan stok', 1000, 0.9, 50, 300); });
  } },
  'supplier-detail': { awal: '/suppliers', target: 14, async jalan() {
    await langkah('baris 1', () => hover(page.locator('tbody tr').nth(0), 900, 0.9));
    await langkah('baris 3', () => hover(page.locator('tbody tr').nth(2), 800, 0.7));
    await langkah('buka', () => tekan('a:has-text("PT Sumber Tani")', 1500, 0.9));
    await langkah('teratas', () => hover('text=Produk teratas', 1100, 0.9, 50));
    await langkah('riwayat', () => hover(page.locator('tbody tr').nth(1), 1000, 0.9));
  } },
  'laporan-4tab': { awal: '/reports/sales', target: 20, async jalan() {
    const tab = (t) => page.locator('nav.report-tabs a', { hasText: t });
    await langkah('kartu', () => hover('text=Total Penjualan', 1000, 0.9));
    await langkah('grafik', () => hover('h2:has-text("Penjualan per Hari")', 1000, 0.9, 180, 500));
    await langkah('produk', () => tekan(tab('Produk'), 1400, 0.9));
    await langkah('laba', () => tekan('button[aria-pressed]:has-text("Laba")', 1400, 0.8));
    await langkah('pembelian', () => tekan(tab('Pembelian'), 1500, 0.9));
    await langkah('stok', () => tekan(tab('Stok'), 1500, 0.8));
    await langkah('lihat', () => hover(page.locator('tbody tr').first(), 900, 0.9));
  } },
  'laporan-ekspor': { awal: '/reports/sales', target: 12, async jalan() {
    await langkah('filter', () => hover('button:text-is("7 hari")', 1000, 0.9));
    await langkah('30 hari', () => tekan('button:text-is("30 hari")', 1400, 0.9));
    await langkah('ekspor', () => tekan('button:has-text("Ekspor CSV")', 2000, 0.9));
  } },
  'pengguna-izin': { awal: '/users', target: 16, async jalan() {
    await langkah('owner', () => hover(page.locator('tr', { hasText: 'Hara Satria' }).first(), 900, 0.9));
    await langkah('siti', () => hover(page.locator('tr', { hasText: 'Siti Nur Aisyah' }).first(), 1000, 0.8));
    await langkah('ubah', () => tekan('button[aria-label="Ubah Siti Nur Aisyah"]', 1300, 0.9));
    await langkah('izin', () => hover(dialog().locator('label', { hasText: /diskon/i }).first(), 1300, 0.9));
    await langkah('peran', () => hover(dialog().locator('#uf-role'), 900, 0.8));
    await langkah('batal', () => tekan(dialog().locator('button:has-text("Batal")'), 1000, 0.8));
  } },
  'kasir-menu-terbatas': { awal: '/login', akun: null, target: 14, async jalan() {
    await langkah('username', async () => { await tekan('#u', 300); await ketik('kasir1', 110); });
    await langkah('password', async () => { await tekan('#p', 300); await ketik('password', 80); });
    await langkah('masuk', () => tekan('button[type=submit]', 1500, 0.8));
    await langkah('menu', async () => { await page.waitForURL(/\/pos/, { timeout: 8000 }).catch(() => {}); await hover('nav a[href="/pos"], aside a[href="/pos"]', 700, 0.9); await hover('a[href="/sales"]', 700, 0.6); await hover('a[href="/products"]', 900, 0.6); });
  } },
  'pengaturan-log': { awal: '/settings', target: 18, async jalan() {
    await langkah('nama', () => hover('#st-name', 1000, 0.9));
    await langkah('struk', () => hover('button:text-is("58 mm")', 1000, 0.9));
    await langkah('ppn', () => hover('#st-tax', 900, 0.8));
    await langkah('log', () => tekan('a[href="/audit-logs"]', 1600, 0.9));
    await langkah('baris', () => hover(page.locator('tbody tr').nth(1), 1000, 0.9));
    await langkah('filter aksi', () => hover('#al-action', 900, 0.8));
  } },
  'penjualan-void': { awal: '/sales/' + (process.env.VID || '0'), target: 14, async jalan() {
    await langkah('status', () => hover('text=Rincian barang', 900, 0.9, 60, 300));
    await langkah('batalkan', () => tekan('button:has-text("Batalkan Transaksi")', 700, 0.9));
    await langkah('alasan', async () => { await page.locator('#confirm-reason').waitFor({ timeout: 3000 }); await tekan('#confirm-reason', 200, 0.8); await ketik('Salah input jumlah', 60); });
    await langkah('ya', () => ubah(dialog().locator('button:has-text("Ya, Batalkan")'), 1500, 0.8));
    await langkah('void', () => hover('text=Pembatalan', 1200, 0.9, 40));
  } },
};

(async () => {
  const nama = process.argv[2] || 'kasir-timbang';
  const alur = ALUR[nama]; if (!alur) throw new Error('alur tak dikenal: ' + nama);
  const browser = await chromium.launch({ headless: false, executablePath: CHROME, args: ['--window-position=0,0', '--window-size=1920,1040', '--force-device-scale-factor=1'] });
  const ctx = await browser.newContext({ viewport: null });
  await ctx.addInitScript(() => { window.print = () => {}; addEventListener('mousemove', (e) => { window.__m = [e.clientX, e.clientY]; }, true); }); // struk ?print=1 → jangan munculkan dialog cetak native
  // halaman login: kotak "Mode demo — pilih akun…" disembunyikan (notice demo tidak boleh terekam); login diketik manual
  await ctx.addInitScript(() => { const s = () => { const st = document.createElement('style'); st.textContent = '.demo-box{display:none!important}'; document.head.appendChild(st); }; if (document.head) s(); else addEventListener('DOMContentLoaded', s); });
  page = await ctx.newPage();
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  if (alur.akun !== null) {
    await page.fill('#u', AKUN[alur.akun || 'owner']);
    await page.fill('#p', 'password');
    await page.click('button[type=submit]');
    await page.waitForURL((u) => !/\/login/.test(u.pathname), { timeout: 60000 });
  }
  if (DRY) await page.route('**/*', (r) => { const q = r.request(); return (q.method() === 'GET' || /\/pos\/quote|\/login/.test(q.url())) ? r.continue() : (console.log('BLOK', q.method(), q.url()), r.abort()); });
  await page.goto(BASE + alur.awal, { waitUntil: 'networkidle' });
  await sleep(800);
  // aktifkan jendela Chromium dengan klik OS di judul halaman (sebelum Record) — uji 19 Okt: klik OS kadang jatuh ke jendela lain
  try { const [hx, hy] = await pusat('h1, h2'); await kirim(`click ${hx} ${hy} 0.2`); await sleep(300); } catch (e) { console.error('aktifkan gagal', e.message); }
  if (alur.siap) await alur.siap();
  await kirim('move 960 560 0.2');
  console.log('SIAP');
  for (let i = 0; i < 300 && !DRY && !fs.existsSync(DIR + 'mulai.flag'); i++) await sleep(500);
  try { fs.unlinkSync(DIR + 'mulai.flag'); } catch {}
  await sleep(600);
  const t0 = Date.now();
  await alur.jalan();
  if (alur.target) await geserSampai(t0 + (alur.target - 1.1) * 1000); // durasi klip ≥ target (sesi menambah ±2 dtk)
  console.log('SELESAI', ((Date.now() - t0) / 1000).toFixed(1) + ' dtk alur', page.url());
  if (DRY) await page.screenshot({ path: OUT + 'dry-' + nama + '.png' });
  for (let i = 0; i < 240 && !DRY && !fs.existsSync(DIR + 'berhenti.flag'); i++) await sleep(500);
  try { fs.unlinkSync(DIR + 'berhenti.flag'); } catch {}
  await sleep(1500);
  await browser.close();
  mouse.kill();
})().catch((e) => { console.error(e.message); mouse.kill(); process.exit(1); });
