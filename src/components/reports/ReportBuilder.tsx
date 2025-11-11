import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { ReportTemplate, REPORT_TYPE_OPTIONS, REPORT_FORMAT_OPTIONS } from '../../types/reports';

interface ReportBuilderProps {
  templates: ReportTemplate[];
  isAdvanced?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReportBuilder({ templates, isAdvanced = false, onSuccess, onCancel }: ReportBuilderProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    format: 'PDF',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle report creation
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter report name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <Select
            options={REPORT_TYPE_OPTIONS}
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Select report type"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <Select
            options={REPORT_FORMAT_OPTIONS}
            value={formData.format}
            onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter report description"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Report
        </Button>
      </div>
    </form>
  );
}
