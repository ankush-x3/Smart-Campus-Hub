import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Building, BookOpen, Calendar, AlertCircle, Edit2, Camera } from 'lucide-react';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
           <button className="absolute bottom-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors">
              <Camera className="w-5 h-5" />
           </button>
        </div>
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white text-slate-700 hover:text-indigo-600 rounded-full shadow-md border border-slate-100 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center shadow-sm"
            >
              {isEditing ? 'Cancel' : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>}
            </button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{user?.name || 'User Name'}</h1>
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <Badge variant="soft" color="indigo" className="capitalize">{user?.role || 'Student'}</Badge>
              <span>•</span>
              <span className="flex items-center"><Building className="w-4 h-4 mr-1" /> Computer Science</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Overview</h3>
             <div className="space-y-4">
               <div className="flex items-center p-3 bg-indigo-50 rounded-xl text-indigo-900">
                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
                   <BookOpen className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-indigo-800/70">Courses Enrolled</p>
                   <p className="text-xl font-bold">5</p>
                 </div>
               </div>
               <div className="flex items-center p-3 bg-emerald-50 rounded-xl text-emerald-900">
                 <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-3">
                   <Calendar className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-emerald-800/70">Events Registered</p>
                   <p className="text-xl font-bold">12</p>
                 </div>
               </div>
               <div className="flex items-center p-3 bg-rose-50 rounded-xl text-rose-900">
                 <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 mr-3">
                   <AlertCircle className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-rose-800/70">Complaints Filed</p>
                   <p className="text-xl font-bold">3</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Details/Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" defaultValue={user?.email} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                      <input type="text" defaultValue="Dormitory Block A, Room 304" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
                        <Mail className="w-4 h-4 mr-2" /> Email Address
                      </div>
                      <p className="text-slate-900 font-medium">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
                        <Phone className="w-4 h-4 mr-2" /> Phone Number
                      </div>
                      <p className="text-slate-900 font-medium">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
                        <MapPin className="w-4 h-4 mr-2" /> Address
                      </div>
                      <p className="text-slate-900 font-medium">Dormitory Block A, Room 304</p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm font-medium text-slate-500 mb-1">
                        <Building className="w-4 h-4 mr-2" /> Department
                      </div>
                      <p className="text-slate-900 font-medium">Computer Science</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
