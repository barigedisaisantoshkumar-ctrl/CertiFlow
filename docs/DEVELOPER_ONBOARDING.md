# CertiFlow — Developer Onboarding Guide

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  

---

## 🚀 Getting Started

Welcome to the **CertiFlow** development team! Follow this guide to set up your local development environment.

---

## 💻 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

---

## 🛠️ Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/barigedisaisantoshkumar-ctrl/CertiFlow.git
   cd CertiFlow
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Note: If no Supabase URL is supplied, the app automatically runs using LocalStorage fallback mode with initial demo data.*

4. **Launch Local Dev Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🔐 Credentials for Local Testing

- **Admin Email:** `admin@certiflow.com` (or any valid email format in fallback mode)
- **Password:** `admin123`
