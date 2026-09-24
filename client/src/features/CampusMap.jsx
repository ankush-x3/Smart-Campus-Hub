import React, { useState } from 'react';
import { X, Search, Info } from 'lucide-react';

const MAP_BUILDINGS = [
  { id: 'academic', title: 'Main Academic Block', category: 'academic', x: 200, y: 300, width: 250, height: 180 },
  { id: 'library', title: 'Central Library', category: 'academic', x: 300, y: 80, width: 150, height: 120 },
  { id: 'admin', title: 'Admin Block', category: 'facilities', x: 50, y: 100, width: 140, height: 100 },
  { id: 'science', title: 'Science Block', category: 'academic', x: 550, y: 250, width: 180, height: 150 },
  { id: 'auditorium', title: 'Auditorium', category: 'facilities', x: 600, y: 80, width: 160, height: 120 },
  { id: 'hostel_a', title: 'Boys Hostel A', category: 'residential', x: 80, y: 550, width: 120, height: 180 },
  { id: 'hostel_b', title: 'Girls Hostel B', category: 'residential', x: 220, y: 550, width: 120, height: 180 },
  { id: 'cafeteria', title: 'Cafeteria', category: 'facilities', x: 400, y: 520, width: 100, height: 100 },
  { id: 'sports', title: 'Sports Ground', category: 'sports', x: 550, y: 480, width: 250, height: 250 },
];

const CampusMap = ({ onClose }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredBuildings = MAP_BUILDINGS.filter(b => 
    (filter === 'all' || b.category === filter) &&
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const getFillColor = (category, isSelected) => {
    if (isSelected) return 'fill-indigo-500';
    switch(category) {
      case 'academic': return 'fill-blue-100 hover:fill-blue-200 stroke-blue-300';
      case 'facilities': return 'fill-amber-100 hover:fill-amber-200 stroke-amber-300';
      case 'residential': return 'fill-purple-100 hover:fill-purple-200 stroke-purple-300';
      case 'sports': return 'fill-emerald-100 hover:fill-emerald-200 stroke-emerald-300';
      default: return 'fill-gray-100 stroke-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🗺️</span> Interactive Campus Map
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 bg-green-50 overflow-auto relative flex items-center justify-center p-4">
          <div className="min-w-[800px] min-h-[800px] relative shadow-lg rounded-2xl bg-white border border-gray-200 overflow-hidden">
            {/* SVG Map */}
            <svg viewBox="0 0 900 800" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Paths/Roads */}
              <path d="M 120 200 L 120 700 M 120 200 L 800 200 M 400 200 L 400 700 M 120 480 L 800 480" fill="none" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" />
              <path d="M 120 200 L 120 700 M 120 200 L 800 200 M 400 200 L 400 700 M 120 480 L 800 480" fill="none" stroke="#f8fafc" strokeWidth="20" strokeLinecap="round" strokeDasharray="10 10" />

              {/* Buildings */}
              {MAP_BUILDINGS.map(building => {
                const isVisible = filteredBuildings.some(b => b.id === building.id);
                if (!isVisible) return null;
                const isSelected = selectedBuilding?.id === building.id;
                
                return (
                  <g 
                    key={building.id}
                    onClick={() => setSelectedBuilding(building)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: isVisible ? 1 : 0.2 }}
                  >
                    <rect 
                      x={building.x} 
                      y={building.y} 
                      width={building.width} 
                      height={building.height} 
                      rx="8"
                      className={`stroke-2 transition-colors duration-300 ${getFillColor(building.category, isSelected)}`}
                    />
                    <text 
                      x={building.x + building.width/2} 
                      y={building.y + building.height/2} 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className={`text-sm font-semibold pointer-events-none ${isSelected ? 'fill-white' : 'fill-gray-700'}`}
                    >
                      {building.title}
                    </text>
                  </g>
                );
              })}

              {/* Current Location Indicator (mock) */}
              <circle cx="250" cy="450" r="6" fill="#ef4444" className="animate-pulse" />
              <circle cx="250" cy="450" r="16" fill="#ef4444" opacity="0.3" className="animate-ping" />
            </svg>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-80 bg-white border-l border-gray-200 flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none z-20 h-64 md:h-auto">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'academic', 'facilities', 'residential', 'sports'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                    filter === cat 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Building Info */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {selectedBuilding ? (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  selectedBuilding.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                  selectedBuilding.category === 'facilities' ? 'bg-amber-100 text-amber-600' :
                  selectedBuilding.category === 'residential' ? 'bg-purple-100 text-purple-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedBuilding.title}</h3>
                <span className="inline-block px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full capitalize mb-4">
                  {selectedBuilding.category}
                </span>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-500">
                      Located in the {selectedBuilding.category} zone. This building is a primary facility for students and staff.
                    </p>
                  </div>
                  
                  <button className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    Get Directions
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                <Info className="w-12 h-12 mb-3 text-gray-300" />
                <p>Click on any building on the map<br/>to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
