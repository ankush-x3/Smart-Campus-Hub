import React, { useState } from 'react';
import { 
  Monitor, Book, MapPin, Calendar, Clock, Users, 
  CheckCircle, XCircle, Search, Filter 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const FacultyResources = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  // Mock Data
  const resources = [
    { id: 1, name: 'Main Auditorium', type: 'Venue', capacity: 500, location: 'Block A', status: 'Available', icon: MapPin },
    { id: 2, name: 'Projector Pro-X', type: 'Equipment', capacity: null, location: 'IT Dept', status: 'Booked', icon: Monitor },
    { id: 3, name: 'Seminar Hall 2', type: 'Venue', capacity: 120, location: 'Block B', status: 'Available', icon: MapPin },
    { id: 4, name: 'Library Conference Room', type: 'Room', capacity: 20, location: 'Central Library', status: 'Maintenance', icon: Book },
  ];

  const bookings = [
    { id: 101, resourceName: 'Seminar Hall 2', requestedBy: 'John Student', date: '2023-11-25', time: '10:00 AM - 12:00 PM', purpose: 'Club Meeting', status: 'Pending' },
    { id: 102, resourceName: 'Projector Pro-X', requestedBy: 'Alice Scholar', date: '2023-11-26', time: '02:00 PM - 04:00 PM', purpose: 'Presentation', status: 'Approved' },
    { id: 103, resourceName: 'Main Auditorium', requestedBy: 'Tech Club', date: '2023-12-01', time: '09:00 AM - 05:00 PM', purpose: 'Annual Hackathon', status: 'Pending' },
  ];

  const handleAction = (id, action) => {
    toast.success(`Booking ${action} successfully!`);
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
