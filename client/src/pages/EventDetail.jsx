import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart, Info, CheckCircle2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { useState } from 'react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Mock specific event data
  const event = {
    id,
    title: 'Introduction to Machine Learning',
    description: 'Join us for an intensive workshop on the fundamentals of Machine Learning. We will cover supervised and unsupervised learning, basic neural networks, and practical implementations using Python and scikit-learn. No prior ML experience required, but basic Python knowledge is recommended. Please bring your laptops fully charged.',
    date: '2024-10-24T14:00:00',
    endDate: '2024-10-24T17:00:00',
    location: 'Auditorium A, Science Block',
    category: 'workshop',
    attendees: 145,
    maxCapacity: 200,
    organizer: 'Computer Science Department',
    contactEmail: 'cs.dept@university.edu',
    speakers: [
      { name: 'Dr. Alan Turing', role: 'Professor, CS Dept' },
      { name: 'Sarah Connor', role: 'Data Scientist, TechCorp' }
    ]
  };

  const dateObj = new Date(event.date);
  const endDateObj = new Date(event.endDate);

  const handleRegister = () => {
    if (isRegistered) {
      setIsRegistered(false);
      toast.success('Registration cancelled');
    } else {
      setIsRegistered(true);
      toast.success('Successfully registered for event! Confirmation email sent.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-6 right-6 flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge variant="solid" color="white" className="bg-white/30 backdrop-blur-md mb-4 shadow-sm border-none">
              {event.category.toUpperCase()}
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-bold mb-2">{event.title}</h1>
            <p className="text-blue-100 text-lg flex items-center">
              By {event.organizer}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">About this event</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {event.description}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Speakers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mr-4 shrink-0">
                      {speaker.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{speaker.name}</h4>
                      <p className="text-sm text-slate-500">{speaker.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mr-4">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{dateObj.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                    <p className="text-sm text-slate-500">{dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endDateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Location</h4>
                    <p className="text-sm text-slate-500">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mr-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Capacity</h4>
                    <p className="text-sm text-slate-500">{event.attendees} / {event.maxCapacity} registered</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleRegister}
                className={clsx(
                  "w-full py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all shadow-sm",
                  isRegistered 
                    ? "bg-white border-2 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                )}
              >
                {isRegistered ? 'Cancel Registration' : 'Register Now'}
              </button>
              
              {isRegistered && (
                <p className="text-emerald-600 text-sm font-medium flex items-center justify-center mt-3">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> You are registered
                </p>
              )}
            </div>

            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-start">
              <Info className="w-5 h-5 text-indigo-600 mr-3 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-800">
                If you have any questions about this event, please contact the organizer at <a href={`mailto:${event.contactEmail}`} className="font-semibold underline">{event.contactEmail}</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
