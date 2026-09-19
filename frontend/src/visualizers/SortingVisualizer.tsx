import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { audio } from '../utils/audio';
import type { ArrayElement } from '../types';

export const SortingVisualizer: React.FC = () => {
    const { events, currentStepIndex, algorithmId, isPlaying, isMuted } = usePlayerStore();
    const prevStepRef = useRef(currentStepIndex);

    useEffect(() => {
        // Initialize audio engine on first unmute
        if (!isMuted) {
            audio.init();
        }
    }, [isMuted]);

    useEffect(() => {
        // Only play sound if advancing forward while playing (not scrubbing backwards)
        if (isPlaying && !isMuted && events.length > 0 && currentStepIndex > prevStepRef.current) {
            const ev = events[currentStepIndex];
            const activeElements = ev.activeElements as number[];
            
            // Find max value for pitch mapping
            const maxValue = Math.max(...ev.state.map((e: any) => e.value));
            
            // Map event type to sound type
            const soundType = ev.type === 'SWAP' ? 'swap' : 'compare';

            // Play tone for each active element (usually 2 for swaps/compares)
            activeElements.forEach(idx => {
                if (ev.state[idx]) {
                    audio.playTone(ev.state[idx].value, maxValue, soundType);
                }
            });
        }
        prevStepRef.current = currentStepIndex;
    }, [currentStepIndex, isPlaying, isMuted, events]);

    if (events.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-mono text-sm border border-dashed border-border rounded-xl m-8 bg-surface/20">
                <p>No execution data.</p>
                <p className="mt-2 opacity-50 text-xs">Adjust size and click Execute.</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    // Cast state to array of objects
    const array: ArrayElement[] = currentEvent.state;
    const activeElements = currentEvent.activeElements as number[];
    const pointers = currentEvent.pointers;

    const pointersByIndex: Record<number, string[]> = {};
    Object.entries(pointers).forEach(([name, val]) => {
        if (name === 'target') return; // Do not render target as an array pointer
        const idx = val as number;
        if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
        pointersByIndex[idx].push(name);
    });

    return (
        <div className="flex-1 flex flex-col relative rounded-xl overflow-hidden shadow-inner bg-background relative border border-border">
            
            {/* Subtle glowing animated background to make it feel alive */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* Top Metrics Bar */}
            <div className="absolute top-4 left-4 flex gap-6 text-xs font-mono text-text-muted z-10 bg-surface/60 px-4 py-2 rounded-lg backdrop-blur-md border border-border shadow-md">
                <div className="flex flex-col">
                    <span className="opacity-50 tracking-wider text-[10px]">STEP</span>
                    <span className="text-text font-semibold text-sm">{currentStepIndex} / {events.length - 1}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col">
                    <span className="opacity-50 tracking-wider text-[10px]">COMPARISONS</span>
                    <span className="text-text font-semibold text-sm">{currentEvent.metrics.comparisons}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col">
                    <span className="opacity-50 tracking-wider text-[10px]">SWAPS</span>
                    <span className="text-text font-semibold text-sm">{currentEvent.metrics.swaps}</span>
                </div>
                {pointers.target !== undefined && (
                    <>
                        <div className="w-px bg-border" />
                        <div className="flex flex-col">
                            <span className="text-accent tracking-wider text-[10px]">TARGET</span>
                            <span className="text-accent font-bold text-sm">{pointers.target}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Central Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start sm:justify-center p-8 pt-32 pb-32 z-10 w-full overflow-y-auto custom-scrollbar">
                
                {/* Linear Array */}
                <div className="flex items-end justify-center w-full max-w-4xl gap-1 sm:gap-2 flex-shrink-0">
                    <AnimatePresence mode="popLayout">
                        {array.map((item, index) => {
                            // Default styling (inactive)
                            let borderColor = 'border-border/60';
                            let bgColor = 'bg-surface/80 backdrop-blur-sm';
                            let textColor = 'text-text-muted';
                            let shadow = 'shadow-sm';
                            let scale = 1;
                            let zIndex = 0;

                            if (activeElements.includes(index)) {
                                zIndex = 10;
                                scale = 1.05;
                                if (currentEvent.type === 'COMPARE') {
                                    borderColor = 'border-state-compare'; 
                                    bgColor = 'bg-state-compare/20 backdrop-blur-md';
                                    textColor = 'text-state-compare';
                                    shadow = 'shadow-[0_0_25px_rgba(234,179,8,0.25)]';
                                } else if (currentEvent.type === 'SWAP') {
                                    borderColor = 'border-state-swap'; 
                                    bgColor = 'bg-state-swap/20 backdrop-blur-md';
                                    textColor = 'text-state-swap';
                                    shadow = 'shadow-[0_0_25px_rgba(239,68,68,0.25)]';
                                } else if (currentEvent.type === 'NO_SWAP') {
                                    borderColor = 'border-state-match'; 
                                    bgColor = 'bg-state-match/20 backdrop-blur-md';
                                    textColor = 'text-state-match';
                                    shadow = 'shadow-[0_0_25px_rgba(47,224,194,0.2)]';
                                } else if (currentEvent.type === 'MATCH') {
                                    borderColor = 'border-state-match'; 
                                    bgColor = 'bg-state-match/30 backdrop-blur-md';
                                    textColor = 'text-state-match';
                                    shadow = 'shadow-[0_0_40px_rgba(47,224,194,0.6)]';
                                    scale = 1.2;
                                    zIndex = 20;
                                } else if (currentEvent.type === 'MISMATCH') {
                                    borderColor = 'border-state-mismatch'; 
                                    bgColor = 'bg-state-mismatch/20 backdrop-blur-md';
                                    textColor = 'text-state-mismatch';
                                    shadow = 'shadow-[0_0_20px_rgba(232,84,144,0.3)]';
                                    scale = 0.95;
                                } else if (currentEvent.type === 'SORTED_ELEMENT') {
                                    borderColor = 'border-accent/60'; 
                                    bgColor = 'bg-accent/10 backdrop-blur-sm';
                                    textColor = 'text-accent';
                                    scale = 1;
                                }
                            } else if (currentEvent.type === 'SORTED_ELEMENT' && activeElements.length === 0) {
                                borderColor = 'border-border';
                                bgColor = 'bg-surface';
                            }

                            return (
                                <div key={item.id} className="flex flex-col items-center gap-2 relative flex-1 min-w-[20px] max-w-[64px]" style={{ zIndex }}>
                                    {/* The Value Block */}
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0, scale }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ 
                                            layout: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
                                            scale: { duration: 0.15 }
                                        }}
                                        className={`w-full aspect-square rounded-md sm:rounded-xl flex items-center justify-center text-xs sm:text-base font-mono font-bold border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-colors duration-200`}
                                    >
                                        {item.value}
                                    </motion.div>
                                    
                                    {/* Index label */}
                                    <span className="text-[9px] text-text-muted/40 font-mono absolute -top-5">{index}</span>

                                    {/* Iteration Pointers */}
                                    {pointersByIndex[index] && (
                                        <div className="absolute -bottom-8 flex flex-col items-center gap-0.5">
                                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-b-[5px] border-b-accent border-r-[4px] border-r-transparent animate-pulse"></div>
                                            <div className="flex gap-0.5 flex-wrap justify-center">
                                                {pointersByIndex[index].map(p => {
                                                    const isMinIdx = p === 'min_idx';
                                                    const isKey = p === 'key';
                                                    const isMid = p === 'mid';
                                                    const isPivot = p === 'pivot';
                                                    const isLargest = p === 'largest';
                                                    const isIj = p === 'i' || p === 'j' || p === 'curr';
                                                    
                                                    let badgeColors = 'text-accent bg-accent/10 border-accent/30';
                                                    if (isMinIdx) {
                                                        badgeColors = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
                                                    } else if (isKey) {
                                                        badgeColors = 'text-purple-400 bg-purple-400/10 border-purple-400/30';
                                                    } else if (isMid) {
                                                        badgeColors = 'text-amber-400 bg-amber-400/10 border-amber-400/30';
                                                    } else if (isPivot) {
                                                        badgeColors = 'text-rose-400 bg-rose-400/10 border-rose-400/30 shadow-[0_0_15px_rgba(251,113,133,0.3)] font-bold';
                                                    } else if (isLargest) {
                                                        badgeColors = 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-bold';
                                                    } else if (isIj) {
                                                        badgeColors = 'text-blue-400 bg-blue-400/10 border-blue-400/30';
                                                    } else if (p === 'left' || p === 'right') {
                                                        badgeColors = 'text-slate-400 bg-slate-400/10 border-slate-400/30';
                                                    }

                                                    return (
                                                        <span key={p} className={`text-[9px] font-bold font-mono px-1 py-0 rounded border ${badgeColors}`}>
                                                            {p}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                
                {/* Auxiliary Buffer (temp) Shelf */}
                <AnimatePresence>
                    {currentEvent.auxiliary && currentEvent.auxiliary.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex flex-col items-center mt-12 pt-6 border-t border-border/40 w-full max-w-2xl"
                        >
                            <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-3">
                                Auxiliary Buffer (temp)
                            </span>
                            <div className="flex items-center justify-center gap-1.5 p-3 bg-surface/40 rounded-xl border border-dashed border-border/60 min-h-[64px] min-w-[200px] flex-wrap shadow-inner">
                                <AnimatePresence mode="popLayout">
                                    {currentEvent.auxiliary.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xs sm:text-sm font-mono font-bold border-2 border-accent/40 bg-accent/10 text-accent shadow-sm"
                                        >
                                            {item.value}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            <AnimatePresence>
                {algorithmId === 'heap_sort' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full flex-shrink-0 border-t border-border/40 mt-8"
                    >
                        <div className="w-full flex flex-col items-center pt-8 pb-4">
                            <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-8">
                                Binary Heap Representation
                            </span>
                            <div className="relative w-full max-w-2xl flex-shrink-0" style={{ height: (array.length > 0 ? Math.floor(Math.log2(array.length)) : 0) * 70 + 80 }}>
                                {/* SVG Edges */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                                    <defs>
                                        <mask id="node-mask">
                                            {/* Everything white is visible, black is hidden */}
                                            <rect width="100%" height="100%" fill="white" />
                                            {array.map((item, i) => {
                                                const level = Math.floor(Math.log2(i + 1));
                                                const levelWidth = Math.pow(2, level);
                                                const indexInLevel = i - (levelWidth - 1);
                                                const x = (indexInLevel + 0.5) / levelWidth * 100;
                                                const y = level * 70 + 20;
                                                // Node radius is 20px, we mask out slightly more (22px) for a clean gap
                                                return <circle key={`mask-${item.id}`} cx={`${x}%`} cy={y} r="24" fill="black" />
                                            })}
                                        </mask>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                    
                                    <g mask="url(#node-mask)">
                                        {array.map((item, i) => {
                                            if (i === 0) return null;
                                            const parentIdx = Math.floor((i - 1) / 2);
                                            
                                            const getCoords = (idx: number) => {
                                                const level = Math.floor(Math.log2(idx + 1));
                                                const levelWidth = Math.pow(2, level);
                                                const indexInLevel = idx - (levelWidth - 1);
                                                const x = (indexInLevel + 0.5) / levelWidth * 100;
                                                const y = level * 70 + 20; // 20 is half node height
                                                return { x, y };
                                            };
                                            
                                            const child = getCoords(i);
                                            const parent = getCoords(parentIdx);
                                            
                                            const isActiveEdge = activeElements.includes(i) && activeElements.includes(parentIdx);
                                            
                                            return (
                                                <line 
                                                    key={`edge-${item.id}`} 
                                                    x1={`${parent.x}%`} 
                                                    y1={parent.y} 
                                                    x2={`${child.x}%`} 
                                                    y2={child.y} 
                                                    stroke={isActiveEdge ? "#38bdf8" : "#64748b"}
                                                    strokeWidth={isActiveEdge ? "3" : "2"}
                                                    opacity={isActiveEdge ? "1" : "0.4"}
                                                    filter={isActiveEdge ? "url(#glow)" : "none"}
                                                    className="transition-all duration-300"
                                                />
                                            );
                                        })}
                                    </g>
                                </svg>
                                
                                {/* Tree Nodes */}
                                {array.map((item, i) => {
                                    const level = Math.floor(Math.log2(i + 1));
                                    const levelWidth = Math.pow(2, level);
                                    const indexInLevel = i - (levelWidth - 1);
                                    const leftPercent = (indexInLevel + 0.5) / levelWidth * 100;
                                    const topPx = level * 70;
                                    
                                    const isActive = activeElements.includes(i);
                                    const isSorted = currentEvent.type === 'SORTED_ELEMENT' && activeElements.includes(i);
                                    
                                    let borderColor = 'border-border/60';
                                    let bgColor = 'bg-surface';
                                    let textColor = 'text-text';
                                    let shadow = 'shadow-sm';
                                    
                                    if (isSorted) {
                                        borderColor = 'border-emerald-500/50';
                                        bgColor = 'bg-emerald-500/10';
                                        textColor = 'text-emerald-400';
                                        shadow = 'shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                                    } else if (isActive) {
                                        borderColor = 'border-accent';
                                        bgColor = 'bg-accent/10';
                                        textColor = 'text-accent';
                                        shadow = 'shadow-[0_0_15px_rgba(56,189,248,0.2)]';
                                    }

                                    return (
                                        <motion.div
                                            key={`tree-${item.id}`}
                                            animate={{ left: `${leftPercent}%`, top: topPx, x: '-50%' }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-colors duration-200 z-10`}
                                        >
                                            {item.value}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Event Description Toast */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full z-20">
                <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-surface/90 backdrop-blur-md border border-border px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4"
                >
                    <div className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </div>
                    <p className="text-sm text-text font-medium leading-tight transition-all duration-75">{currentEvent.description}</p>
                </motion.div>
            </div>
            
        </div>
    );
};
