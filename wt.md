# Walkthrough - PWA Conversion, Supabase Integration, and Vercel Setup

This document serves as your guide for setting up the Supabase database and deploying your Trip Expense Tracker as a Progressive Web App (PWA) on Vercel.

---

## 🛠️ Summary of Changes

### 1. Progressive Web App (PWA) Features
- **App Manifest:** Created `public/manifest.json` detailing name, standalone view, theme colors, and responsive vector icons.
- **SVG Branding Logo:** Created `public/logo.svg`, a custom vector design for app icons.
- **Service Worker:** Created `public/service-worker.js` with a Network-First strategy to cache app assets and support offline loads.
- **Registration:** Added registration hooks in `src/index.js` and linked assets in `public/index.html`.

### 2. Supabase Integration
- **Client Configuration:** Created `src/utils/supabaseClient.js` to initialize the SDK.
- **Database Schema:** Created `src/data/schema.sql` defining the `trips` table with Row-Level Security (RLS) policies.
- **Auth Interface:** Created `src/components/AuthModal.jsx` for cloud user registration, log in, and log out.
- **Cloud Sync:** Updated `src/hooks/useExpenseTracker.js` and `src/components/Header.jsx` to sync trip data state and logs to the cloud.

### 3. Vercel Hosting
- **Routing Setup:** Created `vercel.json` to handle client-side Single Page App routing fallbacks.
- **Config Template:** Provided `.env.example` for environment variables.

---

## 🚀 Setup & Deployment Instructions

When you are ready to set up the database and launch the app, follow these steps:

### Step 1: Initialize Supabase Database
1. Go to your [Supabase Dashboard](https://supabase.com) and open or create a project.
2. Open the **SQL Editor** tab in the sidebar.
3. Click **New Query**, copy the contents of `src/data/schema.sql`, and click **Run**.
   * *This will create the `trips` table, enable Row-Level Security (RLS), and set up triggers to update timestamps.*

### Step 2: Configure Environment Variables
1. In the root of your project directory, copy `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in the values from your Supabase Dashboard (**Project Settings > API**):
   * `REACT_APP_SUPABASE_URL`
   * `REACT_APP_SUPABASE_ANON_KEY`

### Step 3: Deploy to Vercel
1. Link your repository to your **Vercel Dashboard** (via GitHub or Vercel CLI).
2. Add your environment variables in the Vercel project settings:
   * `REACT_APP_SUPABASE_URL`
   * `REACT_APP_SUPABASE_ANON_KEY`
3. Deploy the project! Vercel will automatically read `vercel.json` and build the production bundle.
