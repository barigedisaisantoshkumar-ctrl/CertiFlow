export const INITIAL_INTERNS = [
  {
    id: "int-101",
    intern_code: "HPS260038",
    full_name: "Dipika Reddy Ragipindi",
    gender: "Female",
    email: "dipika.reddy@example.com",
    phone: "+91 98765 43210",
    college: "Indian Institute of Technology, Hyderabad",
    course: "B.Tech Computer Science",
    department: "Software Development",
    internship_title: "SDE Intern",
    duration: "3 Months",
    start_date: "2026-05-16",
    end_date: "2026-08-16",
    supervisor_name: "Director",
    supervisor_email: "director@hps.com",
    created_at: "2026-05-16T09:00:00Z"
  },
  {
    id: "int-102",
    intern_code: "HPS260039",
    full_name: "Sai Kumar",
    gender: "Male",
    email: "sai.kumar@example.com",
    phone: "+91 98123 45678",
    college: "BITS Pilani",
    course: "M.Tech Data Science",
    department: "Artificial Intelligence",
    internship_title: "AI Engineer Intern",
    duration: "3 Months",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    supervisor_name: "Director",
    supervisor_email: "director@hps.com",
    created_at: "2026-06-01T10:30:00Z"
  },
  {
    id: "int-103",
    intern_code: "HPS260040",
    full_name: "Ananya Roy",
    gender: "Female",
    email: "ananya.roy@example.com",
    phone: "+91 97654 32109",
    college: "Delhi Technological University",
    course: "B.E. Information Technology",
    department: "UX/UI Design",
    internship_title: "Product Design Intern",
    duration: "6 Months",
    start_date: "2026-07-01",
    end_date: "2026-12-31",
    supervisor_name: "Director",
    supervisor_email: "director@hps.com",
    created_at: "2026-07-01T08:15:00Z"
  }
];

export const INITIAL_CERTIFICATES = [
  {
    id: "cert-001",
    certificate_number: "HPS/INT/2026/0038",
    intern_id: "int-101",
    intern_name: "Dipika Reddy Ragipindi",
    gender: "Female",
    intern_code: "HPS260038",
    internship_title: "SDE Intern",
    department: "Software Development",
    duration: "3 Months",
    verification_token: "token-dipika-reddy-2026-v1",
    issued_date: "2026-08-18",
    start_date: "2026-05-16",
    end_date: "2026-08-16",
    supervisor_name: "Director",
    status: "VALID",
    pdf_path: "certificates/2026/HPS_INT_2026_0038.pdf",
    created_at: "2026-08-18T10:00:00Z"
  },
  {
    id: "cert-002",
    certificate_number: "HPS/INT/2026/0039",
    intern_id: "int-102",
    intern_name: "Sai Kumar",
    gender: "Male",
    intern_code: "HPS260039",
    internship_title: "AI Engineer Intern",
    department: "Artificial Intelligence",
    duration: "3 Months",
    verification_token: "token-sai-kumar-2026-v1",
    issued_date: "2026-09-01",
    start_date: "2026-06-01",
    end_date: "2026-08-31",
    supervisor_name: "Director",
    status: "VALID",
    pdf_path: "certificates/2026/HPS_INT_2026_0039.pdf",
    created_at: "2026-09-01T11:30:00Z"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud-001",
    user: "HR Manager (hr@hps.com)",
    action: "CERTIFICATE_GENERATED",
    entity_type: "CERTIFICATE",
    entity_id: "HPS/INT/2026/0038",
    details: "Generated certificate HPS/INT/2026/0038 for Dipika Reddy Ragipindi",
    timestamp: "2026-08-18T10:00:00Z"
  }
];
