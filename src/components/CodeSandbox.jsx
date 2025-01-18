import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayIcon, 
  StopIcon,
  ArrowPathIcon,
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const supportedLanguages = {
  python: {
    name: 'Python',
    engine: 'pyodide',
    version: '3.11',
  },
  javascript: {
    name: 'JavaScript',
    engine: 'node',
    version: '18.x',
  },
  typescript: {
    name: 'TypeScript',
    engine: 'deno',
    version: '1.x',
  },
};

const CodeSandbox = ({ code, language }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'javascript');

  useEffect(() => {
    let pyodide = null;

    const initPyodide = async () => {
      if (selectedLanguage === 'python' && !window.pyodide) {
        // Load Pyodide
        const loadPyodide = await import("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");
        pyodide = await loadPyodide.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        window.pyodide = pyodide;
      }
    };

    initPyodide();

    return () => {
      if (pyodide) {
        pyodide.destroy();
      }
    };
  }, [selectedLanguage]);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      let result = '';

      switch (selectedLanguage) {
        case 'python':
          if (!window.pyodide) {
            throw new Error('Python runtime not loaded');
          }
          try {
            // Redirect stdout to capture print statements
            window.pyodide.runPython(`
              import sys
              import io
              sys.stdout = io.StringIO()
            `);
            
            // Run the actual code
            window.pyodide.runPython(code);
            
            // Get captured output
            result = window.pyodide.runPython('sys.stdout.getvalue()');
          } catch (e) {
            throw new Error(e.message);
          }
          break;

        case 'javascript':
          // Create a secure sandbox using iframe
          const sandbox = document.createElement('iframe');
          sandbox.style.display = 'none';
          document.body.appendChild(sandbox);

          try {
            // Redirect console.log
            const logs = [];
            sandbox.contentWindow.console.log = (...args) => {
              logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            };

            // Run code in sandbox
            const wrapped = `
              try {
                ${code}
              } catch (error) {
                console.log('Error:', error.message);
              }
            `;
            sandbox.contentWindow.eval(wrapped);
            result = logs.join('\n');
          } finally {
            document.body.removeChild(sandbox);
          }
          break;

        case 'typescript':
          // For TypeScript, we'll use the Deno Deploy playground API
          const response = await fetch('https://deno.com/playground/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          const data = await response.json();
          result = data.output || data.error;
          break;

        default:
          throw new Error('Unsupported language');
      }

      setOutput(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[color:var(--color-surface-hover)] px-2 py-1 rounded-lg outline-none"
          >
            {Object.entries(supportedLanguages).map(([key, { name, version }]) => (
              <option key={key} value={key}>
                {name} {version}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
          >
            {isCopied ? (
              <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ClipboardIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors
              ${isRunning
                ? 'bg-red-500/20 hover:bg-red-500/30'
                : 'bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)]'
              }`}
          >
            {isRunning ? (
              <>
                <StopIcon className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4" />
                <span>Run</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 rounded-lg hover:bg-[color:var(--color-surface-hover)] transition-colors"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Code Output */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {error ? (
              <div className="p-4 bg-red-500/10 text-red-500 font-mono text-sm whitespace-pre-wrap">
                {error}
              </div>
            ) : output ? (
              <div className="p-4 font-mono text-sm whitespace-pre-wrap">
                {output}
              </div>
            ) : (
              <div className="p-4 text-[color:var(--color-text-secondary)] italic">
                Click "Run" to execute the code
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeSandbox;
