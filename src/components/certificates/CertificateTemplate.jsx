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

  // Unique QR Code URL encoding the public verification route
  const defaultUrl = verificationUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`
    : `https://certiflow.com/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`);

  return (
    <div
      ref={innerRef}
      id="certificate-print-container"
      className="bg-white text-slate-900 relative overflow-hidden select-none w-full aspect-[1.414/1] max-w-[900px] mx-auto shadow-2xl rounded-sm"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Official Canva HPS Clean Background Template Image */}
      <img
        src="/hps-template/hps_clean_template.png"
        alt="HPS Certificate Template"
        className="w-full h-full object-cover absolute inset-0 z-0 pointer-events-none"
      />

      {/* Dynamic Overlay Fields (Pixel-Aligned to HPS Template.png) */}
      <div className="absolute inset-0 z-10">

        {/* 1. Recipient Full Name */}
        <div className="absolute top-[44%] left-[15%] right-[15%] text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-[#2C91E3] tracking-tight uppercase">
            {name}
          </h2>
        </div>

        {/* 2. Dynamic Paragraph */}
        <div className="absolute top-[52.5%] left-[12%] right-[12%] text-center">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            For <strong className="text-slate-900 font-bold">{pronoun}</strong> successful completion of the{' '}
            <strong className="text-slate-900 font-bold">{role}</strong> Internship Program at{' '}
            <strong className="text-slate-900 font-bold">HPS (OPC) Pvt. Ltd.</strong>, demonstrating outstanding dedication,
            strong work ethic and valuable contributions to software development projects.
          </p>
        </div>

        {/* 3. Dates & Duration */}
        <div className="absolute top-[63%] left-[15%] right-[15%] text-center">
          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm font-bold text-slate-800">
            <div>
              <span className="text-slate-500 font-medium">Internship Period: </span>
              <span className="font-extrabold text-slate-900">{startDate} to {endDate}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div>
              <span className="text-slate-500 font-medium">Duration: </span>
              <span className="font-extrabold text-slate-900">{duration}</span>
            </div>
          </div>
        </div>

        {/* 4. Metadata Values Grid Overlay */}
        {/* Department Value */}
        <div className="absolute top-[72.8%] left-[21.5%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-900">{dept}</strong>
        </div>

        {/* Role Value */}
        <div className="absolute top-[78.2%] left-[16.5%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-900">{role}</strong>
        </div>

        {/* Date of Issue Value */}
        <div className="absolute top-[83.2%] left-[22.5%]">
          <strong className="text-xs sm:text-sm font-bold text-slate-900">{issueDate}</strong>
        </div>

        {/* Certificate No. Value */}
        <div className="absolute top-[72.8%] left-[47.5%]">
          <strong className="text-xs sm:text-sm font-mono font-black text-[#0A2540]">{certId}</strong>
        </div>

        {/* EMP ID Value */}
        <div className="absolute top-[78.2%] left-[43.5%]">
          <strong className="text-xs sm:text-sm font-mono font-black text-[#0A2540]">{empId}</strong>
        </div>

        {/* 5. Dynamic Unique QR Code inside the SCAN VERIFY CERTIFICATE Box */}
        <div className="absolute top-[77.5%] left-[78%] w-[10.5%] aspect-square flex items-center justify-center">
          <div className="bg-white p-1 rounded-lg shadow-2xs">
            <QRCodeSVG
              value={defaultUrl}
              size={56}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
