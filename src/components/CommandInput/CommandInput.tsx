import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  lastResult: string | null;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, lastResult }) => {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Add to history and reset
    const trimmedValue = value.trim();
    setHistory((prev) => [trimmedValue, ...prev.slice(0, 9)]);
    onSubmit(trimmedValue);
    setValue('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle command history navigation with arrow keys
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      if (nextIndex >= 0 && history[nextIndex]) {
        setValue(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      if (nextIndex === -1) {
        setValue('');
      } else if (history[nextIndex]) {
        setValue(history[nextIndex]);
      }
    }
  };

  return (
    <div className="bg-charcoal-800 rounded-lg shadow-lg border border-charcoal-700 overflow-hidden">
      <div className="bg-charcoal-700 border-b border-charcoal-600 px-4 py-3 flex items-center">
        <div className="flex space-x-2 mr-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Terminal</h3>
      </div>
      
      <div className="p-4 bg-charcoal-900">
        {/* Command result display */}
        {lastResult && (
          <pre className="mb-4 bg-charcoal-800 text-green-400 p-4 rounded-lg font-mono whitespace-pre-wrap border border-charcoal-700 text-base max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-charcoal-600">
            {lastResult}
          </pre>
        )}
        
        {/* Command input with terminal styling */}
        <form className="flex items-center" onSubmit={handleSubmit}>
          <span className="text-accent-500 font-mono mr-2 text-lg">$</span>
          <input
            ref={inputRef}
            className="flex-1 p-3 text-lg bg-transparent text-white placeholder-gray-500 focus:outline-none font-mono border-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            spellCheck="false"
            autoComplete="off"
            aria-label="Command input"
          />
          <button 
            type="submit" 
            className="bg-accent-500 hover:bg-accent-600 text-charcoal-900 px-4 py-2 rounded-lg font-medium ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500">
            Run
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommandInput; 