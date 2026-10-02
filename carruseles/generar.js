const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CARROUSELS = [
  { name: '6-trabajos', slides: 6 },
  { name: '3-servicios', slides: 6 },
  { name: 'numeros', slides: 6 },
  { name: 'quienes-somos', slides: 6 },
  { name: 'cta', slides: 5 },
];

(async () => {
  const missing = CARROUSELS.filter(carousel => !fs.existsSync(path.join(__dirname, carousel.name, 'carrousel.html')));
  if (missing.length) {
    throw new Error(`Faltan las plantillas de carrusel: ${missing.map(carousel => `${carousel.name}/carrousel.html`).join(', ')}. Añádelas antes de generar las imágenes.`);
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });

  for (const carousel of CARROUSELS) {
    const outDir = path.join(__dirname, carousel.name);
    fs.mkdirSync(outDir, { recursive: true });
    const htmlPath = path.join(__dirname, carousel.name, 'carrousel.html');
    const page = await context.newPage();
    await page.goto(`file://${htmlPath}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    for (let i = 0; i < carousel.slides; i++) {
      await page.evaluate((idx) => {
        const sections = document.querySelectorAll('.slide');
        sections.forEach((s, i) => { s.style.display = i === idx ? 'flex' : 'none'; });
        window.scrollTo(0, 0);
      }, i);
      await page.waitForTimeout(200);
      const filename = `${String(i + 1).padStart(2, '0')}.png`;
      await page.screenshot({ path: path.join(outDir, filename) });
      console.log(`${carousel.name}/${filename}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('\n✅ Carruseles generados.');
})().catch(e => { console.error(e); process.exit(1); });
