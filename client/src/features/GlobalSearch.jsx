import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Calendar, Building, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_RESULTS = [
  { id: 1, title: 'Database Systems Assignment', category: 'Pages', type: 'assignment', path: '/student/assignments' },
  { id: 2, title: 'Annual Tech Fest', category: 'Events', type: 'event', path: '/student/events' },
  { id: 3, title: 'Holiday Notice', category: 'Notices', type: 'notice', path: '/student/notices' },
  { id: 4, title: 'Library Block', category: 'Places', type: 'building', path: '#' },
  { id: 5, title: 'Machine Learning Notes', category: 'Resources', type: 'resource', path: '/student/resources' },
];

const GlobalSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredResults = MOCK_RESULTS.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) || 
    r.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        if (filteredResults[selectedIndex].path !== '#') {
          navigate(filteredResults[selectedIndex].path);
        }
        onClose();
      }
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'assignment': return <FileText className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'notice': return <Megaphone className="w-5 h-5" />;
      case 'building': return <Building className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search className="w-6 h-6 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 text-xl bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400"
            placeholder="Search across the campus hub..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded bg-gray-100 hover:bg-gray-200 text-xs font-semibold px-2"
          >
            ESC
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              <p>Type to search for pages, events, notices, and more.</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredResults.map((result, index) => (
                <li key={result.id}>
                  <button
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      if (result.path !== '#') navigate(result.path);
                      onClose();
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                      index === selectedIndex 
                        ? 'bg-indigo-50 text-indigo-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-4 ${index === selectedIndex ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm opacity-70">{result.category}</div>
                    </div>
                    {index === selectedIndex && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Enter</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
