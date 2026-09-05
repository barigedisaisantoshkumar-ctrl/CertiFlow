import React, { useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CertificateTemplate } from './CertificateTemplate';
import { Download, Printer, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function CertificatePreviewModal({ isOpen, onClose, certificate, intern }) {
  const certRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const verificationUrl = `${window.location.origin}/verify/${certificate?.verification_token || ''}`;

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
      pdf.save(`${certificate?.certificate_number?.replace(/\//g, '_') || 'Certificate'}.pdf`);
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
      <div className="space-y-5">
        {/* Crisp High-Res Certificate Container */}
        <div className="overflow-x-auto p-1 sm:p-2">
          <div className="min-w-[700px] md:min-w-0 mx-auto">
            <CertificateTemplate
              innerRef={certRef}
              certificate={certificate}
              intern={intern}
              verificationUrl={verificationUrl}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Verification Token:</span>
            <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono border border-slate-200 truncate">
              {certificate?.verification_token || 'N/A'}
            </code>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-xl border border-brand-200 transition-colors flex-1 sm:flex-initial whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Route</span>
            </a>

            <Button variant="secondary" icon={Printer} onClick={handlePrint} className="flex-1 sm:flex-initial">
              Print
            </Button>

            <Button
              variant="primary"
              icon={Download}
              isLoading={isGenerating}
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-initial"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
