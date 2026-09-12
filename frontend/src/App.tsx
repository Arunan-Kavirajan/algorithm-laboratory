import { useState } from 'react';
import axios from 'axios';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { PlayerControls } from './components/PlayerControls';
import { usePlayerStore } from './store/usePlayerStore';
import { ExecutionResult } from './types';

const ALGORITHMS = [
  { id: 'bubble_sort', name: 'Bubble Sort' },
  { id: 'selection_sort', name: 'Selection Sort' },
  { id: 'insertion_sort', name: 'Insertion Sort' },
  { id: 'merge_sort', name: 'Merge Sort' },
  { id: 'quick_sort', name: 'Quick Sort' },
  { id: 'heap_sort', name: 'Heap Sort' },
];

function App() {
  const { setExecutionData } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [arraySize, setArraySize] = useState(15);
  const [selectedAlgo, setSelectedAlgo] = useState('bubble_sort');

  const generateAndRun = async () => {
    setLoading(true);
    try {
      // Generate a dataset (unique values are better for Framer Motion keys)
      // We shuffle an array of 1 to arraySize to avoid duplicate keys.
      const values = Array.from({ length: arraySize }, (_, i) => i + 1)
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value * 5); // Scale up for visual height
      
      const payload = {
        algorithmId: selectedAlgo,
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
          
          <div className="flex gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
             <label className="flex flex-col text-sm text-gray-600">
               Algorithm:
               <select 
                 value={selectedAlgo} 
                 onChange={e => setSelectedAlgo(e.target.value)}
                 className="mt-1 p-2 border border-gray-300 rounded"
               >
                 {ALGORITHMS.map(algo => (
                   <option key={algo.id} value={algo.id}>{algo.name}</option>
                 ))}
               </select>
             </label>

             <label className="flex flex-col text-sm text-gray-600">
               Dataset Size:
               <input 
                 type="range" 
                 min="5" 
                 max="50" 
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

        <main>
          <SortingVisualizer />
          <PlayerControls />
        </main>
        
      </div>
    </div>
  );
}

export default App;
