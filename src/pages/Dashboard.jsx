import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { internService } from '../services/internService';
import { certificateService } from '../services/certificateService';
import { calculateInternshipStatus, formatDate } from '../utils/helpers';
import { Users, Award, CheckCircle, ShieldAlert, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [interns, setInterns] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [internsList, certsList] = await Promise.all([
          internService.getInterns(),
          certificateService.getCertificates()
        ]);
        setInterns(internsList);
        setCertificates(certsList);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const totalInterns = interns.length;
  const activeInterns = interns.filter((i) => calculateInternshipStatus(i.start_date, i.end_date) === 'ACTIVE').length;
  const completedInternships = interns.filter((i) => calculateInternshipStatus(i.start_date, i.end_date) === 'COMPLETED').length;
  const totalCertificates = certificates.length;
  const validCertificates = certificates.filter((c) => c.status === 'VALID').length;
  const revokedCertificates = certificates.filter((c) => c.status === 'REVOKED').length;

  const stats = [
    { label: 'Total Interns', value: totalInterns, icon: Users, color: 'text-brand-500 bg-brand-50 border-brand-200' },
    { label: 'Active Interns', value: activeInterns, icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { label: 'Completed', value: completedInternships, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Certificates Issued', value: totalCertificates, icon: Award, color: 'text-brand-600 bg-brand-50 border-brand-200' },
    { label: 'Valid Certificates', value: validCertificates, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Revoked Certificates', value: revokedCertificates, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <AppLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</span>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
                  {loading ? '...' : stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Header & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-brand-500 to-brand-600 p-6 rounded-2xl text-white shadow-lg shadow-brand-500/20">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Internship Certificate Operations</h2>
            <p className="text-xs text-brand-100 mt-1 max-w-xl">
              Automated certificate generation, instant QR verification, and complete intern lifecycle tracking.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/interns">
              <Button variant="secondary" icon={Plus}>
                Add / Manage Interns
              </Button>
            </Link>
            <Link to="/certificates">
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10" icon={Award}>
                View Issued Certificates
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Interns Section */}
        <Card
          title="Recent Interns & Certificate Status"
          subtitle="Showing latest intern records and their current certificate eligibility."
          action={
            <Link to="/interns" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-4 py-3">Code / Name</th>
                  <th className="px-4 py-3">Department & Internship</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Internship Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interns.slice(0, 5).map((intern) => {
                  const status = calculateInternshipStatus(intern.start_date, intern.end_date);
                  return (
                    <tr key={intern.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{intern.full_name}</div>
                        <div className="text-xs text-slate-400 font-mono">{intern.intern_code}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{intern.internship_title}</div>
                        <div className="text-xs text-slate-500">{intern.department}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {formatDate(intern.start_date)} – {formatDate(intern.end_date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={status} type="internship" />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link to="/interns">
                          <Button variant="secondary" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
