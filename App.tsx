import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import FlashcardDeck from './components/FlashcardDeck';
import QuizView from './components/QuizView';
import AboutModal from './components/AboutModal';
import { SubjectId, Message, AppMode, Subject, Semester } from './types';
import { SEMESTERS } from './constants';
import { generateChatResponse } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.SEMESTER_SELECT);
  const [activeSemesterId, setActiveSemesterId] = useState<number | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Learner Mode & Online Toggle
  const [learnerMode, setLearnerMode] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // Default to offline to save money/resources as requested

  // About Modal State
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Data State
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]); // Local copy to manage progress
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [contextNotes, setContextNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const activeSemester = SEMESTERS.find(s => s.id === activeSemesterId) || null;
  const activeSubject = subjectsData.find(s => s.id === activeSubjectId) || null;

  const currentMessages = activeSubjectId ? (chatHistory[activeSubjectId] || []) : [];
  const currentNotes = activeSubjectId ? (contextNotes[activeSubjectId] || '') : '';

  // Initialize subjects when semester changes
  useEffect(() => {
    if (activeSemester) {
        // Deep copy to allow state mutation for progress
        setSubjectsData(JSON.parse(JSON.stringify(activeSemester.subjects)));
    }
  }, [activeSemesterId]);

  const handleSelectSemester = (semester: Semester) => {
    if (semester.status === 'coming_soon') {
        alert("This semester content is being updated. Check back soon!");
        return;
    }
    setActiveSemesterId(semester.id);
    setMode(AppMode.CHAT);
  };

  const handleSelectSubject = (id: SubjectId) => {
    setActiveSubjectId(id);
    setMode(AppMode.CHAT); 
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSubjectId || !activeSubject) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    const updatedHistory = [...currentMessages, newMessage];
    setChatHistory(prev => ({ ...prev, [activeSubjectId]: updatedHistory }));
    setIsLoading(true);

    const apiHistory = updatedHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }] as [{ text: string }]
    }));

    const response = await generateChatResponse(
      text, 
      apiHistory, 
      activeSubject.systemInstruction,
      currentNotes,
      activeSubject.knowledgeBase || '',
      isOnline
    );

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      timestamp: Date.now(),
      sources: response.sources
    };

    setChatHistory(prev => ({ 
      ...prev, 
      [activeSubjectId]: [...updatedHistory, aiMessage] 
    }));
    setIsLoading(false);
  };

  const handleUploadContext = (text: string) => {
    if (!activeSubjectId) return;
    setContextNotes(prev => ({
      ...prev,
      [activeSubjectId]: (prev[activeSubjectId] || '') + '\n' + text
    }));
  };

  const handleToggleUnit = (subjectId: SubjectId, unitId: string) => {
    setSubjectsData(prev => prev.map(sub => {
        if (sub.id === subjectId) {
            return {
                ...sub,
                units: sub.units.map(u => u.id === unitId ? { ...u, isCompleted: !u.isCompleted } : u)
            };
        }
        return sub;
    }));
  };

  // --- SCREEN: Semester Selection ---
  if (mode === AppMode.SEMESTER_SELECT) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            
            <div className="text-center mb-12">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-graduation-cap text-4xl text-indigo-600"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">BCA Study Assistant</h1>
                <p className="text-gray-600">Select your semester to access curated study materials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
                {SEMESTERS.map(sem => (
                    <button
                        key={sem.id}
                        onClick={() => handleSelectSemester(sem)}
                        className={`relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-md
                            ${sem.status === 'active' 
                                ? 'bg-white border-indigo-100 hover:border-indigo-500 group' 
                                : 'bg-gray-50 border-dashed border-gray-200 opacity-70 cursor-not-allowed'}`}
                    >
                        <h3 className={`text-xl font-bold mb-2 ${sem.status === 'active' ? 'text-gray-800 group-hover:text-indigo-600' : 'text-gray-400'}`}>
                            {sem.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {sem.status === 'active' 
                                ? `${sem.subjects.length} Subjects Available` 
                                : 'Content updating soon'}
                        </p>
                        {sem.status === 'active' && (
                            <div className="absolute top-6 right-6 text-indigo-400 group-hover:text-indigo-600 transition-colors">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            
            <div className="absolute bottom-4 text-xs text-gray-400 font-mono italic cursor-pointer hover:text-indigo-500" onClick={() => setIsAboutOpen(true)}>
                made with laziness by abhay_prjs
            </div>
        </div>
    );
  }

  // --- SCREEN: Main Application ---
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 w-full">
      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-10 shadow-sm">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 focus:outline-none">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <span className="ml-4 font-bold text-gray-800 truncate">{activeSemester?.name}</span>
      </div>

      <Sidebar 
        semester={activeSemester}
        subjects={subjectsData}
        activeSubjectId={activeSubjectId}
        onSelectSubject={handleSelectSubject}
        onBackToSemesters={() => {
            setMode(AppMode.SEMESTER_SELECT);
            setActiveSubjectId(null);
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
        learnerMode={learnerMode}
        toggleLearnerMode={() => setLearnerMode(!learnerMode)}
        onToggleUnit={handleToggleUnit}
        onShowAbout={() => setIsAboutOpen(true)}
      />

      {/* Added max-w-[100vw] and min-w-0 to ensure children don't force overflow */}
      <main className="flex-1 flex flex-col h-full relative md:static pt-14 md:pt-0 w-full min-w-0 max-w-[100vw]">
        {!activeSubject ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <i className="fas fa-book-open text-4xl text-indigo-400"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Subject</h2>
            <p className="text-gray-500 max-w-md">
                Choose a subject from the sidebar to start studying with syllabus-aligned content and AI assistance.
            </p>
          </div>
        ) : (
          <>
            {mode === AppMode.CHAT && (
              <ChatInterface 
                subject={activeSubject}
                messages={currentMessages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onUploadContext={handleUploadContext}
                hasContext={!!currentNotes || !!activeSubject.knowledgeBase}
                setMode={setMode}
                isOnline={isOnline}
                toggleOnline={() => setIsOnline(!isOnline)}
              />
            )}
            {mode === AppMode.FLASHCARDS && (
              <FlashcardDeck 
                subjectName={activeSubject.name} 
                contextNotes={currentNotes + (activeSubject.knowledgeBase || '')}
                onClose={() => setMode(AppMode.CHAT)}
              />
            )}
            {mode === AppMode.QUIZ && (
              <QuizView 
                subjectName={activeSubject.name}
                onClose={() => setMode(AppMode.CHAT)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;