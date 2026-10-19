#!/usr/bin/env bash
# Satu sesi rekam Recordly untuk POS Toko Sembako Berkah (salinan ../sesi.sh, gaya sama dengan DentalCare):
#   bash growth/video/recordly/POS/sesi.sh <alur> [nama-keluaran.mp4]
#   contoh: bash POS/sesi.sh kasir-timbang pos-kasir-timbang.mp4
# Buka Recordly (CDP 9556) → alur POS/rekam.js → pilih JENDELA "Toko Sembako Berkah POS" → Hide HUD → Record → Stop
# → preset "Nusawebsite Demo" → kursor 1.0 → crop atas 9% → Suggest Zooms → fokus-klik (Manual) → ekspor ke POS/out/.
set -u
POS="$(cd "$(dirname "$0")" && pwd)"; cd "$POS/.."
ALUR=${1:?alur}; OUTF=${2:-pos-$ALUR.mp4}
FLAG=/e/Rakazo/growth/video/recordly/POS/flag
mkdir -p "$FLAG"; rm -f "$FLAG"/*.flag
LOG=$(mktemp)
powershell -c "Get-Process Recordly -ErrorAction SilentlyContinue | Stop-Process -Force" ; sleep 2
powershell -c "Start-Process \"\$env:LOCALAPPDATA\\Programs\\Recordly\\Recordly.exe\" -ArgumentList '--remote-debugging-port=9556'"
sleep 8
node "$POS/rekam.js" "$ALUR" > "$LOG" 2> "$LOG.err" &
for i in $(seq 1 90); do grep -q SIAP "$LOG" && break; sleep 1; done
timeout 40 node kendali.js klik "Screen"; sleep 3
timeout 40 node kendali.js klik "Toko Sembako Berkah POS"; sleep 1
timeout 40 node kendali.js jsklik "Hide HUD"; sleep 1
/c/Users/RIFE/AppData/Local/Programs/Python/Python310/python.exe "$POS/diatas.py" "Toko Sembako Berkah POS"   # popup app lain tak boleh menutupi klik
timeout 40 node kendali.js jsklik "Record"
timeout 35 node "$POS/tunggu-rekam.js"; sleep 1.5   # tunggu benar-benar merekam (hitung mundur Recordly)

touch "$FLAG/mulai.flag"
for i in $(seq 1 120); do grep -q SELESAI "$LOG" && break; sleep 1; done
timeout 40 node kendali.js jsklik "Stop"; sleep 3
touch "$FLAG/berhenti.flag"   # baru sekarang Chrome boleh ditutup
sleep 8
timeout 70 node "$POS/tunggu-editor.js"; sleep 3
timeout 40 node preset.js pakai "Nusawebsite Demo"
timeout 30 node kendali.js jsklik "Cursor" >/dev/null; sleep 1
timeout 40 node kursor.js 1.0
timeout 30 node kendali.js jsklik "Scene" >/dev/null; sleep 1
timeout 60 node varian.js 14 9 keep   # crop atas 9% (crop tidak ikut preset)
timeout 40 node kendali.js jsklik "Suggest Zooms from Cursor" >/dev/null; sleep 2
REK=$(ls -t /c/Users/RIFE/AppData/Roaming/Recordly/recordings/recording-*.mp4 | head -1)
echo "rekaman mentah: $REK"
timeout 120 node "$POS/fokus-klik.js" "$REK" 9
sleep 2; bash "$POS/ekspor.sh" "$OUTF"
echo "--- log alur"; cat "$LOG" "$LOG.err"
