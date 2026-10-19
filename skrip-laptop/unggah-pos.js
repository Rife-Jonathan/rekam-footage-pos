// Unggah klip POS ke Directus lewat skill directus-pustaka (repo resto) → Nusawebsite/Video/Toko Sembako/Footage Recordly/<Modul>/.
//   node unggah-pos.js [--dry] kasir-hold penjualan-detail ...      sumber: out/pos/<alur>.mp4
// Token: rekam-footage-resto/rahasia/directus-token.txt (TIDAK dicetak). Hasil → out/unggah.json (untuk LAPORAN.md).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const RESTO = path.join(ROOT, '../rekam-footage-resto');
const KLIP = { // alur: [#, Modul (folder), file, deskripsi]
  'kasir-hold': [7, 'Kasir', 'pos-kasir-hold', 'kasir menahan transaksi (Hold, label Bu Sri), buka Daftar Tahan lalu Lanjutkan ke keranjang'],
  'penjualan-detail': [9, 'Penjualan', 'pos-penjualan-detail', 'daftar penjualan, detail transaksi Tunai (rincian barang, pergerakan stok) dan cetak ulang struk'],
  'stok-kartu': [10, 'Stok', 'pos-stok-kartu', 'ringkasan stok (nilai stok, Cabai Rawit habis) dan kartu stok Bawang Merah sebelum/sesudah'],
  'stok-opname': [11, 'Stok', 'pos-stok-opname', 'penyesuaian stok Tomat alasan selisih opname dengan catatan Opname mingguan'],
  'pembelian-baru': [12, 'Pembelian', 'pos-pembelian-baru', 'input pembelian baru dari supplier, simpan lalu detail PO dan pergerakan stok'],
  'supplier-detail': [13, 'Supplier', 'pos-supplier-detail', 'daftar supplier dan detail PT Sumber Tani (produk teratas, riwayat pembelian)'],
  'laporan-4tab': [14, 'Laporan', 'pos-laporan-4tab', 'laporan 4 tab: penjualan, produk (terlaris/laba), pembelian, stok'],
  'laporan-ekspor': [15, 'Laporan', 'pos-laporan-ekspor', 'laporan penjualan filter 30 hari lalu Ekspor CSV'],
  'pengguna-izin': [16, 'Pengguna', 'pos-pengguna-izin', 'daftar pengguna dan dialog izin kasir (beri diskon), dibatalkan'],
  'kasir-menu-terbatas': [17, 'Login', 'pos-kasir-menu-terbatas', 'login kasir1 → menu terbatas (Kasir, Penjualan, Produk)'],
  'pengaturan-log': [18, 'Pengaturan', 'pos-pengaturan-log', 'pengaturan toko (identitas, lebar struk, PPN) dan log aktivitas'],
  'penjualan-void': [19, 'Penjualan', 'pos-penjualan-void', 'membatalkan (VOID) transaksi dengan alasan, status Pembatalan'],
};
const dry = process.argv.includes('--dry');
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const env = { ...process.env, DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN || fs.readFileSync(path.join(RESTO, 'rahasia/directus-token.txt'), 'utf8').trim() };
const catat = path.join(ROOT, 'out/unggah.json');
const hasil = fs.existsSync(catat) ? JSON.parse(fs.readFileSync(catat, 'utf8')) : {};
for (const id of ids) {
  const [no, modul, nama, apa] = KLIP[id] || [];
  if (!nama) { console.log(id, 'TIDAK DIKENAL'); continue; }
  const src = path.join(ROOT, 'out/pos', id + '.mp4');
  if (!fs.existsSync(src)) { console.log(id, 'FILE TIDAK ADA'); continue; }
  const file = path.join(ROOT, 'out', nama + '.mp4');
  fs.copyFileSync(src, file);
  const tag = modul.toLowerCase();
  const args = [path.join(RESTO, 'skill/directus-pustaka/simpan.mjs'), '--brand', 'Nusawebsite', '--jenis', 'Video',
    '--sub', 'Toko Sembako/Footage Recordly/' + modul, '--file', file, '--varian', nama.replace(/-/g, ' '),
    '--produk', 'Toko Sembako', '--kategori', 'screen-recording', '--deskripsi', `Footage Recordly POS Toko Sembako Berkah ${tag}: ${apa}.`,
    '--tags', `pos,recordly,toko-sembako,${tag}`];
  if (dry) args.push('--dry');
  if (process.argv.includes('--ganti')) args.push('--ganti');
  try {
    const out = execFileSync('node', args, { env, encoding: 'utf8', cwd: ROOT });
    const idDx = (out.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/) || [])[0];
    console.log(`${id} ${dry ? 'DRY' : 'OK'} ${idDx || ''}\n${out.trim().split('\n').slice(-4).join('\n')}`);
    if (!dry && idDx) { hasil[id] = { no, modul, file: nama + '.mp4', directus: idDx }; fs.writeFileSync(catat, JSON.stringify(hasil, null, 2)); }
  } catch (e) { console.log(id, 'GAGAL', (e.stdout || '') + (e.stderr || e.message).slice(0, 400)); }
}
