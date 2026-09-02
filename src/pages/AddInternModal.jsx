import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function AddInternModal({ isOpen, onClose, onAddIntern, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      full_name: '',
      email: '',
      phone: '',
      college: '',
      course: '',
      department: 'Software Engineering',
      internship_title: '',
      start_date: '2026-06-01',
      end_date: '2026-08-31',
      supervisor_name: 'Dr. Rajesh Sharma',
      supervisor_email: 'rajesh.sharma@company.com',
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Full name is required.';
    if (!formData.email) newErrors.email = 'Valid email is required.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.internship_title) newErrors.internship_title = 'Internship title is required.';
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
      title={initialData ? 'Edit Intern Details' : 'Add New Intern Record'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="full_name"
            placeholder="e.g. Sai Kumar"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="sai.kumar@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="College / Institution"
            name="college"
            placeholder="IIT Hyderabad"
            value={formData.college}
            onChange={handleChange}
          />

          <Input
            label="Course / Degree"
            name="course"
            placeholder="B.Tech Computer Science"
            value={formData.course}
            onChange={handleChange}
          />

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            error={errors.department}
            required
            options={[
              { value: 'Software Engineering', label: 'Software Engineering' },
              { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
              { value: 'UX/UI Design', label: 'UX/UI Design' },
              { value: 'Product Management', label: 'Product Management' },
              { value: 'DevOps & Security', label: 'DevOps & Security' },
            ]}
          />

          <Input
            label="Internship Title"
            name="internship_title"
            placeholder="e.g. Full Stack Web Development"
            value={formData.internship_title}
            onChange={handleChange}
            error={errors.internship_title}
            required
          />

          <Input
            label="Supervisor Name"
            name="supervisor_name"
            placeholder="Dr. Rajesh Sharma"
            value={formData.supervisor_name}
            onChange={handleChange}
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
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Save Changes' : 'Save Intern Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
