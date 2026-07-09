# Hostinger Node.js Backend Deployment Checklist

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in `EMPLOYEE_USERNAME` and `EMPLOYEE_PASSWORD`.
3. Set `NODE_ENV=production` in `backend/.env`.
4. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
5. Confirm `backend/package.json` contains:
   - `main: server.js`
   - `scripts.start: node server.js`
   - `engines.node: ">=18"`
6. Upload the `backend/` folder to Hostinger as the Node.js app root.
7. Configure Hostinger startup command to `npm start`.
8. Set Hostinger environment variables:
   - `EMPLOYEE_USERNAME`
   - `EMPLOYEE_PASSWORD`
   - `NODE_ENV=production`
   - (optional) `PORT` if Hostinger requires it
9. Restart the Node.js application in Hostinger.
10. Verify endpoints:
   - `GET /` should return `{ message: 'NodalWire backend is running.' }`
   - `GET /api/status` should return status OK
   - `POST /api/login` should accept JSON `username` and `password`
11. If the frontend remains at `https://nodalwire.com`, ensure the backend is reachable from the same origin or update the frontend API base URL accordingly.
