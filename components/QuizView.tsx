import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizViewProps {
  subjectName: string;
  onClose: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ subjectName, onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy'|'Medium'|'Hard'>('Medium');
  const [topic, setTopic] = useState('');

  const startQuiz = async () => {
    if (!topic) return;
    setIsLoading(true);
    const q = await generateQuiz(topic, subjectName, difficulty);
    setQuestions(q);
    setStarted(true);
    setIsLoading(false);
    setCurrentQ(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    if (index === questions[currentQ].correctAnswerIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // End of quiz logic could go here
      alert(`Quiz finished! Score: ${score}/${questions.length}`);
      onClose();
    }
  };

  if (!started) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex justify-between">
          <h2 className="font-bold text-gray-800">Quiz Generator</h2>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <div className="text-center mb-6">
              <i className="fas fa-brain text-4xl text-indigo-500 mb-4"></i>
              <h3 className="text-xl font-bold">Setup Quiz for {subjectName}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Integration, Arrays"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d as any)}
                      className={`p-2 text-sm rounded-lg border ${difficulty === d ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startQuiz}
                disabled={isLoading || !topic}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Generating...' : 'Start Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
       <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h2 className="font-bold text-gray-800">Question {currentQ + 1}/{questions.length}</h2>
             <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Score: {score}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">Exit</button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full">
           <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-6">{q.question}</h3>
             
             <div className="space-y-3">
               {q.options.map((opt, idx) => {
                 let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                 if (selectedOption === null) {
                   btnClass += "border-gray-100 hover:border-indigo-200 hover:bg-gray-50";
                 } else {
                   if (idx === q.correctAnswerIndex) {
                     btnClass += "border-green-500 bg-green-50 text-green-800";
                   } else if (idx === selectedOption) {
                     btnClass += "border-red-500 bg-red-50 text-red-800";
                   } else {
                     btnClass += "border-gray-100 opacity-50";
                   }
                 }

                 return (
                   <button 
                    key={idx} 
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={btnClass}
                   >
                     <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                   </button>
                 );
               })}
             </div>
           </div>

           {showExplanation && (
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 animate-fade-in">
               <h4 className="font-bold text-blue-800 text-sm mb-1"><i className="fas fa-info-circle mr-2"></i>Explanation</h4>
               <p className="text-blue-700 text-sm">{q.explanation}</p>
             </div>
           )}

           {selectedOption !== null && (
             <div className="flex justify-end">
               <button 
                 onClick={nextQuestion}
                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg"
               >
                 {currentQ === questions.length - 1 ? 'Finish' : 'Next Question'} <i className="fas fa-arrow-right ml-2"></i>
               </button>
             </div>
           )}
        </div>
    </div>
  );
};

export default QuizView;