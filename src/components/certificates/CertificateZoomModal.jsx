import React, { useState, useRef } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { CertificateTemplate } from './CertificateTemplate';

export function CertificateZoomModal({ isOpen, onClose, certificate, verificationUrl, onDownloadPdf }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const certRef = useRef(null);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in select-none">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 text-white flex flex-wrap items-center justify-between gap-3 shadow-xl shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 leading-none">
              HPS Verified Certificate Preview
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              No.: {certificate?.certificate_number || 'HPS/INT/2026/0038'}
            </span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner mx-auto sm:mx-0">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.6}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all disabled:opacity-30"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-200 px-2 min-w-[50px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2.5}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all disabled:opacity-30"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1"></div>

          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold px-2"
            title="Reset Zoom to 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Zoomable Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-10 flex items-center justify-center">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
          className="transition-transform duration-200 ease-out shadow-2xl rounded-xl overflow-hidden my-auto"
        >
          <div className="w-[850px] h-[600px] bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden">
            <CertificateTemplate
              innerRef={certRef}
              certificate={certificate}
              verificationUrl={verificationUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
