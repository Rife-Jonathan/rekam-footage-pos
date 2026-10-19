#!/usr/bin/env bash
# bash POS/ekspor.sh <nama-file.mp4>  → ekspor proyek editor Recordly yang terbuka ke E:\Rakazo\growth\video\recordly\POS\out\
# (salinan ../ekspor.sh, tujuan diganti)
cd "$(dirname "$0")/.."
timeout 20 node kendali.js klik "Done" >/dev/null 2>&1; sleep 1
for i in 1 2 3; do
  timeout 30 node kendali.js jsklik "Export Video" && break
  timeout 30 node kendali.js jsklik "Export"; sleep 2
done
rm -f "/e/Rakazo/growth/video/recordly/POS/out/$1"   # file lama → dialog "Replace?" menggantung, ekspor tak terjadi
D='E:\Rakazo\growth\video\recordly\POS\out\'
powershell -ExecutionPolicy Bypass -File simpan-dialog.ps1 -Tujuan "$D$1"
F="/e/Rakazo/growth/video/recordly/POS/out/$1"
for i in $(seq 1 150); do [ -s "$F" ] && break; sleep 4; done
sleep 4; ls -la "$F"
