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

  // Dynamic QR Code URL encoding the public verification route
  const defaultUrl = verificationUrl || (typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`
    : `https://certiflow.com/verify/${certificate?.verification_token || 'token-dipika-reddy-2026-v1'}`);

  return (
    <div
      ref={innerRef}
      id="certificate-print-container"
      className="bg-white text-slate-900 border-[10px] border-[#0C2340] p-8 sm:p-10 relative overflow-hidden select-none w-full aspect-[1.414/1] max-w-[900px] mx-auto shadow-2xl flex flex-col justify-between"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Geometric Decorative Corner Triangles (Top Left & Bottom Right matching Canva HPS Template) */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#2C91E3]/20 rotate-45 pointer-events-none"></div>
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-[#0C2340]/10 rotate-45 pointer-events-none"></div>
      
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#2C91E3]/20 rotate-45 pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-[#0C2340]/10 rotate-45 pointer-events-none"></div>

      {/* Subtle Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <img src="/hps-template/hps_logo.png" alt="Watermark" className="w-96 h-auto grayscale" />
      </div>

      {/* 1. Header Section */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-4 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src="/hps-template/hps_logo.png"
            alt="HPS Logo"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h3 className="text-xl font-black tracking-tight text-[#0C2340] leading-none">
              HPS (OPC) Pvt. Ltd.
            </h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
              SOFTWARE DEVELOPMENT & IT SOLUTIONS PROVIDER
            </p>
          </div>
        </div>

        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#0C2340] bg-[#EBF5FF] px-4 py-1.5 rounded-full border border-[#BDE0FE] shadow-2xs">
            OFFICIAL CERTIFICATE
          </span>
        </div>
      </div>

      {/* 2. Main Certificate Body */}
      <div className="text-center py-4 my-auto relative z-10 space-y-3">
        <div className="inline-block">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.25em] text-[#0C2340]">
            CERTIFICATE OF INTERNSHIP
          </h1>
          <div className="w-48 h-0.5 bg-[#2C91E3] mx-auto mt-1 rounded-full"></div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">
          THIS INTERNSHIP PROGRAM CERTIFICATE IS PROUDLY AWARDED TO
        </p>

        {/* Recipient Full Name */}
        <div className="py-1">
          <h2 className="text-2xl sm:text-4xl font-black text-[#2C91E3] tracking-tight uppercase">
            {name}
          </h2>
        </div>

        {/* Dynamic Body Paragraph */}
        <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed px-4">
          For <strong className="text-slate-900 font-bold">{pronoun}</strong> successful completion of the{' '}
          <strong className="text-slate-900 font-bold">{role}</strong> Internship Program at{' '}
          <strong className="text-slate-900 font-bold">HPS (OPC) Pvt. Ltd.</strong>, demonstrating outstanding dedication,
          strong work ethic and valuable contributions to software development projects.
        </p>

        {/* Period & Duration */}
        <div className="pt-2 flex items-center justify-center gap-6 text-xs sm:text-sm font-bold text-slate-800">
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

      {/* 3. Bottom Grid: Details Table, Signature, and QR Code below "SCAN VERIFY CERTIFICATE" */}
      <div className="pt-4 border-t border-slate-200/90 grid grid-cols-3 gap-4 items-end relative z-10">
        {/* Metadata Grid Table */}
        <div className="col-span-2 text-xs bg-[#F4F8FC] p-3.5 rounded-2xl border border-[#E0ECF8] shadow-2xs">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <span className="font-semibold text-slate-500">Department: </span>
              <strong className="text-slate-900 font-bold">{dept}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Certificate No.: </span>
              <strong className="text-[#0C2340] font-mono font-black">{certId}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Role: </span>
              <strong className="text-slate-900 font-bold">{role}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500">EMP ID: </span>
              <strong className="text-[#0C2340] font-mono font-black">{empId}</strong>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-slate-500">Date of Issue: </span>
              <strong className="text-slate-900 font-bold">{issueDate}</strong>
            </div>
          </div>
        </div>

        {/* Director Signature & Dedicated QR Box */}
        <div className="flex items-center justify-end gap-3.5">
          {/* Director Signature Block */}
          <div className="text-center">
            <img
              src="/hps-template/director_signature.png"
              alt="Director Signature"
              className="h-10 w-auto mx-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="text-xs font-black text-slate-900 border-t border-slate-400 pt-1 mt-1">
              {supervisor}
            </div>
            <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
              HPS (OPC) PVT. LTD.
            </div>
          </div>

          {/* Dedicated QR Code Box below "SCAN VERIFY CERTIFICATE" */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md text-center shrink-0 flex flex-col items-center">
            <div className="text-[9px] font-black text-[#0C2340] uppercase tracking-wider mb-1.5 leading-tight">
              SCAN VERIFY CERTIFICATE
            </div>
            <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-2xs">
              <QRCodeSVG
                value={defaultUrl}
                size={60}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
