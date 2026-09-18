import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { ArrayElement } from '../types';

export const SortingVisualizer: React.FC = () => {
    const { events, currentStepIndex } = usePlayerStore();

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

    // Group pointers by index
    const pointersByIndex: Record<number, string[]> = {};
    Object.entries(pointers).forEach(([name, idx]) => {
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
            </div>

            {/* Central Array Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                <div className="flex items-end justify-center w-full max-w-4xl gap-1 sm:gap-2">
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
                                    borderColor = 'border-[#eab308]'; 
                                    bgColor = 'bg-[#eab308]/20 backdrop-blur-md';
                                    textColor = 'text-[#eab308]';
                                    shadow = 'shadow-[0_0_25px_rgba(234,179,8,0.25)]';
                                } else if (currentEvent.type === 'SWAP') {
                                    borderColor = 'border-[#ef4444]'; 
                                    bgColor = 'bg-[#ef4444]/20 backdrop-blur-md';
                                    textColor = 'text-[#ef4444]';
                                    shadow = 'shadow-[0_0_25px_rgba(239,68,68,0.25)]';
                                } else if (currentEvent.type === 'NO_SWAP') {
                                    borderColor = 'border-[#10b981]'; 
                                    bgColor = 'bg-[#10b981]/20 backdrop-blur-md';
                                    textColor = 'text-[#10b981]';
                                    shadow = 'shadow-[0_0_25px_rgba(16,185,129,0.2)]';
                                } else if (currentEvent.type === 'SORTED_ELEMENT') {
                                    borderColor = 'border-[#3b82f6]/60'; 
                                    bgColor = 'bg-[#3b82f6]/10 backdrop-blur-sm';
                                    textColor = 'text-[#3b82f6]';
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
                                                {pointersByIndex[index].map(p => (
                                                    <span key={p} className="text-[9px] font-bold text-accent font-mono bg-accent/10 border border-accent/30 px-1 py-0 rounded">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Event Description Toast */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full z-20">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="bg-surface/90 backdrop-blur-md border border-border px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4"
                    >
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </div>
                        <p className="text-sm text-text font-medium leading-tight">{currentEvent.description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
            
        </div>
    );
};
