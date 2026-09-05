import { INITIAL_CERTIFICATES } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateCertificateId, generateVerificationToken, generateEmpId, calculateDuration, toUuid } from '../utils/helpers';
import { auditService } from './auditService';

const STORAGE_KEY = 'certiflow_hps_certificates_v3';

const getStoredCertificates = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
      return INITIAL_CERTIFICATES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.warn('Error reading stored certificates', err);
    return INITIAL_CERTIFICATES;
  }
};

const saveStoredCertificates = (certs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch (err) {
    console.warn('Error saving stored certificates', err);
  }
};

export const certificateService = {
  async syncCertificateToSupabase(cert) {
    if (!isSupabaseConfigured() || !cert) return;
    try {
      const validInternId = toUuid(cert.intern_id || cert.id);
      const validCertId = toUuid(cert.id);

      // 1. Ensure Parent Intern exists in Supabase
      const dbIntern = {
        id: validInternId,
        intern_code: cert.intern_code || 'HPS260038',
        full_name: cert.intern_name || 'Intern',
        gender: cert.gender || 'Female',
        email: cert.email || `${(cert.intern_name || 'intern').toLowerCase().replace(/\s+/g, '.')}@example.com`,
        department: cert.department || 'Software Development',
        internship_title: cert.internship_title || 'SDE Intern',
        duration: cert.duration || '3 Months',
        start_date: cert.start_date || '2026-05-16',
        end_date: cert.end_date || '2026-08-16',
        supervisor_name: cert.supervisor_name || 'Director'
      };
      await supabase.from('interns').upsert([dbIntern], { onConflict: 'id' });

      // 2. Upsert Certificate in Supabase
      const dbCert = {
        id: validCertId,
        certificate_number: cert.certificate_number,
        intern_id: validInternId,
        verification_token: cert.verification_token,
        issued_date: cert.issued_date || new Date().toISOString().split('T')[0],
        status: cert.status || 'VALID',
        pdf_path: cert.pdf_path || `certificates/2026/${cert.certificate_number.replace(/\//g, '_')}.pdf`,
        revocation_reason: cert.revocation_reason || null,
        revoked_at: cert.revoked_at || null,
        created_at: cert.created_at || new Date().toISOString()
      };
      await supabase.from('certificates').upsert([dbCert], { onConflict: 'id' });
    } catch (e) {
      console.warn('Sync certificate to Supabase failed', e);
    }
  },

  async getCertificates() {
    let localList = getStoredCertificates();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*, interns(*)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map((item) => {
            const internData = item.interns || {};
            return {
              ...item,
              intern_name: item.intern_name || internData.full_name || 'Intern',
              gender: item.gender || internData.gender || 'Female',
              intern_code: item.intern_code || internData.intern_code || '',
              department: item.department || internData.department || 'Software Development',
              internship_title: item.internship_title || internData.internship_title || 'SDE Intern',
              duration: item.duration || internData.duration || '3 Months',
              start_date: item.start_date || internData.start_date || '',
              end_date: item.end_date || internData.end_date || '',
              supervisor_name: item.supervisor_name || internData.supervisor_name || 'Director',
            };
          });

          // Sync local items into Supabase and merge
          const supabaseTokens = new Set(data.map((c) => c.verification_token));
          const localOnly = localList.filter((c) => !supabaseTokens.has(c.verification_token));

          for (const localCert of localOnly) {
            this.syncCertificateToSupabase(localCert).catch(() => {});
          }

          const merged = [...localOnly, ...formatted];
          saveStoredCertificates(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase certificates fetch failed', err);
      }
    }

    return localList;
  },

  async getCertificateByInternId(internId) {
    const list = await this.getCertificates();
    return list.find((c) => (c.intern_id === internId || toUuid(c.intern_id) === toUuid(internId)) && c.status === 'VALID') || null;
  },

  async getCertificateByToken(token) {
    if (!token) return null;
    let cleanToken = decodeURIComponent(token).trim();
    if (cleanToken.includes('/verify/')) {
      cleanToken = cleanToken.split('/verify/').pop().trim();
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*, interns(*)')
          .eq('verification_token', cleanToken)
          .single();

        if (!error && data) {
          const internData = data.interns || {};
          return {
            ...data,
            intern_name: data.intern_name || internData.full_name || 'Intern',
            gender: data.gender || internData.gender || 'Female',
            intern_code: data.intern_code || internData.intern_code || '',
            department: data.department || internData.department || 'Software Development',
            internship_title: data.internship_title || internData.internship_title || 'SDE Intern',
            duration: data.duration || internData.duration || '3 Months',
            start_date: data.start_date || internData.start_date || '',
            end_date: data.end_date || internData.end_date || '',
            supervisor_name: data.supervisor_name || internData.supervisor_name || 'Director',
          };
        }

        // Fallback simple query
        const { data: simpleData, error: simpleError } = await supabase
          .from('certificates')
          .select('*')
          .eq('verification_token', cleanToken)
          .single();

        if (!simpleError && simpleData) {
          return simpleData;
        }
      } catch (err) {
        console.warn('Supabase token fetch failed', err);
      }
    }

    const list = getStoredCertificates();
    const localMatch = list.find(
      (c) =>
        c.verification_token === cleanToken ||
        c.verification_token?.toLowerCase() === cleanToken.toLowerCase()
    );

    if (localMatch) {
      if (isSupabaseConfigured()) {
        this.syncCertificateToSupabase(localMatch).catch((e) =>
          console.warn('Auto-sync certificate failed', e)
        );
      }
      return localMatch;
    }

    return null;
  },

  async generateCertificate(intern) {
    const existing = await this.getCertificateByInternId(intern.id);
    if (existing) {
      throw new Error(`A valid HPS certificate (${existing.certificate_number}) already exists for this intern.`);
    }

    const list = getStoredCertificates();
    const nextCounter = list.length + 38;
    const certNumber = generateCertificateId(nextCounter);
    const empId = intern.intern_code || generateEmpId(nextCounter);
    const token = generateVerificationToken();
    const duration = intern.duration || calculateDuration(intern.start_date, intern.end_date);

    const certId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : toUuid('cert-' + Date.now());
    const validInternId = toUuid(intern.id);

    const newCert = {
      id: certId,
      certificate_number: certNumber,
      intern_id: validInternId,
      intern_name: intern.full_name || intern.intern_name,
      gender: intern.gender || 'Female',
      intern_code: empId,
      internship_title: intern.internship_title || 'SDE Intern',
      department: intern.department || 'Software Development',
      duration: duration,
      start_date: intern.start_date,
      end_date: intern.end_date,
      supervisor_name: intern.supervisor_name || 'Director',
      issued_date: new Date().toISOString().split('T')[0],
      verification_token: token,
      status: 'VALID',
      pdf_path: `certificates/${new Date().getFullYear()}/${certNumber.replace(/\//g, '_')}.pdf`,
      created_at: new Date().toISOString()
    };

    // Save locally immediately
    const updated = [newCert, ...list];
    saveStoredCertificates(updated);

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      await this.syncCertificateToSupabase(newCert);
    }

    await auditService.logAction(
      'CERTIFICATE_GENERATED',
      'CERTIFICATE',
      certNumber,
      `Generated HPS certificate for ${intern.full_name || intern.intern_name}`
    );

    return newCert;
  },

  async revokeCertificate(certId, reason) {
    const revokedAt = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const validId = toUuid(certId);
        await supabase
          .from('certificates')
          .update({
            status: 'REVOKED',
            revocation_reason: reason,
            revoked_at: revokedAt
          })
          .eq('id', validId);
      } catch (err) {
        console.warn('Supabase revoke failed', err);
      }
    }

    const list = getStoredCertificates();
    let revokedCert = null;
    const updated = list.map((c) => {
      if (c.id === certId || toUuid(c.id) === toUuid(certId)) {
        revokedCert = {
          ...c,
          status: 'REVOKED',
          revocation_reason: reason,
          revoked_at: revokedAt
        };
        return revokedCert;
      }
      return c;
    });

    saveStoredCertificates(updated);
    if (revokedCert) {
      await auditService.logAction(
        'CERTIFICATE_REVOKED',
        'CERTIFICATE',
        revokedCert.certificate_number,
        `Revoked certificate: ${reason}`
      );
    }
    return revokedCert;
  },

  async restoreCertificate(certId) {
    if (isSupabaseConfigured()) {
      try {
        const validId = toUuid(certId);
        await supabase
          .from('certificates')
          .update({
            status: 'VALID',
            revocation_reason: null,
            revoked_at: null
          })
          .eq('id', validId);
      } catch (err) {
        console.warn('Supabase restore failed', err);
      }
    }

    const list = getStoredCertificates();
    let restoredCert = null;
    const updated = list.map((c) => {
      if (c.id === certId || toUuid(c.id) === toUuid(certId)) {
        restoredCert = {
          ...c,
          status: 'VALID',
          revocation_reason: null,
          revoked_at: null
        };
        return restoredCert;
      }
      return c;
    });

    saveStoredCertificates(updated);
    if (restoredCert) {
      await auditService.logAction(
        'CERTIFICATE_RESTORED',
        'CERTIFICATE',
        restoredCert.certificate_number,
        `Restored revoked certificate back to VALID status`
      );
    }
    return restoredCert;
  }
};
