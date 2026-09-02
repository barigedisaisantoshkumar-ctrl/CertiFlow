export const INITIAL_INTERNS = [
  {
    id: "int-101",
    intern_code: "INT-2026-001",
    full_name: "Sai Kumar",
    email: "sai.kumar@example.com",
    phone: "+91 98765 43210",
    college: "Indian Institute of Technology, Hyderabad",
    course: "B.Tech Computer Science",
    department: "Software Engineering",
    internship_title: "Full Stack Web Development",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    supervisor_name: "Dr. Rajesh Sharma",
    supervisor_email: "rajesh.sharma@company.com",
    created_at: "2026-06-01T09:00:00Z"
  },
  {
    id: "int-102",
    intern_code: "INT-2026-002",
    full_name: "Ananya Roy",
    email: "ananya.roy@example.com",
    phone: "+91 98123 45678",
    college: "BITS Pilani",
    course: "M.Tech Data Science",
    department: "Artificial Intelligence",
    internship_title: "Machine Learning Engineering",
    start_date: "2026-05-15",
    end_date: "2026-08-15",
    supervisor_name: "Priya Venkatesh",
    supervisor_email: "priya.v@company.com",
    created_at: "2026-05-15T10:30:00Z"
  },
  {
    id: "int-103",
    intern_code: "INT-2026-003",
    full_name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 97654 32109",
    college: "Delhi Technological University",
    course: "B.E. Information Technology",
    department: "Product Management",
    internship_title: "Associate Product Manager",
    start_date: "2026-07-01",
    end_date: "2026-09-30",
    supervisor_name: "Amitabh Verma",
    supervisor_email: "amitabh.v@company.com",
    created_at: "2026-07-01T08:15:00Z"
  },
  {
    id: "int-104",
    intern_code: "INT-2026-004",
    full_name: "Kavya Patel",
    email: "kavya.patel@example.com",
    phone: "+91 99887 76655",
    college: "National Institute of Design",
    course: "B.Des Communication Design",
    department: "UX/UI Design",
    internship_title: "Product Design Intern",
    start_date: "2026-06-15",
    end_date: "2026-08-30",
    supervisor_name: "Sunil Hegde",
    supervisor_email: "sunil.h@company.com",
    created_at: "2026-06-15T11:00:00Z"
  },
  {
    id: "int-105",
    intern_code: "INT-2026-005",
    full_name: "Vikramaditya Singh",
    email: "vikram.singh@example.com",
    phone: "+91 91234 56789",
    college: "SRM Institute of Science & Tech",
    course: "B.Tech Cybersecurity",
    department: "DevOps & Security",
    internship_title: "Cloud Infrastructure & Security",
    start_date: "2026-09-15",
    end_date: "2026-12-15",
    supervisor_name: "Deepak Joshi",
    supervisor_email: "deepak.j@company.com",
    created_at: "2026-09-01T14:20:00Z"
  }
];

export const INITIAL_CERTIFICATES = [
  {
    id: "cert-001",
    certificate_number: "CERT-2026-000124",
    intern_id: "int-101",
    intern_name: "Sai Kumar",
    internship_title: "Full Stack Web Development",
    department: "Software Engineering",
    verification_token: "token-sai-kumar-2026-v1",
    issued_date: "2026-09-01",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    supervisor_name: "Dr. Rajesh Sharma",
    status: "VALID",
    pdf_path: "certificates/2026/CERT-2026-000124.pdf",
    created_at: "2026-09-01T10:00:00Z"
  },
  {
    id: "cert-002",
    certificate_number: "CERT-2026-000125",
    intern_id: "int-102",
    intern_name: "Ananya Roy",
    internship_title: "Machine Learning Engineering",
    department: "Artificial Intelligence",
    verification_token: "token-ananya-roy-2026-v1",
    issued_date: "2026-08-16",
    start_date: "2026-05-15",
    end_date: "2026-08-15",
    supervisor_name: "Priya Venkatesh",
    status: "VALID",
    pdf_path: "certificates/2026/CERT-2026-000125.pdf",
    created_at: "2026-08-16T11:30:00Z"
  },
  {
    id: "cert-003",
    certificate_number: "CERT-2026-000088",
    intern_id: "int-104",
    intern_name: "Kavya Patel",
    internship_title: "Product Design Intern",
    department: "UX/UI Design",
    verification_token: "token-kavya-patel-2026-revoked",
    issued_date: "2026-08-31",
    start_date: "2026-06-15",
    end_date: "2026-08-30",
    supervisor_name: "Sunil Hegde",
    status: "REVOKED",
    revoked_at: "2026-09-02T08:00:00Z",
    revocation_reason: "Reissued due to typographical update in college degree title.",
    pdf_path: "certificates/2026/CERT-2026-000088.pdf",
    created_at: "2026-08-31T09:00:00Z"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud-001",
    user: "Admin (admin@certiflow.com)",
    action: "CERTIFICATE_REVOKED",
    entity_type: "CERTIFICATE",
    entity_id: "CERT-2026-000088",
    details: "Revoked certificate CERT-2026-000088 for Kavya Patel",
    timestamp: "2026-09-02T08:00:00Z"
  },
  {
    id: "aud-002",
    user: "HR Manager (hr@certiflow.com)",
    action: "CERTIFICATE_GENERATED",
    entity_type: "CERTIFICATE",
    entity_id: "CERT-2026-000124",
    details: "Generated certificate CERT-2026-000124 for Sai Kumar",
    timestamp: "2026-09-01T10:00:00Z"
  },
  {
    id: "aud-003",
    user: "HR Manager (hr@certiflow.com)",
    action: "INTERN_CREATED",
    entity_type: "INTERN",
    entity_id: "INT-2026-005",
    details: "Added intern record for Vikramaditya Singh",
    timestamp: "2026-09-01T14:20:00Z"
  }
];
