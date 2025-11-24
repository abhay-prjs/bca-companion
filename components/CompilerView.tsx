import React, { useState, useRef } from 'react';
import { compileCode, scanCodeFromImage } from '../services/geminiService';

interface CompilerViewProps {
  onClose: () => void;
}

const DEFAULT_CODE = `#include <stdio.h>

int main() {
    printf("Hello, BCA Student!\\n");
    return 0;
}`;

const CompilerView: React.FC<CompilerViewProps> = ({ onClose }) => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [stdin, setStdin] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and executing...');
    const result = await compileCode(code, stdin);
    setOutput(result);
    setIsRunning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = (event.target?.result as string).split(',')[1];
      const mimeType = file.type;
      
      const extractedCode = await scanCodeFromImage(base64String, mimeType);
      setCode(extractedCode);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <i className="fas fa-terminal text-green-400 text-xl"></i>
          <div>
            <h2 className="font-bold text-lg">C Programming Lab</h2>
            <p className="text-xs text-gray-400">AI-Powered Compiler & Scanner</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isScanning || isRunning}
             className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isScanning ? 'bg-gray-700 text-gray-400' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
           >
             {isScanning ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
             <span className="hidden sm:inline">Scan Code</span>
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
             accept="image/*" 
             capture="environment"
             className="hidden" 
           />

           <button 
             onClick={handleRun}
             disabled={isRunning || isScanning}
             className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isRunning ? 'bg-green-800 text-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'}`}
           >
             {isRunning ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-play"></i>}
             <span>Run</span>
           </button>
           
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
             <i className="fas fa-times text-lg"></i>
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Pane: Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-700 min-h-[50%] md:min-h-0">
          <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between">
            <span>main.c</span>
            <span>Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-[#1e1e1e] text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Right Pane: IO & Terminal */}
        <div className="md:w-1/3 w-full flex flex-col min-h-[40%] bg-black">
           
           {/* Stdin Section */}
           <div className="h-1/3 flex flex-col border-b border-gray-800">
             <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400">
               Standard Input (stdin)
             </div>
             <textarea 
               value={stdin}
               onChange={(e) => setStdin(e.target.value)}
               placeholder="Enter input for scanf here..."
               className="flex-1 w-full bg-black text-white font-mono text-sm p-4 resize-none focus:outline-none border-none placeholder-gray-700"
             />
           </div>

           {/* Output Section */}
           <div className="flex-1 flex flex-col">
              <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 flex justify-between items-center">
                <span>Output</span>
                <button onClick={() => setOutput('')} className="hover:text-white">Clear</button>
              </div>
              <pre className="flex-1 p-4 font-mono text-sm overflow-auto text-green-400 whitespace-pre-wrap">
                {output || <span className="text-gray-600 italic">// Output will appear here...</span>}
              </pre>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CompilerView;