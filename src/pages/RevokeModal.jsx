import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertTriangle } from 'lucide-react';

export function RevokeModal({ isOpen, onClose, certificate, onRevoke }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a mandatory revocation reason for audit logging.');
      return;
    }

    setIsLoading(true);
    try {
      await onRevoke(certificate.id, reason);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revoke Issued Certificate" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Warning: Revoking is permanent.</strong>
            <p className="mt-1 text-rose-700">
              Anyone scanning the QR code or visiting the public verification page for{' '}
              <code className="font-mono font-bold">{certificate?.certificate_number}</code> will immediately see the certificate marked as REVOKED.
            </p>
          </div>
        </div>

        <Input
          label="Revocation Reason"
          placeholder="e.g. Reissued due to updated course degree title."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          error={error}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading}>
            Revoke Certificate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
