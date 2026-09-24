import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import clsx from 'clsx';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events
  const events = [
    {
      id: 1,
      title: 'Data Structures Lecture',
      start: new Date(new Date().setHours(9, 0, 0, 0)),
      end: new Date(new Date().setHours(10, 30, 0, 0)),
      type: 'class',
      location: 'Room 301',
      faculty: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'Database Systems Lab',
      start: new Date(new Date().setHours(14, 0, 0, 0)),
      end: new Date(new Date().setHours(16, 0, 0, 0)),
      type: 'class',
      location: 'Lab 2',
      faculty: 'Prof. Johnson'
    },
    {
      id: 3,
      title: 'Binary Tree Assignment Due',
      start: new Date(new Date().setHours(23, 59, 0, 0)),
      end: new Date(new Date().setHours(23, 59, 0, 0)),
      type: 'assignment',
      course: 'Data Structures'
    },
    {
      id: 4,
      title: 'Mid-term Examination: OS',
      start: moment().add(2, 'days').set({hour: 10, minute: 0}).toDate(),
      end: moment().add(2, 'days').set({hour: 13, minute: 0}).toDate(),
      type: 'exam',
      location: 'Main Hall'
    },
    {
      id: 5,
      title: 'Tech Symposium 2026',
      start: moment().add(4, 'days').set({hour: 9, minute: 0}).toDate(),
      end: moment().add(5, 'days').set({hour: 17, minute: 0}).toDate(),
      type: 'event',
      location: 'Auditorium'
    }
  ];

  const eventStyleGetter = (event) => {
    let style = {
      borderRadius: '8px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    
    switch(event.type) {
      case 'class':
        style.backgroundColor = '#4f46e5'; // indigo
        break;
      case 'assignment':
        style.backgroundColor = '#10b981'; // emerald
        break;
      case 'exam':
        style.backgroundColor = '#e11d48'; // rose
        break;
      case 'event':
        style.backgroundColor = '#f59e0b'; // amber
        break;
      default:
        style.backgroundColor = '#3b82f6'; // blue
    }
    
    return { style };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6 animate-in fade-in p-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Academic Calendar</h1>
          <p className="text-slate-500 mt-1">Your schedule, deadlines, and events</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span> Class</div>
          <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Assignment</div>
          <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-rose-600 mr-2"></span> Exam</div>
          <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span> Event</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col min-h-0">
        <style>{`
          .rbc-calendar { font-family: inherit; }
          .rbc-header { padding: 10px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
          .rbc-today { background-color: #f8fafc; }
          .rbc-event { padding: 4px 8px; font-size: 0.85rem; font-weight: 500; }
          .rbc-toolbar button { padding: 8px 16px; border-radius: 8px; font-weight: 500; color: #475569; border: 1px solid #e2e8f0; margin: 0 4px; }
          .rbc-toolbar button.rbc-active { background-color: #4f46e5; color: white; border-color: #4f46e5; }
          .rbc-toolbar button:hover:not(.rbc-active) { background-color: #f1f5f9; }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
          <div className="p-4">
            <div className="mb-4">
              <Badge variant={
                selectedEvent.type === 'class' ? 'primary' :
                selectedEvent.type === 'assignment' ? 'success' :
                selectedEvent.type === 'exam' ? 'danger' : 'warning'
              } className="uppercase tracking-wider">
                {selectedEvent.type}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{selectedEvent.title}</h3>
            
            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center text-slate-700">
                <Clock className="w-5 h-5 mr-3 text-slate-400" />
                <div>
                  <p className="font-semibold text-sm">Time</p>
                  <p>{moment(selectedEvent.start).format('MMM Do YYYY, h:mm a')} - {moment(selectedEvent.end).format('h:mm a')}</p>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="font-semibold text-sm">Location</p>
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {(selectedEvent.faculty || selectedEvent.course) && (
                <div className="flex items-center text-slate-700">
                  <Tag className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="font-semibold text-sm">Additional Info</p>
                    <p>{selectedEvent.faculty ? `Faculty: ${selectedEvent.faculty}` : `Course: ${selectedEvent.course}`}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
