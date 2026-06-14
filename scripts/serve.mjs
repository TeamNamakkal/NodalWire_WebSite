import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('..', import.meta.url));
const PORT = 3000;
const DB_PATH = join(__dirname, 'data/worklogs.json');

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

const USERS = {
  surendran: { name: 'Surendran Natarajan', password: 'surendran', role: 'admin' },
  theepan: { name: 'Theepan SS', passwords: ['theepan@1330', 'theepan'], role: 'user' },
  sampritha: { name: 'Sampritha Sureshkumar', passwords: ['sam@1330', 'sampritha'], role: 'user' }
};

// Helper to parse bodies
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

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
  // --- 1. POST /api/login ---
  if (req.url === '/api/login' && req.method === 'POST') {
    try {
      const { username, password } = await getRequestBody(req);
      const user = USERS[username];
      const isCorrectPassword = user && (user.password === password || (user.passwords && user.passwords.includes(password)));
      if (isCorrectPassword) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: { id: username, name: user.name, role: user.role }
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload' }));
    }
    return;
  }

  // --- 2. GET /api/worklogs ---
  if (req.url.startsWith('/api/worklogs') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const userId = urlObj.searchParams.get('userId');
    const requesterId = urlObj.searchParams.get('requesterId');
    const dateStr = urlObj.searchParams.get('date');

    try {
      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      let logs = dbData;
      const requester = USERS[requesterId];

      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      if (requester.role !== 'admin') {
        logs = logs.filter(l => l.userId === requesterId);
      } else {
        if (userId) {
          logs = logs.filter(l => l.userId === userId);
        }
        if (dateStr) {
          logs = logs.filter(l => l.date === dateStr);
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, logs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Database read failed' }));
    }
    return;
  }

  // --- 3. POST /api/worklogs ---
  if (req.url === '/api/worklogs' && req.method === 'POST') {
    try {
      const { requesterId, date, taskName, startTime, endTime, notes } = await getRequestBody(req);
      const requester = USERS[requesterId];
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      if (!date || !taskName || !startTime || !endTime) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }

      const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startM = toMinutes(startTime);
      const endM = toMinutes(endTime);

      if (endM <= startM) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'End Time must be greater than Start Time' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');

      const isDuplicate = dbData.some(log => {
        if (log.userId === requesterId && log.date === date && log.taskName.toLowerCase() === taskName.toLowerCase()) {
          const logStart = toMinutes(log.startTime);
          const logEnd = toMinutes(log.endTime);
          return startM < logEnd && logStart < endM;
        }
        return false;
      });

      if (isDuplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A duplicate entry for the same task in this time range already exists.' }));
        return;
      }

      const totalHours = parseFloat(((endM - startM) / 60).toFixed(2));
      const newLog = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        userId: requesterId,
        userName: requester.name,
        date,
        taskName,
        startTime,
        endTime,
        totalHours,
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      dbData.push(newLog);
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, log: newLog }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to save entry' }));
    }
    return;
  }

  // --- 4. PUT /api/worklogs ---
  if (req.url === '/api/worklogs' && req.method === 'PUT') {
    try {
      const { requesterId, id, date, taskName, startTime, endTime, notes } = await getRequestBody(req);
      const requester = USERS[requesterId];
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      const logIndex = dbData.findIndex(l => l.id === id);

      if (logIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Work entry not found' }));
        return;
      }

      const existingLog = dbData[logIndex];

      if (requester.role !== 'admin') {
        const getTodayString = () => {
          const d = new Date();
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        if (existingLog.date !== getTodayString()) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Users can only edit today\'s entries' }));
          return;
        }
        if (existingLog.userId !== requesterId) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized to edit this entry' }));
          return;
        }
      }

      const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startM = toMinutes(startTime);
      const endM = toMinutes(endTime);

      if (endM <= startM) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'End Time must be greater than Start Time' }));
        return;
      }

      const isDuplicate = dbData.some(log => {
        if (log.id !== id && log.userId === existingLog.userId && log.date === date && log.taskName.toLowerCase() === taskName.toLowerCase()) {
          const logStart = toMinutes(log.startTime);
          const logEnd = toMinutes(log.endTime);
          return startM < logEnd && logStart < endM;
        }
        return false;
      });

      if (isDuplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A duplicate entry for the same task in this time range already exists.' }));
        return;
      }

      const totalHours = parseFloat(((endM - startM) / 60).toFixed(2));

      dbData[logIndex] = {
        ...existingLog,
        date,
        taskName,
        startTime,
        endTime,
        totalHours,
        notes: notes || ''
      };

      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, log: dbData[logIndex] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update entry' }));
    }
    return;
  }

  // --- 5. DELETE /api/worklogs ---
  if (req.url.startsWith('/api/worklogs') && req.method === 'DELETE') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const id = urlObj.searchParams.get('id');
    const requesterId = urlObj.searchParams.get('requesterId');

    try {
      const requester = USERS[requesterId];
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      const logIndex = dbData.findIndex(l => l.id === id);

      if (logIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Work entry not found' }));
        return;
      }

      const existingLog = dbData[logIndex];

      if (requester.role !== 'admin') {
        const getTodayString = () => {
          const d = new Date();
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        if (existingLog.date !== getTodayString()) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Users can only delete today\'s entries' }));
          return;
        }
        if (existingLog.userId !== requesterId) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized to delete this entry' }));
          return;
        }
      }

      dbData.splice(logIndex, 1);
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Entry deleted' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to delete entry' }));
    }
    return;
  }

  // --- 6. GET /api/reports/export ---
  if (req.url.startsWith('/api/reports/export') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const format = urlObj.searchParams.get('format') || 'csv';
    const type = urlObj.searchParams.get('type') || 'daily';
    const userId = urlObj.searchParams.get('userId');
    const dateStr = urlObj.searchParams.get('date');
    const requesterId = urlObj.searchParams.get('requesterId');

    try {
      const requester = USERS[requesterId];
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admins can export reports' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      let logs = dbData;

      if (userId) {
        logs = logs.filter(l => l.userId === userId);
      }

      const targetDate = dateStr ? new Date(dateStr) : new Date();
      
      if (type === 'daily') {
        const dayStr = dateStr || targetDate.toISOString().split('T')[0];
        logs = logs.filter(l => l.date === dayStr);
      } else if (type === 'weekly') {
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        startOfWeek.setHours(0,0,0,0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        logs = logs.filter(l => {
          const logD = new Date(l.date);
          return logD >= startOfWeek && logD <= endOfWeek;
        });
      } else if (type === 'monthly') {
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        logs = logs.filter(l => {
          const logD = new Date(l.date);
          return logD.getFullYear() === year && logD.getMonth() === month;
        });
      }

      let csv = '\ufeffID,User ID,User Name,Date,Task/Project,Start Time,End Time,Total Hours,Notes,Created At\n';
      logs.forEach(l => {
        csv += `"${l.id}","${l.userId}","${l.userName}","${l.date}","${l.taskName.replace(/"/g, '""')}","${l.startTime}","${l.endTime}",${l.totalHours},"${(l.notes || '').replace(/"/g, '""')}","${l.createdAt}"\n`;
      });

      const filename = `work_hours_${type}_report_${new Date().toISOString().split('T')[0]}`;
      if (format === 'excel') {
        res.writeHead(200, {
          'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
          'Content-Disposition': `attachment; filename=${filename}.xls`
        });
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=${filename}.csv`
        });
      }
      res.end(csv);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to generate report' }));
    }
    return;
  }

  // --- Static File Serving ---
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // If request contains query parameters, strip them for file lookup
  if (urlPath.includes('?')) {
    urlPath = urlPath.split('?')[0];
  }
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
