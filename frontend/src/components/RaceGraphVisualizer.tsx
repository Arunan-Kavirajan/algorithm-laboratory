import React from 'react';
import { motion } from 'framer-motion';
import type { ExecutionEvent } from '../types';

interface RaceGraphVisualizerProps {
    events: ExecutionEvent[];
    currentStepIndex: number;
}

export const RaceGraphVisualizer: React.FC<RaceGraphVisualizerProps> = ({ events, currentStepIndex }) => {
    const currentEvent = events[currentStepIndex];

    if (!currentEvent) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted font-mono text-sm border border-dashed border-border rounded-xl m-4 bg-surface/20">
                <p>Waiting for competitor...</p>
            </div>
        );
    }

    const { nodes = [], edges = [], distances = {} } = currentEvent.state as any;
    const activeElements = currentEvent.activeElements as string[];
    const pointers = currentEvent.pointers;

    // Group pointers by node id (excluding target)
    const pointersById: Record<string, string[]> = {};
    Object.entries(pointers).forEach(([name, val]) => {
        if (name === 'target') return;
        const id = val as string;
        if (!pointersById[id]) pointersById[id] = [];
        pointersById[id].push(name);
    });

    return (
        <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <marker
                        id="arrowhead-race"
                        markerWidth="10"
                        markerHeight="7"
                        refX="25"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                    <marker
                        id="arrowhead-active-race"
                        markerWidth="10"
                        markerHeight="7"
                        refX="25"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
                    </marker>
                    <filter id="glow-race" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {edges.map((edge: any, i: number) => {
                    const sourceNode = nodes.find((n: any) => n.id === edge.source);
                    const targetNode = nodes.find((n: any) => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    const isActive = activeElements.includes(edge.source) && activeElements.includes(edge.target);

                    return (
                        <g key={i}>
                            <line
                                x1={`${sourceNode.x}%`}
                                y1={`${sourceNode.y}%`}
                                x2={`${targetNode.x}%`}
                                y2={`${targetNode.y}%`}
                                stroke={isActive ? "#38bdf8" : "#334155"}
                                strokeWidth={isActive ? "3" : "2"}
                                opacity={isActive ? "1" : "0.5"}
                                markerEnd={isActive ? "url(#arrowhead-active-race)" : "url(#arrowhead-race)"}
                                filter={isActive ? "url(#glow-race)" : "none"}
                                className="transition-all duration-300"
                            />
                        </g>
                    );
                })}
            </svg>

            {nodes.map((node: any) => {
                const isActive = activeElements.includes(node.id);
                const isFound = currentEvent.type === 'MATCH' && isActive;
                const distance = distances[node.id];
                const nodePointers = pointersById[node.id] || [];

                let borderColor = 'border-border/60';
                let bgColor = 'bg-surface';
                let textColor = 'text-text';
                let shadow = 'shadow-sm';

                if (isFound) {
                    borderColor = 'border-emerald-500/50';
                    bgColor = 'bg-emerald-500/10';
                    textColor = 'text-emerald-400';
                    shadow = 'shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                } else if (isActive) {
                    borderColor = 'border-accent';
                    bgColor = 'bg-accent/10';
                    textColor = 'text-accent';
                    shadow = 'shadow-[0_0_15px_rgba(56,189,248,0.2)]';
                } else if (distance !== undefined && distance !== Infinity) {
                    borderColor = 'border-text-secondary/50';
                    bgColor = 'bg-surface-raised';
                }

                return (
                    <motion.div
                        key={node.id}
                        initial={false}
                        animate={{ left: `${node.x}%`, top: `${node.y}%`, x: '-50%', y: '-50%' }}
                        className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-colors duration-200 z-10`}
                    >
                        {node.value}
                        {nodePointers.length > 0 && (
                            <div className="absolute -top-5 flex gap-1">
                                {nodePointers.map(ptr => (
                                    <span key={ptr} className="text-[9px] bg-accent/20 text-accent px-1 rounded">
                                        {ptr}
                                    </span>
                                ))}
                            </div>
                        )}
                        {distance !== undefined && (
                            <div className="absolute -bottom-5 text-[9px] text-text-muted bg-background/80 px-1 rounded">
                                {distance === Infinity ? '∞' : distance}
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};
