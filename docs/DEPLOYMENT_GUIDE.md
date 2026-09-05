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

The repository contains `vercel.json` configured for SPA routing rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploying via Vercel CLI:
```bash
npx vercel --prod
```

---

## 🛢️ Supabase Database Migration Setup

1. Log into your Supabase Dashboard.
2. Navigate to **SQL Editor**.
3. Execute the SQL script contained in `supabase/migrations/20260902_init_schema.sql`.
4. Verify table creation (`interns`, `certificates`, `templates`, `audit_logs`).
5. Ensure Storage Bucket `certificates` is created with public read access for verified PDF downloads.
