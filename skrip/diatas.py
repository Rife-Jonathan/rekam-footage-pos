"""Jadikan jendela berjudul <judul> selalu-di-atas (HWND_TOPMOST) supaya popup aplikasi lain (mis. 'Allow remote debugging?'
dari Chrome owner) tidak menutupi area klik selama rekam. Uji 19 Okt: klik OS jatuh ke popup itu.
   python diatas.py "Toko Sembako Berkah POS" [0=lepas]"""
import ctypes, sys
from ctypes import wintypes
u = ctypes.windll.user32
judul, nyala = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "1") != "0"
hasil = []
def cb(h, l):
    b = ctypes.create_unicode_buffer(256); u.GetWindowTextW(h, b, 256)
    if u.IsWindowVisible(h) and b.value.startswith(judul): hasil.append(h)
    return True
u.EnumWindows(ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)(cb), 0)
for h in hasil:
    u.SetWindowPos(h, -1 if nyala else -2, 0, 0, 0, 0, 0x0001 | 0x0002)  # SWP_NOSIZE|SWP_NOMOVE
print("diatas", nyala, len(hasil))
