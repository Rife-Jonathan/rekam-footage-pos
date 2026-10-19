// Tunggu editor Recordly terbuka (maks 60 dtk). Uji 19 Okt: preset/kursor gagal karena editor belum siap setelah Stop.
const { chromium } = require('E:/Content-Machine/node_modules/playwright');
(async () => {
  for (let i = 0; i < 30; i++) {
    try {
      const b = await chromium.connectOverCDP('http://127.0.0.1:9556', { timeout: 5000 });
      const p = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().includes('editor'));
      if (p && (await p.locator('[role=slider][aria-label="Top"], button[aria-label="Open presets"]').count())) { console.log('editor siap'); process.exit(0); }
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log('editor TIDAK siap'); process.exit(1);
})();
