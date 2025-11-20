import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header with a bit of 'lazy' humor color */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white relative">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-bed"></i>
            About the Lazy Ahh
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl animate-pulse">
              😴
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 text-center">
            The Origin Story
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            This entire application exists solely because <strong>abhay_prjs</strong> really, <em>really</em> didn't want to study for BCA manually. 
          </p>
          
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            Faced with a mountain of PDFs, syllabus units, and assignments, Abhay did what any peak engineer would do: 
            <span className="italic text-indigo-600 font-medium"> spent 50 hours building an AI to avoid doing 2 hours of actual homework.</span>
          </p>

          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            It is not procrastination; it is <strong>strategic automation</strong>. Now, instead of reading the books, we just ask the AI. 
            You're welcome.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Developed By</p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              onClick={(e) => e.preventDefault()} 
            >
              <i className="fab fa-github"></i> abhay_prjs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;