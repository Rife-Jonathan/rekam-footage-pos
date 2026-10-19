# PROMPT agent LAPTOP — lanjutan rekam footage POS "Toko Sembako Berkah"

Aplikasi: https://toko-sembako.nusawebsite.com (login demo owner / kasir1 / kasir2, sandi `password`). JANGAN buka/rekam murah-pangan.nusawebsite.com.
Setup Recordly + preset "Nusawebsite Demo" + aturan rekam = SAMA dengan repo `rekam-footage-resto` (sudah terpasang di laptop ini). Baca PROMPT.md repo itu bagian 1-4.

## Status (19 Okt 2026, dari PC owner)
- 7 dari 19 klip SUDAH direkam di PC (diunggah ke Directus oleh PC): #1 login, #2 dashboard, #3 produk multisatuan, #4 kategori/satuan,
  #5 kasir timbang, #6 kasir diskon+QRIS, #8 struk 58 mm. JANGAN direkam ulang.
- SISA 12 klip = tugasmu: #7 kasir-hold, #9 penjualan-detail, #10 stok-kartu, #11 stok-opname, #12 pembelian-baru, #13 supplier-detail,
  #14 laporan-4tab, #15 laporan-ekspor, #16 pengguna-izin, #17 kasir-menu-terbatas, #18 pengaturan-log, #19 penjualan-void (TERAKHIR).
- Detail langkah, rute, target durasi: `SHOTLIST-POS.md`. Catatan data yang sudah dibuat: `LAPORAN.md`.

## Skrip
`skrip/` = skrip POS yang sudah terbukti di PC (sesi.sh, rekam.js berisi alur SEMUA klip, fokus-klik.js, ekspor.sh, cek.sh, unggah.sh)
+ skrip dasar Recordly (kendali.js, preset.js, kursor.js, varian.js, mouse_server.py, simpan-dialog.ps1).
Path di dalamnya masih path PC (`E:/Content-Machine/node_modules/playwright`, `E:/Rakazo/growth/video/recordly/POS/...`, Python310, chromium-1248)
dan `sesi.sh` menganggap skrip dasar ada di folder induk (`cd "$POS/.."`). Sesuaikan ke laptop (pakai salinan yang sudah jalan di repo resto).
Cara pakai: `bash skrip/sesi.sh <alur> pos-<alur>.mp4` (nama alur lihat `rekam.js`).

## Urutan kerja
1. Bila rekam RESTO masih berjalan: selesaikan/jeda di titik aman dulu (satu layar, satu Recordly). Owner yang menentukan prioritas bila ragu.
2. `git pull`, sesuaikan path, latihan 1 klip (#7) tanpa Record.
3. Rekam 12 klip berurutan; aksi pengubah data hanya di take final; hindari take berulang (tiap take = transaksi permanen, tidak ada reset otomatis).
   #19 VOID paling akhir, pakai INV-20261019-00012 (/sales/1515) yang memang disiapkan untuk VOID.
4. Periksa tiap klip (frame 20/45/70/95%, durasi ≥ target, tanpa desktop/HUD/teks "Murah Pangan", zoom tidak goyang).
5. Unggah ke Directus `Nusawebsite/Video/Toko Sembako/Footage Recordly/<modul>/` --varian "pos <modul> <aksi>" --produk "Toko Sembako"
   --kategori screen-recording --tags "pos,recordly,toko-sembako,<modul>" (token `rahasia/directus-token.txt` di repo resto, jangan dicetak).
6. Isi `LAPORAN.md` (modul | klip | durasi | id Directus | catatan), commit + push tiap beberapa klip.

Batas: hanya rekam + unggah, jangan ubah server. Ragu → tanya owner. Jawab singkat, Bahasa Indonesia.
