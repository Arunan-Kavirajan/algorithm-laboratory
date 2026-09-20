import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { RaceTrack } from '../components/RaceTrack';
import { RaceGraphVisualizer } from '../components/RaceGraphVisualizer';
import { Play, Pause, RotateCcw, Loader2, Trophy, FastForward, Activity, Database } from 'lucide-react';
import type { ExecutionResult, ExecutionEvent } from '../types';
import { generateReport } from '../utils/benchmarkReports';

const ALGORITHM_DATA: Record<string, { time: string, space: string, name: string }> = {
    'bubble_sort': { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
    'selection_sort': { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
    'insertion_sort': { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
    'merge_sort': { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
    'quick_sort': { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
    'heap_sort': { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)' },
    'linear_search': { name: 'Linear Search', time: 'O(n)', space: 'O(1)' },
    'binary_search': { name: 'Binary Search', time: 'O(log n)', space: 'O(1)' },
    'bfs': { name: 'BFS', time: 'O(V+E)', space: 'O(V)' },
    'dfs': { name: 'DFS', time: 'O(V+E)', space: 'O(V)' },
    'dijkstra': { name: "Dijkstra's", time: 'O(V²)', space: 'O(V)' },
};

export function Benchmark() {
    const [category, setCategory] = useState<'Sorting' | 'Searching' | 'Graph Algorithms'>('Sorting');
    
    const [algorithmA, setAlgorithmA] = useState('quick_sort');
    const [algorithmB, setAlgorithmB] = useState('bubble_sort');
    const [arraySize, setArraySize] = useState(25);
    const [playbackSpeed, setPlaybackSpeed] = useState(80); // 1 to 100
    
    // Dataset state for searching/graphs
    const [dataset, setDataset] = useState<any>(null);
    const [searchTarget, setSearchTarget] = useState<number | string>(25);

    const [loading, setLoading] = useState(false);
    const [eventsA, setEventsA] = useState<ExecutionEvent[]>([]);
    const [eventsB, setEventsB] = useState<ExecutionEvent[]>([]);
    
    const [stepA, setStepA] = useState(0);
    const [stepB, setStepB] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const timerRef = useRef<number | null>(null);

    // Whenever category or size changes, regenerate the underlying dataset
    useEffect(() => {
        setIsPlaying(false);
        setStepA(0);
        setStepB(0);
        setEventsA([]);
        setEventsB([]);
        
        let newDataset: any;

        if (category === 'Sorting') {
            const values = Array.from({ length: arraySize }, (_, i) => ({
                id: `el-${i}`,
                value: Math.floor(Math.random() * 95) + 5
            }));
            newDataset = { type: "ARRAY", values };
            setAlgorithmA('quick_sort');
            setAlgorithmB('bubble_sort');
        } else if (category === 'Searching') {
            const values = Array.from({ length: arraySize }, (_, i) => ({
                id: `el-${i}`,
                value: Math.floor(Math.random() * 95) + 5
            })).sort((a, b) => a.value - b.value); // Must be sorted for binary search!
            newDataset = { type: "ARRAY", values };
            setAlgorithmA('binary_search');
            setAlgorithmB('linear_search');
            
            // Auto-select a valid target
            const randomIndex = Math.floor(Math.random() * values.length);
            setSearchTarget(values[randomIndex].value);
        } else if (category === 'Graph Algorithms') {
            const numNodes = Math.min(15, Math.floor(arraySize / 2));
            const nodes = Array.from({ length: numNodes }, (_, i) => {
                const angle = (i / numNodes) * 2 * Math.PI;
                const radius = 35 + Math.random() * 10;
                return {
                    id: String.fromCharCode(65 + i),
                    value: i, // Must be an integer for backend validation!
                    x: 50 + radius * Math.cos(angle),
                    y: 50 + radius * Math.sin(angle)
                };
            });
            const edges = [];
            for (let i = 0; i < numNodes; i++) {
                edges.push({ source: nodes[i].id, target: nodes[(i + 1) % numNodes].id, weight: 1 });
                if (Math.random() > 0.5) {
                    const randomTarget = Math.floor(Math.random() * numNodes);
                    if (randomTarget !== i) {
                        edges.push({ source: nodes[i].id, target: nodes[randomTarget].id, weight: 1 });
                    }
                }
            }
            newDataset = { type: "GRAPH", nodes, edges };
            setAlgorithmA('bfs');
            setAlgorithmB('dfs');
            setSearchTarget(nodes[nodes.length - 1].value);
        }

        setDataset(newDataset);
    }, [category, arraySize]);

    // Playback loop
    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        const delay = Math.max(10, 500 - ((playbackSpeed - 1) * (490 / 99)));

        timerRef.current = window.setInterval(() => {
            let finishedA = false;
            let finishedB = false;

            setStepA(prev => {
                if (prev >= eventsA.length - 1) {
                    finishedA = true;
                    return prev;
                }
                return prev + 1;
            });

            setStepB(prev => {
                if (prev >= eventsB.length - 1) {
                    finishedB = true;
                    return prev;
                }
                return prev + 1;
            });

            if (finishedA && finishedB) {
                setIsPlaying(false);
            }
        }, delay);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, eventsA.length, eventsB.length, playbackSpeed]);

    const executeRace = async () => {
        if (!dataset) return;
        
        setLoading(true);
        setIsPlaying(false);
        setStepA(0);
        setStepB(0);
        setEventsA([]);
        setEventsB([]);

        try {
            const payloadA: any = { algorithmId: algorithmA, dataset };
            const payloadB: any = { algorithmId: algorithmB, dataset };
            
            if (category === 'Searching' || category === 'Graph Algorithms') {
                payloadA.target = Number(searchTarget);
                payloadB.target = Number(searchTarget);
            }

            const [resA, resB] = await Promise.all([
                axios.post<ExecutionResult>('/api/execute', payloadA),
                axios.post<ExecutionResult>('/api/execute', payloadB)
            ]);

            setEventsA(resA.data.events);
            setEventsB(resB.data.events);
            setIsPlaying(true);
        } catch (err) {
            console.error("Race failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const isFinishedA = eventsA.length > 0 && stepA >= eventsA.length - 1;
    const isFinishedB = eventsB.length > 0 && stepB >= eventsB.length - 1;
    const bothFinished = isFinishedA && isFinishedB;
    const hasData = eventsA.length > 0 && eventsB.length > 0;

    let winnerId: 'A' | 'B' | 'TIE' | null = null;
    if (bothFinished) {
        if (eventsA.length < eventsB.length) winnerId = 'A';
        else if (eventsB.length < eventsA.length) winnerId = 'B';
        else winnerId = 'TIE';
    }

    const resetRace = () => {
        setIsPlaying(false);
        setStepA(0);
        setStepB(0);
    };

    const handleAlgorithmChange = (id: string, setter: (val: string) => void) => {
        setter(id);
        if (hasData) {
            setIsPlaying(false);
            setStepA(0);
            setStepB(0);
            setEventsA([]);
            setEventsB([]);
        }
    };

    const generatedReport = useMemo<string[]>(() => {
        if (!bothFinished) return [];
        return generateReport(algorithmA, algorithmB, eventsA, eventsB);
    }, [algorithmA, algorithmB, eventsA, eventsB, bothFinished]);

    const maxSteps = bothFinished ? Math.max(eventsA.length, eventsB.length) : 1;
    const maxComp = bothFinished ? Math.max(eventsA[eventsA.length-1].metrics.comparisons, eventsB[eventsB.length-1].metrics.comparisons) : 1;
    const maxSwaps = bothFinished ? Math.max(eventsA[eventsA.length-1].metrics.swaps, eventsB[eventsB.length-1].metrics.swaps) : 1;

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
            
            {/* Header / Global Controls */}
            <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex items-center justify-between z-10 shrink-0 overflow-x-auto">
                <div className="flex items-center">
                    <div className="flex items-center gap-3 border-r border-border/50 pr-4 md:pr-6 shrink-0">
                        <Trophy size={16} className="text-accent" />
                        <span className="font-display font-bold text-text uppercase tracking-wider text-sm hidden md:block">Algorithmic Racing</span>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 ml-4 md:ml-6 shrink-0">
                        
                        {/* Category Selector */}
                        <div className="flex bg-surface-raised p-1 rounded-lg border border-border-subtle shrink-0">
                            {(['Sorting', 'Searching', 'Graph Algorithms'] as const).map(cat => (
                                <button
                                    key={cat}
                                    disabled={isPlaying || loading}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 text-xs font-bold font-mono rounded-md uppercase tracking-wider transition-colors ${
                                        category === cat 
                                        ? 'bg-accent/20 text-accent' 
                                        : 'text-text-muted hover:text-text disabled:opacity-50'
                                    }`}
                                >
                                    {cat.split(' ')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Dataset Size */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                                <Database size={12} /> Size
                            </span>
                            <div className="flex items-center gap-2.5">
                                <input
                                    type="range"
                                    min="10"
                                    max="75"
                                    value={arraySize}
                                    onChange={(e) => setArraySize(Number(e.target.value))}
                                    className="w-20 md:w-24 accent-accent"
                                    disabled={isPlaying || loading}
                                />
                                <span className="font-mono text-text-muted text-xs w-5">{arraySize}</span>
                            </div>
                        </div>

                        {/* Target Selector (If Searching or Graph) */}
                        {(category === 'Searching' || category === 'Graph Algorithms') && (
                            <div className="flex flex-col gap-1.5 shrink-0">
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                                    Target
                                </span>
                                <div className="flex items-center h-[24px]">
                                    <select
                                        value={searchTarget}
                                        onChange={(e) => setSearchTarget(e.target.value)}
                                        disabled={isPlaying || loading}
                                        className="bg-transparent text-text font-mono font-bold outline-none text-sm cursor-pointer border-b border-border-subtle pb-0.5"
                                    >
                                        {dataset?.type === 'ARRAY' && dataset.values.map((v: any) => (
                                            <option key={v.id} value={v.value} className="bg-surface text-text">{v.value}</option>
                                        ))}
                                        {dataset?.type === 'GRAPH' && dataset.nodes.map((n: any) => (
                                            <option key={n.id} value={n.value} className="bg-surface text-text">{n.value}</option>
                                        ))}
                                        <option value={-999} className="bg-surface text-text">None</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="w-px h-8 bg-border/50 hidden sm:block mx-2" />

                        {/* Playback Speed */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                                <FastForward size={12} /> Speed
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={playbackSpeed}
                                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                                    className="w-20 md:w-24 accent-accent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Action */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    {bothFinished ? (
                        <button 
                            onClick={resetRace}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-raised border border-border rounded-xl text-text hover:bg-surface-hover hover:text-white transition-all text-xs font-bold font-mono tracking-wider uppercase"
                        >
                            <RotateCcw size={14} /> Clear
                        </button>
                    ) : isPlaying ? (
                        <button 
                            onClick={() => setIsPlaying(false)}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-text text-background rounded-xl hover:bg-white transition-colors text-xs font-bold font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        >
                            <Pause size={14} /> Pause
                        </button>
                    ) : (
                        <button 
                            onClick={hasData ? () => setIsPlaying(true) : executeRace}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 px-6 py-2 ${hasData ? 'bg-accent/20 text-accent hover:bg-accent/30' : 'bg-accent text-background hover:bg-accent/90 shadow-[0_0_20px_rgba(56,189,248,0.2)]'} rounded-xl transition-all text-xs font-bold font-mono tracking-wider uppercase disabled:opacity-50`}
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                            {hasData ? 'Resume' : 'Execute'}
                        </button>
                    )}
                </div>
            </header>

            {/* Split Track Area */}
            <main className={`flex-1 p-6 flex gap-6 overflow-hidden relative transition-all duration-500 ${bothFinished ? 'h-[40%] min-h-[300px] shrink-0' : 'h-full'}`}>
                <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />
                
                {/* Track A */}
                <div className="flex-1 flex flex-col gap-4 relative z-10 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-accent tracking-widest uppercase">Track A</span>
                            <div className="flex gap-2 text-[10px] font-mono opacity-70">
                                <span className="bg-surface-raised px-2 py-0.5 rounded border border-border-subtle">⏱ {ALGORITHM_DATA[algorithmA]?.time}</span>
                                <span className="bg-surface-raised px-2 py-0.5 rounded border border-border-subtle">💾 {ALGORITHM_DATA[algorithmA]?.space}</span>
                            </div>
                        </div>
                        <AlgorithmSelector 
                            value={algorithmA} 
                            onChange={(id) => handleAlgorithmChange(id, setAlgorithmA)}
                            category={category}
                            disabled={isPlaying || loading}
                        />
                    </div>
                    {category === 'Graph Algorithms' ? (
                        <RaceGraphVisualizer events={eventsA} currentStepIndex={stepA} />
                    ) : (
                        <RaceTrack title="Algorithm A" algorithmId={algorithmA} events={eventsA} currentStepIndex={stepA} winner={winnerId === 'A'} />
                    )}
                </div>

                {/* VS Divider */}
                <div className="w-px bg-border/50 flex flex-col items-center justify-center relative z-10">
                    <div className="absolute bg-surface-raised border border-border px-3 py-1 rounded-full text-xs font-bold text-text-muted tracking-widest">
                        VS
                    </div>
                </div>

                {/* Track B */}
                <div className="flex-1 flex flex-col gap-4 relative z-10 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-accent tracking-widest uppercase">Track B</span>
                            <div className="flex gap-2 text-[10px] font-mono opacity-70">
                                <span className="bg-surface-raised px-2 py-0.5 rounded border border-border-subtle">⏱ {ALGORITHM_DATA[algorithmB]?.time}</span>
                                <span className="bg-surface-raised px-2 py-0.5 rounded border border-border-subtle">💾 {ALGORITHM_DATA[algorithmB]?.space}</span>
                            </div>
                        </div>
                        <AlgorithmSelector 
                            value={algorithmB} 
                            onChange={(id) => handleAlgorithmChange(id, setAlgorithmB)}
                            category={category}
                            disabled={isPlaying || loading}
                        />
                    </div>
                    {category === 'Graph Algorithms' ? (
                        <RaceGraphVisualizer events={eventsB} currentStepIndex={stepB} />
                    ) : (
                        <RaceTrack title="Algorithm B" algorithmId={algorithmB} events={eventsB} currentStepIndex={stepB} winner={winnerId === 'B'} />
                    )}
                </div>
            </main>
            
            {/* Post-Race Detailed Summary */}
            {bothFinished && (
                <div className="h-[60%] border-t border-border bg-surface/95 backdrop-blur-md p-8 flex flex-col items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] overflow-y-auto overflow-x-hidden animate-in slide-in-from-bottom-12 duration-500">
                    <div className="flex items-center gap-3 mb-6 text-accent font-bold uppercase tracking-widest text-base border-b border-border/50 pb-4 w-full max-w-5xl justify-center">
                        <Activity size={18} /> Laboratory Benchmark Report
                    </div>
                    
                    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Visual Stats Block */}
                        <div className="flex flex-col gap-6 border border-border/50 rounded-xl p-6 bg-background shadow-inner">
                            <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Metrics Comparison</h3>
                            
                            {/* Total Steps */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-text-secondary">Total Steps</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${winnerId === 'A' ? 'bg-accent' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsA.length / maxSteps) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track A: {eventsA.length}</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${winnerId === 'B' ? 'bg-accent' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsB.length / maxSteps) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track B: {eventsB.length}</span>
                                </div>
                            </div>

                            {/* Comparisons */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-text-secondary">Total Comparisons</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${eventsA[eventsA.length-1].metrics.comparisons < eventsB[eventsB.length-1].metrics.comparisons ? 'bg-emerald-500' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsA[eventsA.length-1].metrics.comparisons / maxComp) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track A: {eventsA[eventsA.length-1].metrics.comparisons}</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${eventsB[eventsB.length-1].metrics.comparisons < eventsA[eventsA.length-1].metrics.comparisons ? 'bg-emerald-500' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsB[eventsB.length-1].metrics.comparisons / maxComp) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track B: {eventsB[eventsB.length-1].metrics.comparisons}</span>
                                </div>
                            </div>

                            {/* Swaps */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-text-secondary">Memory Writes / Mutations</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${eventsA[eventsA.length-1].metrics.swaps < eventsB[eventsB.length-1].metrics.swaps ? 'bg-emerald-500' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsA[eventsA.length-1].metrics.swaps / maxSwaps) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track A: {eventsA[eventsA.length-1].metrics.swaps}</span>
                                </div>
                                <div className="relative h-6 bg-surface-raised rounded overflow-hidden flex items-center border border-border-subtle">
                                    <div className={`absolute top-0 left-0 h-full ${eventsB[eventsB.length-1].metrics.swaps < eventsA[eventsA.length-1].metrics.swaps ? 'bg-emerald-500' : 'bg-surface-hover'} opacity-80`} style={{ width: `${(eventsB[eventsB.length-1].metrics.swaps / maxSwaps) * 100}%` }} />
                                    <span className="absolute left-2 text-[10px] font-mono font-bold z-10 mix-blend-difference text-white">Track B: {eventsB[eventsB.length-1].metrics.swaps}</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Text Block */}
                        <div className="flex flex-col gap-4 border border-border/50 rounded-xl p-6 bg-background shadow-inner">
                            <h3 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2">Laboratory Insights</h3>
                            <div className="flex flex-col gap-4 text-sm text-text-secondary leading-relaxed">
                                {generatedReport.map((paragraph: string, i: number) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                            
                            <div className="mt-auto pt-6 flex justify-end gap-3">
                                <button 
                                    onClick={resetRace}
                                    className="flex items-center gap-2 text-xs font-bold font-mono bg-surface-raised hover:bg-surface-hover text-text border border-border px-4 py-2 rounded uppercase tracking-wider transition-colors"
                                >
                                    <RotateCcw size={14} /> Play Again
                                </button>
                                <button 
                                    onClick={executeRace}
                                    className="flex items-center gap-2 text-xs font-bold font-mono bg-text hover:bg-text/90 text-background px-4 py-2 rounded uppercase tracking-wider transition-colors"
                                >
                                    Regenerate & Race
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
