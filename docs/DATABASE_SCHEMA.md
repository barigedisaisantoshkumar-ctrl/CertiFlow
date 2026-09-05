# CertiFlow — Database Schema Documentation

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Engine:** PostgreSQL 15 / Supabase  

---

## 🗄️ Database Architecture Overview

The database is built on PostgreSQL with **Row Level Security (RLS)** enabled across all core operational tables. UUID version 4 keys serve as primary identifiers across tables.

---

## 📊 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    INTERNS ||--o{ CERTIFICATES : "receives"
    TEMPLATES ||--o{ CERTIFICATES : "formats"
    USERS ||--o{ AUDIT_LOGS : "triggers"

    INTERNS {
        uuid id PK
        string intern_code UK
        string full_name
        string gender
        string email
        string phone
        string college
        string course
        string department
        string internship_title
        string duration
        date start_date
        date end_date
        string supervisor_name
        string supervisor_email
        timestamp created_at
        timestamp updated_at
        uuid created_by
    }

    TEMPLATES {
        uuid id PK
        string name
        string description
        string template_path
        integer version
        boolean is_active
        timestamp created_at
        uuid created_by
    }

    CERTIFICATES {
        uuid id PK
        string certificate_number UK
        uuid intern_id FK
        string verification_token UK
        uuid template_id FK
        date issued_date
        string pdf_path
        string status
        timestamp revoked_at
        uuid revoked_by
        string revocation_reason
        timestamp created_at
        uuid created_by
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id
        string action
        string entity_type
        string entity_id
        jsonb metadata
        timestamp created_at
    }
```

---

## 🛡️ Security & Row Level Security (RLS) Policies

### 1. `interns` Table
- **SELECT Policy:** `Authenticated users can select interns` (`to authenticated USING (true)`)
- **ALL Policy:** `Authenticated users can insert/update interns` (`to authenticated USING (true)`)

### 2. `certificates` Table
- **SELECT Policy (Public):** `Anyone can view valid/revoked certificate for verification` (`to anon, authenticated USING (true)`)
- **ALL Policy (Admin):** `Authenticated users can generate and manage certificates` (`to authenticated USING (true)`)

### 3. `audit_logs` Table
- **SELECT Policy:** `Authenticated users can view audit logs` (`to authenticated USING (true)`)
- **INSERT Policy:** `Authenticated users can insert audit logs` (`to authenticated WITH CHECK (true)`)

---

## ⚡ Extensions & Indexes

- **UUID Extension:** `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- **Unique Constraints:**
  - `interns(intern_code)`
  - `certificates(certificate_number)`
  - `certificates(verification_token)`
