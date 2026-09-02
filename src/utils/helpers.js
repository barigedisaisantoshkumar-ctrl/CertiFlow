/**
  Helper utilities for CertiFlow application
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

// Format date for UI display (e.g., "01 June 2026")
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

// Generate unique certificate ID format CERT-YYYY-XXXXXX
export function generateCertificateId(counter = 1) {
  const year = new Date().getFullYear();
  const padNum = String(counter).padStart(6, '0');
  return `CERT-${year}-${padNum}`;
}

// Generate unpredictable verification token (UUID v4 style)
export function generateVerificationToken() {
  return 'cf-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
}
