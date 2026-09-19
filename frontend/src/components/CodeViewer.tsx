import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeViewer: React.FC = () => {
    const { sourceCode, events, currentStepIndex, algorithmId } = usePlayerStore();
    const { theme } = useThemeStore();
    const containerRef = useRef<HTMLDivElement>(null);

    const currentEvent = events[currentStepIndex];
    const activeLine = currentEvent?.line;

    // Auto-scroll to active line
    useEffect(() => {
        if (containerRef.current && activeLine) {
            const container = containerRef.current;
            // The syntax highlighter will assign the 'active-line' class
            const element = container.querySelector('.active-line') as HTMLElement;
            
            if (element) {
                const topPos = element.offsetTop;
                const containerHeight = container.clientHeight;
                
                container.scrollTo({
                    top: topPos - (containerHeight / 2) + 20,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentStepIndex, events, activeLine]);

    if (!sourceCode || events.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-surface border-l border-border/60 text-text-muted text-sm font-mono p-8 text-center">
                <p className="opacity-50">Algorithm source code will appear here during execution.</p>
            </div>
        );
    }

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
            <div ref={containerRef} className="flex-1 overflow-auto font-mono text-[13px] leading-6 select-text relative custom-scrollbar">
                <SyntaxHighlighter
                    language="python"
                    style={theme === 'dark' ? vscDarkPlus : vs}
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                        margin: 0,
                        padding: '1rem 0',
                        background: 'transparent',
                        fontSize: '13px',
                    }}
                    lineNumberStyle={(lineNum) => ({
                        minWidth: '2.5rem',
                        paddingRight: '1rem',
                        textAlign: 'right',
                        color: activeLine === lineNum ? (theme === 'dark' ? '#38bdf8' : '#0FA68D') : '#64748b',
                        fontWeight: activeLine === lineNum ? 'bold' : 'normal',
                        opacity: activeLine === lineNum ? 1 : 0.5,
                    })}
                    lineProps={(lineNum) => {
                        const isLineActive = activeLine === lineNum;
                        return {
                            className: `transition-colors duration-150 block ${
                                isLineActive 
                                    ? 'bg-accent/10 border-l-[3px] border-accent text-text active-line' 
                                    : 'border-l-[3px] border-transparent'
                            }`
                        };
                    }}
                >
                    {sourceCode}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
