import React, { useState, useEffect } from 'react';
import { 
  Server, Monitor, MapPin, Search, Plus, Edit2, Trash2, Power, PowerOff 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenModal = (resource = null) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      type: formData.get('type').toLowerCase(),
      capacity: formData.get('capacity') ? parseInt(formData.get('capacity')) : undefined,
      building: formData.get('building'),
      floor: formData.get('floor'),
      isActive: formData.get('isActive') === 'on'
    };

    try {
      if (editingResource) {
        await api.put(`/resources/${editingResource._id}`, data);
        toast.success('Resource updated successfully');
      } else {
        await api.post('/resources', data);
        toast.success('Resource created successfully');
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this resource permanently?')) {
      try {
        await api.delete(`/resources/${id}`);
        toast.success('Resource deleted');
        fetchResources();
      } catch (err) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const toggleStatus = async (resource) => {
    try {
      await api.put(`/resources/${resource._id}`, { isActive: !resource.isActive });
      toast.success(`Resource marked as ${!resource.isActive ? 'Active' : 'Inactive'}`);
      fetchResources();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Inventory</h1>
          <p className="text-gray-500 mt-1">Manage campus facilities, rooms, and equipment.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Resource
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No resources found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Resource Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{resource.name}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{resource.type}</td>
                    <td className="px-6 py-4 text-gray-600">{resource.capacity ? `${resource.capacity} pax` : 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {resource.building ? `${resource.building}${resource.floor ? `, Fl ${resource.floor}` : ''}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={resource.isActive ? 'success' : 'danger'}>
                        {resource.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(resource)} className={`p-1.5 rounded-lg transition-colors ${resource.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Toggle Status">
                          {resource.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                        </button>
                        <button onClick={() => handleOpenModal(resource)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(resource._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingResource ? "Edit Resource" : "Add Resource"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Resource Name</label>
            <input type="text" name="name" required defaultValue={editingResource?.name || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select name="type" required defaultValue={editingResource?.type ? editingResource.type.charAt(0).toUpperCase() + editingResource.type.slice(1) : 'Classroom'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500">
                <option value="Classroom">Classroom</option>
                <option value="Lab">Lab</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Sports">Sports</option>
                <option value="Library">Library</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Capacity</label>
              <input type="number" name="capacity" defaultValue={editingResource?.capacity || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Building</label>
              <input type="text" name="building" defaultValue={editingResource?.building || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Floor</label>
              <input type="text" name="floor" defaultValue={editingResource?.floor || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingResource ? editingResource.isActive : true} className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Available for booking</label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">{editingResource ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceManagement;
