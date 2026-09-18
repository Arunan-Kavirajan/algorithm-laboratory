import { useState } from 'react';
import axios from 'axios';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { PlayerControls } from './components/PlayerControls';
import { CodeViewer } from './components/CodeViewer';
import { usePlayerStore } from './store/usePlayerStore';
import type { ExecutionResult } from './types';

function App() {
  const { setExecutionData } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [arraySize, setArraySize] = useState(10); 
  const [activeAlgorithm, setActiveAlgorithm] = useState('bubble_sort');

  const generateAndRun = async () => {
    setLoading(true);
    try {
      const values = Array.from({ length: arraySize }, (_, i) => i + 1)
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }, i) => ({ 
            id: `block-${value}-${i}-${Math.random()}`,
            value: value * 5 
        })); 
      
      const payload = {
        algorithmId: activeAlgorithm,
        dataset: {
          type: "ARRAY",
          values: values
        }
      };

      const response = await axios.post<ExecutionResult>('http://localhost:8000/api/execute', payload);
      setExecutionData(response.data.events, response.data.summary, response.data.sourceCode, response.data.algorithmId);
    } catch (error) {
      console.error("Failed to execute algorithm:", error);
      alert("Failed to execute algorithm. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30">
      
      {/* Sleek Top Navigation */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="text-white font-bold font-mono tracking-tighter">AL</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-text">Algorithm Laboratory</h1>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider flex items-center gap-2">
                <select 
                    value={activeAlgorithm}
                    onChange={(e) => setActiveAlgorithm(e.target.value)}
                    className="bg-background border border-border text-accent rounded px-2 py-0.5 outline-none focus:border-accent"
                >
                    <option value="bubble_sort">Bubble Sort</option>
                    <option value="selection_sort">Selection Sort</option>
                </select>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 text-sm">
             <span className="text-text-muted">Size</span>
             <input 
               type="range" 
               min="5" 
               max="15" 
               value={arraySize}
               onChange={(e) => setArraySize(Number(e.target.value))}
               className="w-24 accent-accent"
             />
             <span className="font-mono text-text-muted w-4">{arraySize}</span>
           </div>
           
           <button 
             onClick={generateAndRun}
             disabled={loading}
             className="bg-text text-background hover:bg-white px-5 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
           >
             {loading ? 'Compiling...' : 'Execute'}
           </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* Left/Center: Visualizer & Controls */}
        <div className="col-span-2 flex flex-col border-r border-border bg-background">
          <div className="flex-1 p-8 overflow-hidden flex flex-col">
            <SortingVisualizer />
          </div>
          <div className="border-t border-border bg-surface">
            <PlayerControls />
          </div>
        </div>
        
        {/* Right: Code Viewer */}
        <div className="col-span-1 bg-surface flex flex-col overflow-hidden">
          <CodeViewer />
        </div>
        
      </main>
      
    </div>
  );
}

export default App;
