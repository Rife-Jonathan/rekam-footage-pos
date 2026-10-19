#!/usr/bin/env bash
# Periksa klip: durasi + 4 frame (20/45/70/95% durasi) → POS/out/frame-<nama>-{1..4}.png + lembar 2x2 POS/out/cek/<nama>.png
#   bash POS/cek.sh pos-xxx.mp4
set -u
O=/e/Rakazo/growth/video/recordly/POS/out; N="${1%.mp4}"; mkdir -p "$O/cek"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O/$1"); echo "durasi $D"
i=1; for f in 0.2 0.45 0.7 0.95; do t=$(awk "BEGIN{print $D*$f}"); ffmpeg -v error -y -ss "$t" -i "$O/$1" -frames:v 1 -vf scale=960:-1 "$O/cek/$N-$i.png"; i=$((i+1)); done
ffmpeg -v error -y -i "$O/cek/$N-1.png" -i "$O/cek/$N-2.png" -i "$O/cek/$N-3.png" -i "$O/cek/$N-4.png" -filter_complex "[0][1]hstack[a];[2][3]hstack[b];[a][b]vstack" "$O/cek/$N.png"
echo "$O/cek/$N.png"
