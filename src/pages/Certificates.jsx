import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { CertificatePreviewModal } from '../components/certificates/CertificatePreviewModal';
import { RevokeModal } from './RevokeModal';
import { RestoreModal } from './RestoreModal';
import { certificateService } from '../services/certificateService';
import { formatDate } from '../utils/helpers';
import { Search, Eye, AlertOctagon, ShieldCheck, ShieldAlert, RotateCcw } from 'lucide-react';

export function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewCert, setPreviewCert] = useState(null);
  const [revokeCertTarget, setRevokeCertTarget] = useState(null);
  const [restoreCertTarget, setRestoreCertTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const handleRestore = async (certId) => {
    await certificateService.restoreCertificate(certId);
    showToast('Certificate was successfully restored to VALID status.');
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

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  // Paginated Certificates
  const totalPages = Math.ceil(filteredCertificates.length / pageSize) || 1;
  const paginatedCertificates = filteredCertificates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout title="Certificate Master Registry">
      <div className="space-y-5">
        {/* Notification Banner */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            {toastMessage}
          </div>
        )}

        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
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

        {/* Certificate Master Table */}
        <Card className="p-0 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-4">Certificate Number</th>
                  <th className="px-5 py-4">Intern Name</th>
                  <th className="px-5 py-4">Internship Program</th>
                  <th className="px-5 py-4">Issued Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedCertificates.length > 0 ? (
                  paginatedCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-slate-900 font-mono flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-brand-500" />
                          {cert.certificate_number}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                          Token: {cert.verification_token}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{cert.intern_name}</div>
                        <div className="text-xs text-slate-400">{cert.department}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-800 font-medium">{cert.internship_title}</div>
                        <div className="text-xs text-slate-400">
                          {formatDate(cert.start_date, 'DD-MM-YYYY')} – {formatDate(cert.end_date, 'DD-MM-YYYY')}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-700">
                        {formatDate(cert.issued_date, 'DD/MM/YYYY')}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={cert.status} type="certificate" />
                        {cert.status === 'REVOKED' && cert.revocation_reason && (
                          <div className="text-[10px] text-rose-600 mt-1 max-w-[160px] truncate" title={cert.revocation_reason}>
                            Reason: {cert.revocation_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => setPreviewCert(cert)}
                            className="whitespace-nowrap"
                          >
                            View & Print
                          </Button>

                          {cert.status === 'VALID' ? (
                            <button
                              onClick={() => setRevokeCertTarget(cert)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                              title="Revoke Certificate"
                            >
                              <AlertOctagon className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setRestoreCertTarget(cert)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0"
                              title="Restore Certificate back to Valid access"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Make Normal</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No certificates found matching search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-white border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredCertificates.length}
              itemName="certificates"
            />
          </div>
        </Card>

        {/* Modals */}
        {previewCert && (
          <CertificatePreviewModal
            isOpen={!!previewCert}
            onClose={() => setPreviewCert(null)}
            certificate={previewCert}
          />
        )}

        {revokeCertTarget && (
          <RevokeModal
            isOpen={!!revokeCertTarget}
            onClose={() => setRevokeCertTarget(null)}
            certificate={revokeCertTarget}
            onRevoke={handleRevoke}
          />
        )}

        {restoreCertTarget && (
          <RestoreModal
            isOpen={!!restoreCertTarget}
            onClose={() => setRestoreCertTarget(null)}
            certificate={restoreCertTarget}
            onRestore={handleRestore}
          />
        )}
      </div>
    </AppLayout>
  );
}
