import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { RaceTrack } from '../components/RaceTrack';
import { Play, Pause, RotateCcw, Loader2, Trophy, FastForward, Activity, Database } from 'lucide-react';
import type { ExecutionResult, ExecutionEvent } from '../types';

const SORTING_ALGORITHMS = ['bubble_sort', 'selection_sort', 'insertion_sort', 'merge_sort', 'quick_sort', 'heap_sort'];

const ALGORITHM_DATA: Record<string, { time: string, space: string, name: string }> = {
    'bubble_sort': { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' },
    'selection_sort': { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)' },
    'insertion_sort': { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' },
    'merge_sort': { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' },
    'quick_sort': { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' },
    'heap_sort': { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)' },
};

function getAnalysisText(
    algA: string, algB: string, 
    eventsA: ExecutionEvent[], eventsB: ExecutionEvent[]
) {
    const stepsA = eventsA.length;
    const stepsB = eventsB.length;
    const dataA = ALGORITHM_DATA[algA];
    const dataB = ALGORITHM_DATA[algB];
    
    if (stepsA === stepsB) {
        return [`Both ${dataA.name} and ${dataB.name} sorted the dataset in exactly ${stepsA} steps.`, `This indicates identical structural performance for this specific randomized dataset arrangement. Both algorithms executed the exact same number of operations.`];
    }

    const winner = stepsA < stepsB ? 'A' : 'B';
    const winnerData = winner === 'A' ? dataA : dataB;
    const loserData = winner === 'A' ? dataB : dataA;
    
    const winSteps = winner === 'A' ? stepsA : stepsB;
    const loseSteps = winner === 'A' ? stepsB : stepsA;
    
    const winComp = (winner === 'A' ? eventsA : eventsB)[winSteps - 1].metrics.comparisons;
    const loseComp = (winner === 'A' ? eventsB : eventsA)[loseSteps - 1].metrics.comparisons;
    
    const speedup = (loseSteps / winSteps).toFixed(1);
    const diff = loseSteps - winSteps;
    
    const paragraphs = [];

    paragraphs.push(`${winnerData.name} (Track ${winner}) dominated this benchmark, completing the execution ${speedup}x faster than ${loserData.name}. It saved a total of ${diff} operational steps.`);

    if (winnerData.time !== loserData.time) {
        paragraphs.push(`This vividly demonstrates theoretical time complexity in practice. ${winnerData.name} operates at an average time complexity of ${winnerData.time}, which scales far better on larger datasets than the ${loserData.time} complexity of ${loserData.name}.`);
    } else {
        paragraphs.push(`Interestingly, both algorithms share an average time complexity of ${winnerData.time}. However, ${winnerData.name}'s specific approach proved highly optimized for this dataset's distribution.`);
    }

    if (winComp < loseComp) {
        paragraphs.push(`By drastically reducing algorithmic comparisons (${winComp} vs ${loseComp}), it avoided unnecessary inner-loop checks, proving its partitioning or searching strategy was highly efficient.`);
    } else {
        paragraphs.push(`Even though it performed more raw comparisons (${winComp} vs ${loseComp}), its memory write optimizations gave it the decisive performance edge.`);
    }

    return paragraphs;
}

export function Benchmark() {
    const [algorithmA, setAlgorithmA] = useState('quick_sort');
    const [algorithmB, setAlgorithmB] = useState('bubble_sort');
    const [arraySize, setArraySize] = useState(25);
    const [playbackSpeed, setPlaybackSpeed] = useState(80); // 1 to 100
    
    const [loading, setLoading] = useState(false);
    const [eventsA, setEventsA] = useState<ExecutionEvent[]>([]);
    const [eventsB, setEventsB] = useState<ExecutionEvent[]>([]);
    
    const [stepA, setStepA] = useState(0);
    const [stepB, setStepB] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const timerRef = useRef<number | null>(null);

    // Playback loop
    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        // speed: 1 to 100. delay: 500ms to 10ms.
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

    const generateAndRace = async () => {
        setLoading(true);
        setIsPlaying(false);
        setStepA(0);
        setStepB(0);
        setEventsA([]);
        setEventsB([]);

        try {
            // Generate identical dataset for both
            const values = Array.from({ length: arraySize }, (_, i) => ({
                id: `el-${i}`,
                value: Math.floor(Math.random() * 95) + 5
            }));
            const dataset = { type: "ARRAY", values };

            const [resA, resB] = await Promise.all([
                axios.post<ExecutionResult>('/api/execute', { algorithmId: algorithmA, dataset }),
                axios.post<ExecutionResult>('/api/execute', { algorithmId: algorithmB, dataset })
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

    // Derived max metrics for visual bar scaling
    const maxSteps = bothFinished ? Math.max(eventsA.length, eventsB.length) : 1;
    const maxComp = bothFinished ? Math.max(eventsA[eventsA.length-1].metrics.comparisons, eventsB[eventsB.length-1].metrics.comparisons) : 1;
    const maxSwaps = bothFinished ? Math.max(eventsA[eventsA.length-1].metrics.swaps, eventsB[eventsB.length-1].metrics.swaps) : 1;

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
            
            {/* Header / Global Controls */}
            <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center">
                    <div className="flex items-center gap-3 border-r border-border/50 pr-4 md:pr-6">
                        <Trophy size={16} className="text-accent" />
                        <span className="font-display font-bold text-text uppercase tracking-wider text-sm hidden md:block">Algorithmic Racing</span>
                    </div>

                    <div className="flex items-center gap-6 ml-4 md:ml-6">
                        {/* Dataset Size */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                                <Database size={12} /> Dataset Size
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

                        <div className="w-px h-8 bg-border/50 hidden sm:block" />

                        {/* Playback Speed */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                                <FastForward size={12} /> Playback Speed
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

                <div className="flex items-center gap-3">
                    {hasData && (
                        <div className="flex items-center gap-2 mr-2 md:mr-4 border-r border-border/50 pr-2 md:pr-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-raised hover:bg-surface-hover text-text transition-colors border border-border"
                                title={isPlaying ? "Pause Race" : "Resume Race"}
                            >
                                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button
                                onClick={resetRace}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-raised hover:bg-surface-hover text-text transition-colors border border-border"
                                title="Reset to Start"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={generateAndRace}
                        disabled={loading}
                        className="flex items-center gap-2 bg-text hover:bg-text/90 text-background px-4 md:px-6 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 uppercase tracking-wider"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                        <span className="hidden sm:inline">{loading ? 'Compiling...' : (hasData ? 'New Race' : 'Start Race')}</span>
                    </button>
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
                            onChange={setAlgorithmA}
                            filter={SORTING_ALGORITHMS}
                        />
                    </div>
                    <RaceTrack 
                        title="Algorithm A" 
                        algorithmId={algorithmA} 
                        events={eventsA} 
                        currentStepIndex={stepA}
                        winner={winnerId === 'A'}
                    />
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
                            onChange={setAlgorithmB}
                            filter={SORTING_ALGORITHMS}
                        />
                    </div>
                    <RaceTrack 
                        title="Algorithm B" 
                        algorithmId={algorithmB} 
                        events={eventsB} 
                        currentStepIndex={stepB}
                        winner={winnerId === 'B'}
                    />
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
                                    <span className="text-text-secondary">Array Writes / Swaps</span>
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
                                {getAnalysisText(algorithmA, algorithmB, eventsA, eventsB).map((paragraph, i) => (
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
                                    onClick={generateAndRace}
                                    className="flex items-center gap-2 text-xs font-bold font-mono bg-text hover:bg-text/90 text-background px-4 py-2 rounded uppercase tracking-wider transition-colors"
                                >
                                    New Random Dataset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
