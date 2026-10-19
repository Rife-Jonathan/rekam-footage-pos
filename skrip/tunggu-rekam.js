// Tunggu Recordly benar-benar merekam (tombol Stop ada di HUD), maks 30 dtk. Uji 19 Okt: rekaman mulai ±8 dtk terlambat → klik awal hilang.
const { chromium } = require('E:/Content-Machine/node_modules/playwright');
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9556', { timeout: 10000 });
  for (let i = 0; i < 60; i++) {
    for (const p of b.contexts().flatMap((c) => c.pages())) {
      const ada = await p.evaluate(() => [...document.querySelectorAll('button')].some((x) => /^Stop/.test((x.getAttribute('aria-label') || x.getAttribute('title') || x.innerText || '').trim()))).catch(() => false);
      if (ada) { console.log('merekam', (i * 0.5).toFixed(1), 'dtk'); process.exit(0); }
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log('Stop TIDAK muncul'); process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
