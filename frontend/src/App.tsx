import { useState } from 'react';
import axios from 'axios';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { PlayerControls } from './components/PlayerControls';
import { usePlayerStore } from './store/usePlayerStore';
import { ExecutionResult } from './types';

function App() {
  const { setExecutionData } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [arraySize, setArraySize] = useState(15);

  const generateAndRun = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have a separate endpoint to generate datasets.
      // For now, let's just generate a random array in the frontend to send.
      const values = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
      
      const payload = {
        algorithmId: "bubble_sort",
        dataset: {
          type: "ARRAY",
          values: values
        }
      };

      const response = await axios.post<ExecutionResult>('http://localhost:8000/api/execute', payload);
      setExecutionData(response.data.events, response.data.summary);
    } catch (error) {
      console.error("Failed to execute algorithm:", error);
      alert("Failed to execute algorithm. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Algorithm Laboratory</h1>
            <p className="text-gray-500 mt-1">Interactive algorithm visualizer and learning tool</p>
          </div>
          
          <div className="flex gap-4 items-end">
             <label className="flex flex-col text-sm text-gray-600">
               Dataset Size:
               <input 
                 type="range" 
                 min="5" 
                 max="50" 
                 value={arraySize}
                 onChange={(e) => setArraySize(Number(e.target.value))}
                 className="mt-1"
               />
               <span className="text-xs text-center">{arraySize} elements</span>
             </label>
             <button 
               onClick={generateAndRun}
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm disabled:opacity-50"
             >
               {loading ? 'Running...' : 'Generate & Run Bubble Sort'}
             </button>
          </div>
        </header>

        <main>
          <SortingVisualizer />
          <PlayerControls />
        </main>
        
      </div>
    </div>
  );
}

export default App;
