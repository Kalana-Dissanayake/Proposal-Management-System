# Research Grant & Proposal Management System

A full-stack platform for universities and research institutions to manage grants, proposals, and peer reviews.

## Architecture

This project is built using a monorepo-style structure containing two separate Next.js 14 applications that share a single MongoDB database.

1. **`website/`**: The public-facing portal for researchers to discover grants, submit proposals, and contact administration. Runs on port `3000`.
2. **`admin/`**: The secure internal dashboard for administrators to manage grants, review proposals, manage researchers, and view analytics. Runs on port `3001`.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- Recharts for analytics

## Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

## Setup & Installation

1. Install dependencies for both apps:
   ```bash
   npm run install:all
   ```
   *(Or manually `cd admin && npm install` and `cd website && npm install`)*

2. Configure Environment Variables
   Ensure you have a MongoDB connection string.
   
   **`admin/.env.local`**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=a_very_secure_secret_key_here
   ```
   
   **`website/.env.local`**
   ```env
   NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3001
   ```

3. Seed the Database
   Start the `admin` server and make a GET request to `/api/setup/seed` to populate the database with initial dummy data. This will create:
   - An admin user (`admin@example.com` / `password123`)
   - 10 researchers
   - 5 grants
   - 20 proposals (in various states)
   - 10 reviews
   - 5 contact messages

4. Start Development Servers
   You can start both servers simultaneously:
   ```bash
   npm run dev
   ```
   *(Or open two terminal tabs and run `npm run dev` inside `admin` and `website` separately).*

   - **Website**: http://localhost:3000
   - **Admin**: http://localhost:3001 (Login: `admin@example.com` / `password123`)
