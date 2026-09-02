import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { auditService } from '../services/auditService';
import { formatDate } from '../utils/helpers';
import { History, Shield, User, FileText } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadLogs() {
      const data = await auditService.getAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  return (
    <AppLayout title="Administrative Audit Logs">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg border border-brand-200">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Certificate Activity Audit Trail</h2>
              <p className="text-xs text-slate-500">
                Immutable system event logs for certificate generation, intern record updates, and revocations.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Action Event</th>
                  <th className="px-4 py-3.5">Entity / ID</th>
                  <th className="px-4 py-3.5">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {log.user}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                        log.action.includes('REVOKED')
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : log.action.includes('GENERATED')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-brand-50 text-brand-700 border-brand-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono font-bold text-slate-900">
                      {log.entity_id}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
