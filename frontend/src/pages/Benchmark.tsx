import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { RaceTrack } from '../components/RaceTrack';
import { Play, RotateCcw, Loader2, Trophy } from 'lucide-react';
import type { ExecutionResult, ExecutionEvent } from '../types';

const SORTING_ALGORITHMS = ['bubble_sort', 'selection_sort', 'insertion_sort', 'merge_sort', 'quick_sort', 'heap_sort'];

export function Benchmark() {
    const [algorithmA, setAlgorithmA] = useState('quick_sort');
    const [algorithmB, setAlgorithmB] = useState('bubble_sort');
    const [arraySize, setArraySize] = useState(25);
    
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
        }, 150); // fast playback for racing

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, eventsA.length, eventsB.length]);

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

    let winnerId = null;
    if (bothFinished) {
        if (eventsA.length < eventsB.length) winnerId = 'A';
        else if (eventsB.length < eventsA.length) winnerId = 'B';
        else winnerId = 'TIE';
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
            
            {/* Header / Global Controls */}
            <header className="border-b border-border/60 bg-surface/50 backdrop-blur-sm px-5 py-3 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border-r border-border/50 pr-4">
                        <Trophy size={16} className="text-accent" />
                        <span className="font-display font-bold text-text uppercase tracking-wider text-sm">Algorithmic Racing</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm ml-2">
                        <span className="text-text-muted text-xs font-medium uppercase tracking-wider">Array Size</span>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            value={arraySize}
                            onChange={(e) => setArraySize(Number(e.target.value))}
                            className="w-24 accent-accent"
                            disabled={isPlaying || loading}
                        />
                        <span className="font-mono text-text-muted text-xs w-4">{arraySize}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={generateAndRace}
                        disabled={loading || isPlaying}
                        className="flex items-center gap-2 bg-text hover:bg-text/90 text-background px-6 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 uppercase tracking-wider"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                        {loading ? 'Compiling...' : 'Start Race'}
                    </button>
                </div>
            </header>

            {/* Split Track Area */}
            <main className="flex-1 p-6 flex gap-6 overflow-hidden relative">
                <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />
                
                {/* Track A */}
                <div className="flex-1 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-text-muted tracking-widest uppercase">Track A</span>
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
                <div className="flex-1 flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-text-muted tracking-widest uppercase">Track B</span>
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
            
            {/* Post-Race Summary */}
            {bothFinished && (
                <div className="border-t border-border bg-surface/80 backdrop-blur-sm p-4 flex justify-center z-20">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-text uppercase tracking-widest">Race Results:</span>
                        <div className="flex gap-8 text-xs font-mono">
                            <span className={winnerId === 'A' ? 'text-accent' : 'text-text-muted'}>
                                Track A: {eventsA.length} steps
                            </span>
                            <span className={winnerId === 'B' ? 'text-accent' : 'text-text-muted'}>
                                Track B: {eventsB.length} steps
                            </span>
                            <span className="text-text-secondary font-sans border-l border-border pl-8">
                                {winnerId === 'TIE' ? 'It is a tie!' : `Track ${winnerId} is ${Math.abs(eventsA.length - eventsB.length)} steps faster.`}
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                setStepA(0);
                                setStepB(0);
                                setIsPlaying(true);
                            }}
                            className="ml-4 flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text transition-colors"
                        >
                            <RotateCcw size={14} /> Replay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
