import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { usePlayerStore } from '../store/usePlayerStore';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { PlayerControls } from '../components/PlayerControls';
import { CodeViewer } from '../components/CodeViewer';
import { InteractiveCanvas } from '../components/InteractiveCanvas';
import { Modal } from '../components/Modal';
import type { CustomNode, CustomEdge } from '../components/InteractiveCanvas';
import type { ExecutionResult } from '../types';
import { ChevronDown } from 'lucide-react';

type BuildMode = 'ADD_NODE' | 'ADD_EDGE' | 'REMOVE_NODE';

export function Playground() {
    const [isBuilding, setIsBuilding] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeAlgorithm, setActiveAlgorithm] = useState('dijkstra');
    
    // We start without a target until they place nodes
    const [searchTarget, setSearchTarget] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [nodes, setNodes] = useState<CustomNode[]>([]);
    const [edges, setEdges] = useState<CustomEdge[]>([]);
    const [activeMode, setActiveMode] = useState<BuildMode>('ADD_NODE');

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const { setExecutionData, reset } = usePlayerStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const generateAndRun = async () => {
        if (nodes.length === 0) {
            setAlertMessage('Please add at least one node to the canvas.');
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
            setAlertMessage("Failed to execute algorithm. Ensure you have properly connected your graph.");
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
                        <div className="text-xs text-text-muted font-mono uppercase tracking-wider flex items-center gap-2 mt-1 relative">
                            <select 
                                value={activeAlgorithm}
                                onChange={(e) => setActiveAlgorithm(e.target.value)}
                                className="bg-background border border-border text-accent rounded px-2 py-0.5 outline-none focus:border-accent disabled:opacity-50 appearance-none pr-8 cursor-pointer"
                                disabled={!isBuilding}
                            >
                                <option value="bfs">Breadth-First Search (BFS)</option>
                                <option value="dfs">Depth-First Search (DFS)</option>
                                <option value="dijkstra">Dijkstra's Shortest Path</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-accent" />
                        </div>
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

                        {/* Custom Dropdown for Target Node */}
                        <div className="flex items-center gap-2 text-sm bg-surface/50 px-3 py-1.5 rounded-lg border border-border focus-within:border-accent transition-all relative" ref={dropdownRef}>
                            <span className="text-text-muted font-medium text-xs uppercase tracking-widest">Target Node</span>
                            <div className="w-px h-4 bg-border mx-1" />
                            
                            <div 
                                className="flex items-center gap-2 cursor-pointer text-text font-mono font-bold min-w-16 justify-between"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>{searchTarget || '---'}</span>
                                <ChevronDown size={14} className="text-text-muted" />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-48 overflow-y-auto">
                                        {nodes.length === 0 ? (
                                            <div className="px-4 py-2 text-xs text-text-muted italic">No nodes placed</div>
                                        ) : (
                                            nodes.map(n => (
                                                <button
                                                    key={n.id}
                                                    className={`w-full text-left px-4 py-2 text-sm font-mono font-bold transition-colors ${searchTarget === n.id ? 'bg-accent/10 text-accent' : 'text-text hover:bg-surface-hover'}`}
                                                    onClick={() => {
                                                        setSearchTarget(n.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    {n.id}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
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

            <Modal 
                isOpen={!!alertMessage}
                title="Notice"
                message={alertMessage || ''}
                onClose={() => setAlertMessage(null)}
            />
        </div>
    );
}
