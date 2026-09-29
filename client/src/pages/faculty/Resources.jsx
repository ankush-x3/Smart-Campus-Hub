import React, { useState, useEffect } from 'react';
import { 
  Monitor, Book, MapPin, Calendar, Clock, Users, 
  CheckCircle, XCircle, Search, Filter 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FacultyResources = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      const data = res.data.data || res.data;
      
      const mappedResources = data.map(r => ({
        id: r._id || r.id,
        name: r.name,
        type: r.type || 'Venue',
        capacity: r.capacity,
        location: r.location || 'Campus',
        status: r.status || 'Available',
        icon: r.type === 'Equipment' ? Monitor : (r.type === 'Room' ? Book : MapPin)
      }));
      setResources(mappedResources);

      let allBookings = [];
      data.forEach(resource => {
        if (resource.slots) {
          resource.slots.forEach(slot => {
            if (slot.status && slot.status !== 'Available') {
              allBookings.push({
                id: slot._id || slot.id,
                resourceId: resource._id || resource.id,
                resourceName: resource.name,
                requestedBy: slot.bookedBy?.name || 'Student',
                date: slot.startTime ? new Date(slot.startTime).toLocaleDateString() : 'N/A',
                time: slot.startTime && slot.endTime ? `${new Date(slot.startTime).toLocaleTimeString()} - ${new Date(slot.endTime).toLocaleTimeString()}` : 'N/A',
                purpose: slot.purpose || 'Booking',
                status: slot.status
              });
            }
          });
        }
      });
      setBookings(allBookings);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load resources');
    }
  };

  const handleAction = async (id, action) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    try {
      await api.put(`/resources/${booking.resourceId}/book/${booking.id}/status`, {
        status: action === 'approved' ? 'Approved' : 'Rejected'
      });
      toast.success(`Booking ${action} successfully!`);
      fetchResources();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} booking`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-500 mt-1">View campus resources and manage student booking requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('All')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'All'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveTab('Manage')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'Manage'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Booking Requests
              <span className="bg-emerald-100 text-emerald-600 py-0.5 px-2 rounded-full text-xs">2</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'All' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                      <resource.icon size={24} />
                    </div>
                    <Badge variant={
                      resource.status === 'Available' ? 'success' : 
                      resource.status === 'Booked' ? 'warning' : 'danger'
                    }>
                      {resource.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{resource.type}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{resource.location}</span>
                    </div>
                    {resource.capacity && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>Capacity: {resource.capacity} people</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    disabled={resource.status !== 'Available'}
                    className="mt-6 w-full py-2 bg-white border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
                  >
                    {resource.status === 'Available' ? 'Book for Class' : 'Unavailable'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Resource</th>
                    <th className="px-6 py-3">Requested By</th>
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Purpose</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{booking.resourceName}</td>
                      <td className="px-6 py-4">{booking.requestedBy}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12}/> {booking.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{booking.purpose}</td>
                      <td className="px-6 py-4">
                        <Badge variant={booking.status === 'Approved' ? 'success' : booking.status === 'Pending' ? 'warning' : 'danger'}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleAction(booking.id, 'approved')}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleAction(booking.id, 'rejected')}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyResources;


