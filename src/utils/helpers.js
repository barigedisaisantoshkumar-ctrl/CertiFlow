/**
  Helper utilities for HPS CertiFlow application
*/

// Calculate Internship Status based on start and end dates
export function calculateInternshipStatus(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 'UNKNOWN';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDateStr);
  end.setHours(23, 59, 59, 999);

  if (today < start) {
    return 'UPCOMING';
  } else if (today >= start && today <= end) {
    return 'ACTIVE';
  } else {
    return 'COMPLETED';
  }
}

// Calculate Duration between two dates (e.g., "3 Months", "6 Months", "15 Days")
export function calculateDuration(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return '3 Months';
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (diffMonths >= 1) {
      return `${diffMonths} Month${diffMonths > 1 ? 's' : ''}`;
    }
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  } catch (e) {
    return '3 Months';
  }
}

// Format date for display (e.g., "16-05-2026" or "18/08/2026")
export function formatDate(dateString, format = 'DD-MM-YYYY') {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    if (format === 'DD/MM/YYYY') {
      return `${day}/${month}/${year}`;
    }
    return `${day}-${month}-${year}`;
  } catch (e) {
    return dateString;
  }
}

// Format date for inputs (YYYY-MM-DD)
export function formatDateForInput(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toISOString().split('T')[0];
}

// Generate unique HPS Certificate Number format HPS/INT/YYYY/XXXX
export function generateCertificateId(counter = 38) {
  const year = new Date().getFullYear();
  const padNum = String(counter).padStart(4, '0');
  return `HPS/INT/${year}/${padNum}`;
}

// Generate EMP ID format HPS26XXXX
export function generateEmpId(counter = 38) {
  const yearShort = String(new Date().getFullYear()).slice(-2);
  const padNum = String(counter).padStart(4, '0');
  return `HPS${yearShort}${padNum}`;
}

// Generate unpredictable verification token
export function generateVerificationToken() {
  return 'hps-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
}

// Convert any string identifier (like 'int-101', 'cert-001') to a valid PostgreSQL UUID format
export function toUuid(str) {
  if (!str) {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : '00000000-0000-4000-8000-000000000000';
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  const cleanHex = Array.from(String(str))
    .map((c) => c.charCodeAt(0).toString(16))
    .join('')
    .slice(0, 32)
    .padEnd(32, '0');
  return `${cleanHex.slice(0, 8)}-${cleanHex.slice(8, 12)}-4${cleanHex.slice(13, 16)}-8${cleanHex.slice(17, 20)}-${cleanHex.slice(20, 32)}`;
}

// Get pronoun based on gender (her / his / their)
export function getPronoun(gender) {
  if (!gender) return 'her/his';
  const g = gender.toLowerCase();
  if (g.includes('female') || g.includes('her')) return 'her';
  if (g.includes('male') || g.includes('his')) return 'his';
  return 'their';
}

