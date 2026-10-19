# LAPORAN rekam footage POS — Toko Sembako Berkah (toko-sembako.nusawebsite.com)

Recordly PC, gaya "Nusawebsite Demo" (kursor 1.0, crop atas 9%, zoom Manual di titik klik). Shotlist: `SHOTLIST-POS.md`.
Directus: `Nusawebsite/Video/Toko Sembako/Footage Recordly/<modul>/` (katalog `video_aset`, kategori screen-recording).
Frame periksa: `out/cek/<klip>.png` (lembar 2x2: 20/45/70/95% durasi).

| # | Modul | Klip | File | Durasi | Target | id Directus | Catatan |
|---|---|---|---|---|---|---|---|
| 5 | Kasir | kasir timbang (uji) | out/pos-kasir-timbang.mp4 | 21,3 | 22 | 36f09e55-2f11-41c7-b83f-311ff88849ef | disetujui owner; INV-20261019-00013 (/sales/1516) |
| 7 | Kasir | kasir hold (laptop) | out/pos-kasir-hold.mp4 | 20,6 | 16 | d3a03b88-5428-4e65-a2c4-e50938f99dde | Data: 1 hold "Bu Sri" (Beras Premium 5 kg) lalu dilanjutkan; keranjang tidak dibayar. |
| 9 | Penjualan | penjualan detail (laptop) | out/pos-penjualan-detail.mp4 | 18,4 | 18 | 697712dc-1395-46e6-b8f4-26e53f21e931 | Baris teratas = INV-20261019-00014 (QRIS, bukan Tunai); sesaat layar muat sebelum struk. |
| 10 | Stok | stok kartu (laptop) | out/pos-stok-kartu.mp4 | 16,0 | 16 | 216b728d-3506-48a1-a8d3-61b19576cf21 | Zoom pertama sempat menangkap layar muat Riwayat Stok. |
| 11 | Stok | stok opname (laptop) | out/pos-stok-opname.mp4 | 18,4 | 18 | b5899396-3fc0-490b-8b00-01768a28f733 | Data: penyesuaian Tomat −250 g (60.200 → 59.950 g), alasan Selisih opname. |
| 12 | Pembelian | pembelian baru (laptop) | out/pos-pembelian-baru.mp4 | 20,4 | 20 | 66e7047e-57e0-4d4c-8222-915d6c25e450 | Data: PO-20261019-00004 (/purchases/16), PT Sumber Tani, Bawang Merah 20 kg Rp 433.160, nota NOTA-1019-778. Satu baris saja (alur PC; tanpa Gula Pasir). |
| 13 | Supplier | supplier detail (laptop) | out/pos-supplier-detail.mp4 | 14,0 | 14 | d56a8613-3096-4e64-8f8e-7440204af9aa | PT Sumber Tani: produk teratas + riwayat pembelian. |
| 14 | Laporan | laporan 4tab (laptop) | out/pos-laporan-4tab.mp4 | 20,3 | 20 | 03cc3ae1-e93b-4eba-9d9f-e6629154f4df | 4 klik tab, zoom Manual 1 zona. |
| 15 | Laporan | laporan ekspor (laptop) | out/pos-laporan-ekspor.mp4 | 13,0 | 12 | 7691dce7-937e-4398-b75a-56e2ef3b069a | Unduhan CSV: gelembung unduhan Chrome tampil di kanan atas (tidak kena crop). |
| 16 | Pengguna | pengguna izin (laptop) | out/pos-pengguna-izin.mp4 | 16,3 | 16 | 0a5d6f3d-b69b-4604-be7c-c730ef467778 | Dialog Ubah Siti Nur Aisyah (izin Beri diskon) → Batal, tidak disimpan. |
| 17 | Login | kasir menu terbatas (laptop) | out/pos-kasir-menu-terbatas.mp4 | 15,1 | 14 | 358ff78b-cec5-4945-bf69-7f7f61f7aabf | Login kasir1 diketik manual; sesaat layar muat sebelum /pos. |
| 18 | Pengaturan | pengaturan log (laptop) | out/pos-pengaturan-log.mp4 | 18,4 | 18 | fd6cd1b7-8fac-4672-9ec3-61eeeecd504d | Pengaturan hanya hover (tidak disimpan) → Log Aktivitas. |
| 19 | Penjualan | penjualan void (laptop) | out/pos-penjualan-void.mp4 | 14,2 | 14 | dddd03ee-480b-458a-a124-8f3998c1662a | Data: INV-20261019-00012 (/sales/1515) di-VOID, alasan "Salah input jumlah"; stok kembali (Bawang Merah +0,75 kg, Minyak Kita +1). |

## Data yang dibuat rekaman (permanen, tanpa reset otomatis)
- INV-20261019-00012 (/sales/1515) — take uji pertama, dipakai untuk klip VOID.
- INV-20261019-00013 (/sales/1516) — klip uji kasir timbang.

## Klip laptop (19 Okt 2026) — 12 klip sisa selesai
Direkam di laptop dengan `skrip-laptop/` (salinan skrip PC + infrastruktur Recordly laptop dari repo resto; jendela 1920x1008 = area kerja laptop).
Data tambahan yang dibuat rekaman laptop (permanen):
- 1 hold "Bu Sri" (Beras Premium 5 kg) → dilanjutkan, tidak dibayar (#7).
- Penyesuaian stok Tomat −250 g, alasan Selisih opname, catatan "Opname mingguan" (#11).
- PO-20261019-00004 (/purchases/16), PT Sumber Tani, Bawang Merah 20 kg, nota NOTA-1019-778 (#12).
- INV-20261019-00012 (/sales/1515) di-VOID, alasan "Salah input jumlah" (#19).
Teks "Murah Pangan" / data QA tidak terlihat di lembar kontak.
