const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['https://nodalwire.com'];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => {
  res.json({ message: 'NodalWire backend is running.' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', app: 'nodalwire-backend' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const expectedUsername = process.env.EMPLOYEE_USERNAME;
  const expectedPassword = process.env.EMPLOYEE_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return res.status(500).json({
      success: false,
      message: 'Backend is not configured. Set EMPLOYEE_USERNAME and EMPLOYEE_PASSWORD in the environment.'
    });
  }

  if (username === expectedUsername && password === expectedPassword) {
    return res.json({
      success: true,
      user: { username },
      message: 'Login successful.'
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password.' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
