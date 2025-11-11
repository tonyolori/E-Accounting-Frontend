import React from 'react';
import { FileText, Download, Play, Trash2, Calendar } from 'lucide-react';
import { Report } from '../../types/reports';
import { Button } from '../ui/button';

interface ReportCardProps {
  report: Report;
  onGenerate: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export default function ReportCard({ report, onGenerate, onDownload, onDelete }: ReportCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'GENERATING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {report.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {report.description || 'No description provided'}
            </p>
          </div>
          <FileText className="h-5 w-5 text-gray-400 ml-4" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
            <span className="text-xs text-gray-500">{report.format}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created {formatDate(report.createdAt)}</span>
          </div>
          {report.lastGenerated && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Generated {formatDate(report.lastGenerated)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerate}
            disabled={report.status === 'GENERATING'}
          >
            <Play className="h-4 w-4 mr-1" />
            Generate
          </Button>
          
          {report.status === 'COMPLETED' && report.downloadUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
