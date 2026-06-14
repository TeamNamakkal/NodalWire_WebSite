import { readFileSync, writeFileSync } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

const GA4_TAG = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TCXCP971BF"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-TCXCP971BF');
  <\/script>`;

function injectGA4(filePath) {
  try {
    let html = readFileSync(filePath, 'utf-8');

    if (html.includes('G-TCXCP971BF')) {
      console.log(`✓ ${filePath} — GA4 already present`);
      return;
    }

    const headIndex = html.indexOf('<head>');
    if (headIndex === -1) {
      console.log(`✗ ${filePath} — No <head> tag found, skipping`);
      return;
    }

    const insertIndex = headIndex + 6;
    const updatedHtml = html.slice(0, insertIndex) + '\n' + GA4_TAG + '\n' + html.slice(insertIndex);

    writeFileSync(filePath, updatedHtml, 'utf-8');
    console.log(`✓ ${filePath} — GA4 injected`);
  } catch (err) {
    console.error(`✗ ${filePath} — Error:`, err.message);
  }
}

function processDirectory(dir) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.html')) {
      injectGA4(filePath);
    }
  });
}

console.log('🔍 Scanning for HTML files and injecting GA4 tag...\n');
processDirectory(__dirname);
console.log('\n✅ GA4 injection complete!');
