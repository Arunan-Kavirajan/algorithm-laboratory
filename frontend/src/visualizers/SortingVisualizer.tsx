import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

export const SortingVisualizer: React.FC = () => {
    const { events, currentStepIndex } = usePlayerStore();

    if (events.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No algorithm running. Generate dataset and execute.</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    const array: number[] = currentEvent.state;
    const activeElements = currentEvent.activeElements as number[];
    const pointers = currentEvent.pointers;

    // We can group pointers by their current index to display multiple pointers on the same block
    const pointersByIndex: Record<number, string[]> = {};
    Object.entries(pointers).forEach(([name, idx]) => {
        if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
        pointersByIndex[idx].push(name);
    });

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative min-h-[300px]">
                
                {/* Array Blocks */}
                <div className="flex items-end justify-center gap-2">
                    <AnimatePresence>
                        {array.map((value, index) => {
                            // Determine colors based on event type
                            let borderColor = 'border-gray-300';
                            let bgColor = 'bg-white';
                            let textColor = 'text-gray-700';

                            if (activeElements.includes(index)) {
                                if (currentEvent.type === 'COMPARE') {
                                    borderColor = 'border-yellow-400';
                                    bgColor = 'bg-yellow-50';
                                } else if (currentEvent.type === 'SWAP') {
                                    borderColor = 'border-red-400';
                                    bgColor = 'bg-red-50';
                                } else if (currentEvent.type === 'NO_SWAP') {
                                    borderColor = 'border-green-400';
                                    bgColor = 'bg-green-50';
                                } else if (currentEvent.type === 'SORTED_ELEMENT') {
                                    borderColor = 'border-purple-400';
                                    bgColor = 'bg-purple-100';
                                    textColor = 'text-purple-900 font-bold';
                                }
                            }

                            return (
                                <div key={value + "-" + index} className="flex flex-col items-center gap-2 relative">
                                    {/* The Block */}
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={`w-14 h-14 rounded-md flex items-center justify-center text-xl shadow-sm border-2 ${borderColor} ${bgColor} ${textColor}`}
                                    >
                                        {value}
                                    </motion.div>
                                    
                                    {/* Index label */}
                                    <span className="text-xs text-gray-400 font-mono">{index}</span>

                                    {/* Pointers */}
                                    {pointersByIndex[index] && (
                                        <div className="absolute -bottom-8 flex flex-col items-center">
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[8px] border-b-blue-500 border-r-[6px] border-r-transparent mb-1"></div>
                                            <div className="flex gap-1">
                                                {pointersByIndex[index].map(p => (
                                                    <span key={p} className="text-xs font-bold text-blue-600 bg-blue-100 px-1 rounded">
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

            {/* Explanation Panel */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-700">Current Operation (Step {currentStepIndex + 1} / {events.length})</h3>
                <p className="text-gray-600 mt-1">{currentEvent.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <div>Comparisons: <span className="font-mono">{currentEvent.metrics.comparisons}</span></div>
                    <div>Swaps: <span className="font-mono">{currentEvent.metrics.swaps}</span></div>
                </div>
            </div>
        </div>
    );
};
