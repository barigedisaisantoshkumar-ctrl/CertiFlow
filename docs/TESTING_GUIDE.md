# CertiFlow — Testing Guide

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  

---

## 🧪 Testing Overview

CertiFlow incorporates client-side state validation, fallback resilience testing, schema validation via **Zod**, and end-to-end user path testing.

---

## 🔍 Validation Suite

### 1. Schema Validation Tests (Zod + React Hook Form)
- Validates that mandatory intern details (`intern_code`, `full_name`, `email`, `department`, `start_date`, `end_date`) pass strict type & date boundary checks.
- Validates date math logic where `end_date` must occur after `start_date`.

### 2. LocalStorage Fallback Tests
- Test application startup when `VITE_SUPABASE_URL` is omitted or invalid.
- Verify seamless automatic degradation to `LocalStorage` mock dataset without application crash.

### 3. QR & PDF Generation Verification
- Verify `html2canvas` captures `CertificateTemplate` component at high DPI scale (2x pixel ratio).
- Verify `jsPDF` creates clean A4 landscape PDF file payload.
- Verify `qrcode.react` produces valid URL targets matching `/verify/:token`.

### 4. Verification Route Security
- Verify public access to `/verify/:token` without requiring login token.
- Verify invalid token displays an explicit "Certificate Not Found" warning state.
- Verify revoked certificate displays prominent "REVOKED" badge alongside revocation timestamp and reason.
