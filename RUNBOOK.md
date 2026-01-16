# Operational Runbook - QR Master

This document outlines standard operating procedures for maintaining and troubleshooting the QR Master application.

## 1. System Overview
- **Service Name**: QR Master
- **Primary URL**: [Production URL] (e.g., https://qr-master.vercel.app)
- **Architecture**: Monolithic Next.js Application (Server Actions + React Server Components).
- **Database**: SQLite (Local file `dev.db` for prototype) / PostgreSQL (Recommended for Prod).

## 2. Common Administrative Tasks

### 2.1 Resetting the Database
If the database enters an inconsistent state during development or testing, you can reset it. **Warning: This deletes all data.**

```bash
npx prisma migrate reset
```

### 2.2 Inspecting Data
To view and edit database records via a GUI:

```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555`.

### 2.3 Manually Verifying a User
If the mock verification fails or you need to test verified features:
1.  Open Prisma Studio (`npx prisma studio`).
2.  Select the `User` model.
3.  Find the target user.
4.  Set the `isVerified` column to `true`.
5.  Click "Save Changes".

## 3. Troubleshooting

### 3.1 Login Fails (Invalid Credentials)
- **Symptom**: User cannot log in despite correct password.
- **Cause**: JWT Secret mismatch or DB corruption.
- **Fix**: 
    1. Check `JWT_SECRET` in `.env`.
    2. Check if the user exists in the DB using Prisma Studio.
    3. If needed, manually reset the password hash via a script or create a new user.

### 3.2 QR Codes Not Loading
- **Symptom**: Broken image icon in dashboard/details.
- **Cause**: The QR code data URI was not generated or is too large (rare).
- **Fix**: 
    1. Check if the `qrCodeUrl` field in the `Item` table is populated.
    2. If empty, the item creation logic failed. Delete the item and recreate it.

### 3.3 Public Page 404
- **Symptom**: Scanning a QR leads to a 404 page.
- **Cause**: The Item ID does not exist or the Item is not `PUBLISHED`.
- **Fix**:
    1. Verify the ID in the URL (`/q/123`).
    2. Check the `Item` table for ID `123`.
    3. Ensure `status` is set to `PUBLISHED`.

## 4. Monitoring & Logs
- **Application Logs**: Check the terminal output where `npm run start` is running.
- **Database Logs**: Prisma is configured to log queries in development. Check terminal for failed SQL queries.
