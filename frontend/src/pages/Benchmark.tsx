import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { RaceTrack } from '../components/RaceTrack';
import { Play, Pause, RotateCcw, Loader2, Trophy, FastForward, Info } from 'lucide-react';
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

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
            
            {/* Header / Global Controls */}
            <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border-r border-border/50 pr-4">
                        <Trophy size={16} className="text-accent" />
                        <span className="font-display font-bold text-text uppercase tracking-wider text-sm hidden md:block">Algorithmic Racing</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm ml-2">
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Size</span>
                        <input
                            type="range"
                            min="10"
                            max="75"
                            value={arraySize}
                            onChange={(e) => setArraySize(Number(e.target.value))}
                            className="w-16 md:w-24 accent-accent"
                            disabled={isPlaying || loading}
                        />
                        <span className="font-mono text-text-muted text-xs w-4">{arraySize}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm ml-2 border-l border-border/50 pl-4">
                        <FastForward size={14} className="text-text-muted hidden sm:block" />
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Speed</span>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="w-16 md:w-24 accent-accent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasData && (
                        <div className="flex items-center gap-2 mr-4 border-r border-border/50 pr-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-raised hover:bg-surface-hover text-text transition-colors border border-border"
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
                        className="flex items-center gap-2 bg-text hover:bg-text/90 text-background px-6 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 uppercase tracking-wider"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                        {loading ? 'Compiling...' : (hasData ? 'New Race' : 'Start Race')}
                    </button>
                </div>
            </header>

            {/* Split Track Area */}
            <main className="flex-1 p-6 flex gap-6 overflow-hidden relative">
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
                <div className="border-t border-border bg-surface/95 backdrop-blur-md p-6 flex flex-col items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 mb-4 text-accent font-bold uppercase tracking-widest text-sm">
                        <Info size={16} /> Race Analysis Complete
                    </div>
                    
                    <div className="grid grid-cols-3 gap-12 w-full max-w-3xl text-sm border border-border/50 rounded-xl bg-background overflow-hidden shadow-inner">
                        <div className={`p-4 flex flex-col gap-3 ${winnerId === 'A' ? 'bg-accent/5' : ''}`}>
                            <span className="font-bold font-display uppercase tracking-wider border-b border-border/50 pb-2 text-center text-accent">Track A</span>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Total Steps:</span> <span>{eventsA.length}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Comparisons:</span> <span>{eventsA[eventsA.length-1].metrics.comparisons}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Swaps/Writes:</span> <span>{eventsA[eventsA.length-1].metrics.swaps}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Time (Avg):</span> <span>{ALGORITHM_DATA[algorithmA].time}</span></div>
                        </div>
                        
                        <div className="p-4 flex flex-col justify-center items-center text-center gap-2 bg-surface-raised border-x border-border/50">
                            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Conclusion</span>
                            <span className="font-bold text-text">
                                {winnerId === 'TIE' ? 'It is an exact tie.' : `Track ${winnerId} won the race.`}
                            </span>
                            <span className="text-[11px] text-text-secondary mt-1">
                                {winnerId === 'TIE' ? 'Both algorithms performed identically on this dataset.' : `Track ${winnerId} was more efficient, requiring ${Math.abs(eventsA.length - eventsB.length)} fewer steps to sort the exact same dataset.`}
                            </span>
                            <button 
                                onClick={resetRace}
                                className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold font-mono bg-text text-background hover:bg-accent px-4 py-1.5 rounded uppercase tracking-wider transition-colors w-full"
                            >
                                <RotateCcw size={12} /> Play Again
                            </button>
                        </div>

                        <div className={`p-4 flex flex-col gap-3 ${winnerId === 'B' ? 'bg-accent/5' : ''}`}>
                            <span className="font-bold font-display uppercase tracking-wider border-b border-border/50 pb-2 text-center text-accent">Track B</span>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Total Steps:</span> <span>{eventsB.length}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Comparisons:</span> <span>{eventsB[eventsB.length-1].metrics.comparisons}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Swaps/Writes:</span> <span>{eventsB[eventsB.length-1].metrics.swaps}</span></div>
                            <div className="flex justify-between font-mono text-xs"><span className="text-text-muted">Time (Avg):</span> <span>{ALGORITHM_DATA[algorithmB].time}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
