CertiFlow — Product Requirements Document (PRD)

1. Product Overview

Product Name: CertiFlow

Product Type: Internship Certificate Generation & Verification Platform

Purpose:
CertiFlow is a web-based internal company application that automates the creation, management, issuance, and public verification of internship completion certificates.

At the beginning of an internship, an authorized company user records the intern's information. When the internship is completed, the authorized user can generate a certificate with one click. The system dynamically inserts the intern's details into a predefined company certificate template, generates a unique certificate ID and verification URL, creates a QR code linked to that URL, places the QR code on the certificate, generates a PDF, and stores the final certificate securely.

Anyone who scans the QR code can open the public verification URL and verify/view the certificate without logging in.

2. Problem Statement

Companies often create internship completion certificates manually. This can cause:

Repetitive manual work

Typing errors

Inconsistent certificate formatting

Difficulty tracking issued certificates

Difficulty verifying whether a certificate is genuine

No centralized certificate history

Difficulty revoking incorrectly issued certificates

CertiFlow solves these problems through centralized data management, automated certificate generation, QR-based verification, and certificate status management.

3. Goals

Primary Goals

Store intern information digitally.

Allow authorized users to manage intern records.

Automatically determine when an internship is eligible for certificate generation.

Generate certificates using a predefined company template.

Dynamically insert intern-specific information.

Generate a unique certificate number.

Generate a unique public verification URL.

Generate and embed a QR code in the certificate.

Generate the final certificate as a PDF.

Store generated certificates securely.

Allow anyone to verify a certificate through its public URL.

Allow authorized users to revoke certificates.

Maintain an audit trail of important certificate actions.

Secondary Goals

Provide a professional admin dashboard.

Provide search and filtering.

Provide certificate download.

Prevent duplicate certificate issuance.

Support future certificate templates.

Support future role-based access control.

4. Non-Goals for MVP

The first version should NOT attempt to include:

Automated email delivery

WhatsApp/SMS integration

AI-generated certificate designs

Payment processing

Public user registration

Mobile application

Multiple companies/tenants

Complex HR/payroll functionality

Advanced analytics

Digital signatures using external certificate authorities

These can be considered future enhancements.

5. Target Users

5.1 Administrator

Responsible for:

Managing users

Managing interns

Managing certificates

Managing templates

Revoking certificates

Viewing audit logs

5.2 Supervisor / HR User

Responsible for:

Adding intern information

Updating intern information

Viewing internship status

Generating certificates

Downloading certificates

Viewing certificate records

5.3 Public Verifier

A person who receives or scans an internship certificate.

The verifier:

Does not need an account.

Scans the QR code.

Opens the public verification page.

Views certificate details.

Checks whether the certificate is valid/revoked.

Can view/download the certificate PDF if permitted.

6. Core User Journey

Intern joins company
        ↓
Authorized user creates intern record
        ↓
Internship information is stored
        ↓
Internship continues
        ↓
Internship end date is reached
        ↓
Certificate becomes eligible
        ↓
Authorized user clicks "Generate Certificate"
        ↓
System validates intern information
        ↓
System generates unique Certificate ID
        ↓
System creates public verification URL
        ↓
System generates QR code
        ↓
System inserts intern data + QR into template
        ↓
System generates PDF
        ↓
PDF is stored in Supabase Storage
        ↓
Certificate record is saved
        ↓
User can view/download certificate
        ↓
Verifier scans QR
        ↓
Public verification page opens
        ↓
System validates certificate
        ↓
Certificate details are displayed

7. Recommended Technology Stack

Frontend

React

Vite

JavaScript or TypeScript

Tailwind CSS

React Router

React Hook Form

Zod

Lucide React icons

Backend / BaaS

Supabase

Supabase Authentication

Supabase PostgreSQL

Supabase Storage

Supabase Edge Functions

Certificate Generation

Use a server-side certificate generation service/function.

Preferred approach:

HTML/CSS certificate template

Server-side rendering

PDF generation

QR code generation

The browser must NOT be considered the trusted certificate-generation environment.

Deployment

Frontend:

Vercel or company-approved hosting

Backend:

Supabase

Source control:

Git

GitHub/GitLab/company repository

8. High-Level Architecture

┌─────────────────────────────────────────────┐
│                 ADMIN USER                  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ React + Vite UI │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │    Supabase     │
              │                 │
              │ Authentication  │
              │ PostgreSQL      │
              │ Storage         │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Edge Function / │
              │ Server Function │
              └────────┬────────┘
                       │
              ┌────────┴─────────┐
              ▼                  ▼
       Certificate Engine      QR Engine
              │                  │
              └────────┬─────────┘
                       ▼
                  PDF Certificate
                       │
                       ▼
                 Supabase Storage
                       │
                       ▼
              Public Verification
                       │
                       ▼
                 QR Code Scan

9. Functional Requirements

FR-001 Authentication

The application must provide secure authentication for company users.

Requirements:

Login page

Logout

Session persistence

Protected admin routes

Unauthorized users must not access the admin dashboard

Public certificate verification must not require authentication

Example routes:

/login
/dashboard
/interns
/interns/new
/interns/:id
/certificates
/certificates/:id
/verify/:certificateId

10. Intern Management

FR-002 Create Intern

Authorized users must be able to create an intern record.

Required fields:

Full Name

Email

College / Institution

Course / Degree

Department

Internship Title

Internship Start Date

Internship End Date

Supervisor Name

Optional fields may include:

Phone

Intern Code

College ID

Batch

Description

Supervisor Email

Validation:

Full name is required.

Email must be valid.

Internship start date is required.

Internship end date is required.

End date cannot be before start date.

Internship title is required.

Department is required.

11. Intern List

The application must provide an intern listing.

Display:

Intern name

Internship title

Department

Start date

End date

Internship status

Certificate status

Actions

Actions:

View

Edit

Generate Certificate

View Certificate

Search:

Name

Email

Intern code

Certificate ID

Filters:

Active

Completed

Certificate Generated

Certificate Not Generated

12. Internship Status

The system should derive internship status based on dates.

Possible states:

UPCOMING
ACTIVE
COMPLETED

Example:

Start Date: 01 June 2026
End Date:   31 August 2026
Current:    02 September 2026

Status: COMPLETED

Certificate generation should normally only be available when:

status = COMPLETED

An administrator may optionally have an override mechanism in a later version.

13. Certificate Generation

FR-003 Generate Certificate

The user clicks:

Generate Certificate

The system must:

Validate intern data.

Confirm the internship is completed.

Check whether a certificate already exists.

Generate a unique certificate ID.

Generate a unique verification token.

Construct the public verification URL.

Generate a QR code containing the public verification URL.

Load the configured certificate template.

Replace template placeholders with intern data.

Insert the QR code.

Generate a PDF.

Upload the PDF to secure storage.

Create the certificate database record.

Record the generation event in the audit log.

Return the certificate details to the frontend.

14. Certificate ID

Certificate IDs must be unique.

Recommended format:

CERT-2026-000001
CERT-2026-000002
CERT-2026-000003

The actual implementation must guarantee uniqueness at the database level.

Do not rely only on frontend-generated IDs.

15. Verification Token

Each certificate must have a unique unpredictable verification token.

Example:

a8d4c7f1-2e91-4f8b-91d3-xxxxxxxxxxxx

The token must not expose personal information.

Do not use:

/verify/sai-kumar
/verify/sai@example.com

Prefer:

/verify/<secure-random-token>

or a system-generated certificate identifier mapped to a secure verification record.

16. QR Code

The QR code must contain only the public verification URL.

Example:

https://company-domain.com/verify/a8d4c7f1...

Do NOT encode sensitive personal data directly inside the QR code.

The QR code should be:

High resolution

Error-correction enabled

Suitable for printing

Placed in the predefined QR area of the certificate template

17. Certificate Template

The system must support a company-provided certificate template.

Recommended template mechanism:

{{INTERN_NAME}}
{{INTERNSHIP_TITLE}}
{{DEPARTMENT}}
{{START_DATE}}
{{END_DATE}}
{{SUPERVISOR_NAME}}
{{CERTIFICATE_ID}}
{{ISSUE_DATE}}
{{QR_CODE}}

Example:

This is to certify that

{{INTERN_NAME}}

has successfully completed the

{{INTERNSHIP_TITLE}}

internship program from

{{START_DATE}} to {{END_DATE}}.

Department: {{DEPARTMENT}}

Certificate ID: {{CERTIFICATE_ID}}

{{QR_CODE}}

The template must preserve:

Company logo

Typography

Borders

Background

Layout

Signatures

Decorative elements

Only dynamic fields should change.

18. Certificate PDF

The final output must be a PDF.

Requirements:

Preserve certificate dimensions.

Preserve template layout.

Maintain print quality.

Embed QR code.

Include certificate ID.

Include required intern information.

Avoid text overflow.

Handle long names safely.

Handle long internship titles safely.

Handle special characters correctly.

The PDF must be generated server-side.

19. Duplicate Certificate Protection

The system must prevent accidental duplicate issuance.

Before generating:

Does this intern already have a valid certificate?

If yes:

Certificate already exists.

Certificate ID:
CERT-2026-000124

[View Certificate]

Do not create another certificate unless the user explicitly performs an authorized reissue operation.

20. Certificate Status

Certificates should support:

VALID
REVOKED

Future states may include:

DRAFT
GENERATING
FAILED
REISSUED

21. Certificate Revocation

Authorized users must be able to revoke a certificate.

Example:

Certificate:
CERT-2026-000124

Status:
VALID

[ Revoke Certificate ]

The system should require confirmation.

After revocation:

Certificate Status:
REVOKED

The public verification page must clearly show:

CERTIFICATE REVOKED

The revoked certificate must not appear as valid.

22. Public Verification

FR-004 Public Certificate Verification

Route:

/verify/:token

This route must be publicly accessible.

No login required.

The page should display:

✓ VERIFIED CERTIFICATE

Certificate ID:
CERT-2026-000124

Name:
Sai Kumar

Internship:
Full Stack Development

Department:
Software Development

Duration:
01 June 2026 – 31 August 2026

Issued By:
Company Name

Status:
VALID

[View Certificate]

The exact information displayed should follow company privacy requirements.

23. Invalid Certificate

If the verification token does not exist:

Certificate Not Found

The certificate could not be verified.
Please check the QR code or verification link.

Do not expose internal database details.

24. Revoked Certificate Verification

If the certificate is revoked:

⚠ CERTIFICATE REVOKED

Certificate ID:
CERT-2026-000124

This certificate was previously issued but is no longer valid.

25. Certificate Storage

Generated PDFs should be stored in Supabase Storage.

Recommended structure:

certificates/
    2026/
        CERT-2026-000001.pdf
        CERT-2026-000002.pdf

Certificate files should not be publicly writable.

Prefer controlled access and short-lived signed URLs for protected storage.

The public verification page can authorize access to the appropriate certificate before providing the file.

26. Database Design

Table: interns

id UUID PRIMARY KEY
intern_code TEXT UNIQUE
full_name TEXT NOT NULL
email TEXT NOT NULL
phone TEXT
college TEXT
course TEXT
department TEXT NOT NULL
internship_title TEXT NOT NULL
start_date DATE NOT NULL
end_date DATE NOT NULL
supervisor_name TEXT
supervisor_email TEXT
status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
created_by UUID

Table: certificates

id UUID PRIMARY KEY
certificate_number TEXT UNIQUE NOT NULL
intern_id UUID REFERENCES interns(id)
verification_token TEXT UNIQUE NOT NULL
template_id UUID
issued_date DATE
pdf_path TEXT
status TEXT NOT NULL
created_at TIMESTAMPTZ
created_by UUID
revoked_at TIMESTAMPTZ
revoked_by UUID
revocation_reason TEXT

Table: templates

id UUID PRIMARY KEY
name TEXT NOT NULL
description TEXT
template_path TEXT
version INTEGER
is_active BOOLEAN
created_at TIMESTAMPTZ
created_by UUID

Table: audit_logs

id UUID PRIMARY KEY
user_id UUID
action TEXT NOT NULL
entity_type TEXT
entity_id UUID
metadata JSONB
created_at TIMESTAMPTZ

Example actions:

INTERN_CREATED
INTERN_UPDATED
CERTIFICATE_GENERATED
CERTIFICATE_VIEWED
CERTIFICATE_DOWNLOADED
CERTIFICATE_REVOKED
TEMPLATE_CREATED
TEMPLATE_UPDATED

27. Row Level Security

Supabase Row Level Security must be enabled for company data.

Requirements:

Anonymous users must not read intern records.

Anonymous users must not access admin tables.

Authenticated authorized users can access permitted company data.

Public verification should expose only the minimum certificate information necessary.

Certificate storage must not allow unauthorized uploads/deletes.

Never rely only on frontend route protection.

Authorization must also be enforced at the database/backend level.

28. Admin Dashboard

Dashboard should display:

Total Interns
Active Interns
Completed Internships
Certificates Issued
Valid Certificates
Revoked Certificates

Example:

┌────────────────┐
│ Total Interns  │
│      248       │
└────────────────┘

┌────────────────┐
│ Active         │
│       42       │
└────────────────┘

┌────────────────┐
│ Completed      │
│      206       │
└────────────────┘

┌────────────────┐
│ Certificates   │
│      198       │
└────────────────┘

29. UI Requirements

The UI should be:

Professional

Minimal

Corporate

Responsive

Accessible

Fast

Easy for non-technical HR users

Recommended layout:

┌──────────────────────────────────────────────┐
│ Logo                         User / Logout   │
├──────────────┬───────────────────────────────┤
│ Dashboard    │                               │
│ Interns      │       Main Content            │
│ Certificates │                               │
│ Templates    │                               │
│ Audit Logs   │                               │
│ Settings     │                               │
└──────────────┴───────────────────────────────┘

30. Important UI Components

Create reusable components:

Button
Input
Select
DatePicker
Modal
ConfirmationModal
Table
Badge
Card
Toast
LoadingState
EmptyState
ErrorState
SearchBar
Pagination
CertificatePreview
StatusBadge

Avoid duplicating UI code.

31. Certificate Preview

Before final generation, the user should ideally see a preview.

Flow:

Generate Certificate
        ↓
Preview
        ↓
Confirm
        ↓
Generate Final PDF

For MVP, preview may be implemented after basic generation works.

32. Error Handling

Every asynchronous operation must have:

Loading state

Success state

Error state

Examples:

Generating certificate...

Please wait.

Success:

Certificate generated successfully.

Failure:

Certificate generation failed.
Please try again.

Do not expose raw backend errors to end users.

Log technical errors securely for debugging.

33. Security Requirements

The application handles personal information and official company documents.

Requirements:

Use HTTPS in production.

Use Supabase authentication.

Enable Row Level Security.

Never expose service-role keys in frontend code.

Store secrets only in environment variables/server-side secrets.

Validate all user input.

Sanitize template data.

Use unpredictable verification tokens.

Do not expose unnecessary personal data publicly.

Protect certificate storage.

Validate authorization server-side.

Record important administrative actions.

Prevent unauthorized certificate generation.

Prevent duplicate issuance.

Do not trust certificate IDs supplied by the browser.

34. Environment Variables

Frontend example:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_PUBLIC_APP_URL=

Server-side secrets must NOT use the VITE_ prefix.

Never commit secrets to Git.

Create:

.env.local
.env.example

.env.example should contain placeholder names only.

35. API / Backend Operations

The frontend should interact with backend functionality through well-defined services.

Suggested operations:

createIntern()
getInterns()
getIntern()
updateIntern()

getCertificates()
getCertificate()

generateCertificate()
revokeCertificate()

getPublicCertificate()

Certificate generation should be handled by a secure server-side function.

36. Certificate Generation API

Example:

POST /generate-certificate

Request:

{
  "internId": "uuid"
}

Response:

{
  "success": true,
  "certificateId": "CERT-2026-000124",
  "verificationUrl": "https://company.com/verify/secure-token"
}

Do not return internal storage credentials.

37. Public Verification API

Example:

GET /verify/:token

Response should contain only public-safe certificate information.

Example:

{
  "valid": true,
  "certificateNumber": "CERT-2026-000124",
  "name": "Sai Kumar",
  "internshipTitle": "Full Stack Development",
  "department": "Software Development",
  "startDate": "2026-06-01",
  "endDate": "2026-08-31",
  "issuedDate": "2026-09-01",
  "status": "VALID"
}

38. Recommended Project Structure

certiflow/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── interns/
│   │   └── certificates/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Interns.jsx
│   │   ├── AddIntern.jsx
│   │   ├── EditIntern.jsx
│   │   ├── Certificates.jsx
│   │   └── VerifyCertificate.jsx
│   │
│   ├── services/
│   │   ├── supabase.js
│   │   ├── internService.js
│   │   └── certificateService.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── lib/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   ├── migrations/
│   └── functions/
│       └── generate-certificate/
│
├── templates/
│   └── certificate/
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

39. Development Roadmap

Phase 1 — Project Setup

Tasks:

Initialize React + Vite.

Install Tailwind CSS.

Install React Router.

Configure Supabase.

Configure environment variables.

Create Git repository.

Create base application layout.

Create login page.

Deliverable:

React application connected to Supabase.

Phase 2 — Authentication

Tasks:

Implement login.

Implement logout.

Implement session handling.

Protect admin routes.

Create authentication context/hook.

Deliverable:

Only authenticated company users can access admin dashboard.

Phase 3 — Intern Management

Tasks:

Create database migration.

Create intern form.

Add validation.

Create intern list.

Create intern detail page.

Implement edit.

Implement search.

Implement filtering.

Deliverable:

Complete intern CRUD system.

Phase 4 — Certificate Database

Tasks:

Create certificates table.

Create certificate statuses.

Generate unique certificate numbers.

Connect intern → certificate relationship.

Display certificate history.

Deliverable:

System can track certificates independently from intern records.

Phase 5 — Certificate Template

Tasks:

Obtain official company certificate template.

Convert template into the chosen rendering format.

Identify dynamic fields.

Define placeholder syntax.

Implement QR placeholder.

Test long names and long titles.

Deliverable:

Template can accept dynamic certificate data.

Phase 6 — PDF Generation

Tasks:

Implement server-side generation.

Inject intern data.

Generate QR code.

Insert QR code.

Generate PDF.

Upload PDF to storage.

Save certificate metadata.

Deliverable:

One-click certificate generation produces the final PDF.

Phase 7 — Public Verification

Tasks:

Create public verification route.

Resolve verification token.

Display certificate details.

Handle valid certificate.

Handle invalid certificate.

Handle revoked certificate.

Provide certificate PDF access.

Deliverable:

Anyone can scan the QR and verify the certificate.

Phase 8 — Revocation and Audit

Tasks:

Implement certificate revocation.

Add revocation reason.

Add audit logs.

Display certificate history.

Add audit log page for administrators.

Deliverable:

Certificate lifecycle is traceable.

Phase 9 — Production Hardening

Tasks:

Review RLS policies.

Review authentication.

Review storage permissions.

Review environment variables.

Validate all inputs.

Test QR scanning from printed certificate.

Test mobile verification.

Test PDF printing.

Test duplicate generation.

Test revoked certificates.

Add error monitoring/logging.

Deploy to production.

40. MVP Acceptance Criteria

The MVP is considered complete when all of the following work:

Authentication

User can log in.

User can log out.

Unauthenticated users cannot access admin pages.

Intern Management

User can create an intern.

User can view interns.

User can edit an intern.

User can search interns.

System determines internship status.

Certificate Generation

Completed intern can have a certificate generated.

Certificate receives a unique ID.

QR code is generated.

QR points to the correct verification URL.

Intern information is inserted into the template.

PDF is generated.

PDF is stored.

Certificate record is stored.

Duplicate generation is prevented.

Verification

QR scan opens the public URL.

Valid certificate displays as valid.

Invalid token displays an error.

Revoked certificate displays as revoked.

Public verifier does not need an account.

Security

RLS is enabled.

Service role key is never exposed.

Private intern information is not publicly exposed.

Certificate generation requires authorization.

Certificate storage is protected.

41. Future Enhancements

After the MVP, consider:

Email Delivery

Automatically email the certificate to the intern.

Certificate generated
        ↓
Email sent
        ↓
Intern receives PDF + verification link

Bulk Certificate Generation

Select multiple completed interns:

☑ Sai Kumar
☑ Rahul Kumar
☑ Anil Kumar

[Generate Certificates]

Template Management

Allow administrators to upload and manage multiple certificate templates.

Multiple Certificate Types

Examples:

Internship Completion
Internship Participation
Training Completion
Workshop Completion
Project Completion

Digital Signing

Integrate an approved digital-signature workflow if the company requires legally verifiable signatures.

Advanced Analytics

Track:

Certificates issued per month

Internship departments

Verification count

Revocation count

Completion trends

Email Verification Notifications

Notify an administrator when a certificate is verified.

42. Important Engineering Rules for AI-Assisted Development

When using an AI coding assistant to implement this project:

Do not generate the entire application in one step.

Implement one phase at a time.

Keep database schema and application types synchronized.

Never put Supabase service-role credentials in frontend code.

Never bypass Row Level Security just to make development easier.

Keep certificate generation server-side.

Keep public verification read-only.

Validate all user input.

Use reusable components.

Keep business logic outside UI components where practical.

Handle loading, empty, success, and error states.

Write meaningful commit messages.

Test every feature before moving to the next phase.

Do not replace working architecture without a clear reason.

Keep the certificate template isolated from the rest of the application.

Make the certificate generation process idempotent or explicitly protect it from duplicates.

Never expose internal database errors or secrets to public users.

43. First Development Task

Start with Phase 1 only.

Do NOT implement certificate generation yet.

Initial tasks:

1. Create React + Vite project.
2. Configure Tailwind CSS.
3. Configure React Router.
4. Create Supabase project configuration.
5. Create .env.example.
6. Create application folder structure.
7. Create base dashboard layout.
8. Create login page UI.
9. Create protected-route structure.
10. Create placeholder pages:
    - Dashboard
    - Interns
    - Certificates
    - Templates
    - Audit Logs
11. Create Git repository.
12. Verify the application runs successfully.

After Phase 1 is working, move to authentication and database schema.

44. Definition of Done

A feature is not considered complete merely because the UI exists.

A feature is complete only when:

UI
 ↓
Validation
 ↓
Backend
 ↓
Database
 ↓
Authorization
 ↓
Error Handling
 ↓
Loading State
 ↓
Success State
 ↓
Testing

all work correctly.

45. Product Success Criteria

CertiFlow should reduce manual certificate-generation work and provide a trustworthy verification mechanism.

The ideal final experience is:

HR/Supervisor:

Open intern
      ↓
Internship completed
      ↓
Click Generate Certificate
      ↓
Certificate ready in seconds
      ↓
Download / View


External verifier:

Scan QR
      ↓
Verification page
      ↓
Certificate status
      ↓
Certificate details
      ↓
View official certificate

The system should feel like a real internal company product, not a student CRUD application.