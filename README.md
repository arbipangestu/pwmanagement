# PassManager

A secure, responsive, and elegant Password Management application built with Next.js and PostgreSQL.

## Features

- **User Authentication**: Secure Login & Registration.
- **Password Management**:
  - Create and manage Applications.
  - Store Credentials (username/password) for each application.
  - Passwords are encrypted in the database (AES).
- **Security**:
  - User passwords hashed with `bcrypt`.
  - Stored credentials encrypted with `crypto-js`.
  - Protected API routes using `NextAuth`.
- **UI/UX**:
  - Elegant Red theme.
  - Responsive Dashboard.
  - Modern components with Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Database**: PostgreSQL (Neon.tech).
- **Driver**: `pg` (PostgreSQL client) - Manual SQL queries (No ORM).
- **Auth**: NextAuth.js.

## Setup & Installation

### 1. Prerequisites

- Node.js installed.
- A PostgreSQL database (e.g., from Neon.tech).

### 2. Clone and Install

```bash
git clone <repo-url>
cd passmanager
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection String (PostgreSQL)
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# NextAuth Secret (Generate a random string: openssl rand -base64 32)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Encryption Key for Passwords (Keep this safe!)
ENCRYPTION_KEY="your_strong_secret_key"
```

### 4. Database Migration

Since we are using manual SQL, you need to run the schema creation script on your database.

Copy the contents of `db/schema.sql` and execute them in your PostgreSQL query tool (e.g., Neon Dashboard SQL Editor, pgAdmin, or psql).

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

1.  Push to GitHub.
2.  Deploy to Vercel (recommended for Next.js).
3.  Add the Environment Variables in Vercel project settings.
4.  Ensure your Database allows connections from Vercel.

## Folder Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable React components.
- `lib/`: Helper functions (DB connection, Auth, Crypto).
- `db/`: SQL Schema.

## Security Note

- **ENCRYPTION_KEY**: If you lose this key, you cannot decrypt stored passwords.
- **HTTPS**: Always use HTTPS in production to protect data in transit.
