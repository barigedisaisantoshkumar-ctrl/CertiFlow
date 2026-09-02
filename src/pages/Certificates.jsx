import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CertificatePreviewModal } from '../components/certificates/CertificatePreviewModal';
import { RevokeModal } from './RevokeModal';
import { certificateService } from '../services/certificateService';
import { formatDate } from '../utils/helpers';
import { Search, Eye, AlertOctagon, ShieldCheck, ShieldAlert, Download } from 'lucide-react';

export function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCert, setSelectedCert] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);
  const [revokeCertTarget, setRevokeCertTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadCertificates = async () => {
    try {
      const list = await certificateService.getCertificates();
      setCertificates(list);
    } catch (err) {
      console.error('Failed to load certificates', err);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleRevoke = async (certId, reason) => {
    await certificateService.revokeCertificate(certId, reason);
    showToast('Certificate was successfully revoked.');
    loadCertificates();
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.intern_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'VALID') return cert.status === 'VALID';
    if (statusFilter === 'REVOKED') return cert.status === 'REVOKED';
    return true;
  });

  return (
    <AppLayout title="Certificate Master Registry">
      <div className="space-y-6">
        {/* Notification Banner */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            {toastMessage}
          </div>
        )}

        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search by Certificate ID, Intern Name or Dept..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
              options={[
                { value: 'ALL', label: 'All Certificates' },
                { value: 'VALID', label: 'Valid Only' },
                { value: 'REVOKED', label: 'Revoked Only' },
              ]}
            />
          </div>
        </div>

        {/* Certificate Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-4 py-3.5">Certificate Number</th>
                  <th className="px-4 py-3.5">Intern Name</th>
                  <th className="px-4 py-3.5">Internship Program</th>
                  <th className="px-4 py-3.5">Issued Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-brand-500" />
                          {cert.certificate_number}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                          Token: {cert.verification_token}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{cert.intern_name}</div>
                        <div className="text-xs text-slate-400">{cert.department}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-800 font-medium">{cert.internship_title}</div>
                        <div className="text-xs text-slate-400">
                          {formatDate(cert.start_date)} – {formatDate(cert.end_date)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-700">
                        {formatDate(cert.issued_date)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={cert.status} type="certificate" />
                        {cert.status === 'REVOKED' && cert.revocation_reason && (
                          <div className="text-[10px] text-rose-600 mt-1 max-w-[160px] truncate" title={cert.revocation_reason}>
                            Reason: {cert.revocation_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => setPreviewCert(cert)}
                          >
                            Preview
                          </Button>

                          {cert.status === 'VALID' && (
                            <Button
                              variant="danger"
                              size="sm"
                              icon={AlertOctagon}
                              onClick={() => setRevokeCertTarget(cert)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No certificate records match the given criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Certificate Preview Modal */}
        {previewCert && (
          <CertificatePreviewModal
            isOpen={!!previewCert}
            onClose={() => setPreviewCert(null)}
            certificate={previewCert}
          />
        )}

        {/* Certificate Revocation Modal */}
        {revokeCertTarget && (
          <RevokeModal
            isOpen={!!revokeCertTarget}
            onClose={() => setRevokeCertTarget(null)}
            certificate={revokeCertTarget}
            onRevoke={handleRevoke}
          />
        )}
      </div>
    </AppLayout>
  );
}
