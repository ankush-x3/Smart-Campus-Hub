import React, { useState, useEffect, useRef } from 'react';
import { X, Download, QrCode, Camera } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';

const QRModal = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('generate'); // generate, scan
  const [qrText, setQrText] = useState(user ? `student:${user.id}` : 'https://campus.edu');
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (activeTab === 'generate' && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrText || ' ', {
        width: 250,
        margin: 2,
        color: {
          dark: '#4f46e5', // indigo-600
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [qrText, activeTab]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-qr.png';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">QR Tools</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-gray-50">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'generate' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <QrCode className="w-4 h-4 mr-2" />
            My QR
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'scan' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Camera className="w-4 h-4 mr-2" />
            Scanner
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'generate' ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-center w-full">
                <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
              </div>
              
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QR Content</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter text or URL"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setQrText(`student:${user?.id || 'demo'}`)}
                    className="flex-1 py-2 px-3 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    My ID Card
                  </button>
                  <button
                    onClick={() => setQrText(`profile:${user?.id || 'demo'}`)}
                    className="flex-1 py-2 px-3 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Profile Link
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full mt-4 flex items-center justify-center py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download QR
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-2xl animate-pulse"></div>
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Camera Access Required</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                To scan a QR code, please allow camera permissions or upload an image containing a QR code.
              </p>
              <button className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                Upload Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRModal;
