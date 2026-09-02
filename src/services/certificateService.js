import { INITIAL_CERTIFICATES } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateCertificateId, generateVerificationToken, generateEmpId, calculateDuration } from '../utils/helpers';
import { auditService } from './auditService';

const STORAGE_KEY = 'certiflow_hps_certificates_v3';

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
      throw new Error(`A valid HPS certificate (${existing.certificate_number}) already exists for this intern.`);
    }

    const list = getStoredCertificates();
    const nextCounter = list.length + 38;
    const certNumber = generateCertificateId(nextCounter);
    const empId = intern.intern_code || generateEmpId(nextCounter);
    const token = generateVerificationToken();
    const duration = intern.duration || calculateDuration(intern.start_date, intern.end_date);

    const newCert = {
      id: 'cert-' + Date.now(),
      certificate_number: certNumber,
      intern_id: intern.id,
      intern_name: intern.full_name,
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('certificates').insert([newCert]).select().single();
        if (!error && data) {
          await auditService.logAction('CERTIFICATE_GENERATED', 'CERTIFICATE', certNumber, `Generated HPS certificate for ${intern.full_name}`);
          return data;
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing locally', err);
      }
    }

    const updated = [newCert, ...list];
    saveStoredCertificates(updated);
    await auditService.logAction('CERTIFICATE_GENERATED', 'CERTIFICATE', certNumber, `Generated HPS certificate for ${intern.full_name}`);
    return newCert;
  }
};
