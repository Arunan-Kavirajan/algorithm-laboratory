import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const CodeViewer: React.FC = () => {
    const { sourceCode, events, currentStepIndex } = usePlayerStore();

    if (!sourceCode || events.length === 0) {
        return null;
    }

    const currentEvent = events[currentStepIndex];
    const lines = sourceCode.split('\n');
    const activeLine = currentEvent.line;

    return (
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 overflow-hidden text-sm flex flex-col h-full">
            <div className="bg-gray-800 text-gray-400 px-4 py-2 border-b border-gray-700 font-semibold">
                Source Code
            </div>
            <div className="p-4 overflow-auto flex-1 font-mono">
                {lines.map((line, idx) => {
                    // Line numbers are 1-indexed in our data
                    const isLineActive = activeLine === idx + 1;
                    return (
                        <div 
                            key={idx} 
                            className={`flex ${isLineActive ? 'bg-blue-900/50 text-blue-100' : 'text-gray-300'}`}
                        >
                            <span className="w-8 flex-shrink-0 text-right pr-4 text-gray-600 select-none">
                                {idx + 1}
                            </span>
                            <span className="whitespace-pre">
                                {line || ' '}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
