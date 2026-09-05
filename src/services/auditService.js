import { INITIAL_AUDIT_LOGS } from './mockData';

const STORAGE_KEY = 'certiflow_hps_audit_logs_v4';

const getStoredAuditLogs = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  }
  return JSON.parse(data);
};

export const auditService = {
  async getAuditLogs() {
    return getStoredAuditLogs();
  },

  async logAction(action, entityType, entityId, details) {
    const logs = getStoredAuditLogs();
    const newLog = {
      id: 'aud-' + Date.now(),
      user: 'Authorized User (admin@certiflow.com)',
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  }
};
