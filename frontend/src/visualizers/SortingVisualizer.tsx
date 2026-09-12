import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

export const SortingVisualizer: React.FC = () => {
    const { events, currentStepIndex } = usePlayerStore();

    if (events.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-mono text-sm border border-dashed border-border rounded-xl m-8">
                <p>No execution data.</p>
                <p className="mt-2 opacity-50">Adjust size and click Execute.</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    const array: number[] = currentEvent.state;
    const activeElements = currentEvent.activeElements as number[];
    const pointers = currentEvent.pointers;

    // Group pointers by index
    const pointersByIndex: Record<number, string[]> = {};
    Object.entries(pointers).forEach(([name, idx]) => {
        if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
        pointersByIndex[idx].push(name);
    });

    return (
        <div className="flex-1 flex flex-col relative">
            
            {/* Top Metrics Bar */}
            <div className="absolute top-4 left-4 flex gap-6 text-xs font-mono text-text-muted z-10 bg-surface/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-border">
                <div className="flex flex-col">
                    <span className="opacity-50">STEP</span>
                    <span className="text-text font-semibold">{currentStepIndex} / {events.length - 1}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col">
                    <span className="opacity-50">COMPARISONS</span>
                    <span className="text-text font-semibold">{currentEvent.metrics.comparisons}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col">
                    <span className="opacity-50">SWAPS</span>
                    <span className="text-text font-semibold">{currentEvent.metrics.swaps}</span>
                </div>
            </div>

            {/* Central Array Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <div className="flex items-end justify-center gap-3">
                    <AnimatePresence>
                        {array.map((value, index) => {
                            // Default styling (inactive)
                            let borderColor = 'border-border';
                            let bgColor = 'bg-surface';
                            let textColor = 'text-text-muted';
                            let shadow = 'shadow-none';

                            if (activeElements.includes(index)) {
                                if (currentEvent.type === 'COMPARE') {
                                    borderColor = 'border-[#eab308]'; // yellow
                                    bgColor = 'bg-[#eab308]/10';
                                    textColor = 'text-[#eab308]';
                                    shadow = 'shadow-[0_0_15px_rgba(234,179,8,0.15)]';
                                } else if (currentEvent.type === 'SWAP') {
                                    borderColor = 'border-[#ef4444]'; // red
                                    bgColor = 'bg-[#ef4444]/10';
                                    textColor = 'text-[#ef4444]';
                                    shadow = 'shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                                } else if (currentEvent.type === 'NO_SWAP') {
                                    borderColor = 'border-[#10b981]'; // green
                                    bgColor = 'bg-[#10b981]/10';
                                    textColor = 'text-[#10b981]';
                                    shadow = 'shadow-[0_0_15px_rgba(16,185,129,0.1)]';
                                } else if (currentEvent.type === 'SORTED_ELEMENT') {
                                    borderColor = 'border-[#3b82f6]/50'; // blue
                                    bgColor = 'bg-[#3b82f6]/5';
                                    textColor = 'text-[#3b82f6]';
                                }
                            } else if (currentEvent.type === 'SORTED_ELEMENT' && activeElements.length === 0) {
                                // If array is completely sorted (COMPLETE event sometimes)
                                borderColor = 'border-border';
                                bgColor = 'bg-surface';
                            }

                            return (
                                <div key={value + "-" + index} className="flex flex-col items-center gap-3 relative">
                                    {/* The Value Block */}
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-mono font-medium border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-colors duration-200`}
                                    >
                                        {value}
                                    </motion.div>
                                    
                                    {/* Index label */}
                                    <span className="text-[10px] text-text-muted/50 font-mono absolute -top-6">{index}</span>

                                    {/* Iteration Pointers */}
                                    {pointersByIndex[index] && (
                                        <div className="absolute -bottom-10 flex flex-col items-center gap-1">
                                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-b-[6px] border-b-accent border-r-[5px] border-r-transparent"></div>
                                            <div className="flex gap-1">
                                                {pointersByIndex[index].map(p => (
                                                    <span key={p} className="text-[10px] font-bold text-accent font-mono bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
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
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full">
                <motion.div 
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border px-4 py-3 rounded-lg shadow-xl flex items-center gap-3"
                >
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <p className="text-sm text-text font-medium">{currentEvent.description}</p>
                </motion.div>
            </div>
            
        </div>
    );
};
