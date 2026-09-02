import React, { useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CertificateTemplate } from './CertificateTemplate';
import { Download, Printer, ExternalLink, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function CertificatePreviewModal({ isOpen, onClose, certificate, intern }) {
  const certRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const verificationUrl = `${window.location.origin}/verify/${certificate?.verification_token || 'token-sai-kumar-2026-v1'}`;

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsGenerating(true);
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
      pdf.save(`${certificate?.certificate_number || 'Certificate'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Could not download PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Certificate Preview & Verification" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Certificate Rendering Area */}
        <div className="overflow-x-auto p-2 bg-slate-100/60 rounded-xl border border-slate-200">
          <CertificateTemplate
            innerRef={certRef}
            certificate={certificate}
            intern={intern}
            verificationUrl={verificationUrl}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Public Verification Token:</span>
            <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono border border-slate-200">
              {certificate?.verification_token || 'token-sai-kumar-2026-v1'}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg border border-brand-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Verification Route
            </a>

            <Button variant="secondary" icon={Printer} onClick={handlePrint}>
              Print
            </Button>

            <Button
              variant="primary"
              icon={Download}
              isLoading={isGenerating}
              onClick={handleDownloadPdf}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
