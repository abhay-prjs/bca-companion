import React from 'react';
import { Semester, Subject, SubjectId, Unit } from '../types';

interface SidebarProps {
  semester: Semester | null;
  activeSubjectId: SubjectId | null;
  onSelectSubject: (id: SubjectId) => void;
  onBackToSemesters: () => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  learnerMode: boolean;
  toggleLearnerMode: () => void;
  onToggleUnit: (subjectId: SubjectId, unitId: string) => void;
  subjects: Subject[];
  onShowAbout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  semester,
  activeSubjectId, 
  onSelectSubject, 
  onBackToSemesters,
  isMobileMenuOpen,
  closeMobileMenu,
  learnerMode,
  toggleLearnerMode,
  onToggleUnit,
  subjects,
  onShowAbout
}) => {
  
  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  // Calculate Semester Progress
  const calculateProgress = () => {
    if (!subjects.length) return 0;
    let totalUnits = 0;
    let completedUnits = 0;
    subjects.forEach(sub => {
        totalUnits += sub.units.length;
        completedUnits += sub.units.filter(u => u.isCompleted).length;
    });
    return totalUnits === 0 ? 0 : Math.round((completedUnits / totalUnits) * 100);
  };

  const progress = calculateProgress();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-72 transform transition-transform duration-200 ease-in-out z-30 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={onBackToSemesters} className="text-gray-400 hover:text-indigo-600 transition-colors">
                <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight truncate">
                {semester ? semester.name : 'BCA Assistant'}
            </h1>
          </div>

          {/* Semester Progress Bar */}
          {semester && (
            <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-500">Semester Progress</span>
                    <span className="font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
          )}
        </div>

        {/* Subjects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Subjects
          </h2>
          <div className="space-y-2">
            {subjects.map((subject) => {
                const subjectProgress = Math.round((subject.units.filter(u => u.isCompleted).length / subject.units.length) * 100);
                const isActive = activeSubjectId === subject.id;

                return (
                    <div key={subject.id} className="space-y-1">
                        <button
                            onClick={() => {
                            onSelectSubject(subject.id);
                            closeMobileMenu();
                            }}
                            className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-all
                            ${isActive 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                <i className={`fas ${subject.icon} text-xs ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{subject.name}</div>
                                {learnerMode && (
                                    <div className="text-[10px] text-gray-400">{subjectProgress}% Complete</div>
                                )}
                            </div>
                        </button>

                        {/* Learner Mode: Unit Checklist */}
                        {isActive && learnerMode && (
                            <div className="ml-4 pl-4 border-l-2 border-indigo-100 space-y-2 py-2 animate-fade-in">
                                {subject.units.map((unit) => (
                                    <div key={unit.id} className="flex items-start space-x-2">
                                        <input 
                                            type="checkbox" 
                                            checked={unit.isCompleted}
                                            onChange={() => onToggleUnit(subject.id, unit.id)}
                                            className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <label 
                                            onClick={() => onToggleUnit(subject.id, unit.id)}
                                            className={`text-xs cursor-pointer hover:text-indigo-600 ${unit.isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'}`}
                                        >
                                            {unit.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Learner Mode</span>
            <button 
                onClick={toggleLearnerMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${learnerMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${learnerMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* About the Lazy Ahh Button */}
          <button 
            onClick={onShowAbout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium border border-purple-100 shadow-sm"
          >
            <i className="fas fa-bed"></i>
            <span>About the lazy ahh</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;