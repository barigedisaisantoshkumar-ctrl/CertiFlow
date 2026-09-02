import React from 'react';

export function Table({ headers = [], children, emptyMessage = "No data found." }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider border-b border-slate-200/80">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-5 py-3.5 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
