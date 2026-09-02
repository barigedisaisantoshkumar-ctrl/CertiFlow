import { INITIAL_CERTIFICATES } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateCertificateId, generateVerificationToken } from '../utils/helpers';
import { auditService } from './auditService';

const STORAGE_KEY = 'certiflow_certificates';

const getStoredCertificates = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  }
  return JSON.parse(data);
};

const saveStoredCertificates = (certs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
};

export const certificateService = {
  async getCertificates() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase certificates fetch failed', err);
      }
    }
    return getStoredCertificates();
  },

  async getCertificateByInternId(internId) {
    const list = await this.getCertificates();
    return list.find((c) => c.intern_id === internId && c.status === 'VALID') || null;
  },

  async getCertificateByToken(token) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('verification_token', token)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase token fetch failed', err);
      }
    }
    const list = getStoredCertificates();
    return list.find((c) => c.verification_token === token) || null;
  },

  async generateCertificate(intern) {
    const existing = await this.getCertificateByInternId(intern.id);
    if (existing) {
      throw new Error(`A valid certificate (${existing.certificate_number}) already exists for this intern.`);
    }

    const list = getStoredCertificates();
    const nextCounter = list.length + 125;
    const certNumber = generateCertificateId(nextCounter);
    const token = generateVerificationToken();

    const newCert = {
      id: 'cert-' + Date.now(),
      certificate_number: certNumber,
      intern_id: intern.id,
      intern_name: intern.full_name,
      internship_title: intern.internship_title,
      department: intern.department,
      start_date: intern.start_date,
      end_date: intern.end_date,
      supervisor_name: intern.supervisor_name || 'Authorized Signatory',
      issued_date: new Date().toISOString().split('T')[0],
      verification_token: token,
      status: 'VALID',
      pdf_path: `certificates/${new Date().getFullYear()}/${certNumber}.pdf`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('certificates').insert([newCert]).select().single();
        if (!error && data) {
          await auditService.logAction('CERTIFICATE_GENERATED', 'CERTIFICATE', certNumber, `Generated certificate for ${intern.full_name}`);
          return data;
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing locally', err);
      }
    }

    const updated = [newCert, ...list];
    saveStoredCertificates(updated);
    await auditService.logAction('CERTIFICATE_GENERATED', 'CERTIFICATE', certNumber, `Generated certificate for ${intern.full_name}`);
    return newCert;
  },

  async revokeCertificate(certificateId, reason) {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('certificates')
          .update({
            status: 'REVOKED',
            revocation_reason: reason,
            revoked_at: new Date().toISOString()
          })
          .eq('id', certificateId);
      } catch (err) {
        console.warn('Supabase revoke failed', err);
      }
    }

    const list = getStoredCertificates();
    const updated = list.map((c) => {
      if (c.id === certificateId) {
        auditService.logAction('CERTIFICATE_REVOKED', 'CERTIFICATE', c.certificate_number, `Revoked certificate: ${reason}`);
        return {
          ...c,
          status: 'REVOKED',
          revocation_reason: reason,
          revoked_at: new Date().toISOString()
        };
      }
      return c;
    });
    saveStoredCertificates(updated);
    return updated.find((c) => c.id === certificateId);
  }
};
