import { useState, useEffect } from 'react';
import axios from 'axios';
import { SortingVisualizer } from '../visualizers/SortingVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { PlayerControls } from '../components/PlayerControls';
import { CodeViewer } from '../components/CodeViewer';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { usePlayerStore } from '../store/usePlayerStore';
import { Search, Play, Loader2 } from 'lucide-react';
import type { ExecutionResult } from '../types';

export function Visualizer() {
  const { setExecutionData, algorithmId: currentRunningAlgorithm } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const [activeAlgorithm, setActiveAlgorithm] = useState('bubble_sort');
  const [searchTarget, setSearchTarget] = useState(25);

  const [dataset, setDataset] = useState<any>(null);

  const isSearch = activeAlgorithm.includes('search') || activeAlgorithm === 'bfs' || activeAlgorithm === 'dfs' || activeAlgorithm === 'dijkstra';
  const requiresSorted = activeAlgorithm === 'binary_search';
  const isGraphAlgorithm = activeAlgorithm === 'bfs' || activeAlgorithm === 'dfs' || activeAlgorithm === 'dijkstra';
  const isGraphRunning = currentRunningAlgorithm === 'bfs' || currentRunningAlgorithm === 'dfs' || currentRunningAlgorithm === 'dijkstra';

  // Generate dataset whenever algorithm type (graph/array) or size changes
  useEffect(() => {
    let newDataset: any;
    if (isGraphAlgorithm) {
        const nodes = [];
        const edges = [];
        const getWeight = () => activeAlgorithm === 'dijkstra' ? Math.floor(Math.random() * 9) + 1 : undefined;
        const totalLevels = Math.floor(Math.log2(arraySize)) + 1;
        const yStep = totalLevels > 1 ? 77 / (totalLevels - 1) : 0;
        for (let i = 0; i < arraySize; i++) {
          const level = Math.floor(Math.log2(i + 1));
          const levelWidth = Math.pow(2, level);
          const indexInLevel = i - (levelWidth - 1);
          const x = ((indexInLevel + 0.5) / levelWidth) * 92 + 4;
          const y = level * yStep + 8;
          nodes.push({ id: `node-${i}`, value: i, x, y });
          if (i > 0) edges.push({ source: `node-${Math.floor((i - 1) / 2)}`, target: `node-${i}`, weight: getWeight() });
        }
        if (arraySize > 4) edges.push({ source: 'node-1', target: 'node-4', weight: getWeight() });
        if (arraySize > 5) edges.push({ source: 'node-2', target: 'node-3', weight: getWeight() });
        if (arraySize > 7) edges.push({ source: 'node-3', target: 'node-7', weight: getWeight() });
        if (arraySize > 8) edges.push({ source: 'node-4', target: 'node-6', weight: getWeight() });
        if (arraySize > 10) edges.push({ source: 'node-5', target: 'node-9', weight: getWeight() });
        if (arraySize > 12) edges.push({ source: 'node-7', target: 'node-10', weight: getWeight() });
        if (arraySize > 13) edges.push({ source: 'node-8', target: 'node-12', weight: getWeight() });
        if (arraySize > 14) edges.push({ source: 'node-11', target: 'node-14', weight: getWeight() });
        newDataset = { type: "GRAPH", nodes, edges };
    } else {
        const values = Array.from({ length: arraySize }, (_, i) => ({
          id: `el-${i}`,
          value: requiresSorted ? (i + 1) * 5 : Math.floor(Math.random() * 95) + 5
        }));
        newDataset = { type: "ARRAY", values };
    }
    setDataset(newDataset);
    
    // Auto-select a valid target for the new dataset
    if (newDataset.type === 'ARRAY') {
        const randomIndex = Math.floor(Math.random() * newDataset.values.length);
        setSearchTarget(newDataset.values[randomIndex].value);
    } else if (newDataset.type === 'GRAPH') {
        const randomIndex = Math.floor(Math.random() * newDataset.nodes.length);
        setSearchTarget(newDataset.nodes[randomIndex].value); // or id, assuming backend takes value/id
    }
  }, [arraySize, isGraphAlgorithm, requiresSorted, activeAlgorithm]);

  const executeAlgorithm = async () => {
    if (!dataset) return;
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative">

      {/* Visualizer Controls Sub-Header */}
      <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <AlgorithmSelector value={activeAlgorithm} onChange={setActiveAlgorithm} />
        </div>

        <div className="flex items-center gap-4">
           {isSearch && (
               <div className="flex items-center gap-2 text-sm bg-surface-raised/60 px-3 py-1.5 rounded-lg border border-border-subtle focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all">
                   <Search size={14} className="text-accent" />
                   <span className="text-text-muted font-medium text-xs">Target</span>
                   <div className="w-px h-4 bg-border-subtle mx-0.5" />
                   <select
                     value={searchTarget}
                     onChange={(e) => setSearchTarget(Number(e.target.value))}
                     className="w-32 bg-transparent text-text font-mono font-bold outline-none text-sm cursor-pointer"
                   >
                     {dataset?.type === 'ARRAY' && dataset.values.map((v: any) => (
                         <option key={v.id} value={v.value} className="bg-surface text-text">{v.value}</option>
                     ))}
                     {dataset?.type === 'GRAPH' && dataset.nodes.map((n: any) => (
                         <option key={n.id} value={n.value} className="bg-surface text-text">{n.value}</option>
                     ))}
                     <option value={-999} className="bg-surface text-text">None (Missing)</option>
                   </select>
               </div>
           )}
           <div className="flex items-center gap-2.5 text-sm">
             <span className="text-text-muted text-xs font-medium">Size</span>
             <input
               type="range"
               min="5"
               max="15"
               value={arraySize}
               onChange={(e) => setArraySize(Number(e.target.value))}
               className="w-20 accent-accent"
             />
             <span className="font-mono text-text-muted text-xs w-4">{arraySize}</span>
           </div>

           <button
             onClick={executeAlgorithm}
             disabled={loading}
             className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-background px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-accent-glow"
           >
             {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
             {loading ? 'Compiling...' : 'Execute'}
           </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">

        {/* Left/Center: Visualizer & Controls */}
        <div className="col-span-2 flex flex-col border-r border-border/60 bg-background relative">
          <div className="absolute inset-0 dot-grid pointer-events-none" />
          <div className="flex-1 p-8 overflow-hidden flex flex-col relative z-[1]">
            {isGraphRunning ? <GraphVisualizer /> : <SortingVisualizer />}
          </div>
          <div className="border-t border-border/60 bg-surface/50 backdrop-blur-sm relative z-[1]">
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
