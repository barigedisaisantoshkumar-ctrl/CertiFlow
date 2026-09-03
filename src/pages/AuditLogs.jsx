import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Pagination } from '../components/ui/Pagination';
import { auditService } from '../services/auditService';
import { History, User, ShieldCheck } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function loadLogs() {
      const data = await auditService.getAuditLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  // Paginated Audit Logs
  const totalPages = Math.ceil(logs.length / pageSize) || 1;
  const paginatedLogs = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout title="Administrative Audit Logs">
      <div className="space-y-5">
        {/* Header Summary Banner */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-full border border-brand-200/80 shadow-2xs shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Certificate Activity Audit Trail</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Immutable system event logs for certificate generation, intern record updates, and revocations.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <Card className="p-0 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-4">Timestamp</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Action Event</th>
                  <th className="px-5 py-4">Entity / ID</th>
                  <th className="px-5 py-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {log.user}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full border ${
                          log.action.includes('REVOKED')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : log.action.includes('GENERATED')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-brand-50 text-brand-700 border-brand-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono font-bold text-slate-900">
                        {log.entity_id}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 font-medium">
                        {log.details}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-white border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={logs.length}
              itemName="logs"
            />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
