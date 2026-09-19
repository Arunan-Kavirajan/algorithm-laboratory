import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { usePlayerStore } from '../store/usePlayerStore';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { PlayerControls } from '../components/PlayerControls';
import { CodeViewer } from '../components/CodeViewer';
import { InteractiveCanvas } from '../components/InteractiveCanvas';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { Modal } from '../components/Modal';
import type { CustomNode, CustomEdge } from '../components/InteractiveCanvas';
import type { ExecutionResult } from '../types';
import { ChevronDown, Plus, Minus, Trash2, Play, Loader2, ArrowLeft } from 'lucide-react';

type BuildMode = 'ADD_NODE' | 'ADD_EDGE' | 'REMOVE_NODE';

export function Playground() {
    const [isBuilding, setIsBuilding] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeAlgorithm, setActiveAlgorithm] = useState('dijkstra');
    
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
                const targetNode = nodes.find(n => n.id === searchTarget);
                payload.target = targetNode ? targetNode.value : (nodes.length > 1 ? nodes[1].value : nodes[0].value);
            } else if (nodes.length > 1) {
                payload.target = nodes[1].value;
            } else {
                payload.target = nodes[0].value;
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
        <div className="flex-1 flex flex-col h-full relative">
            <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex flex-wrap items-center justify-between gap-4 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <AlgorithmSelector
                        value={activeAlgorithm}
                        onChange={setActiveAlgorithm}
                        filter={['bfs', 'dfs', 'dijkstra']}
                    />
                </div>

                {isBuilding ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-surface-raised/60 border border-border-subtle rounded-lg p-1">
                            <button 
                                onClick={() => setActiveMode('ADD_NODE')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeMode === 'ADD_NODE' ? 'bg-accent text-background shadow-sm' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
                            >
                                <Plus size={12} /> Node
                            </button>
                            <button 
                                onClick={() => setActiveMode('ADD_EDGE')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeMode === 'ADD_EDGE' ? 'bg-accent text-background shadow-sm' : 'text-text-muted hover:text-text hover:bg-surface-hover'}`}
                            >
                                <Plus size={12} /> Edge
                            </button>
                            <button 
                                onClick={() => setActiveMode('REMOVE_NODE')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activeMode === 'REMOVE_NODE' ? 'bg-state-swap text-white shadow-sm' : 'text-text-muted hover:text-state-swap hover:bg-surface-hover'}`}
                            >
                                <Minus size={12} /> Del
                            </button>
                            <div className="w-px h-4 bg-border-subtle mx-0.5" />
                            <button 
                                onClick={handleClearCanvas}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-state-swap hover:bg-state-swap/10 transition-colors"
                            >
                                <Trash2 size={12} /> Clear
                            </button>
                        </div>

                        {/* Custom Dropdown for Target Node */}
                        <div className="flex items-center gap-2 text-sm bg-surface-raised/60 px-3 py-1.5 rounded-lg border border-border-subtle focus-within:border-accent transition-all relative" ref={dropdownRef}>
                            <span className="text-text-muted font-medium text-[10px] uppercase tracking-widest">Target</span>
                            <div className="w-px h-4 bg-border-subtle mx-0.5" />
                            
                            <div 
                                className="flex items-center gap-2 cursor-pointer text-text font-mono font-bold min-w-12 justify-between text-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>{searchTarget || '---'}</span>
                                <ChevronDown size={12} className={`text-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-surface-raised border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="max-h-48 overflow-y-auto py-1">
                                        {nodes.length === 0 ? (
                                            <div className="px-4 py-2 text-xs text-text-muted italic">No nodes placed</div>
                                        ) : (
                                            nodes.map(n => (
                                                <button
                                                    key={n.id}
                                                    className={`w-full text-left px-4 py-2 text-sm font-mono font-bold transition-colors ${searchTarget === n.id ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:bg-surface-hover hover:text-text'}`}
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
                            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-background px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-accent-glow"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                            {loading ? 'Compiling...' : 'Execute'}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleReset}
                            className="flex items-center gap-2 bg-surface-raised hover:bg-surface-hover text-text px-4 py-1.5 rounded-lg text-sm font-medium transition-all border border-border-subtle"
                        >
                            <ArrowLeft size={14} /> Back to Builder
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                <div className="col-span-2 flex flex-col border-r border-border/60 bg-background relative">
                    <div className="absolute inset-0 dot-grid pointer-events-none" />
                    <div className="flex-1 p-8 overflow-hidden flex flex-col relative z-[1]">
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
                        <div className="border-t border-border/60 bg-surface/50 backdrop-blur-sm relative z-[1]">
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
