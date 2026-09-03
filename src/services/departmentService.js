const STORAGE_KEY = 'certiflow_hps_departments_v1';

const DEFAULT_DEPARTMENTS = [
  'Software Development',
  'Artificial Intelligence',
  'UX/UI Design',
  'Product Management',
  'Cloud & DevOps',
];

export const departmentService = {
  getDepartments() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEPARTMENTS));
      return DEFAULT_DEPARTMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_DEPARTMENTS;
    }
  },

  addDepartment(newDeptName) {
    const trimmed = newDeptName.trim();
    if (!trimmed) return this.getDepartments();

    const current = this.getDepartments();
    if (current.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`Department "${trimmed}" already exists.`);
    }

    const updated = [...current, trimmed];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteDepartment(deptNameToDelete) {
    const current = this.getDepartments();
    if (current.length <= 1) {
      throw new Error('At least one department must remain in the system.');
    }

    const updated = current.filter((d) => d !== deptNameToDelete);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
