import React, { useState, useRef } from 'react';

export interface CustomNode {
    id: string;
    value: string;
    x: number;
    y: number;
}

export interface CustomEdge {
    source: string;
    target: string;
    weight?: number;
}

interface InteractiveCanvasProps {
    nodes: CustomNode[];
    edges: CustomEdge[];
    onNodesChange: (nodes: CustomNode[]) => void;
    onEdgesChange: (edges: CustomEdge[]) => void;
    activeMode: 'ADD_NODE' | 'ADD_EDGE' | 'MOVE_NODE';
    isDijkstra: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
    nodes, edges, onNodesChange, onEdgesChange, activeMode, isDijkstra
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dragStartNode, setDragStartNode] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [nodeCounter, setNodeCounter] = useState(1);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (activeMode !== 'ADD_NODE') return;
        if ((e.target as HTMLElement).closest('.canvas-node')) return;

        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newNode: CustomNode = {
            id: `node-${nodeCounter}`,
            value: `${nodeCounter}`,
            x,
            y
        };
        onNodesChange([...nodes, newNode]);
        setNodeCounter(prev => prev + 1);
    };

    const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeMode === 'ADD_EDGE') {
            setDragStartNode(nodeId);
        }
    };

    const handleNodeMouseUp = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeMode === 'ADD_EDGE' && dragStartNode && dragStartNode !== nodeId) {
            const exists = edges.some(e => 
                (e.source === dragStartNode && e.target === nodeId) ||
                (e.target === dragStartNode && e.source === nodeId)
            );
            
            if (!exists) {
                let weight = 1;
                if (isDijkstra) {
                    const val = prompt('Enter edge weight (e.g., 5):', '1');
                    if (val !== null && !isNaN(Number(val))) {
                        weight = Number(val);
                    }
                }
                
                onEdgesChange([...edges, {
                    source: dragStartNode,
                    target: nodeId,
                    weight: isDijkstra ? weight : undefined
                }]);
            }
        }
        setDragStartNode(null);
    };

    return (
        <div 
            ref={canvasRef}
            className="flex-1 w-full h-full relative overflow-hidden bg-background rounded-xl border border-border shadow-inner cursor-crosshair"
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
            onMouseUp={() => setDragStartNode(null)}
            onMouseLeave={() => setDragStartNode(null)}
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map((edge, i) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    return (
                        <g key={i}>
                            <line 
                                x1={`${sourceNode.x}%`} y1={`${sourceNode.y}%`}
                                x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                                stroke="currentColor" strokeWidth="2"
                                className="text-border"
                            />
                            {edge.weight !== undefined && (
                                <circle 
                                    cx={`${(sourceNode.x + targetNode.x)/2}%`} 
                                    cy={`${(sourceNode.y + targetNode.y)/2}%`} 
                                    r="12" 
                                    className="fill-surface stroke-border" 
                                    strokeWidth="1"
                                />
                            )}
                            {edge.weight !== undefined && (
                                <text 
                                    x={`${(sourceNode.x + targetNode.x)/2}%`} 
                                    y={`${(sourceNode.y + targetNode.y)/2}%`} 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    className="fill-text-muted text-[10px] font-mono font-bold"
                                >
                                    {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}
                
                {dragStartNode && (
                    <line 
                        x1={`${nodes.find(n => n.id === dragStartNode)?.x || 0}%`} 
                        y1={`${nodes.find(n => n.id === dragStartNode)?.y || 0}%`}
                        x2={`${mousePos.x}%`} 
                        y2={`${mousePos.y}%`}
                        stroke="currentColor" strokeWidth="2" strokeDasharray="4"
                        className="text-accent/50"
                    />
                )}
            </svg>

            {nodes.map(node => (
                <div
                    key={node.id}
                    className={`canvas-node absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm border-2 border-border bg-surface/80 backdrop-blur-sm text-text-muted shadow-sm transition-colors ${activeMode === 'ADD_EDGE' ? 'cursor-pointer hover:border-accent hover:text-accent' : ''}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                    onMouseUp={(e) => handleNodeMouseUp(node.id, e)}
                >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-muted/60 uppercase tracking-widest bg-background/80 px-1 rounded">
                        N{node.id.split('-')[1]}
                    </div>
                    {node.value}
                </div>
            ))}
        </div>
    );
};
