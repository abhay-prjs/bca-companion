import React, { useState, useRef, useEffect } from 'react';
import { Message, Subject, AppMode } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  subject: Subject;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onUploadContext: (text: string) => void;
  hasContext: boolean;
  setMode: (mode: AppMode) => void;
  isOnline: boolean;
  toggleOnline: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  subject,
  messages,
  onSendMessage,
  isLoading,
  onUploadContext,
  hasContext,
  setMode,
  isOnline,
  toggleOnline
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onUploadContext(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-white w-full max-w-full">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-3 md:px-6 bg-white flex-shrink-0 w-full">
        <div className="flex items-center space-x-2 md:space-x-3 overflow-hidden min-w-0 flex-1 mr-2">
           <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
             <i className={`fas ${subject.icon}`}></i>
           </div>
           <div className="min-w-0 flex-1">
             <h2 className="font-bold text-gray-800 truncate text-sm md:text-base">{subject.name}</h2>
             <p className="text-xs text-gray-500 truncate hidden md:block">{subject.code} - {subject.description}</p>
           </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          {/* Online Toggle */}
          <button 
            onClick={toggleOnline}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
            title={isOnline ? "Online Search Enabled" : "Offline Mode (Uses Syllabus)"}
          >
            <i className={`fas ${isOnline ? 'fa-globe' : 'fa-wifi'}`}></i>
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          <button 
            onClick={() => setMode(AppMode.FLASHCARDS)}
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <i className="fas fa-clone"></i>
            <span>Cards</span>
          </button>
          <button 
            onClick={() => setMode(AppMode.QUIZ)}
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <i className="fas fa-brain"></i>
            <span>Quiz</span>
          </button>
          
          {/* Mobile menu for Cards/Quiz could go here */}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 scrollbar-hide w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4 md:p-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-book-reader text-2xl text-indigo-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Study {subject.name}</h3>
            <p className="max-w-sm text-sm mb-6 px-4">
               I have studied the syllabus and your notes. Ask me anything about {subject.units.length} units in this subject.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-2">
              {['Summarize Unit 1', 'Important questions for exam', 'Explain the hardest topic', 'Create a study plan'].map((q) => (
                <button 
                  key={q}
                  onClick={() => onSendMessage(q)}
                  className="p-3 bg-white border border-gray-200 rounded-lg text-sm hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[90%] md:max-w-[75%] rounded-2xl p-4 shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}
              `}
            >
              <div className={`prose text-sm ${msg.role === 'user' ? 'prose-invert' : 'prose-indigo'} max-w-none`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100/20">
                  <p className="text-xs opacity-70 mb-1 font-semibold">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs underline opacity-80 hover:opacity-100 truncate max-w-[200px]"
                      >
                        {new URL(src).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2">
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-200 w-full">
        <div className="flex justify-between mb-2 px-1">
            {hasContext && (
            <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <i className="fas fa-check-circle"></i>
                <span>Notes Uploaded</span>
            </div>
            )}
            <div className="text-[10px] text-gray-400 flex items-center ml-auto">
                Using {isOnline ? 'Web Search' : 'Syllabus Memory'}
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="relative flex items-center space-x-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.md,.json" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 md:p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors flex-shrink-0"
            title="Upload Additional Notes"
          >
            <i className="fas fa-paperclip"></i>
          </button>
          
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${subject.name}...`}
              className="w-full pl-4 pr-10 md:pr-12 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 rounded-lg transition-colors ${
                input.trim() && !isLoading 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-paper-plane text-xs md:text-sm"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;