# CertiFlow — Deployment Guide

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Target Environments:** Vercel / Netlify / Supabase Cloud  

---

## 🚀 Overview

CertiFlow is structured as a static modern Single Page Application (SPA) produced by **Vite**, backed by **Supabase Cloud BaaS** (Database, Auth, Storage).

---

## ⚙️ Environment Variables Setup

Create a `.env.local` or environment configuration in your hosting provider with:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 Production Build Procedure

1. **Install Dependencies:**
   ```bash
   npm ci
   ```

2. **Execute Vite Build:**
   ```bash
   npm run build
   ```
   This compiles assets into the output directory `dist/`.

3. **Local Build Preview:**
   ```bash
   npm run preview
   ```

---

## 🌐 Vercel Deployment Configuration

1. **Vercel Project Setup**:
   - Link your GitHub repository to Vercel.
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables in Vercel**:
   Go to **Project Settings -> Environment Variables** in Vercel and add:
   - `VITE_SUPABASE_URL`: `https://rewzxbwurojdaavtwcbz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_oCz383K8VLAQK6P7qU1IXw_ic65QGnv` (or your active anon key)

3. **SPA Routing Config (`vercel.json`)**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🛢️ Supabase Database Migration Setup (Mandatory)

> [!IMPORTANT]
> If database tables do not exist in your Supabase project, data will be stored **only in local browser storage**, causing external QR code verification scans to show "Certificate Not Found".

Follow these steps to initialize your cloud database:

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (`rewzxbwurojdaavtwcbz`).
3. Click on **SQL Editor** from the left navigation sidebar.
4. Click **New Query**.
5. Copy and paste the entire contents of [20260902_init_schema.sql](file:///c:/HPS/CertiFlow/supabase/migrations/20260902_init_schema.sql).
6. Click **Run** (or press Ctrl+Enter).
7. Verify under **Table Editor** that tables `interns`, `certificates`, `templates`, and `audit_logs` exist.
8. Verify under **Authentication -> Policies** that:
   - `certificates` has policy: `Anyone can view valid/revoked certificate for verification` (`SELECT TO anon, authenticated`).
   - `interns` has policy: `Anyone can view interns for verification` (`SELECT TO anon, authenticated`).

