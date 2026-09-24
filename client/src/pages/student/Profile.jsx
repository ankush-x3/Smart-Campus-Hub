import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Shield, Download, Camera, QrCode } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Edit Profile', 'Security', 'QR Card'];

  const student = {
    name: 'Alex Johnson',
    id: 'STU2024001',
    email: 'alex.j@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    year: '3rd Year',
    role: 'Student',
    stats: {
      courses: 6,
      events: 12,
      complaints: 2,
      posts: 15
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-5xl mx-auto">
      {/* Cover & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center">
            <Camera className="w-4 h-4 mr-2" /> Edit Cover
          </button>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-700 shadow-md relative group cursor-pointer">
                AJ
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-extrabold text-slate-800">{student.name}</h1>
                <p className="text-slate-500 font-medium">{student.id} • {student.department}</p>
              </div>
            </div>
            <Badge variant="primary" className="text-sm px-4 py-1.5">{student.year}</Badge>
          </div>

          <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={clsx(
                  "px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Personal Info</h3>
              <div className="space-y-4">
                <div className="flex items-center text-slate-600"><Mail className="w-5 h-5 mr-3 text-slate-400" /> {student.email}</div>
                <div className="flex items-center text-slate-600"><Phone className="w-5 h-5 mr-3 text-slate-400" /> {student.phone}</div>
                <div className="flex items-center text-slate-600"><BookOpen className="w-5 h-5 mr-3 text-slate-400" /> {student.department}</div>
                <div className="flex items-center text-slate-600"><User className="w-5 h-5 mr-3 text-slate-400" /> {student.role}</div>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 text-lg">Activity Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <p className="text-3xl font-extrabold text-indigo-600 mb-1">{student.stats.courses}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Courses</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <p className="text-3xl font-extrabold text-emerald-600 mb-1">{student.stats.events}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Events</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <p className="text-3xl font-extrabold text-rose-600 mb-1">{student.stats.complaints}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Tickets</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <p className="text-3xl font-extrabold text-amber-600 mb-1">{student.stats.posts}</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Edit Profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated!'); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" defaultValue={student.name} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID (Read Only)</label>
                <input type="text" defaultValue={student.id} disabled className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 outline-none text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue={student.email} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" defaultValue={student.phone} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="pt-4 text-right">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center mb-6 text-slate-800">
            <Shield className="w-6 h-6 mr-2 text-indigo-600" />
            <h3 className="font-bold text-lg">Change Password</h3>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Password changed successfully!'); e.target.reset(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="pt-4 text-right">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900">Update Password</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'QR Card' && (
        <div className="flex flex-col items-center">
          <div className="w-[320px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-indigo-600 p-6 text-center text-white">
              <h2 className="text-xl font-black tracking-widest uppercase">Smart Campus</h2>
              <p className="text-indigo-200 text-xs mt-1 uppercase tracking-widest">Student ID Card</p>
            </div>
            <div className="p-8 flex flex-col items-center bg-slate-50 relative">
              <div className="absolute top-0 left-0 w-full h-16 bg-indigo-600 rounded-b-[50%]"></div>
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg z-10 mb-4">
                <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700">
                  AJ
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 text-center">{student.name}</h3>
              <p className="text-slate-500 font-medium mb-6">{student.id}</p>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>
              
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Department</span>
                  <span className="font-bold text-slate-800 text-right">{student.department}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500 font-medium">Valid Until</span>
                  <span className="font-bold text-slate-800">July 2027</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="mt-8 flex items-center px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            <Download className="w-5 h-5 mr-2" /> Download ID Card
          </button>
        </div>
      )}
    </div>
  );
}
