import React, { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { calculateDuration } from '../utils/helpers';

export function AddInternModal({ isOpen, onClose, onAddIntern, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
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
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        full_name: '',
        gender: 'Female',
        email: '',
        phone: '',
        intern_code: `HPS26${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`,
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
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Valid email is required.';
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

    onAddIntern(formData);
    onClose();
  };

  return (
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

          <Input
            label="EMP ID / Intern Code"
            name="intern_code"
            placeholder="e.g. HPS260038"
            value={formData.intern_code}
            onChange={handleChange}
            required
          />

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

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            required
            options={[
              { value: 'Software Development', label: 'Software Development' },
              { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
              { value: 'UX/UI Design', label: 'UX/UI Design' },
              { value: 'Product Management', label: 'Product Management' },
              { value: 'Cloud & DevOps', label: 'Cloud & DevOps' },
            ]}
          />

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
            label="Supervisor / Director Title"
            name="supervisor_name"
            placeholder="Director"
            value={formData.supervisor_name}
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
  );
}
