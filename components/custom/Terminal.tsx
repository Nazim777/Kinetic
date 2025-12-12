import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullText = [
    "> npm create bolt-app@latest my-awesome-project",
    "> initializing project structure...",
    "> installing dependencies...",
    "> connecting to AI engine...",
    "> ready. type prompt below."
  ];

  useEffect(() => {
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let timeoutId: number;

    const typeLine = () => {
      if (currentLineIndex >= fullText.length) return;

      const currentLineText = fullText[currentLineIndex];
      
      if (currentCharIndex <= currentLineText.length) {
        setLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = "";
          }
          newLines[currentLineIndex] = currentLineText.slice(0, currentCharIndex);
          return newLines;
        });
        currentCharIndex++;
        // Randomize typing speed slightly for realism
        timeoutId = window.setTimeout(typeLine, 30 + Math.random() * 50);
      } else {
        currentLineIndex++;
        currentCharIndex = 0;
        timeoutId = window.setTimeout(typeLine, 400); // Pause between lines
      }
    };

    timeoutId = window.setTimeout(typeLine, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 font-mono text-sm transform transition-all hover:scale-[1.02] duration-300">
      <div className="bg-gray-800/50 px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center text-gray-500 text-xs">
          <TerminalIcon className="w-3 h-3 mr-1" />
          bash
        </div>
      </div>
      <div className="p-4 h-64 text-gray-300 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">
             <span className="text-green-500 mr-2">$</span>
             <span className={i === 0 ? "text-brand-400" : ""}>{line}</span>
             {i === lines.length - 1 && i < fullText.length - 1 && (
               <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-cursor align-middle"></span>
             )}
          </div>
        ))}
        {lines.length === fullText.length && (
           <div className="mt-2 text-brand-400 animate-pulse">
             AI Agent is ready to build.
             <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-cursor align-middle"></span>
           </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;