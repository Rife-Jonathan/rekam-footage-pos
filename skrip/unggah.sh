#!/usr/bin/env bash
# Unggah satu klip POS ke Directus (skill directus-pustaka).
#   bash POS/unggah.sh <nama-file.mp4 di POS/out> <Folder Modul> <tag-modul> "<varian: pos modul aksi>" "<deskripsi>" [--dry]
set -u
F="/e/Rakazo/growth/video/recordly/POS/out/$1"
node /c/Users/RIFE/.claude/skills/directus-pustaka/simpan.mjs --brand Nusawebsite --jenis Video \
  --sub "Toko Sembako/Footage Recordly/$2" --file "$F" --varian "$4" --produk "Toko Sembako" --kategori screen-recording \
  --deskripsi "$5" --tags "pos,recordly,toko-sembako,$3" ${6:-} 2>&1 | tail -4
