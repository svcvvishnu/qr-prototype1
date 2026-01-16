# QR Master - Mobile QR Code Management

QR Master is a modern, mobile-first web application for creating, managing, and sharing QR codes. It features a premium "Glassmorphism" UI, secure authentication, and specialized public views for ID cards and Lost & Found items.

## Features
- **Modern Dashboard**: Intuitively organized categories and items with a sophisticated UI.
- **Dynamic QR Generation**: Automatic QR code generation for every item.
- **Smart Public Views**:
    - **ID Card**: Displays contact details securely.
    - **Lost & Found**: Prominently shows "Help! I'm Lost" with a direct contact button.
    - **Custom**: Displays custom text or information.
- **Scan History**: Tracks when and where (simulation) your QR codes are scanned.
- **Identity Verification**: Mock Aadhar upload simulation for "Verified" blue tick status.
- **Secure Auth**: Custom JWT-based authentication with secure cookies.

## Tech Stack
- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Styling**: Vanilla CSS (CSS Modules & Global Variables for Design System)
- **Auth**: JOSE (JWT) + Bcrypt

## Local Development

### Prerequisites
- Node.js 18+
- NPM

### Setup
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd qr-prototype1
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment**:
    Create a `.env` file (if not present) with:
    ```env
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-super-secret-key"
    BASE_URL="http://localhost:3000"
    ```

4.  **Initialize Database**:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## Project Structure
- `/app`: Next.js App Router pages and layouts.
    - `(auth)`: Login and Signup routes.
    - `(dashboard)`: Main authenticated application routes.
    - `q/[id]`: Public-facing QR code landing pages.
- `/lib`: Helper utilities for Database (Prisma) and Authentication.
- `/prisma`: Database schema and migrations.

## License
Private / Proprietary
