-- CertiFlow PostgreSQL Database Migration & RLS Setup
-- HPS Certificate Template Alignment

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE INTERNS TABLE
CREATE TABLE IF NOT EXISTS interns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT DEFAULT 'Female',
    email TEXT NOT NULL,
    phone TEXT,
    college TEXT,
    course TEXT,
    department TEXT NOT NULL,
    internship_title TEXT NOT NULL,
    duration TEXT DEFAULT '3 Months',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    supervisor_name TEXT DEFAULT 'Director',
    supervisor_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- 3. CREATE TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    template_path TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- 4. CREATE CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL,
    intern_id UUID NOT NULL REFERENCES interns(id) ON DELETE CASCADE,
    verification_token TEXT UNIQUE NOT NULL,
    template_id UUID REFERENCES templates(id),
    issued_date DATE DEFAULT CURRENT_DATE,
    pdf_path TEXT,
    status TEXT NOT NULL DEFAULT 'VALID',
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    revocation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- 5. CREATE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can select interns" ON interns;
DROP POLICY IF EXISTS "Authenticated users can insert/update interns" ON interns;
DROP POLICY IF EXISTS "Anyone can view interns for verification" ON interns;
DROP POLICY IF EXISTS "Anyone can view interns" ON interns;
DROP POLICY IF EXISTS "Anyone can insert and manage interns" ON interns;

DROP POLICY IF EXISTS "Anyone can view valid/revoked certificate for verification" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can generate and manage certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can view certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can insert and manage certificates" ON certificates;

DROP POLICY IF EXISTS "Authenticated users can read templates" ON templates;
DROP POLICY IF EXISTS "Anyone can read templates" ON templates;

DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Anyone can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Anyone can insert audit logs" ON audit_logs;

-- Interns Policies: Full access for web application operations
CREATE POLICY "Anyone can view interns"
    ON interns FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert and manage interns"
    ON interns FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Certificates Policies: Full access for verification and generation
CREATE POLICY "Anyone can view certificates"
    ON certificates FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert and manage certificates"
    ON certificates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Templates Policies: Read access
CREATE POLICY "Anyone can read templates"
    ON templates FOR SELECT TO anon, authenticated USING (true);

-- Audit Logs Policies: Read and insert access
CREATE POLICY "Anyone can view audit logs"
    ON audit_logs FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert audit logs"
    ON audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
