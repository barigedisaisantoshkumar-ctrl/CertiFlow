# CertiFlow — Internship Certificate Generation & Verification Platform

**CertiFlow** is a web application designed for companies to automate the creation, lifecycle management, issuance, and public QR-based verification of internship completion certificates.

---

## Key Features

- **Centralized Intern Management**: Digital records of interns including department, title, duration, supervisor details, and date-calculated status (`UPCOMING`, `ACTIVE`, `COMPLETED`).
- **1-Click Certificate Issuance**: Generates a unique certificate number (`CERT-2026-XXXXXX`), unpredictable verification token, and dynamic QR code automatically.
- **Embedded QR Code Verification**: Includes error-correction QR codes linked to the public verification URL.
- **Public Verification Portal**: Accessible at `/verify/:token` without requiring login. Displays authenticity proof (`✓ VERIFIED CERTIFICATE`), intern details, or clear warning if revoked (`⚠ CERTIFICATE REVOKED`).
- **High-Definition PDF Download & Print**: Instant PDF rendering via `jsPDF` and `html2canvas` preserving print quality and dynamic placeholders.
- **Certificate Revocation & Audit Trail**: Mandatory revocation reasons with immutable event log history (`INTERN_CREATED`, `CERTIFICATE_GENERATED`, `CERTIFICATE_REVOKED`).
- **Duplicate Protection**: Database-backed uniqueness guarantees to prevent duplicate certificate creation.

---

## 🎨 Design System & Branding

- **Typography**: Integrated **Satoshi** font (`'Satoshi', sans-serif`) loaded globally via Fontshare CDN.
- **Color Palette**: Derived from `favicon.png` (`#2C91E3` / `#2563EB` Cerulean Blue) set against a pure white background (`#FFFFFF`) with subtle slate contrast cards.
- **Responsive UI**: Responsive admin dashboard layout with sidebar navigation, search, status filters, and modals.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6
- **Validation & Forms**: React Hook Form, Zod
- **Backend / BaaS**: Supabase (PostgreSQL, Supabase Authentication, Row-Level Security, Storage)
- **PDF & QR Engine**: `jspdf`, `html2canvas`, `qrcode.react`

---

## 📂 Project Structure

```
CertiFlow/
├── public/
│   └── favicon.png             # Application logo & favicon
├── src/
│   ├── components/
│   │   ├── certificates/       # Certificate rendering template & preview modal
│   │   ├── layout/             # Sidebar, Header, and AppLayout shell
│   │   └── ui/                 # Reusable UI primitives (Button, Input, Card, Modal, Table)
│   ├── context/                # AuthContext & session handling
│   ├── pages/                  # Dashboard, Interns, Certificates, Login, Verify, AuditLogs, Templates
│   ├── routes/                 # Protected admin & public routing
│   ├── services/               # Supabase client, intern, certificate & audit services
│   ├── utils/                  # Date formatting, status calculators & helper methods
│   ├── App.jsx
│   ├── index.css               # Satoshi font & Tailwind CSS styles
│   └── main.jsx
├── supabase/
│   └── migrations/             # PostgreSQL database schema & RLS policies
├── .env.example                # Template environment variables
├── .env.local                  # Local development keys
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/certiflow.git
cd certiflow
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Set the following variables in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🗄 Database Setup (Supabase)

Run the SQL migration script located at `supabase/migrations/20260902_init_schema.sql` in your Supabase SQL Editor:

1. Creates tables: `interns`, `certificates`, `templates`, `audit_logs`.
2. Enables Row-Level Security (RLS).
3. Grants public read-only access for `/verify/:token` verification and restricts administrative management to authenticated users.

---

## 🧪 Build for Production

To build the production assets:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npm run preview
```

---

## 📝 License

Distributed under the MIT License.
