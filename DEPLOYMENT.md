# Deployment Guide - QR Master

This guide covers deploying QR Master to a production environment.

## Option 1: Vercel (Recommended for Next.js)

Vercel provides the easiest deployment flow, but **important note**: accessing the SQLite file (`dev.db`) on Vercel Serverless Functions is not persistent (data will be lost on redeploy). 

**Critical Requirement for Production**: Switch the `datasource` provider in `prisma/schema.prisma` to **PostgreSQL** or **MySQL** (e.g., using Neon, Supabase, or PlanetScale) for persistent data.

### Steps:
1.  **Prepare Database**:
    - Provision a PostgreSQL database (e.g., on [Neon.tech](https://neon.tech)).
    - Update `prisma/schema.prisma`:
        ```prisma
        datasource db {
          provider = "postgresql" // Changed from sqlite
          url      = env("DATABASE_URL")
        }
        ```
    - Update `.env`:
        ```env
        DATABASE_URL="postgres://user:pass@host:5432/dbname"
        ```
    - Run migrations: `npx prisma migrate dev`

2.  **Push to GitHub**:
    - Commit your code and push to a GitHub repository.

3.  **Deploy on Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com).
    - "Add New" -> "Project" -> Import your repo.
    - **Environment Variables**: Add the following:
        - `DATABASE_URL`: Your PostgreSQL connection string.
        - `JWT_SECRET`: A strong random string (e.g., generated via `openssl rand -base64 32`).
        - `BASE_URL`: Your Vercel domain (e.g., `https://qr-master.vercel.app`).
    - Click **Deploy**.

4.  **Post-Deploy**:
    - Vercel will build and deploy the app.
    - The Prisma Client will automatically connect to your PostgreSQL DB.

## Option 2: VPS (Docker / Node.js)

If you want to keep using SQLite (simple file-based DB) or self-host:

1.  **Server Setup**:
    - Provision a Linux server (Ubuntu 22.04).
    - Install Node.js 18+ and Nginx.

2.  **Build**:
    ```bash
    git clone <repo>
    cd qr-prototype1
    npm install
    npx prisma migrate deploy # Apply migrations to prod DB
    npm run build
    ```

3.  **Run (Process Manager)**:
    - Use `pm2` to keep the app running.
    ```bash
    npm install -g pm2
    pm2 start npm --name "qr-master" -- start
    ```

4.  **Nginx Reverse Proxy**:
    Config Nginx to forward port 80 to 3000.

    ```nginx
    server {
        listen 80;
        server_name your-domain.com;
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
        }
    }
    ```

## Environment Variables Checklist
Ensure these are set in your production environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string | `postgres://...` or `file:./dev.db` |
| `JWT_SECRET` | Secret for signing session tokens | `a-very-long-random-string` |
| `BASE_URL` | Public domain of the app | `https://qr-master.com` |
