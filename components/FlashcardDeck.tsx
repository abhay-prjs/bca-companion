import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';

interface FlashcardDeckProps {
  subjectName: string;
  contextNotes: string;
  onClose: () => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ subjectName, contextNotes, onClose }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topic, setTopic] = useState('General Concepts');
  const [customTopic, setCustomTopic] = useState('');

  const loadCards = async (topicToLoad: string) => {
    setIsLoading(true);
    setCards([]); // Clear current
    const generated = await generateFlashcards(topicToLoad, subjectName, contextNotes);
    setCards(generated);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCards(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c - 1), 150);
    }
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      setTopic(customTopic);
      loadCards(customTopic);
      setCustomTopic('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <i className="fas fa-clone text-indigo-600"></i> 
          Flashcards: {subjectName}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        
        {/* Topic Selector */}
        <form onSubmit={handleTopicSubmit} className="w-full max-w-md mb-8 flex gap-2">
          <input 
            type="text" 
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Enter a topic (e.g., 'Pointers', 'Derivatives')"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Generate
          </button>
        </form>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-indigo-600">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">AI is generating study cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No cards generated. Try a different topic.</p>
          </div>
        ) : (
          <div className="w-full max-w-xl perspective-1000">
             {/* Card Container */}
             <div 
               className="relative h-80 w-full cursor-pointer group perspective"
               onClick={() => setIsFlipped(!isFlipped)}
             >
               <div className={`
                  relative w-full h-full transition-all duration-500 transform preserve-3d shadow-xl rounded-2xl
                  ${isFlipped ? 'rotate-y-180' : ''}
               `}>
                  {/* Front */}
                  <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-200">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-4">
                      {cards[currentIndex].topic}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {cards[currentIndex].front}
                    </h3>
                    <p className="absolute bottom-6 text-xs text-gray-400">Click to flip</p>
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full backface-hidden bg-indigo-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
                    <p className="text-lg font-medium leading-relaxed">
                      {cards[currentIndex].back}
                    </p>
                  </div>
               </div>
             </div>

             {/* Controls */}
             <div className="flex justify-between items-center mt-8 px-4">
               <button 
                 onClick={handlePrev}
                 disabled={currentIndex === 0}
                 className={`p-3 rounded-full ${currentIndex === 0 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
               >
                 <i className="fas fa-arrow-left text-xl"></i>
               </button>
               
               <span className="text-gray-500 font-medium">
                 {currentIndex + 1} / {cards.length}
               </span>

               <button 
                 onClick={handleNext}
                 disabled={currentIndex === cards.length - 1}
                 className={`p-3 rounded-full ${currentIndex === cards.length - 1 ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
               >
                 <i className="fas fa-arrow-right text-xl"></i>
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDeck;