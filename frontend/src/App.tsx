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
  const [searchTarget, setSearchTarget] = useState(25);

  const isSearch = activeAlgorithm.includes('search');
  const requiresSorted = activeAlgorithm === 'binary_search';

  const generateAndRun = async () => {
    setLoading(true);
    try {
      let rawValues = Array.from({ length: arraySize }, (_, i) => i + 1)
        .map(value => ({ value, sort: Math.random() }));
        
      if (!requiresSorted) {
        rawValues.sort((a, b) => a.sort - b.sort);
      }
      
      const values = rawValues.map(({ value }, i) => ({ 
          id: `block-${value}-${i}-${Math.random()}`,
          value: value * 5 
      }));
      
      const payload: any = {
        algorithmId: activeAlgorithm,
        dataset: {
          type: "ARRAY",
          values: values
        }
      };
      
      if (isSearch) {
          payload.target = searchTarget;
      }

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
                    <option value="insertion_sort">Insertion Sort</option>
                    <option value="merge_sort">Merge Sort</option>
                    <option value="quick_sort">Quick Sort</option>
                    <option value="heap_sort">Heap Sort</option>
                    <option value="linear_search">Linear Search</option>
                    <option value="binary_search">Binary Search</option>
                </select>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           {isSearch && (
               <div className="flex items-center gap-2 text-sm bg-surface/50 px-3 py-1.5 rounded-lg border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/50 transition-all shadow-sm">
                   <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                   <span className="text-text-muted font-medium">Target</span>
                   <div className="w-px h-4 bg-border mx-1" />
                   <input 
                     type="number" 
                     value={searchTarget}
                     onChange={(e) => setSearchTarget(Number(e.target.value))}
                     className="w-12 bg-transparent text-text font-mono font-bold outline-none text-center appearance-none"
                   />
               </div>
           )}
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
