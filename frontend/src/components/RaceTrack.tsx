import React from 'react';
import { motion } from 'framer-motion';
import type { ExecutionEvent, ArrayElement } from '../types';

interface RaceTrackProps {
    title: string;
    algorithmId: string;
    events: ExecutionEvent[];
    currentStepIndex: number;
    winner: boolean;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ title, algorithmId, events, currentStepIndex, winner }) => {
    if (events.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-mono text-sm border border-dashed border-border rounded-xl bg-surface/20">
                <p>Waiting to race...</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    const array: ArrayElement[] = currentEvent.state as ArrayElement[];
    const activeElements = currentEvent.activeElements as number[];

    const isFinished = currentStepIndex === events.length - 1;

    return (
        <div className={`flex-1 flex flex-col relative rounded-xl overflow-hidden shadow-inner bg-surface border ${winner && isFinished ? 'border-accent shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-border'} transition-all duration-500`}>
            
            {/* Header */}
            <div className={`border-b border-border bg-surface-raised px-4 py-3 flex items-center justify-between ${winner && isFinished ? 'bg-accent/10' : ''} transition-colors`}>
                <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-text uppercase tracking-wider">{title}</span>
                    {winner && isFinished && (
                        <span className="bg-accent text-background text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Winner</span>
                    )}
                </div>
                <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                    {algorithmId.replace('_', ' ')}
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 border-b border-border/50 bg-background/50 text-[10px] font-mono divide-x divide-border/50 text-center uppercase tracking-widest">
                <div className="py-2 flex flex-col gap-1">
                    <span className="text-text-muted opacity-70">Steps</span>
                    <span className="text-text font-bold text-xs">{currentStepIndex} <span className="opacity-50 font-normal">/ {events.length - 1}</span></span>
                </div>
                <div className="py-2 flex flex-col gap-1">
                    <span className="text-text-muted opacity-70">Comparisons</span>
                    <span className="text-text font-bold text-xs">{currentEvent.metrics.comparisons}</span>
                </div>
                <div className="py-2 flex flex-col gap-1">
                    <span className="text-text-muted opacity-70">Swaps</span>
                    <span className="text-text font-bold text-xs">{currentEvent.metrics.swaps}</span>
                </div>
            </div>

            {/* Array Container */}
            <div className="flex-1 relative mx-6 mb-6 mt-4 border-b border-border/50">
                {array.map((item, idx) => {
                    const isActive = activeElements.includes(idx);
                    const isSorted = (currentEvent.type === 'SORTED_ELEMENT' || currentEvent.type === 'MATCH') && activeElements.includes(idx);
                    
                    let bgColor = 'bg-surface-raised';
                    let borderColor = 'border-border-subtle';
                    let textColor = 'text-text-muted';

                    if (isFinished) {
                        bgColor = 'bg-accent/10';
                        borderColor = 'border-accent/40';
                        textColor = 'text-accent';
                    } else if (isSorted) {
                        bgColor = 'bg-emerald-500/10';
                        borderColor = 'border-emerald-500/40';
                        textColor = 'text-emerald-400';
                    } else if (isActive) {
                        bgColor = 'bg-accent/20';
                        borderColor = 'border-accent';
                        textColor = 'text-accent';
                    }

                    // Calculate height based on value
                    const maxVal = Math.max(...array.map(a => a.value), 10);
                    const heightPercent = Math.max(10, (item.value / maxVal) * 100);

                    // Calculate precise absolute positioning
                    const widthPercent = 100 / array.length;
                    const leftPercent = idx * widthPercent;
                    const itemWidth = `calc(${widthPercent}% - 2px)`; // 2px gap

                    return (
                        <motion.div 
                            key={item.id}
                            animate={{ left: `${leftPercent}%`, height: `${heightPercent}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`absolute bottom-0 flex flex-col justify-end items-center rounded-t-[2px] border-t-2 ${borderColor} ${bgColor} transition-colors duration-200`}
                            style={{ width: itemWidth }}
                        >
                            {array.length <= 25 && (
                                <span className={`text-[9px] font-mono mb-1 ${textColor} transition-colors`}>{item.value}</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            {/* Status Bar */}
            <div className={`h-8 border-t border-border flex items-center justify-center text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${isFinished ? 'bg-accent/10 text-accent' : 'bg-surface-raised text-text-muted'}`}>
                {isFinished ? 'ALGORITHM FINISHED' : 'RACING...'}
            </div>
        </div>
    );
};
