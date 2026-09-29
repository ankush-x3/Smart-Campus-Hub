import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Download, FileText, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ReportModal = ({ isOpen, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [form, setForm] = useState({
    type: 'all',
    startDate: '',
    endDate: ''
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setReportResult(null);
    try {
      const params = new URLSearchParams();
      if (form.type !== 'all') params.append('type', form.type);
      if (form.startDate) params.append('startDate', form.startDate);
      if (form.endDate) params.append('endDate', form.endDate);

      const res = await api.get(`/admin/reports?${params.toString()}`);
      
      if (res.data.success) {
        setReportResult(res.data);
        toast.success('Report generated successfully!');
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    // Creating a readable JSON file as a substitute for PDF for now
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportResult, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `campus-report-${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    toast.success('Report downloaded!');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => { setReportResult(null); onClose(); }} title="Generate System Report" size="lg">
      <div className="space-y-6">
        
        {/* Form */}
        {!reportResult && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({...form, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="all">Comprehensive (All Data)</option>
                <option value="users">Users & Registrations</option>
                <option value="events">Events & Activities</option>
                <option value="complaints">Complaints & Tickets</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                <input 
                  type="date" 
                  value={form.startDate} 
                  onChange={(e) => setForm({...form, startDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                <input 
                  type="date" 
                  value={form.endDate} 
                  onChange={(e) => setForm({...form, endDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {generating ? 'Compiling Data...' : 'Generate Report'}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {reportResult && (
          <div className="space-y-4 text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Report Generated</h3>
            <p className="text-gray-500">The requested data has been compiled successfully.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg text-left mt-4 mb-6 text-sm overflow-auto max-h-48 border">
               <p><strong>Type:</strong> {reportResult.type}</p>
               <p><strong>Generated At:</strong> {new Date(reportResult.generatedAt).toLocaleString()}</p>
               <p><strong>Records Found:</strong></p>
               <ul className="list-disc pl-5 mt-2">
                 {reportResult.data.users && <li>Users: {reportResult.data.users.length}</li>}
                 {reportResult.data.events && <li>Events: {reportResult.data.events.length}</li>}
                 {reportResult.data.complaints && <li>Complaints: {reportResult.data.complaints.length}</li>}
               </ul>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => setReportResult(null)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Generate Another</button>
              <button 
                onClick={downloadReport}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" /> Download JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportModal;
