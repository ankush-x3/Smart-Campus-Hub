import React, { useState } from 'react';
import { 
  Server, Monitor, MapPin, Search, Plus, Edit2, Trash2, Power, PowerOff 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const ResourceManagement = () => {
  const [resources, setResources] = useState([
    { id: 1, name: 'Main Auditorium', type: 'Venue', capacity: 500, status: 'Active', bookings: 12 },
    { id: 2, name: 'Projector Pro-X', type: 'Equipment', capacity: null, status: 'Active', bookings: 45 },
    { id: 3, name: 'Seminar Hall 2', type: 'Venue', capacity: 120, status: 'Maintenance', bookings: 8 },
    { id: 4, name: 'Chemistry Lab', type: 'Lab', capacity: 30, status: 'Active', bookings: 24 },
  ]);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setResources(resources.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Resource marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Inventory</h1>
          <p className="text-gray-500 mt-1">Manage campus facilities, rooms, and equipment.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm">
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search resources..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Resource Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Total Bookings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{resource.name}</td>
                  <td className="px-6 py-4 text-gray-600">{resource.type}</td>
                  <td className="px-6 py-4 text-gray-600">{resource.capacity ? `${resource.capacity} pax` : 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{resource.bookings}</td>
                  <td className="px-6 py-4">
                    <Badge variant={resource.status === 'Active' ? 'success' : resource.status === 'Maintenance' ? 'warning' : 'danger'}>
                      {resource.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleStatus(resource.id, resource.status)} className={`p-1.5 rounded-lg transition-colors ${resource.status === 'Active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Toggle Status">
                        {resource.status === 'Active' ? <Power size={18} /> : <PowerOff size={18} />}
                      </button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
