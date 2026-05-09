import puppeteer from 'puppeteer';
import { existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const { join } = path;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'Temp_Screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Auto-increment screenshot number
const existing = existsSync(screenshotDir)
  ? readdirSync(screenshotDir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
  : [];
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}${label}.png`;
const outPath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: Temp_Screenshots/${filename}`);
