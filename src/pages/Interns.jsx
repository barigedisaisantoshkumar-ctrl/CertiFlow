import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { AddInternModal } from './AddInternModal';
import { CertificatePreviewModal } from '../components/certificates/CertificatePreviewModal';
import { internService } from '../services/internService';
import { certificateService } from '../services/certificateService';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { calculateInternshipStatus, formatDate } from '../utils/helpers';
import { Search, Plus, Award, Edit, Trash2, ShieldCheck, Eye, Sparkles } from 'lucide-react';

export function Interns() {
  const [interns, setInterns] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);
  const [previewIntern, setPreviewIntern] = useState(null);
  const [isGeneratingCertId, setIsGeneratingCertId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadData = async () => {
    try {
      const [internsList, certsList] = await Promise.all([
        internService.getInterns(),
        certificateService.getCertificates()
      ]);
      setInterns(internsList);
      setCertificates(certsList);
    } catch (err) {
      console.error('Failed to load interns', err);
    }
  };

  useEffect(() => {
    loadData();

    // Cross-tab, Focus, & Visibility Sync
    const handleStorage = (e) => {
      if (!e.key || e.key === 'certiflow_hps_interns_v3' || e.key === 'certiflow_hps_certificates_v3') {
        loadData();
      }
    };
    const handleFocus = () => loadData();
    const handleVisibility = () => {
      if (!document.hidden) loadData();
    };

    const pollInterval = setInterval(loadData, 4000);

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel;
    if (isSupabaseConfigured()) {
      try {
        channel = supabase
          .channel('realtime-interns-page')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'interns' }, () => loadData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => loadData())
          .subscribe();
      } catch (e) {
        // ignore
      }
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      }
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleAddOrEditIntern = async (formData) => {
    if (editingIntern) {
      await internService.updateIntern(editingIntern.id, formData);
      showToast(`Updated intern record for ${formData.full_name}`);
    } else {
      await internService.createIntern(formData);
      showToast(`Successfully added HPS intern ${formData.full_name}`);
    }
    setEditingIntern(null);
    loadData();
  };

  const handleDeleteIntern = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete intern record for ${name}?`)) {
      await internService.deleteIntern(id);
      showToast(`Deleted intern record for ${name}`);
      loadData();
    }
  };

  const handleGenerateCertificate = async (intern) => {
    const status = calculateInternshipStatus(intern.start_date, intern.end_date);
    if (status !== 'COMPLETED') {
      alert('Certificates can only be generated for interns who have completed their internship duration.');
      return;
    }

    try {
      setIsGeneratingCertId(intern.id);
      const newCert = await certificateService.generateCertificate(intern);
      showToast(`Certificate ${newCert.certificate_number} generated successfully!`);
      await loadData();
      setPreviewCert(newCert);
      setPreviewIntern(intern);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGeneratingCertId(null);
    }
  };

  const handleViewCertificate = (intern, cert) => {
    setPreviewCert(cert);
    setPreviewIntern(intern);
  };

  // Filter Logic
  const filteredInterns = interns.filter((intern) => {
    const status = calculateInternshipStatus(intern.start_date, intern.end_date);
    const existingCert = certificates.find((c) => c.intern_id === intern.id && c.status === 'VALID');

    const matchesSearch =
      intern.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.intern_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.internship_title.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') return status === 'ACTIVE';
    if (statusFilter === 'COMPLETED') return status === 'COMPLETED';
    if (statusFilter === 'CERT_ISSUED') return !!existingCert;
    if (statusFilter === 'CERT_NOT_ISSUED') return !existingCert;

    return true;
  });

  // Reset pagination to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  // Paginated Interns
  const totalPages = Math.ceil(filteredInterns.length / pageSize) || 1;
  const paginatedInterns = filteredInterns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout title="HPS Intern Directory & Certificate Operations">
      <div className="space-y-5">
        {/* Toast Alert Banner */}
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
              placeholder="Search by EMP ID, name, email, role or department..."
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
                { value: 'ALL', label: 'All Interns' },
                { value: 'ACTIVE', label: 'Active Interns' },
                { value: 'COMPLETED', label: 'Completed Internships' },
                { value: 'CERT_ISSUED', label: 'Certificate Issued' },
                { value: 'CERT_NOT_ISSUED', label: 'Certificate Pending' },
              ]}
            />
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingIntern(null);
              setIsAddModalOpen(true);
            }}
          >
            Add New Intern
          </Button>
        </div>

        {/* Intern Directory Table */}
        <Card className="p-0 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-4">EMP ID / Name</th>
                  <th className="px-5 py-4">Gender</th>
                  <th className="px-5 py-4">Department & Role</th>
                  <th className="px-5 py-4">Period & Duration</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">HPS Certificate</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedInterns.length > 0 ? (
                  paginatedInterns.map((intern) => {
                    const status = calculateInternshipStatus(intern.start_date, intern.end_date);
                    const validCert = certificates.find((c) => c.intern_id === intern.id && c.status === 'VALID');

                    return (
                      <tr key={intern.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-slate-900">{intern.full_name}</div>
                          <div className="text-xs font-mono text-brand-600 font-bold mt-0.5">{intern.intern_code}</div>
                          <div className="text-[11px] text-slate-400">{intern.email}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                          {intern.gender || 'Female'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">{intern.internship_title}</div>
                          <div className="text-xs text-slate-500">{intern.department}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          <div>{formatDate(intern.start_date, 'DD-MM-YYYY')} to {formatDate(intern.end_date, 'DD-MM-YYYY')}</div>
                          <div className="text-brand-600 font-bold mt-0.5">{intern.duration || '3 Months'}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={status} type="internship" />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {validCert ? (
                            <button
                              onClick={() => handleViewCertificate(intern, validCert)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full transition-all shadow-2xs whitespace-nowrap shrink-0"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{validCert.certificate_number}</span>
                            </button>
                          ) : status === 'COMPLETED' ? (
                            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                              Eligible for HPS Certificate
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">In Progress</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            {validCert ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={Eye}
                                onClick={() => handleViewCertificate(intern, validCert)}
                                className="whitespace-nowrap"
                              >
                                View Cert
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                icon={Award}
                                disabled={status !== 'COMPLETED'}
                                isLoading={isGeneratingCertId === intern.id}
                                onClick={() => handleGenerateCertificate(intern)}
                                className="whitespace-nowrap"
                              >
                                Generate Cert
                              </Button>
                            )}

                            <button
                              onClick={() => {
                                setEditingIntern(intern);
                                setIsAddModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                              title="Edit Intern"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteIntern(intern.id, intern.full_name)}
                              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No intern records found matching search filters.
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
              totalItems={filteredInterns.length}
              itemName="interns"
            />
          </div>
        </Card>

        {/* Add/Edit Intern Modal */}
        <AddInternModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingIntern(null);
          }}
          onAddIntern={handleAddOrEditIntern}
          initialData={editingIntern}
        />

        {/* Certificate Preview Modal */}
        {previewCert && (
          <CertificatePreviewModal
            isOpen={!!previewCert}
            onClose={() => setPreviewCert(null)}
            certificate={previewCert}
            intern={previewIntern}
          />
        )}
      </div>
    </AppLayout>
  );
}
