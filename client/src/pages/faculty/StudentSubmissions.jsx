import React, { useState } from 'react';
import { 
  Download, Filter, Search, CheckCircle, Clock, AlertCircle, FileText 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const StudentSubmissions = () => {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // Mock Data
  const submissions = [
    { id: 1, student: 'John Doe', assignment: 'Graph Algorithms', course: 'CS301', submittedAt: '2023-11-19 14:30', status: 'pending', grade: null, file: 'graph_algo_jd.pdf' },
    { id: 2, student: 'Jane Smith', assignment: 'React Basics', course: 'CS101', submittedAt: '2023-11-18 09:15', status: 'graded', grade: 95, file: 'react_assignment.zip' },
    { id: 3, student: 'Alice Johnson', assignment: 'Binary Trees', course: 'CS201', submittedAt: '2023-11-20 23:50', status: 'pending', grade: null, file: 'trees_alice.py' },
    { id: 4, student: 'Bob Williams', assignment: 'Graph Algorithms', course: 'CS301', submittedAt: '2023-11-21 10:00', status: 'graded', grade: 82, file: 'algo_hw2.pdf' },
  ];

  const handleGrade = (e) => {
    e.preventDefault();
    toast.success('Grade submitted successfully!');
    setIsGradeModalOpen(false);
  };

  const openGradeModal = (sub) => {
    setSelectedSub(sub);
    setIsGradeModalOpen(true);
  };

  const handleExport = () => {
    toast.success('Exporting submissions to CSV...');
  };

  const filteredSubs = selectedCourse === 'All' ? submissions : submissions.filter(s => s.course === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Submissions</h1>
          <p className="text-gray-500 mt-1">Review and grade student assignment submissions.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FileText size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Submissions</p>
            <h3 className="text-2xl font-bold text-gray-900">{submissions.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Graded</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {submissions.filter(s => s.status === 'graded').length} 
              <span className="text-sm text-gray-500 font-normal ml-2">({Math.round((submissions.filter(s => s.status === 'graded').length / submissions.length) * 100)}%)</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Review</p>
            <h3 className="text-2xl font-bold text-gray-900">{submissions.filter(s => s.status === 'pending').length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
            >
              <option value="All">All Courses</option>
              <option value="CS101">CS101 - Intro to Programming</option>
              <option value="CS201">CS201 - Data Structures</option>
              <option value="CS301">CS301 - Algorithms</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white hidden sm:block">
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="graded">Graded</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search student or assignment..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Assignment & Course</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4">Status & Grade</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.student}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{sub.assignment}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{sub.course}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{sub.submittedAt}</td>
                  <td className="px-6 py-4">
                    {sub.status === 'graded' ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Graded</Badge>
                        <span className="font-bold text-gray-900">{sub.grade}/100</span>
                      </div>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors flex items-center gap-1 text-xs font-medium">
                        <Download size={14} /> File
                      </a>
                      <button 
                        onClick={() => openGradeModal(sub)}
                        className="text-emerald-600 font-medium hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Grade Submission: ${selectedSub?.student}`}
      >
        <form onSubmit={handleGrade} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-1">Assignment: <span className="font-medium text-gray-900">{selectedSub?.assignment}</span></p>
            <p className="text-sm text-gray-600">Submitted File: <a href="#" className="text-emerald-600 hover:underline">{selectedSub?.file}</a></p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Marks (out of 100)</label>
            <input 
              type="number" 
              required 
              min="0"
              max="100"
              defaultValue={selectedSub?.grade || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Feedback (Optional)</label>
            <textarea 
              rows="4" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Provide feedback to the student..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsGradeModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Grade</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentSubmissions;
