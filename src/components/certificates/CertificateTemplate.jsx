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
  const supervisor = certificate?.supervisor_name || intern?.supervisor_name || 'Director';

  // Dynamic QR Code target URL for public verification
  const defaultUrl = verificationUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`
    : `https://certiflow.com/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`);

  return (
    <div
      ref={innerRef}
      id="certificate-print-container"
      className="bg-white text-slate-900 border-[3px] border-[#0A2540] p-10 relative overflow-hidden select-none w-[950px] h-[672px] flex flex-col justify-between shrink-0"
      style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}
    >
      {/* 1. Top-Left Corner Shape */}
      <img
        src="/hps-template/hps_top-removebg-preview.png"
        alt=""
        className="absolute top-0 left-0 w-[21%] h-auto pointer-events-none z-0"
      />

      {/* 2. Bottom-Right Corner Shape */}
      <img
        src="/hps-template/hps_bottom-removebg-preview.png"
        alt=""
        className="absolute bottom-0 right-[-1px] w-[22%] h-auto pointer-events-none z-0"
      />

      {/* 3. Top Header with HPS Logo */}
      <div className="flex flex-col items-center justify-center relative z-10 pt-1">
        <img
          src="/hps-template/hps_logo.png"
          alt="HPS HARSHA PERFECT SOLUTIONS Logo"
          className="h-20 w-auto object-contain mx-auto"
        />
      </div>

      {/* 4. Main Certificate Title & Dynamic Recipient Section */}
      <div className="text-center py-2 my-auto relative z-10 space-y-3">
        {/* Title & Central Blue Diamond Divider Line */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black uppercase tracking-[0.18em] text-[#0A2540] leading-none">
            CERTIFICATE OF INTERNSHIP
          </h1>
          <div className="flex items-center justify-center gap-3 w-64 mx-auto my-1.5 h-3">
            <div className="h-[1.5px] bg-[#2C91E3] flex-1"></div>
            <div className="w-2.5 h-2.5 bg-[#0A2540] rotate-45 shrink-0"></div>
            <div className="h-[1.5px] bg-[#2C91E3] flex-1"></div>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-700 tracking-wide leading-normal">
          This internship program certificate is proudly awarded to
        </p>

        {/* Dynamic Recipient Name & Underline */}
        <div className="py-1">
          <h2 className="text-4xl font-extrabold text-[#0A2540] tracking-wider uppercase font-serif">
            {name}
          </h2>
          <div className="w-80 h-[1.5px] bg-[#2C91E3] mx-auto mt-2"></div>
        </div>

        {/* Dynamic Body Paragraph */}
        <p className="text-xs text-slate-800 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
          For <strong className="text-slate-950 font-bold">{pronoun}</strong> successful completion of the{' '}
          <strong className="text-[#2C91E3] font-bold">{role} Internship Program</strong> at{' '}
          <strong className="text-slate-950 font-bold">HPS (OPC) Pvt. Ltd.</strong>, demonstrating outstanding dedication,
          strong work ethic and valuable contributions to software development projects.
        </p>

        {/* Dynamic Period & Duration Box */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-3 border border-[#94A3B8] px-5 py-1.5 rounded-xs bg-white text-xs font-semibold text-slate-800 shadow-2xs">
            <div>
              <span className="text-[#2C91E3] font-bold">Internship Period: </span>
              <span className="font-bold text-slate-900">{startDate} to {endDate}</span>
            </div>
            <span className="text-slate-400">|</span>
            <div>
              <span className="text-[#2C91E3] font-bold">Duration: </span>
              <span className="font-bold text-slate-900">{duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Metadata List, QR Code Box, and Director Signature */}
      <div className="pt-2 grid grid-cols-12 gap-2 items-end relative z-10">
        {/* Left Column: Metadata Details List */}
        <div className="col-span-5 text-xs font-semibold text-slate-800 space-y-1 pl-2">
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-[#0A2540] font-bold">Department</span>
            <span>:</span>
            <strong className="text-slate-950 font-bold">{dept}</strong>
          </div>
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-[#0A2540] font-bold">Role</span>
            <span>:</span>
            <strong className="text-slate-950 font-bold">{role}</strong>
          </div>
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-[#0A2540] font-bold">Certificate No.</span>
            <span>:</span>
            <strong className="text-slate-950 font-bold font-mono">{certId}</strong>
          </div>
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-[#0A2540] font-bold">EMP ID</span>
            <span>:</span>
            <strong className="text-slate-950 font-bold font-mono">{empId}</strong>
          </div>
          <div className="grid grid-cols-[110px_10px_1fr] items-center">
            <span className="text-[#0A2540] font-bold">Date of Issue</span>
            <span>:</span>
            <strong className="text-slate-950 font-bold">{issueDate}</strong>
          </div>
        </div>

        {/* Center Column: Unique Dynamic QR Code Box below "Scan to Verify Certificate" */}
        <div className="col-span-3 flex flex-col items-center justify-end">
          <div className="text-[10px] font-bold text-slate-700 tracking-tight mb-1">
            Scan to Verify Certificate
          </div>
          <div className="border border-[#D97706] bg-white p-1 rounded-2xs shadow-2xs">
            <QRCodeSVG
              value={defaultUrl}
              size={64}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Right Column: Director Signature */}
        <div className="col-span-4 flex flex-col items-center justify-end text-center pr-14 relative z-10">
          <img
            src="/hps-template/signature.png"
            alt="Director Signature"
            className="h-16 w-auto mx-auto object-contain mb-1"
          />
          <div className="w-36 h-[1.5px] bg-[#0A2540] my-1 mx-auto"></div>
          <div className="text-xs font-bold text-[#0A2540] leading-tight">
            {supervisor}
          </div>
        </div>
      </div>
    </div>
  );
}
