import { useState } from 'react';
import axios from 'axios';
import { usePlayerStore } from '../store/usePlayerStore';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { PlayerControls } from '../components/PlayerControls';
import { CodeViewer } from '../components/CodeViewer';
import { InteractiveCanvas } from '../components/InteractiveCanvas';
import type { CustomNode, CustomEdge } from '../components/InteractiveCanvas';
import type { ExecutionResult } from '../types';

type BuildMode = 'ADD_NODE' | 'ADD_EDGE' | 'REMOVE_NODE';

export function Playground() {
    const [isBuilding, setIsBuilding] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeAlgorithm, setActiveAlgorithm] = useState('dijkstra');
    
    // We start without a target until they place nodes
    const [searchTarget, setSearchTarget] = useState<string>('');
    
    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<CustomEdge[]>([]);
    const [activeMode, setActiveMode] = useState<BuildMode>('ADD_NODE');

    const { setExecutionData, reset } = usePlayerStore();

    const generateAndRun = async () => {
        if (nodes.length === 0) {
            alert('Please add at least one node to the canvas.');
            return;
        }

        setLoading(true);
        try {
            const dataset = { type: 'GRAPH', nodes, edges };
            
            const payload: any = {
                algorithmId: activeAlgorithm,
                dataset: dataset
            };
            
            if (searchTarget) {
                payload.target = searchTarget;
            } else if (nodes.length > 1) {
                payload.target = nodes[1].id;
            } else {
                payload.target = nodes[0].id;
            }

            const response = await axios.post<ExecutionResult>('/api/execute', payload);
            setExecutionData(response.data.events, response.data.summary, response.data.sourceCode, response.data.algorithmId);
            setIsBuilding(false);
        } catch (error) {
            console.error("Failed to execute algorithm:", error);
            alert("Failed to execute algorithm. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        reset();
        setIsBuilding(true);
    };

    const handleClearCanvas = () => {
        setNodes([]);
        setEdges([]);
        setSearchTarget('');
        setActiveMode('ADD_NODE');
    };

    return (
        <div className="flex-1 flex flex-col font-sans selection:bg-accent/30 h-full relative">
            <header className="border-b border-border bg-surface px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold tracking-tight text-text">Playground Mode</h2>
                        <p className="text-xs text-text-muted font-mono uppercase tracking-wider flex items-center gap-2 mt-1">
                            <select 
                                value={activeAlgorithm}
                                onChange={(e) => setActiveAlgorithm(e.target.value)}
                                className="bg-background border border-border text-accent rounded px-2 py-0.5 outline-none focus:border-accent disabled:opacity-50"
                                disabled={!isBuilding}
                            >
                                <option value="bfs">Breadth-First Search (BFS)</option>
                                <option value="dfs">Depth-First Search (DFS)</option>
                                <option value="dijkstra">Dijkstra's Shortest Path</option>
                            </select>
                        </p>
                    </div>
                </div>

                {isBuilding ? (
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1">
                            <button 
                                onClick={() => setActiveMode('ADD_NODE')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeMode === 'ADD_NODE' ? 'bg-accent text-white' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
                            >
                                + Node
                            </button>
                            <button 
                                onClick={() => setActiveMode('ADD_EDGE')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeMode === 'ADD_EDGE' ? 'bg-accent text-white' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
                            >
                                + Edge
                            </button>
                            <button 
                                onClick={() => setActiveMode('REMOVE_NODE')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeMode === 'REMOVE_NODE' ? 'bg-red-500 text-white' : 'text-text-muted hover:text-red-400 hover:bg-surface-hover'}`}
                            >
                                - Del
                            </button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button 
                                onClick={handleClearCanvas}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm bg-surface/50 px-3 py-1.5 rounded-lg border border-border focus-within:border-accent transition-all">
                            <span className="text-text-muted font-medium text-xs uppercase tracking-widest">Target Node</span>
                            <div className="w-px h-4 bg-border mx-1" />
                            <select 
                                value={searchTarget}
                                onChange={(e) => setSearchTarget(e.target.value)}
                                className="bg-transparent text-text font-mono font-bold outline-none cursor-pointer min-w-16"
                            >
                                {nodes.length === 0 && <option value="">---</option>}
                                {nodes.map(n => (
                                    <option key={n.id} value={n.id}>{n.id}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button 
                            onClick={generateAndRun}
                            disabled={loading || nodes.length === 0}
                            className="bg-text text-background hover:bg-white px-5 py-1.5 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? 'Compiling...' : 'Execute'}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleReset}
                            className="bg-surface-hover text-text hover:bg-border px-5 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm"
                        >
                            ← Back to Builder
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                <div className="col-span-2 flex flex-col border-r border-border bg-background">
                    <div className="flex-1 p-8 overflow-hidden flex flex-col">
                        {isBuilding ? (
                            <InteractiveCanvas 
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={setNodes}
                                onEdgesChange={setEdges}
                                activeMode={activeMode}
                                isDijkstra={activeAlgorithm === 'dijkstra'}
                            />
                        ) : (
                            <GraphVisualizer />
                        )}
                    </div>
                    
                    {!isBuilding && (
                        <div className="border-t border-border bg-surface">
                            <PlayerControls />
                        </div>
                    )}
                </div>
                
                <div className="col-span-1 bg-surface flex flex-col overflow-hidden">
                    <CodeViewer />
                </div>
            </main>
        </div>
    );
}
