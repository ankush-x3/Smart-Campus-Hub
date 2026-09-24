import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 I'm your Campus AI. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI response logic
    setTimeout(() => {
      let aiResponse = "I can help with campus navigation, checking events, assignments, or finding notices. Just ask!";
      const lowerInput = userMessage.text.toLowerCase();

      if (lowerInput.includes('assignment')) {
        aiResponse = "You have 2 upcoming assignments due this week. Check the Assignments tab for details.";
      } else if (lowerInput.includes('event')) {
        aiResponse = "The Annual Tech Fest is happening next month! Registration is open on the Events page.";
      } else if (lowerInput.includes('notice')) {
        aiResponse = "The latest notice is about the holiday on Friday. Stay tuned to the Notices page.";
      } else if (lowerInput.includes('help')) {
        aiResponse = "You can navigate using the sidebar. I'm here if you have questions about specific features.";
      } else if (lowerInput.includes('map') || lowerInput.includes('building')) {
        aiResponse = "You can view the interactive Campus Map from the top header to find building locations.";
      } else if (lowerInput.includes('library')) {
        aiResponse = "The Central Library is open from 8:00 AM to 10:00 PM on weekdays, and 9:00 AM to 5:00 PM on weekends.";
      } else if (lowerInput.includes('hostel')) {
        aiResponse = "Hostel queries can be directed to the Help Desk or the warden's office in Admin Block.";
      }

      setMessages(prev => [...prev, { id: Date.now(), text: aiResponse, isUser: false }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 animate-pulse'}`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between text-white shrink-0">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Campus AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.isUser 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="ml-2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
