import { useState } from 'react';
import axios from 'axios';
import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { GraphVisualizer } from './visualizers/GraphVisualizer';
import { PlayerControls } from './components/PlayerControls';
import { CodeViewer } from './components/CodeViewer';
import { usePlayerStore } from './store/usePlayerStore';
import type { ExecutionResult } from './types';

function App() {
  const { setExecutionData, algorithmId: currentRunningAlgorithm } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [arraySize, setArraySize] = useState(10); 
  const [activeAlgorithm, setActiveAlgorithm] = useState('bubble_sort');
  const [searchTarget, setSearchTarget] = useState(25);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSearch = activeAlgorithm.includes('search') || activeAlgorithm === 'bfs' || activeAlgorithm === 'dfs' || activeAlgorithm === 'dijkstra';
  const requiresSorted = activeAlgorithm === 'binary_search';
  const isGraphRunning = currentRunningAlgorithm === 'bfs' || currentRunningAlgorithm === 'dfs' || currentRunningAlgorithm === 'dijkstra';

  const generateAndRun = async () => {
    setLoading(true);
    try {
      let dataset: any;

      if (activeAlgorithm === 'bfs' || activeAlgorithm === 'dfs' || activeAlgorithm === 'dijkstra') {
          const nodes = [];
          const edges = [];
          const getWeight = () => activeAlgorithm === 'dijkstra' ? Math.floor(Math.random() * 9) + 1 : undefined;
          for (let i = 0; i < arraySize; i++) {
              const level = Math.floor(Math.log2(i + 1));
              const levelWidth = Math.pow(2, level);
              const indexInLevel = i - (levelWidth - 1);
              const x = (indexInLevel + 0.5) / levelWidth * 100;
              const y = level * 25 + 15; // Percentages for Y
              
              nodes.push({
                  id: `node-${i}`,
                  value: (i + 1) * 5,
                  x,
                  y
              });
              
              const leftChild = 2 * i + 1;
              const rightChild = 2 * i + 2;
              if (leftChild < arraySize) edges.push({ source: `node-${i}`, target: `node-${leftChild}`, weight: getWeight() });
              if (rightChild < arraySize) edges.push({ source: `node-${i}`, target: `node-${rightChild}`, weight: getWeight() });
          }
          
          // Let's add a few random edges to make it a generic graph, not strictly a tree!
          if (arraySize > 4) edges.push({ source: 'node-1', target: 'node-4', weight: getWeight() });
          if (arraySize > 5) edges.push({ source: 'node-2', target: 'node-3', weight: getWeight() });
          if (arraySize > 7) edges.push({ source: 'node-3', target: 'node-7', weight: getWeight() });
          if (arraySize > 8) edges.push({ source: 'node-4', target: 'node-6', weight: getWeight() });
          if (arraySize > 10) edges.push({ source: 'node-5', target: 'node-9', weight: getWeight() });
          if (arraySize > 12) edges.push({ source: 'node-7', target: 'node-10', weight: getWeight() });
          if (arraySize > 13) edges.push({ source: 'node-8', target: 'node-12', weight: getWeight() });
          if (arraySize > 14) edges.push({ source: 'node-11', target: 'node-14', weight: getWeight() });

          dataset = { type: "GRAPH", nodes, edges };
      } else {
          let rawValues = Array.from({ length: arraySize }, (_, i) => i + 1)
            .map(value => ({ value, sort: Math.random() }));
            
          if (!requiresSorted) {
            rawValues.sort((a, b) => a.sort - b.sort);
          }
          
          const values = rawValues.map(({ value }, i) => ({ 
              id: `block-${value}-${i}-${Math.random()}`,
              value: value * 5 
          }));
          
          dataset = { type: "ARRAY", values };
      }
      
      const payload: any = {
        algorithmId: activeAlgorithm,
        dataset: dataset
      };
      
      if (isSearch) {
          payload.target = searchTarget;
      }

      const response = await axios.post<ExecutionResult>('/api/execute', payload);
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
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center shadow-lg shadow-accent/20">
                    <span className="text-white font-bold font-mono tracking-tighter text-sm">AL</span>
                </div>
                <h2 className="text-sm font-bold tracking-tight text-text">Navigation</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-text-muted hover:text-text transition-colors rounded-lg p-1 hover:bg-surface-hover">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-3 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 text-accent font-medium border border-accent/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Visualizer
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Sandbox (Soon)
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Racing (Soon)
            </button>
        </div>
      </div>

      {/* Sleek Top Navigation */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 border-l border-border pl-4">
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
                    <option value="bfs">Breadth-First Search (BFS)</option>
                    <option value="dfs">Depth-First Search (DFS)</option>
                    <option value="dijkstra">Dijkstra's Shortest Path</option>
                </select>
            </p>
          </div>
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
            {isGraphRunning ? <GraphVisualizer /> : <SortingVisualizer />}
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
