import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/client';
import { MessageSquare, X, Send, Bot, User, Image as ImageIcon } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Chatbot = ({ open, onOpenChange, hideToggleButton }) => {
  const { isDarkMode } = useDarkMode();
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? open : isOpenInternal;
  const setOpen = isControlled
    ? (value) => { if (onOpenChange) onOpenChange(value); }
    : setIsOpenInternal;
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your ArtisanAura assistant. Ask me about products, shipping, or anything else!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [attachments, setAttachments] = useState([]); // File[]
  const [attachError, setAttachError] = useState('');
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachments.length === 0) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const form = new FormData();
      form.append('message', userMessage.text || '');
      form.append('history', JSON.stringify(newMessages.map(m => ({ sender: m.sender, text: m.text }))));
      attachments.forEach((file) => form.append('images', file));

      const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const botResponse = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Chatbot error:", error);
      
      // Provide more specific feedback to the user.
      let errorMessage = "Sorry, something went wrong. Please try again later.";
      if (error.response) {
        // The server responded with an error status (e.g., 400, 500)
        errorMessage = `Error: ${error.response.data.message || 'The server returned an error.'}`;
      } else if (error.request) {
        // The request was made but no response was received (network error)
        errorMessage = "I couldn't connect to the server. Please make sure it's running.";
      }

      const errorResponse = {
        id: Date.now() + 1,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setAttachments([]);
      setAttachError('');
      try { if (fileInputRef.current) fileInputRef.current.value = ''; } catch (_) {}
    }
  };

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    // Enforce max 3 images, 5MB each, images only
    const current = attachments;
    const combined = [...current];
    let error = '';
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        error = 'Only image files are allowed.';
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        error = 'Images must be 5MB or smaller.';
        continue;
      }
      if (combined.length < 3) combined.push(f);
    }
    if (combined.length > 3) combined.length = 3;
    setAttachments(combined);
    setAttachError(error);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {!hideToggleButton && (
        <button
          onClick={() => setOpen(!isOpen)}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-orange-600' : 'bg-orange-500'} text-white`}
          aria-label="Toggle Chat"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] rounded-lg shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-orange-50 border-gray-200'} rounded-t-lg`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"><Bot size={16} className="text-white" /></div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ArtisanAura Assistant</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    {message.sender === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-white" />}
                  </div>
                  <div className={`rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900')}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-70`}>{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start"><div className="flex items-start space-x-2"><div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"><Bot size={12} className="text-white" /></div><div className={`rounded-lg p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div></div></div></div></div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-2">
              {attachments.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{attachments.length} image(s) attached</span>
                  <button type="button" onClick={() => { setAttachments([]); setAttachError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="underline">
                    Clear
                  </button>
                </div>
              )}
              {attachError && (
                <div className="text-xs text-red-500">{attachError}</div>
              )}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-3 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2"><ImageIcon size={16} /> Attach</div>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={onPickFiles} />
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <button type="submit" disabled={(!!attachError) || (!inputMessage.trim() && attachments.length === 0) || isTyping} className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"><Send size={16} /></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
