import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export function RestoreModal({ isOpen, onClose, certificate, onRestore }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onRestore(certificate.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to restore certificate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restore Revoked Certificate" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Re-activate Certificate Access</strong>
            <p className="mt-1 text-emerald-700">
              Restoring certificate <code className="font-mono font-bold">{certificate?.certificate_number}</code> will mark it as <strong>VALID</strong> again.
              Anyone scanning the QR code or visiting the public verification page will see this certificate as normal, fully authenticated and valid.
            </p>
          </div>
        </div>

        {certificate?.revocation_reason && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <span className="font-bold text-slate-700">Previous Revocation Reason:</span>
            <p className="mt-0.5 text-slate-500 italic">"{certificate.revocation_reason}"</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} icon={RotateCcw} className="bg-emerald-600 hover:bg-emerald-700">
            Restore to Valid Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
