import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('..', import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const GA4_TAG = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TCXCP971BF"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-TCXCP971BF');
  <\/script>`;

function injectGA4(html) {
  if (!html.includes('G-TCXCP971BF')) {
    return html.replace('<head>', `<head>\n${GA4_TAG}\n`);
  }
  return html;
}

createServer(async (req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = join(__dirname, urlPath);
  try {
    let data = await readFile(filePath);
    const ext = extname(filePath);

    if (ext === '.html') {
      let html = data.toString();
      html = injectGA4(html);
      data = Buffer.from(html);
    }

    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
