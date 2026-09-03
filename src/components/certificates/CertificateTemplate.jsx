import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, getPronoun, calculateDuration } from '../../utils/helpers';

export function CertificateTemplate({ certificate, intern, verificationUrl, innerRef }) {
  const name = (certificate?.intern_name || intern?.full_name || 'DIPIKA REDDY RAGIPINDI').toUpperCase();
  const gender = certificate?.gender || intern?.gender || 'Female';
  const pronoun = getPronoun(gender);
  
  const role = certificate?.internship_title || intern?.internship_title || 'Software Development Engineer (SDE)';
  const dept = certificate?.department || intern?.department || 'Software Development';
  const duration = certificate?.duration || intern?.duration || calculateDuration(certificate?.start_date || intern?.start_date, certificate?.end_date || intern?.end_date) || '3 Months';
  
  const startDate = formatDate(certificate?.start_date || intern?.start_date || '2026-05-16', 'DD-MM-YYYY');
  const endDate = formatDate(certificate?.end_date || intern?.end_date || '2026-08-16', 'DD-MM-YYYY');
  
  const certId = certificate?.certificate_number || 'HPS/INT/2026/0038';
  const empId = certificate?.intern_code || intern?.intern_code || 'HPS260038';
  const issueDate = formatDate(certificate?.issued_date || new Date().toISOString(), 'DD/MM/YYYY');

  // Dynamic QR Code target URL for public verification
  const defaultUrl = verificationUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`
    : `https://certiflow.com/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`);

  return (
    <div
      ref={innerRef}
      id="certificate-print-container"
      className="bg-white text-slate-900 relative overflow-hidden select-none w-full aspect-[1.414/1] max-w-[950px] mx-auto shadow-2xl rounded-sm"
      style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
    >
      {/* 1. Authentic Master Canva Background Image Template */}
      <img
        src="/hps-template/hps_master_blank_template.png"
        alt="HPS Official Certificate Template"
        className="w-full h-full object-cover absolute inset-0 z-0 pointer-events-none"
      />

      {/* 2. Pixel-Perfect Dynamic Overlay Layer */}
      <div className="absolute inset-0 z-10">

        {/* Dynamic Recipient Name */}
        <div className="absolute top-[41.5%] left-[10%] right-[10%] text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E293B] tracking-wider uppercase font-serif">
            {name}
          </h2>
        </div>

        {/* Dynamic Body Paragraph Overlay */}
        <div className="absolute top-[51.8%] left-[10%] right-[10%] text-center px-4">
          <p className="text-[11px] sm:text-[13px] text-slate-800 leading-relaxed font-semibold">
            For <strong className="text-slate-950 font-bold">{pronoun}</strong> successful completion of the{' '}
            <strong className="text-[#2C91E3] font-extrabold">{role} Internship Program</strong> at{' '}
            <strong className="text-slate-950 font-bold">HPS (OPC) Pvt. Ltd.</strong>, demonstrating outstanding dedication,
            strong work ethic and valuable contributions to software development projects.
          </p>
        </div>

        {/* Dynamic Period & Duration (Inside Period Box) */}
        <div className="absolute top-[64.6%] left-[38%] right-[29%] text-left">
          <div className="text-[11px] sm:text-xs font-bold text-slate-900 flex items-center gap-2">
            <span className="text-[#2C91E3]">Internship Period:</span>
            <span>{startDate} to {endDate}</span>
            <span className="text-slate-400">|</span>
            <span className="text-[#2C91E3]">Duration:</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Dynamic Metadata List (Left Column) */}
        {/* Department Value */}
        <div className="absolute top-[72.2%] left-[20.8%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-950">{dept}</strong>
        </div>

        {/* Role Value */}
        <div className="absolute top-[76.4%] left-[20.8%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-950">{role}</strong>
        </div>

        {/* Certificate No. Value */}
        <div className="absolute top-[80.7%] left-[20.8%]">
          <strong className="text-xs sm:text-sm font-bold font-mono text-slate-950">{certId}</strong>
        </div>

        {/* EMP ID Value */}
        <div className="absolute top-[85.0%] left-[20.8%]">
          <strong className="text-xs sm:text-sm font-bold font-mono text-slate-950">{empId}</strong>
        </div>

        {/* Date of Issue Value */}
        <div className="absolute top-[89.2%] left-[20.8%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-950">{issueDate}</strong>
        </div>

        {/* Dynamic Unique QR Code (Positioned Inside the Gold Box) */}
        <div className="absolute top-[76.2%] left-[44.8%] w-[8.8%] aspect-square flex items-center justify-center">
          <div className="bg-white p-1 rounded-xs shadow-2xs w-full h-full flex items-center justify-center">
            <QRCodeSVG
              value={defaultUrl}
              size={64}
              level="H"
              includeMargin={false}
              className="w-full h-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
