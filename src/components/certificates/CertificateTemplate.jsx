import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Award } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export function CertificateTemplate({ certificate, intern, verificationUrl, innerRef }) {
  const name = certificate?.intern_name || intern?.full_name || 'Sai Kumar';
  const title = certificate?.internship_title || intern?.internship_title || 'Full Stack Web Development';
  const dept = certificate?.department || intern?.department || 'Software Engineering';
  const startDate = formatDate(certificate?.start_date || intern?.start_date || '2026-06-01');
  const endDate = formatDate(certificate?.end_date || intern?.end_date || '2026-08-31');
  const certId = certificate?.certificate_number || 'CERT-2026-000124';
  const issuedDate = formatDate(certificate?.issued_date || new Date().toISOString());
  const supervisor = certificate?.supervisor_name || intern?.supervisor_name || 'Dr. Rajesh Sharma';

  const defaultUrl = verificationUrl || `${window.location.origin}/verify/${certificate?.verification_token || 'token-sai-kumar-2026-v1'}`;

  return (
    <div
      ref={innerRef}
      id="certificate-print-container"
      className="bg-white text-slate-900 border-[10px] border-slate-900 p-8 relative overflow-hidden select-none w-full aspect-[1.414/1] max-w-[850px] mx-auto shadow-2xl flex flex-col justify-between"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Decorative Brand Header Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-brand-500"></div>

      {/* Background Watermark Pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Award className="w-[500px] h-[500px] text-brand-500" />
      </div>

      {/* Header Section */}
      <div className="flex items-start justify-between relative z-10 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <img src="/favicon.png" alt="Company Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Certi<span className="text-brand-500">Flow</span> Technologies
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Official Internship Completion Certificate
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            ID: {certId}
          </span>
          <div className="text-[10px] text-slate-400 mt-1">Issue Date: {issuedDate}</div>
        </div>
      </div>

      {/* Certificate Main Body */}
      <div className="text-center py-6 my-auto relative z-10 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-slate-800">
          Certificate of Completion
        </h1>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          This is to certify that
        </p>

        <div className="py-2">
          <h2 className="text-3xl sm:text-4xl font-black text-brand-600 tracking-tight underline decoration-brand-200 underline-offset-8">
            {name}
          </h2>
        </div>

        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          has successfully completed the intensive internship program in{' '}
          <strong className="text-slate-900 font-bold">{title}</strong> under the{' '}
          <strong className="text-slate-900 font-bold">{dept}</strong> department from{' '}
          <span className="font-semibold text-slate-800">{startDate}</span> to{' '}
          <span className="font-semibold text-slate-800">{endDate}</span>.
        </p>
      </div>

      {/* Footer & QR Verification Section */}
      <div className="flex items-end justify-between pt-6 border-t border-slate-200 relative z-10">
        {/* Supervisor Signature */}
        <div className="text-center">
          <div className="w-36 border-b-2 border-slate-400 pb-1 mb-1 italic font-serif text-lg text-slate-800">
            {supervisor}
          </div>
          <div className="text-xs font-bold text-slate-700">{supervisor}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Supervisor / HR Manager</div>
        </div>

        {/* Official Security Stamp */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full border-2 border-brand-500 flex items-center justify-center text-brand-500 bg-brand-50 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 tracking-widest">
            Verified Document
          </span>
        </div>

        {/* QR Code & Scan Instructions */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <QRCodeSVG value={defaultUrl} size={64} level="H" />
          </div>
          <div className="text-left text-[10px] max-w-[120px]">
            <div className="font-bold text-slate-800 leading-tight">Scan to Verify</div>
            <div className="text-slate-500 text-[9px] mt-0.5 leading-snug">
              Authenticity verified via QR code scan or url.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
