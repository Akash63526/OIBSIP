# Deployment Guide

This document outlines how to deploy the Pizza Delivery Application to a production environment.

## Architecture
- **Frontend**: React (Vite) deployed as static files (e.g. Vercel, Netlify, or Nginx).
- **Backend**: Node.js/Express API.
- **Database**: MongoDB (Atlas recommended for production).
- **Cache & Queues**: Redis (Upstash or AWS ElastiCache).

## Docker Compose Deployment (Recommended)
This repository includes a `docker-compose.yml` file pre-configured for running the entire stack together.

1. Install Docker and Docker Compose on your host server.
2. Clone this repository.
3. Update the `.env` file with production values (secrets, MongoDB URI).
4. Build and start the services in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Manual Deployment

### Backend Deployment (Node.js)
1. Install dependencies: `npm install --production`
2. Set up environment variables securely on your host.
3. Run the server using PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "pizza-api"
   ```

### Frontend Deployment (Nginx)
1. Build the frontend assets:
   ```bash
   cd client
   npm run build
   ```
2. The compiled assets will be in the `dist/` directory.
3. Configure Nginx to serve these static files and proxy API requests to the backend server running on port 5000.

## CI/CD Pipeline
(Future extension) Consider using GitHub Actions to automate building Docker images and pushing them to a container registry, followed by a webhook to update your production server.
