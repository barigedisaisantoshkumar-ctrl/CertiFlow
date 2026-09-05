# CertiFlow — API Documentation

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Status:** Active  

---

## 📋 Overview

CertiFlow leverages **Supabase Auto-generated PostgREST APIs** backed by PostgreSQL Row Level Security (RLS) policies, alongside direct client services (`internService`, `certificateService`, `auditService`, `departmentService`).

All authenticated REST requests require the `apikey` header and an authorization bearer token (`Authorization: Bearer <JWT>`). Public verification requests access the database via anon keys subject to public RLS read policies.

---

## 🔑 Authentication Headers

| Header | Description | Required |
| :--- | :--- | :--- |
| `apikey` | Supabase Anonymous / Service Key | Yes |
| `Authorization` | `Bearer <user_jwt_token>` | Yes (for protected endpoints) |
| `Content-Type` | `application/json` | Yes (for POST / PUT / PATCH) |

---

## 👥 Intern Management Endpoints

### 1. Fetch All Interns
- **HTTP Method:** `GET`
- **Endpoint:** `/rest/v1/interns?select=*&order=created_at.desc`
- **Access Level:** Authenticated Users
- **Response (200 OK):**
```json
[
  {
    "id": "a3b1c2d4-5678-90ab-cdef-1234567890ab",
    "intern_code": "HPS-INT-2026-001",
    "full_name": "Jane Doe",
    "gender": "Female",
    "email": "jane.doe@example.com",
    "phone": "+1 (555) 234-5678",
    "college": "Stanford University",
    "course": "B.Tech Computer Science",
    "department": "Software Engineering",
    "internship_title": "Full Stack Developer Intern",
    "duration": "3 Months",
    "start_date": "2026-06-01",
    "end_date": "2026-09-01",
    "supervisor_name": "Dr. Robert Smith",
    "supervisor_email": "r.smith@hps.com",
    "created_at": "2026-06-01T09:00:00Z"
  }
]
```

### 2. Create Intern Record
- **HTTP Method:** `POST`
- **Endpoint:** `/rest/v1/interns`
- **Access Level:** Authenticated Users
- **Request Body:**
```json
{
  "intern_code": "HPS-INT-2026-042",
  "full_name": "Alex Mercer",
  "gender": "Male",
  "email": "alex.m@example.com",
  "phone": "+1 555-0199",
  "college": "MIT",
  "course": "B.S. Software Engineering",
  "department": "Cybersecurity",
  "internship_title": "Security Analyst Intern",
  "duration": "6 Months",
  "start_date": "2026-03-01",
  "end_date": "2026-09-01",
  "supervisor_name": "Director of Security"
}
```
- **Response (201 Created):** Returns inserted object.

### 3. Update Intern Record
- **HTTP Method:** `PATCH`
- **Endpoint:** `/rest/v1/interns?id=eq.<intern_id>`
- **Access Level:** Authenticated Users

---

## 📜 Certificate Endpoints

### 1. Fetch All Certificates
- **HTTP Method:** `GET`
- **Endpoint:** `/rest/v1/certificates?select=*&order=created_at.desc`
- **Access Level:** Authenticated Users

### 2. Public Certificate Verification
- **HTTP Method:** `GET`
- **Endpoint:** `/rest/v1/certificates?verification_token=eq.<token>&select=*`
- **Access Level:** Public (Anonymous)
- **Response (200 OK):**
```json
[
  {
    "id": "c9d8e7f6-1234-5678-90ab-cdef12345678",
    "certificate_number": "HPS/2026/042",
    "intern_id": "a3b1c2d4-5678-90ab-cdef-1234567890ab",
    "verification_token": "a1b2c3d4e5f67890",
    "issued_date": "2026-09-01",
    "pdf_path": "certificates/2026/HPS_2026_042.pdf",
    "status": "VALID",
    "revoked_at": null,
    "revocation_reason": null
  }
]
```

### 3. Generate Certificate
- **HTTP Method:** `POST`
- **Endpoint:** `/rest/v1/certificates`
- **Access Level:** Authenticated Users

### 4. Revoke Certificate
- **HTTP Method:** `PATCH`
- **Endpoint:** `/rest/v1/certificates?id=eq.<cert_id>`
- **Request Body:**
```json
{
  "status": "REVOKED",
  "revocation_reason": "Incorrect duration specified on original form",
  "revoked_at": "2026-09-05T06:00:00Z"
}
```

### 5. Restore Revoked Certificate
- **HTTP Method:** `PATCH`
- **Endpoint:** `/rest/v1/certificates?id=eq.<cert_id>`
- **Request Body:**
```json
{
  "status": "VALID",
  "revocation_reason": null,
  "revoked_at": null
}
```

---

## 📊 Audit Log Endpoints

### 1. View Audit Logs
- **HTTP Method:** `GET`
- **Endpoint:** `/rest/v1/audit_logs?select=*&order=created_at.desc`
- **Access Level:** Authenticated Users

### 2. Log System Action
- **HTTP Method:** `POST`
- **Endpoint:** `/rest/v1/audit_logs`
- **Request Body:**
```json
{
  "action": "CERTIFICATE_GENERATED",
  "entity_type": "CERTIFICATE",
  "entity_id": "HPS/2026/042",
  "metadata": {
    "details": "Generated HPS certificate for Alex Mercer"
  }
}
```

---

## ⚠️ Error Codes & Handling

| HTTP Status | Error Code | Explanation |
| :--- | :--- | :--- |
| `400` | `INVALID_PAYLOAD` | Missing required fields (e.g. intern_code, full_name, start_date) |
| `401` | `UNAUTHORIZED` | Invalid or expired JWT token |
| `403` | `FORBIDDEN` | Row Level Security constraint violation |
| `404` | `NOT_FOUND` | Verification token or certificate record does not exist |
| `409` | `CONFLICT` | Certificate already issued for specified intern ID |
