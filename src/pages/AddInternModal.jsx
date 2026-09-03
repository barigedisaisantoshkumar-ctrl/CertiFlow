import React, { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { calculateDuration } from '../utils/helpers';
import { departmentService } from '../services/departmentService';
import { Plus, Trash2, Settings, Building2 } from 'lucide-react';

export function AddInternModal({ isOpen, onClose, onAddIntern, initialData = null }) {
  const [departments, setDepartments] = useState([]);
  const [isManageDeptsOpen, setIsManageDeptsOpen] = useState(false);
  const [newDeptInput, setNewDeptInput] = useState('');
  const [deptError, setDeptError] = useState('');

  // Number portion of EMP ID (after fixed 'HPS' prefix)
  const [empNumber, setEmpNumber] = useState('260038');

  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'Female',
    email: '',
    phone: '',
    intern_code: 'HPS260038',
    college: '',
    course: '',
    department: 'Software Development',
    internship_title: 'SDE Intern',
    duration: '3 Months',
    start_date: '2026-05-16',
    end_date: '2026-08-16',
    supervisor_name: 'Director',
    supervisor_email: 'director@hps.com',
  });

  const [errors, setErrors] = useState({});

  const loadDepartments = () => {
    const list = departmentService.getDepartments();
    setDepartments(list);
    return list;
  };

  // Helper to extract numbers/code after HPS prefix
  const extractEmpNumber = (codeStr) => {
    if (!codeStr) return '';
    let str = String(codeStr).toUpperCase().trim();
    if (str.startsWith('HPS')) {
      return str.slice(3);
    }
    return str;
  };

  useEffect(() => {
    const list = loadDepartments();
    if (initialData) {
      const numPart = extractEmpNumber(initialData.intern_code);
      setEmpNumber(numPart);
      setFormData({
        ...initialData,
        supervisor_name: 'Director'
      });
    } else {
      const defaultNum = `${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`;
      setEmpNumber(`26${defaultNum}`);
      setFormData({
        full_name: '',
        gender: 'Female',
        email: '',
        phone: '',
        intern_code: `HPS26${defaultNum}`,
        college: '',
        course: '',
        department: list[0] || 'Software Development',
        internship_title: 'SDE Intern',
        duration: '3 Months',
        start_date: '2026-05-16',
        end_date: '2026-08-16',
        supervisor_name: 'Director',
        supervisor_email: 'director@hps.com',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department' && value === 'MANAGE_DEPTS') {
      setIsManageDeptsOpen(true);
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'start_date' || name === 'end_date') {
        if (updated.start_date && updated.end_date) {
          updated.duration = calculateDuration(updated.start_date, updated.end_date);
        }
      }
      return updated;
    });
  };

  // Handle manual input for EMP ID number part after HPS prefix
  const handleEmpNumberChange = (e) => {
    let rawVal = e.target.value.toUpperCase();
    // Strip duplicate HPS prefix if typed in input
    if (rawVal.startsWith('HPS')) {
      rawVal = rawVal.slice(3);
    }
    setEmpNumber(rawVal);
    setFormData((prev) => ({
      ...prev,
      intern_code: `HPS${rawVal}`
    }));
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setDeptError('');
    try {
      const updated = departmentService.addDepartment(newDeptInput);
      setDepartments(updated);
      setFormData((prev) => ({ ...prev, department: newDeptInput.trim() }));
      setNewDeptInput('');
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleDeleteDepartment = (deptToDelete) => {
    setDeptError('');
    try {
      const updated = departmentService.deleteDepartment(deptToDelete);
      setDepartments(updated);
      if (formData.department === deptToDelete) {
        setFormData((prev) => ({ ...prev, department: updated[0] || '' }));
      }
    } catch (err) {
      setDeptError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Valid email is required.';
    if (!empNumber.trim()) newErrors.intern_code = 'EMP ID code/number is required.';
    if (!formData.department.trim()) newErrors.department = 'Department is required.';
    if (!formData.internship_title.trim()) newErrors.internship_title = 'Role / Internship title is required.';
    if (!formData.start_date) newErrors.start_date = 'Start date is required.';
    if (!formData.end_date) newErrors.end_date = 'End date is required.';
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date cannot be earlier than start date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddIntern({
      ...formData,
      intern_code: `HPS${empNumber.trim()}`,
      supervisor_name: 'Director'
    });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? 'Edit HPS Intern Details' : 'Add New HPS Intern Record'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name (for Certificate)"
              name="full_name"
              placeholder="e.g. DIPIKA REDDY RAGIPINDI"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
              required
            />

            <Select
              label="Gender / Pronoun"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              options={[
                { value: 'Female', label: 'Female (her successful completion...)' },
                { value: 'Male', label: 'Male (his successful completion...)' },
                { value: 'Other', label: 'Other / Non-binary (their successful completion...)' },
              ]}
            />

            {/* EMP ID Field with Fixed 'HPS' Prefix Pill + Manual Number Add Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                EMP ID / Intern Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="inline-flex items-center px-4 py-2.5 rounded-l-full border border-r-0 border-slate-200 bg-slate-100 text-slate-700 text-sm font-extrabold font-mono select-none">
                  HPS
                </span>
                <input
                  type="text"
                  placeholder="e.g. 260875"
                  value={empNumber}
                  onChange={handleEmpNumberChange}
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm font-mono font-bold rounded-r-full border border-slate-200 px-4 py-2.5 transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  required
                />
              </div>
              {errors.intern_code && <span className="text-xs text-rose-500 font-medium">{errors.intern_code}</span>}
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="dipika.reddy@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* Department Select with Dynamic Manage Option */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsManageDeptsOpen(true)}
                  className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
                >
                  <Settings className="w-3 h-3" /> Manage Departments
                </button>
              </div>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-white text-slate-900 text-sm rounded-full border border-slate-200 px-4 py-2.5 transition-all duration-200 cursor-pointer focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
                <option value="MANAGE_DEPTS">⚙ + Create / Delete Department Options...</option>
              </select>
              {errors.department && <span className="text-xs text-rose-500 font-medium">{errors.department}</span>}
            </div>

            <Input
              label="Role / Internship Title"
              name="internship_title"
              placeholder="e.g. SDE Intern / Software Development Engineer"
              value={formData.internship_title}
              onChange={handleChange}
              error={errors.internship_title}
              required
            />

            <Input
              label="Start Date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              error={errors.start_date}
              required
            />

            <Input
              label="End Date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              error={errors.end_date}
              required
            />

            <Input
              label="Internship Duration"
              name="duration"
              placeholder="e.g. 3 Months"
              value={formData.duration}
              onChange={handleChange}
            />

            <Input
              label="College / Institution (Optional)"
              name="college"
              placeholder="IIT Hyderabad"
              value={formData.college}
              onChange={handleChange}
            />

            <Input
              label="Course / Degree (Optional)"
              name="course"
              placeholder="B.Tech Computer Science"
              value={formData.course}
              onChange={handleChange}
              containerClassName="sm:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? 'Save Changes' : 'Save HPS Intern Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* HR Department Management Modal */}
      {isManageDeptsOpen && (
        <Modal
          isOpen={isManageDeptsOpen}
          onClose={() => setIsManageDeptsOpen(false)}
          title="HR Department Directory Management"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Add new company departments or remove unused department options for certificate generation.
            </p>

            {deptError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {deptError}
              </div>
            )}

            {/* Add Department Form */}
            <form onSubmit={handleAddDepartment} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Cybersecurity & InfoSec"
                value={newDeptInput}
                onChange={(e) => setNewDeptInput(e.target.value)}
                className="flex-1 bg-white text-slate-900 text-xs rounded-full border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500"
              />
              <Button type="submit" size="sm" variant="primary" icon={Plus}>
                Add
              </Button>
            </form>

            {/* Existing Departments List */}
            <div className="space-y-2 border-t border-slate-100 pt-3 max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Departments ({departments.length})
              </span>
              {departments.map((dept) => (
                <div
                  key={dept}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-brand-500" />
                    <span>{dept}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteDepartment(dept)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    title={`Delete ${dept} department`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsManageDeptsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
