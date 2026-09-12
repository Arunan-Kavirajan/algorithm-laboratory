import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const CodeViewer: React.FC = () => {
    const { sourceCode, events, currentStepIndex } = usePlayerStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = activeLineRef.current;
            
            // Calculate if element is out of view
            const topPos = element.offsetTop;
            const containerHeight = container.clientHeight;
            
            container.scrollTo({
                top: topPos - (containerHeight / 2) + 20,
                behavior: 'smooth'
            });
        }
    }, [currentStepIndex, events]);

    if (!sourceCode || events.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] border-l border-border text-text-muted text-sm font-mono p-8 text-center">
                <p className="opacity-50">Algorithm source code will appear here during execution.</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    const lines = sourceCode.split('\n');
    const activeLine = currentEvent.line;

    return (
        <div className="flex flex-col h-full bg-[#0d0d0d] border-l border-border relative">
            
            {/* Header / Tab */}
            <div className="flex items-center px-4 py-3 bg-[#111] border-b border-[#222]">
                <div className="flex gap-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="text-xs font-mono text-text-muted bg-[#222] px-3 py-1 rounded border border-[#333]">
                    bubble_sort.py
                </div>
            </div>

            {/* Code Body */}
            <div ref={containerRef} className="flex-1 overflow-auto py-4 font-mono text-[13px] leading-6 select-text relative">
                {lines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isLineActive = activeLine === lineNum;
                    
                    return (
                        <div 
                            key={idx}
                            ref={isLineActive ? activeLineRef : null}
                            className={`flex px-2 transition-colors duration-150 ${
                                isLineActive 
                                    ? 'bg-[#1e293b]/70 border-l-[3px] border-accent text-[#e2e8f0]' 
                                    : 'border-l-[3px] border-transparent text-[#94a3b8]'
                            }`}
                        >
                            <span className={`w-8 flex-shrink-0 text-right pr-4 select-none ${
                                isLineActive ? 'text-accent font-semibold' : 'text-[#475569]'
                            }`}>
                                {lineNum}
                            </span>
                            <span className="whitespace-pre flex-1">
                                {line || ' '}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
