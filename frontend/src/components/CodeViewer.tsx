import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const CodeViewer: React.FC = () => {
    const { sourceCode, events, currentStepIndex, algorithmId } = usePlayerStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = activeLineRef.current;
            
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
            <div className="flex-1 flex items-center justify-center bg-surface border-l border-border/60 text-text-muted text-sm font-mono p-8 text-center">
                <p className="opacity-50">Algorithm source code will appear here during execution.</p>
            </div>
        );
    }

    const currentEvent = events[currentStepIndex];
    const lines = sourceCode.split('\n');
    const activeLine = currentEvent.line;

    return (
        <div className="flex flex-col h-full bg-surface border-l border-border/60 relative">
            
            {/* Header / Tab */}
            <div className="flex items-center px-4 py-3 bg-surface-raised border-b border-border/60">
                <div className="flex gap-2 mr-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-state-swap/30 border border-state-swap/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-state-compare/30 border border-state-compare/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent/30 border border-accent/50" />
                </div>
                <div className="text-[11px] font-mono text-text-muted bg-surface px-2.5 py-0.5 rounded-md border border-border-subtle">
                    {algorithmId ? `${algorithmId}.py` : 'source.py'}
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
                                    ? 'bg-accent/10 border-l-[3px] border-accent text-text' 
                                    : 'border-l-[3px] border-transparent text-text-secondary'
                            }`}
                        >
                            <span className={`w-8 flex-shrink-0 text-right pr-4 select-none ${
                                isLineActive ? 'text-accent font-semibold' : 'text-text-muted'
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
