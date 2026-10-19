// Tambahkan/ganti baris klip laptop di ../LAPORAN.md (tabel PC tetap) dari out/unggah.json + durasi ffprobe + catatan-pos.json.  node laporan-pos.js
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'); const F = ROOT + '/LAPORAN.md';
const UNG = fs.existsSync(ROOT + '/out/unggah.json') ? JSON.parse(fs.readFileSync(ROOT + '/out/unggah.json', 'utf8')) : {};
const CAT = fs.existsSync(__dirname + '/catatan-pos.json') ? JSON.parse(fs.readFileSync(__dirname + '/catatan-pos.json', 'utf8')) : {};
const TARGET = { 'kasir-hold': 16, 'penjualan-detail': 18, 'stok-kartu': 16, 'stok-opname': 18, 'pembelian-baru': 20, 'supplier-detail': 14,
  'laporan-4tab': 20, 'laporan-ekspor': 12, 'pengguna-izin': 16, 'kasir-menu-terbatas': 14, 'pengaturan-log': 18, 'penjualan-void': 14 };
const dur = (id) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', `${ROOT}/out/pos/${id}.mp4`], { encoding: 'utf8' })).toFixed(1).replace('.', ',');
const baru = Object.entries(UNG).map(([id, u]) => [u.no, `| ${u.no} | ${u.modul} | ${id.replace(/-/g, ' ')} (laptop) | out/${u.file} | ${dur(id)} | ${TARGET[id]} | ${u.directus} | ${CAT[id] || ''} |`]);
const L = fs.readFileSync(F, 'utf8').split(/\r?\n/);
const i0 = L.findIndex((l) => l.startsWith('|---')); let i1 = i0 + 1; while (i1 < L.length && L[i1].startsWith('|')) i1++;
const nomor = (l) => Number((l.match(/^\|\s*(\d+)\s*\|/) || [])[1]);
const ada = new Set(baru.map((b) => b[0]));
const baris = L.slice(i0 + 1, i1).filter((l) => !ada.has(nomor(l))).map((l) => [nomor(l), l]).concat(baru).sort((a, b) => a[0] - b[0]).map((b) => b[1]);
fs.writeFileSync(F, [...L.slice(0, i0 + 1), ...baris, ...L.slice(i1)].join('\n'));
console.log('LAPORAN.md:', baris.length, 'baris klip');
