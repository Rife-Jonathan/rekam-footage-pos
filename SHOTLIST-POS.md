# SHOTLIST POS — pustaka footage POS "Toko Sembako Berkah" (Recordly, gaya DentalCare)

App: https://toko-sembako.nusawebsite.com (judul jendela "Toko Sembako Berkah POS"; JANGAN rekam/ubah murah-pangan.nusawebsite.com). Teks "Murah Pangan" tidak boleh muncul di frame. Peta fitur: `growth/video/pipeline/apps/_peta/murah-pangan/PETA.md`.
Data demo di-reseed 19 Okt (1.514 penjualan 20 Sep–19 Okt). **TIDAK ada reset otomatis** → transaksi rekaman tersimpan permanen.

## Aturan rekam (sama dengan DentalCare / PROMPT rekam-footage-resto)
- Recordly merekam **JENDELA "Toko Sembako Berkah POS" saja**, Hide HUD, kursor OS asli (`mouse_server.py`), ukuran kursor 1.0.
- Viewport: jendela Chrome 1920x1040 di (0,0), DSF 1. Olah: preset "Nusawebsite Demo" → kursor 1.0 → crop atas 9% → Suggest Zooms
  → `fokus-klik.js` (zoom Manual di titik klik) → ekspor ke `POS/out/<nama>.mp4`.
- Gerak: meluncur 0,9 dtk → klik → geser kecil ±1,6 dtk. Jeda antar aksi ≤1 dtk; scroll hanya setelah zoom keluar.
- Durasi klip = target (boleh +1–2 dtk, jangan kurang). Nama file `pos-<modul>-<aksi>.mp4`.
- `window.print` dimatikan (addInitScript) → dialog cetak native Chrome tidak pernah muncul di rekaman.
- Klip yang MENGUBAH DATA (bayar, hold, simpan produk, penyesuaian, pembelian, simpan pengaturan) hanya di TAKE FINAL;
  latihan pakai `DRY=1` (request non-GET diblokir, aksi ubah = hover). VOID/hapus PALING AKHIR dan hanya pada data buatan rekaman ini.
- Dashboard: JANGAN tampilkan filter "Hari ini" (kartu turun merah). Pakai "7 hari" / "Kemarin" / "30 hari".
- Nama/produk QA (QA Kategori, QA Beras Kemasan, QA Supplier) tidak boleh terlihat; kalau muncul → berhenti, lapor.

## Login
| Akun | Tombol demo | Landing |
|---|---|---|
| owner / password (Hara Satria, admin) | "Pemilik" | `/dashboard` |
| kasir1 / password (Siti Nur Aisyah, + izin diskon) | "Kasir 1" | `/pos` |
| kasir2 / password (Budi Santoso) | "Kasir 2" | `/pos` |
Login non-rekam dilakukan otomatis oleh `rekam.js` (isi #u/#p, submit), kecuali klip `pos-login-pemilik`.

## Pustaka klip (urut take final)

| # | File | Modul | Rute awal | Login | Target | Ubah data |
|---|---|---|---|---|---|---|
| 1 | pos-login-pemilik.mp4 | Login | `/login` | — | 12 dtk | tidak |
| 2 | pos-dashboard-ringkasan.mp4 | Dashboard | `/dashboard` | owner | 18 dtk | tidak |
| 3 | pos-produk-multisatuan.mp4 | Produk | `/products` | owner | 18 dtk | tidak (hanya buka) |
| 4 | pos-produk-kategori-satuan.mp4 | Produk | `/categories` | owner | 14 dtk | tidak |
| 5 | pos-kasir-timbang.mp4 (**KLIP UJI**) | Kasir | `/pos` | owner | 22 dtk | YA (1 penjualan Tunai) |
| 6 | pos-kasir-diskon-qris.mp4 | Kasir | `/pos` | kasir1 | 20 dtk | YA (1 penjualan QRIS) |
| 7 | pos-kasir-hold.mp4 | Kasir | `/pos` | kasir1 | 16 dtk | YA (1 hold, lalu dilanjutkan) |
| 8 | pos-struk-58mm.mp4 | Struk | `/receipt/<id klip 6>` | owner | 12 dtk | tidak |
| 9 | pos-penjualan-detail.mp4 | Penjualan | `/sales` | owner | 18 dtk | tidak |
| 10 | pos-stok-kartu.mp4 | Stok | `/inventory` | owner | 16 dtk | tidak |
| 11 | pos-stok-opname.mp4 | Stok | `/inventory/adjustment` | owner | 18 dtk | YA (1 penyesuaian) |
| 12 | pos-pembelian-baru.mp4 | Pembelian | `/purchases/new` | owner | 20 dtk | YA (1 PO) |
| 13 | pos-supplier-detail.mp4 | Supplier | `/suppliers` | owner | 14 dtk | tidak |
| 14 | pos-laporan-4tab.mp4 | Laporan | `/reports/sales` | owner | 20 dtk | tidak |
| 15 | pos-laporan-ekspor.mp4 | Laporan | `/reports/sales` | owner | 12 dtk | tidak (unduh CSV) |
| 16 | pos-pengguna-izin.mp4 | Pengguna | `/users` | owner | 16 dtk | tidak (dialog dibuka, Batal) |
| 17 | pos-kasir-menu-terbatas.mp4 | Login kasir | `/login` | — | 14 dtk | tidak |
| 18 | pos-pengaturan-log.mp4 | Pengaturan | `/settings` | owner | 18 dtk | tidak |
| 19 | pos-penjualan-void.mp4 (TERAKHIR) | Penjualan | `/sales/<id klip 5>` | owner | 14 dtk | YA (VOID penjualan buatan klip 5) |

## Langkah per klip
Format: [aksi, jeda setelahnya]. Selector = teks yang terlihat di UI.

### 1 pos-login-pemilik · 12 dtk
1. [hover kotak "Mode demo", 1,5] 2. [klik tombol demo "Pemilik" → username/password terisi, 1,5]
3. [klik "Masuk", 2,5 — dashboard muncul] 4. [geser kecil, sisanya]

### 2 pos-dashboard-ringkasan · 18 dtk
Persiapan (tidak direkam): pilih filter "7 hari" sebelum SIAP (supaya frame pertama bukan "Hari ini").
1. [hover kartu Omzet, 1,5] 2. [hover kartu Laba kotor, 1,5] 3. [hover grafik penjualan titik tengah, 2]
4. [klik filter "Kemarin", 2] 5. [klik filter "30 hari", 2] 6. [hover panel "Perlu perhatian" (Cabai Rawit habis), 2] 7. [diam/geser, sisanya]

### 3 pos-produk-multisatuan · 18 dtk
1. [hover baris "Bawang Merah", 1,5] 2. [klik "Bawang Merah" → `/products/:id`, 2] 3. [gulir ke bagian Satuan setelah zoom keluar, 1,5]
4. [hover baris satuan kg / ons / ikat (harga proporsional vs tetap), 3×1,5] 5. [diam, sisanya]. JANGAN klik Simpan.

### 4 pos-produk-kategori-satuan · 14 dtk
1. [hover 2 baris kategori (Sayur, Sembako), 2×1,5] 2. [klik menu Produk ▸ "Satuan", 2] 3. [hover baris "Kilogram" (1 kg = 1.000 g), 2] 4. [diam, sisanya]

### 5 pos-kasir-timbang (KLIP UJI) · 22 dtk
1. [klik kartu "Bawang Merah" → dialog "Input Jumlah — Timbang", 1,2] 2. [ketik "0,75" di Jumlah, Total harga Rp 19.500, 1,2]
3. [klik "Tambah ke Keranjang", 1,2] 4. [klik kartu "Minyak Kita 1 L" → dialog "Input Jumlah", ketik "1", Tambah, 1,2]
5. [klik metode "Tunai", 0,6] 6. [klik "Uang pas", 1,2] 7. [klik "PROSES PEMBAYARAN (F12)" → struk, 2,5] 8. [klik lebar kertas "58 mm" (setelan toko 80 mm; hanya tampilan), 1] 9. [hover struk, sisanya]

### 6 pos-kasir-diskon-qris · 20 dtk (kasir1)
1. [klik "Telur Ayam", ketik "1", Tambah, 1] 2. [klik "Gula Pasir", ketik "2", Tambah, 1] 3. [klik "Diskon" (F8), isi 5%, Terapkan, 1,5]
4. [klik "QRIS", 1,5] 5. [klik PROSES PEMBAYARAN → struk, 2,5] 6. [diam, sisanya]

### 7 pos-kasir-hold · 16 dtk (kasir1)
1. [klik "Beras Premium", ketik "5", Tambah, 1] 2. [klik "Hold" (F4), isi label "Bu Sri", simpan, 1,5]
3. [klik "Daftar Tahan" (badge 1), 1,5] 4. [klik "Lanjutkan" pada "Bu Sri" → keranjang kembali, 2] 5. [diam, sisanya]
(Sesudah klip: kosongkan keranjang tanpa merekam.)

### 8 pos-struk-58mm · 12 dtk
1. [hover kop toko struk, 1,5] 2. [klik lebar "80 mm", 1,5] 3. [klik "58 mm", 1,5] 4. [hover tombol "Cetak", 1,5] 5. [hover "Transaksi Baru", sisanya]

### 9 pos-penjualan-detail · 18 dtk
Persiapan: set filter tanggal 7 hari.
1. [hover 2 baris transaksi, 2×1,2] 2. [klik baris transaksi Tunai teratas → `/sales/:id`, 2] 3. [hover rincian item, 1,5]
4. [gulir ke "Pergerakan stok", 1,5] 5. [klik "Cetak Ulang Struk" → struk, 2,5] 6. [diam, sisanya]

### 10 pos-stok-kartu · 16 dtk
1. [hover kartu "Nilai stok", 1,5] 2. [hover baris "Cabai Rawit" (Habis), 1,5] 3. [klik "Bawang Merah" → kartu stok, 2]
4. [hover baris penjualan (stok sebelum → sesudah), 2] 5. [diam, sisanya]

### 11 pos-stok-opname · 18 dtk
1. [klik pilih produk, ketik "Tomat", pilih, 1,5] 2. [pilih alasan "Selisih opname", 1] 3. [ketik jumlah stok fisik, 1]
4. [ketik catatan "Opname mingguan", 1] 5. [klik Simpan → toast, 2] 6. [diam, sisanya]

### 12 pos-pembelian-baru · 20 dtk
1. [pilih supplier pertama (bukan QA), 1,2] 2. [baris 1: produk "Bawang Merah", satuan "Sak", jumlah 2, harga, 1,5]
3. [klik "Tambah baris", produk "Gula Pasir", 1,5] 4. [hover total, 1] 5. [klik Simpan → detail PO + pergerakan stok, 2,5] 6. [diam, sisanya]

### 13 pos-supplier-detail · 14 dtk
1. [hover 2 baris supplier, 2×1,2] 2. [klik supplier teratas → detail, 2] 3. [hover "Produk teratas", 1,5] 4. [hover riwayat PO, sisanya]

### 14 pos-laporan-4tab · 20 dtk
Persiapan: filter 30 hari.
1. [hover kartu omzet/laba, 1,5] 2. [hover grafik per hari, 1,5] 3. [klik tab "Produk", 2] 4. [klik "Terlaris"/"Laba", 1,5]
5. [klik tab "Pembelian", 2] 6. [klik tab "Stok", 2] 7. [diam, sisanya]

### 15 pos-laporan-ekspor · 12 dtk
1. [hover filter tanggal, 1,5] 2. [klik "Ekspor CSV" → toast/unduhan, 2,5] 3. [diam, sisanya] (bilah unduhan Chrome ada di atas → kena crop 9%; cek frame.)

### 16 pos-pengguna-izin · 16 dtk
1. [hover baris "Siti Nur Aisyah" (Kasir, izin diskon), 1,5] 2. [klik ubah → dialog izin, 2] 3. [hover centang "Beri diskon", 1,5]
4. [klik "Batal", 1,5] 5. [diam, sisanya]

### 17 pos-kasir-menu-terbatas · 14 dtk
1. [klik tombol demo "Kasir 1", 1] 2. [klik "Masuk" → `/pos`, 2] 3. [hover sidebar: hanya Kasir, Penjualan, Produk, 2×1,5] 4. [diam, sisanya]

### 18 pos-pengaturan-log · 18 dtk
1. [hover identitas toko, 1,5] 2. [hover lebar struk 58/80, 1,5] 3. [hover PPN / izin stok minus, 1,5] (JANGAN simpan)
4. [klik "Log aktivitas", 2] 5. [hover baris "ubah harga"/"void", 2] 6. [diam, sisanya]

### 19 pos-penjualan-void (PALING AKHIR) · 14 dtk
Hanya transaksi buatan klip 5. 1. [hover status, 1] 2. [klik "VOID", isi alasan "Salah input", konfirmasi, 3] 3. [hover badge DIBATALKAN, sisanya]

## Perkiraan waktu
Per klip ±12–15 menit (tulis/latih alur DRY 5–8 mnt + sesi rekam & olah Recordly ±6 mnt, ekspor ber-zoom 2–4 mnt).
19 klip ≈ 4–5 jam layar PC terpakai.
