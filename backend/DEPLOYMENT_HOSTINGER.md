# Hostinger Node.js Deployment Guide

## Application Root
Upload the `backend/` folder as the Node.js application root in Hostinger.

## Startup File
- `server.js`
- Hostinger should use `npm start` or `node server.js` as the startup command.

## Node.js Version
- Recommended: `18.x` or `20.x`
- The `package.json` includes `"engines": { "node": ">=18" }`.

## Required environment variables
- `PORT` (optional; Hostinger usually provides this automatically)
- `NODE_ENV=production`
- `EMPLOYEE_USERNAME`
- `EMPLOYEE_PASSWORD`

## Commands to install dependencies
```bash
cd backend
npm install
```

## Startup command
```bash
cd backend
npm start
```

## How to restart the application
- Use Hostinger Dashboard restart button for the Node.js app.
- Or run `npm restart` if you add a restart script.

## Hostinger notes
- Ensure the `backend/` folder contains `server.js`, `package.json`, and installed `node_modules`.
- If your frontend remains on `https://nodalwire.com`, the backend must be accessible from the same origin or the front-end fetch URL must point to the backend origin.
- This scaffold exposes `POST /api/login`, which matches the existing frontend call.

## Test endpoints after deployment
- `GET /` → health check
- `GET /api/status` → backend status
- `POST /api/login` → login endpoint
