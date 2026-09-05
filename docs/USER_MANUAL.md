# CertiFlow — End User Manual

**Document Version:** 1.0.0  
**Last Updated:** September 5, 2026  
**Audience:** Company Administrators & HR Supervisors  

---

## 📖 User Manual Overview

CertiFlow provides an intuitive administrative portal for managing intern records, generating official completion certificates, revoking faulty certificates, and maintaining audit compliance.

---

## 🔑 1. Logging In
1. Navigate to the CertiFlow URL in your web browser.
2. Enter your authorized admin credentials.
3. Click **Sign In** to access the Dashboard.

---

## ➕ 2. Adding an Intern
1. Navigate to the **Interns** tab in the sidebar.
2. Click **+ Add Intern**.
3. Fill in mandatory intern details:
   - Intern Code / Employee ID
   - Full Name & Gender
   - Contact Email & Phone
   - University / College & Course
   - Department & Internship Title
   - Start Date & End Date
   - Supervisor Name
4. Click **Save Intern Record**.

---

## 🎓 3. Generating a Certificate
1. On the **Interns** or **Certificates** table, locate an intern whose internship end date is complete.
2. Status will show **ELIGIBLE**.
3. Click **Generate Certificate**.
4. The system automatically creates a unique certificate number (e.g. `HPS/2026/042`), verification token, and QR code.
5. Click **Preview & Download PDF** to view or export the high-resolution certificate.

---

## 🚫 4. Revoking a Certificate
1. Navigate to the **Certificates** page.
2. Locate the target valid certificate.
3. Click **Revoke**.
4. Provide an explicit **Revocation Reason** in the modal prompt.
5. Confirm revocation. The certificate status will instantly update to **REVOKED**, and public verification will flag it accordingly.

---

## 🔄 5. Restoring a Revoked Certificate
1. If a certificate was revoked in error, locate the revoked certificate.
2. Click **Restore**.
3. Confirm restoration to revert certificate back to **VALID** status.

---

## 🔍 6. Public Certificate Verification
1. Scan the QR code on any printed/digital certificate or visit `/verify/<token>`.
2. The verification screen immediately displays certificate authenticity status, intern details, issue date, and official verification seal.
