#!/usr/bin/env bash
# Potong ekor klip hasil ekspor Recordly di <detik setelah klik ke-N> (dipakai pos-login-pemilik: berhenti tepat setelah MASUK,
# sebelum layar muat kosong + kartu dashboard "Hari ini" merah).  bash POS/potong.sh <klip.mp4> <rekaman-mentah.mp4> [lebih=0.5] [klik ke-N dari akhir=1]
set -u
O=/e/Rakazo/growth/video/recordly/POS/out; K="$1"; REK="$2"; L=${3:-0.5}; N=${4:-1}
T=$(node -e "const j=require(process.argv[1]);const c=j.samples.filter(s=>s.interactionType==='click');console.log((c[c.length-$N].timeMs/1000+$L).toFixed(2))" "$(cygpath -w "$REK.cursor.json")")
echo "potong di $T dtk"
ffmpeg -v error -y -i "$O/$K" -t "$T" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -an "$O/tmp-$K" && mv "$O/tmp-$K" "$O/$K"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$O/$K"
