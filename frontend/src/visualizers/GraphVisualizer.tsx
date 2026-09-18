import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

export const GraphVisualizer: React.FC = () => {
    const { events, currentStepIndex } = usePlayerStore();
    const currentEvent = events[currentStepIndex];

    if (!currentEvent) {
        return (
            <div className="flex-1 flex items-center justify-center text-text-muted font-mono animate-pulse">
                Awaiting Execution Context...
            </div>
        );
    }

    const { nodes = [], edges = [] } = currentEvent.state as any;
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
                <div className="absolute inset-0 p-12 pb-48 pt-24">
                    {/* SVG Edges Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <mask id="graph-node-mask">
                                <rect width="100%" height="100%" fill="white" />
                                {nodes.map((node: any) => (
                                    <circle key={`mask-${node.id}`} cx={`${node.x}%`} cy={`${node.y}%`} r="28" fill="black" />
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
                            
                            // Highlight edge if both source and target are active (e.g. scanning neighbors)
                            const isEdgeActive = activeElements.includes(source.id) && activeElements.includes(target.id);
                            
                            return (
                                <motion.line
                                    key={`edge-${source.id}-${target.id}-${i}`}
                                    x1={`${source.x}%`}
                                    y1={`${source.y}%`}
                                    x2={`${target.x}%`}
                                    y2={`${target.y}%`}
                                    stroke={isEdgeActive ? "#3b82f6" : "rgba(255,255,255,0.1)"}
                                    strokeWidth={isEdgeActive ? 3 : 2}
                                    mask="url(#graph-node-mask)"
                                    filter={isEdgeActive ? "url(#edge-glow)" : ""}
                                    className="transition-colors duration-300"
                                />
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

                        let borderColor = 'border-border/60';
                        let bgColor = 'bg-surface/80 backdrop-blur-sm';
                        let textColor = 'text-text-muted';
                        let shadow = 'shadow-sm';
                        let scale = 1;
                        let zIndex = 10;

                        if (isMatch) {
                            borderColor = 'border-[#10b981]'; 
                            bgColor = 'bg-[#10b981]/40 backdrop-blur-md';
                            textColor = 'text-white font-bold';
                            shadow = 'shadow-[0_0_40px_rgba(16,185,129,0.8)]';
                            scale = 1.2;
                            zIndex = 30;
                        } else if (isMismatch) {
                            borderColor = 'border-[#f43f5e]'; 
                            bgColor = 'bg-[#f43f5e]/30 backdrop-blur-md';
                            textColor = 'text-white';
                            shadow = 'shadow-[0_0_20px_rgba(244,63,94,0.5)]';
                            scale = 1.1;
                            zIndex = 25;
                        } else if (isCurrent) {
                            borderColor = 'border-[#3b82f6]'; 
                            bgColor = 'bg-[#3b82f6]/30 backdrop-blur-md';
                            textColor = 'text-white font-bold';
                            shadow = 'shadow-[0_0_25px_rgba(59,130,246,0.6)]';
                            scale = 1.15;
                            zIndex = 20;
                        } else if (isEnqueued) {
                            borderColor = 'border-[#f59e0b]'; 
                            bgColor = 'bg-[#f59e0b]/20 backdrop-blur-md';
                            textColor = 'text-[#f59e0b]';
                            shadow = 'shadow-[0_0_15px_rgba(245,158,11,0.3)]';
                        } else if (isVisited) {
                            borderColor = 'border-[#10b981]/40'; 
                            bgColor = 'bg-[#10b981]/10 backdrop-blur-md';
                            textColor = 'text-[#10b981]/80';
                        } else if (activeElements.length > 0) {
                            // Dim unvisited non-active nodes slightly
                            bgColor = 'bg-surface/30 backdrop-blur-sm';
                            borderColor = 'border-border/20';
                            textColor = 'text-text-muted/50';
                        }

                        const pBadges = pointersById[node.id] || [];

                        return (
                            <motion.div
                                key={node.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex }}
                                animate={{ scale }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm border-2 ${borderColor} ${bgColor} ${textColor} ${shadow} transition-all duration-300`}>
                                    {node.value}
                                </div>
                                
                                {/* Pointer Badges */}
                                {pBadges.length > 0 && (
                                    <div className="absolute top-full mt-2 flex flex-col items-center gap-1">
                                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-accent/80" />
                                        {pBadges.map(p => (
                                            <span key={p} className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-accent/10 text-accent border border-accent/20 shadow-sm backdrop-blur-sm">
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

            {/* Queue Visualization */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl z-20 px-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider mb-2 pl-2">
                        BFS Queue (FIFO)
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
                                        className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-sm border-2 border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    >
                                        {node.value}
                                    </motion.div>
                                );
                            })}
                            {queue.length === 0 && (
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-text-muted/40 font-mono text-sm mx-auto"
                                >
                                    Empty Queue
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Event Description Toast */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full z-30">
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
    );
};


