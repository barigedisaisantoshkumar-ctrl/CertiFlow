import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';

export function Templates() {
  return (
    <AppLayout title="Certificate Template Management">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
              Active Template v1.2
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Standard Company Internship Completion Certificate</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Pre-configured high-definition template with dynamic fields, QR code verification area, and company seal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Default Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Dynamic Template Placeholders">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { tag: '{{INTERN_NAME}}', desc: 'Full legal name of the intern', example: 'Sai Kumar' },
                  { tag: '{{INTERNSHIP_TITLE}}', desc: 'Title of the completed program', example: 'Full Stack Web Development' },
                  { tag: '{{DEPARTMENT}}', desc: 'Assigned corporate department', example: 'Software Engineering' },
                  { tag: '{{START_DATE}}', desc: 'Official internship start date', example: '01 June 2026' },
                  { tag: '{{END_DATE}}', desc: 'Official internship end date', example: '31 August 2026' },
                  { tag: '{{CERTIFICATE_ID}}', desc: 'Unique database identifier', example: 'CERT-2026-000124' },
                  { tag: '{{QR_CODE}}', desc: 'Embedded QR pointing to verification URL', example: '[Embedded SVG]' },
                  { tag: '{{SUPERVISOR_NAME}}', desc: 'Authorized signatory officer name', example: 'Dr. Rajesh Sharma' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <code className="text-xs font-bold text-brand-600 font-mono bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {item.tag}
                    </code>
                    <div className="text-xs font-medium text-slate-700">{item.desc}</div>
                    <div className="text-[11px] text-slate-400">Sample: {item.example}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card title="Template Design Rules">
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <p>Preserves corporate logo, borders, font hierarchy, and signatures.</p>
                </div>
                <div className="flex items-start gap-2">
                  <QrCode className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <p>QR code automatically generated and placed in dedicated security area.</p>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <p>Server-side rendering ensures consistent PDF layout without browser font distortion.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
