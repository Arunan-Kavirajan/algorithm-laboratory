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
  const [arraySize, setArraySize] = useState(10); // Default to smaller for block view

  const generateAndRun = async () => {
    setLoading(true);
    try {
      // Generate a dataset (unique values are better for Framer Motion keys)
      // We shuffle an array of 1 to arraySize to avoid duplicate keys.
      const values = Array.from({ length: arraySize }, (_, i) => i + 1)
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value * 5); 
      
      const payload = {
        algorithmId: 'bubble_sort',
        dataset: {
          type: "ARRAY",
          values: values
        }
      };

      const response = await axios.post<ExecutionResult>('http://localhost:8000/api/execute', payload);
      setExecutionData(response.data.events, response.data.summary, response.data.sourceCode);
    } catch (error) {
      console.error("Failed to execute algorithm:", error);
      alert("Failed to execute algorithm. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Algorithm Laboratory</h1>
            <p className="text-gray-500 mt-1">High-Fidelity Bubble Sort</p>
          </div>
          
          <div className="flex gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
             <label className="flex flex-col text-sm text-gray-600">
               Dataset Size:
               <input 
                 type="range" 
                 min="5" 
                 max="15" 
                 value={arraySize}
                 onChange={(e) => setArraySize(Number(e.target.value))}
                 className="mt-3"
               />
               <span className="text-xs text-center">{arraySize} elements</span>
             </label>
             <button 
               onClick={generateAndRun}
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm disabled:opacity-50 h-[42px]"
             >
               {loading ? 'Running...' : 'Run'}
             </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="col-span-2 flex flex-col gap-4">
            <SortingVisualizer />
            <PlayerControls />
          </div>
          <div className="col-span-1 h-full">
            <CodeViewer />
          </div>
        </main>
        
      </div>
    </div>
  );
}

export default App;
