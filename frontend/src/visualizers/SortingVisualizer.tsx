import React from 'react';
import { motion } from 'framer-motion';
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
    const maxVal = Math.max(...array, 1);

    return (
        <div className="flex flex-col gap-4 w-full h-96">
            {/* The Visualization Canvas */}
            <div className="flex-1 flex items-end justify-center gap-1 p-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {array.map((value, index) => {
                    const heightPercent = (value / maxVal) * 100;
                    
                    // Determine colors based on event type
                    let bgColor = 'bg-blue-300';
                    if (activeElements.includes(index)) {
                        if (currentEvent.type === 'COMPARE') bgColor = 'bg-yellow-400';
                        else if (currentEvent.type === 'SWAP') bgColor = 'bg-red-400';
                        else if (currentEvent.type === 'NO_SWAP') bgColor = 'bg-green-400';
                        else if (currentEvent.type === 'SORTED_ELEMENT') bgColor = 'bg-purple-500';
                    }

                    return (
                        <motion.div
                            layout
                            key={value + "-" + index} // simple unique key for layout animations
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-8 rounded-t-sm ${bgColor} relative group`}
                        >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {value}
                            </span>
                        </motion.div>
                    );
                })}
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
