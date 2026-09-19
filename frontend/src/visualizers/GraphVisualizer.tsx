import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

export const GraphVisualizer: React.FC = () => {
    const { events, currentStepIndex, algorithmId } = usePlayerStore();
    const currentEvent = events[currentStepIndex];

    if (!currentEvent) {
        return (
            <div className="flex-1 flex items-center justify-center text-text-muted font-mono animate-pulse">
                Awaiting Execution Context...
            </div>
        );
    }

    const { nodes = [], edges = [], distances = {} } = currentEvent.state as any;
    const activeElements = currentEvent.activeElements as string[];
    const pointers = currentEvent.pointers;
    const queue = currentEvent.auxiliary || [];

    // Map nodes to dict for easy lookup
    const nodesDict = nodes.reduce((acc: any, node: any) => {
        acc[node.id] = node;
        return acc;
    }, {});

    // Group pointers by node id (excluding target)
    const pointersById: Record<string, string[]> = {};
    Object.entries(pointers).forEach(([name, val]) => {
        if (name === 'target') return;
        const nodeId = val as string;
        if (!pointersById[nodeId]) pointersById[nodeId] = [];
        pointersById[nodeId].push(name);
    });

    // Clamp node positions to prevent overflow and provide breathing room
    // X gets standard 8-92% bounds, Y gets 10-90% (container is shifted down to avoid metrics)
    const clampX = (val: number) => Math.max(8, Math.min(92, val));
    const clampY = (val: number) => Math.max(10, Math.min(90, val));

    return (
        <div className="flex-1 flex flex-col relative rounded-xl overflow-hidden shadow-inner bg-background relative border border-border h-full">
            
            {/* Subtle animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Top Metrics Bar */}
            <div className="absolute top-4 left-4 flex gap-6 text-xs font-mono text-text-muted z-20 bg-surface/60 px-4 py-2 rounded-lg backdrop-blur-md border border-border shadow-md">
                <div className="flex flex-col">
                    <span className="opacity-50 tracking-wider text-[10px]">STEP</span>
                    <span className="text-text font-semibold text-sm">{currentStepIndex} / {events.length > 0 ? events.length - 1 : 0}</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex flex-col">
                    <span className="opacity-50 tracking-wider text-[10px]">COMPARISONS</span>
                    <span className="text-text font-semibold text-sm">{currentEvent.metrics.comparisons}</span>
                </div>
                {pointers.target !== undefined && (
                    <>
                        <div className="w-px bg-border" />
                        <div className="flex flex-col">
                            <span className="text-accent tracking-wider text-[10px]">TARGET</span>
                            <span className="text-accent font-bold text-sm">{pointers.target}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Central Graph Area */}
            <div className="flex-1 relative w-full h-full z-10 overflow-hidden">
                {algorithmId === 'dijkstra' && (
                    <div className="absolute top-6 right-8 flex flex-col gap-2 z-30 opacity-75">
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-mono text-text-muted">Edge Weight</span>
                            <div className="w-4 h-4 rounded-full bg-surface-raised flex items-center justify-center text-[8px] font-mono font-bold text-text-secondary">5</div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-mono text-text-muted">Shortest Distance</span>
                            <div className="px-1 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 text-[8px] font-mono font-bold">d=12</div>
                        </div>
                    </div>
                )}
                <div className="absolute top-24 left-0 right-0 bottom-8">
                    {/* SVG Edges Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <mask id="graph-node-mask">
                                <rect width="100%" height="100%" fill="white" />
                                {nodes.map((node: any) => (
                                    <circle key={`mask-${node.id}`} cx={`${clampX(node.x)}%`} cy={`${clampY(node.y)}%`} r="28" fill="black" />
                                ))}
                            </mask>
                            <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        {edges.map((edge: any, i: number) => {
                            const source = nodesDict[edge.source];
                            const target = nodesDict[edge.target];
                            if (!source || !target) return null;
                            
                            const isEdgeActive = activeElements.includes(source.id) && activeElements.includes(target.id);
                            
                            return (
                                <g key={`edge-${source.id}-${target.id}-${i}`}>
                                    <motion.line
                                        x1={`${clampX(source.x)}%`}
                                        y1={`${clampY(source.y)}%`}
                                        x2={`${clampX(target.x)}%`}
                                        y2={`${clampY(target.y)}%`}
                                        stroke={isEdgeActive ? "#2FE0C2" : "#34304A"}
                                        strokeWidth={isEdgeActive ? 3 : 2}
                                        mask="url(#graph-node-mask)"
                                        filter={isEdgeActive ? "url(#edge-glow)" : ""}
                                        className="transition-colors duration-300"
                                    />

                                    {edge.weight != null && (
                                        <g>
                                            <circle
                                                cx={`${(clampX(source.x) + clampX(target.x)) / 2}%`}
                                                cy={`${(clampY(source.y) + clampY(target.y)) / 2}%`}
                                                r="8"
                                                fill="#1C1829"
                                                className="transition-colors duration-300"
                                            />
                                            <text
                                                x={`${(clampX(source.x) + clampX(target.x)) / 2}%`}
                                                y={`${(clampY(source.y) + clampY(target.y)) / 2}%`}
                                                fill={isEdgeActive ? "#2FE0C2" : "#9C96AC"}
                                                fontSize="10"
                                                fontFamily="monospace"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className="transition-colors duration-300"
                                            >
                                                {edge.weight}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map((node: any) => {
                        const isActive = activeElements.includes(node.id);
                        const isCurrent = pointers.curr === node.id;
                        const isMatch = currentEvent.type === 'MATCH' && isCurrent;
                        const isMismatch = currentEvent.type === 'MISMATCH' && isCurrent;
                        const isEnqueued = queue.includes(node.id) || currentEvent.type === 'ENQUEUE' && activeElements.includes(node.id);
                        const isVisited = !isActive && !isEnqueued && currentStepIndex > 0 && events.slice(0, currentStepIndex).some(e => e.type === 'DEQUEUE' && e.pointers.curr === node.id);

                        let borderColor = 'border-border';
                        let bgColor = 'bg-surface/80 backdrop-blur-sm';
                        let textColor = 'text-text-muted';
                        let shadow = 'shadow-sm';
                        let scale = 1;
                        let zIndex = 10;

                        if (isMatch) {
                            borderColor = 'border-state-match'; 
                            bgColor = 'bg-state-match/40 backdrop-blur-md';
                            textColor = 'text-text font-bold';
                            shadow = 'shadow-[0_0_40px_rgba(47,224,194,0.8)]';
                            scale = 1.2;
                            zIndex = 30;
                        } else if (isMismatch) {
                            borderColor = 'border-state-mismatch'; 
                            bgColor = 'bg-state-mismatch/30 backdrop-blur-md';
                            textColor = 'text-text';
                            shadow = 'shadow-[0_0_20px_rgba(232,84,144,0.5)]';
                            scale = 1.1;
                            zIndex = 25;
                        } else if (isCurrent) {
                            borderColor = 'border-accent'; 
                            bgColor = 'bg-accent/30 backdrop-blur-md';
                            textColor = 'text-text font-bold';
                            shadow = 'shadow-[0_0_25px_rgba(47,224,194,0.6)]';
                            scale = 1.15;
                            zIndex = 20;
                        } else if (isEnqueued) {
                            borderColor = 'border-state-compare'; 
                            bgColor = 'bg-state-compare/20 backdrop-blur-md';
                            textColor = 'text-state-compare';
                            shadow = 'shadow-[0_0_15px_rgba(232,163,23,0.3)]';
                        } else if (isVisited) {
                            borderColor = 'border-state-visited/40'; 
                            bgColor = 'bg-state-visited/10 backdrop-blur-md';
                            textColor = 'text-state-visited';
                        } else if (activeElements.length > 0) {
                            bgColor = 'bg-surface/30 backdrop-blur-sm';
                            borderColor = 'border-border/50';
                            textColor = 'text-text-muted/50';
                        }

                        const pBadges = pointersById[node.id] || [];
                        const hasDistance = distances[node.id] !== undefined;

                        return (
                            <motion.div
                                key={node.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                style={{ left: `${clampX(node.x)}%`, top: `${clampY(node.y)}%`, zIndex }}
                                animate={{ scale }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Node Label (above node) */}
                                <div className="text-[9px] font-mono text-text-muted/60 uppercase tracking-widest mb-1">
                                    N{node.id.split('-')[1]}
                                </div>

                                {/* Node Circle */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-all duration-300`}>
                                    {node.value}
                                </div>

                                {/* Distance Badge (below node, only for Dijkstra) */}
                                {hasDistance && (
                                    <div className="mt-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap bg-accent/20 text-accent border border-accent/30">
                                        {distances[node.id] === 999 ? '\u221E' : `d=${distances[node.id]}`}
                                    </div>
                                )}

                                {/* Pointer Badges (below distance, stacked vertically) */}
                                {pBadges.length > 0 && (
                                    <div className="mt-1 flex flex-col items-center gap-0.5">
                                        {pBadges.map(p => (
                                            <span key={p} className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-accent/10 text-accent border border-accent/20 leading-none">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Controls Container */}
            <div className="shrink-0 flex flex-col items-center gap-4 w-full z-20 px-8 pb-6 pt-2">
                {/* Queue Visualization */}
                <div className="w-full max-w-3xl">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-2 pl-2">
                            {algorithmId === 'dijkstra' ? 'Priority Queue (Min-Heap)' : algorithmId === 'dfs' ? 'DFS Stack (LIFO)' : 'BFS Queue (FIFO)'}
                        </span>
                        <div className="flex items-center gap-2 p-3 bg-surface/60 rounded-xl border border-dashed border-border/60 min-h-[72px] shadow-inner backdrop-blur-md overflow-x-auto custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {queue.map((nodeId: string, idx: number) => {
                                    const node = nodesDict[nodeId];
                                    if (!node) return null;
                                    return (
                                        <motion.div
                                            key={`q-${nodeId}-${idx}`}
                                            layout
                                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-sm border-2 border-state-compare bg-state-compare/20 text-state-compare shadow-[0_0_15px_rgba(232,163,23,0.2)] relative mt-4"
                                        >
                                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-state-compare/80 uppercase tracking-widest">
                                                N{node.id.split('-')[1]}
                                            </div>
                                            {node.value}
                                            {distances[node.id] !== undefined && (
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold px-1 py-0.5 rounded-full whitespace-nowrap bg-accent/20 text-accent border border-accent/30">
                                                    {distances[node.id] === 999 ? '\u221E' : `d=${distances[node.id]}`}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                                {queue.length === 0 && (
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-text-muted/40 font-mono text-sm mx-auto"
                                    >
                                        {algorithmId === 'dijkstra' ? 'Empty Priority Queue' : algorithmId === 'dfs' ? 'Empty Stack' : 'Empty Queue'}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Event Description Toast */}
                <div className="w-full max-w-md">
                    <motion.div 
                        key={`toast-${currentStepIndex}`}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="mx-auto bg-surface/90 backdrop-blur-md border border-border shadow-lg rounded-xl p-4 flex items-center gap-4"
                    >
                        <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent)]" />
                        <p className="text-text text-sm font-medium leading-relaxed">
                            {currentEvent.description}
                        </p>
                    </motion.div>
                </div>
            </div>
            
        </div>
    );
};
