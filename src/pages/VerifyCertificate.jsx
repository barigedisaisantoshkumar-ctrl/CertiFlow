import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import { formatDate } from '../utils/helpers';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Award, 
  UserCheck,
  Download,
  Printer,
  ExternalLink
} from 'lucide-react';
import { CertificateTemplate } from '../components/certificates/CertificateTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function VerifyCertificate() {
  const { token } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullCertificate, setShowFullCertificate] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    async function verifyToken() {
      setLoading(true);
      try {
        const cert = await certificateService.getCertificateByToken(token);
        setCertificate(cert);
      } catch (err) {
        console.error('Error verifying certificate token', err);
      } finally {
        setLoading(false);
      }
    }
    verifyToken();
  }, [token]);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificate?.certificate_number || 'Verified_Certificate'}.pdf`);
    } catch (err) {
      console.error('Download error', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans selection:bg-brand-500 selection:text-white flex flex-col justify-between p-4 sm:p-6 md:p-10">
      {/* Top Branding Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <img src="/favicon.png" alt="CertiFlow" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
              Certi<span className="text-brand-500">Flow</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Public Certificate Verification
            </span>
          </div>
        </div>

        <Link
          to="/login"
          className="text-xs font-bold text-slate-500 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200 bg-white transition-colors"
        >
          Company Login
        </Link>
      </header>

      {/* Main Verification Container */}
      <main className="max-w-3xl w-full mx-auto my-8">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm font-semibold text-slate-600">Verifying Certificate Authenticity...</p>
          </div>
        ) : !certificate ? (
          /* NOT FOUND / INVALID TOKEN CARD */
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 text-center shadow-lg space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Certificate Not Found</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              The verification token provided could not be matched with an issued certificate in our record system. Please double check the QR code or link URL.
            </p>
            <div className="pt-4 text-xs text-slate-400 font-mono">Token: {token}</div>
          </div>
        ) : certificate.status === 'REVOKED' ? (
          /* REVOKED CERTIFICATE CARD */
          <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden shadow-xl animate-in fade-in">
            <div className="bg-rose-600 text-white p-6 flex items-center gap-4">
              <ShieldAlert className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                  Status: Revoked
                </span>
                <h2 className="text-2xl font-black tracking-tight mt-1">⚠ CERTIFICATE REVOKED</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/70 p-4 rounded-xl border border-rose-100 text-rose-900 font-medium">
                This certificate (ID: <strong>{certificate.certificate_number}</strong>) was previously issued to <strong>{certificate.intern_name}</strong> but is <strong>no longer valid</strong> as it has been officially revoked by the issuing authority.
              </p>

              {certificate.revocation_reason && (
                <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800">Revocation Reason:</span> {certificate.revocation_reason}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Certificate ID</div>
                  <div className="font-bold font-mono text-slate-900 mt-0.5">{certificate.certificate_number}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Intern Name</div>
                  <div className="font-bold text-slate-900 mt-0.5">{certificate.intern_name}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VALID VERIFIED CERTIFICATE CARD */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl animate-in fade-in">
            {/* Verified Banner */}
            <div className="bg-emerald-600 text-white p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                    Official Authenticated Record
                  </span>
                  <h2 className="text-2xl font-black tracking-tight mt-0.5">✓ VERIFIED CERTIFICATE</h2>
                </div>
              </div>

              <div className="text-right font-mono text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                {certificate.certificate_number}
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Intern Name</span>
                  <div className="text-xl font-black text-slate-900">{certificate.intern_name}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internship Title</span>
                  <div className="text-lg font-bold text-brand-600">{certificate.internship_title}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</span>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {certificate.department}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Internship Duration</span>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(certificate.start_date)} – {formatDate(certificate.end_date)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Issued By</span>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-400" />
                    CertiFlow Technologies
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Supervisor / Signatory</span>
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    {certificate.supervisor_name}
                  </div>
                </div>
              </div>

              {/* Actions & Toggle View */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setShowFullCertificate(!showFullCertificate)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg border border-brand-200 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  {showFullCertificate ? 'Hide Full Certificate Layout' : 'View Full Certificate Document'}
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF'}
                </button>
              </div>

              {/* Full Certificate Visual Preview Toggle */}
              {showFullCertificate && (
                <div className="pt-4 border-t border-slate-100 animate-in fade-in">
                  <div className="overflow-x-auto p-2 bg-slate-100 rounded-xl border border-slate-200">
                    <CertificateTemplate
                      innerRef={certRef}
                      certificate={certificate}
                      verificationUrl={window.location.href}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-4 border-t border-slate-200 text-xs text-slate-400">
        <p>© 2026 CertiFlow Internship Certificate System. All rights reserved.</p>
      </footer>
    </div>
  );
}
