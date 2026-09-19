import { useState, useRef } from 'react';
import { Modal } from './Modal';

export interface CustomNode {
    id: string;
    value: number;
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
    activeMode: 'ADD_NODE' | 'ADD_EDGE' | 'REMOVE_NODE';
    isDijkstra: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
    nodes, edges, onNodesChange, onEdgesChange, activeMode, isDijkstra
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dragStartNode, setDragStartNode] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [dragTargetNode, setDragTargetNode] = useState<string | null>(null);
    
    // Custom Modal state
    const [pendingEdge, setPendingEdge] = useState<{source: string, target: string} | null>(null);

    // Derive the next node counter safely from existing nodes
    const getNextNodeId = () => {
        if (nodes.length === 0) return 1;
        const maxId = Math.max(...nodes.map(n => parseInt(n.id.split('-')[1]) || 0));
        return maxId + 1;
    };

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

        const nextId = getNextNodeId();
        const newNode: CustomNode = {
            id: `node-${nextId}`,
            value: nextId,
            x,
            y
        };
        onNodesChange([...nodes, newNode]);
    };

    const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeMode === 'ADD_EDGE') {
            setDragStartNode(nodeId);
            setDragTargetNode(null); // Reset
        } else if (activeMode === 'REMOVE_NODE') {
            onNodesChange(nodes.filter(n => n.id !== nodeId));
            onEdgesChange(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        }
    };

    const handleCanvasMouseUp = () => {
        if (activeMode === 'ADD_EDGE' && dragStartNode && dragTargetNode && dragStartNode !== dragTargetNode) {
            const exists = edges.some(e => 
                (e.source === dragStartNode && e.target === dragTargetNode) ||
                (e.target === dragStartNode && e.source === dragTargetNode)
            );
            
            if (!exists) {
                if (isDijkstra) {
                    setPendingEdge({ source: dragStartNode, target: dragTargetNode });
                } else {
                    onEdgesChange([...edges, {
                        source: dragStartNode,
                        target: dragTargetNode
                    }]);
                }
            }
        }
        setDragStartNode(null);
        setDragTargetNode(null);
    };

    const handleWeightConfirm = (val?: string) => {
        if (pendingEdge) {
            const weight = (val && !isNaN(Number(val))) ? Number(val) : 1;
            onEdgesChange([...edges, {
                source: pendingEdge.source,
                target: pendingEdge.target,
                weight
            }]);
        }
        setPendingEdge(null);
    };

    return (
        <div 
            ref={canvasRef}
            className={`flex-1 w-full h-full relative overflow-hidden bg-background rounded-xl border border-border shadow-inner ${activeMode === 'ADD_NODE' ? 'cursor-crosshair' : ''} select-none`}
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={() => { setDragStartNode(null); setDragTargetNode(null); }}
        >
            <div className="absolute inset-0 dot-grid pointer-events-none" />

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
                                    r="10" 
                                    fill="#1C1829"
                                    stroke="#34304A"
                                    strokeWidth="1"
                                />
                            )}
                            {edge.weight !== undefined && (
                                <text 
                                    x={`${(sourceNode.x + targetNode.x)/2}%`} 
                                    y={`${(sourceNode.y + targetNode.y)/2}%`} 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fill="#9C96AC"
                                    fontSize="11"
                                    fontWeight="bold"
                                    fontFamily="monospace"
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

            {nodes.map(node => {
                let hoverClasses = '';
                if (activeMode === 'ADD_EDGE') hoverClasses = 'cursor-pointer hover:border-accent hover:text-accent';
                if (activeMode === 'REMOVE_NODE') hoverClasses = 'cursor-pointer hover:border-state-swap hover:text-state-swap hover:bg-state-swap/10';

                return (
                    <div
                        key={node.id}
                        className={`canvas-node absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm border-2 border-border bg-surface/80 backdrop-blur-sm text-text-muted shadow-sm transition-colors ${hoverClasses}`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                        onMouseEnter={() => setDragTargetNode(node.id)}
                        onMouseLeave={() => setDragTargetNode(null)}
                    >
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-muted/60 uppercase tracking-widest bg-background/80 px-1 rounded">
                            N{node.id.split('-')[1]}
                        </div>
                        {node.value}
                    </div>
                );
            })}
            
            <Modal 
                isOpen={!!pendingEdge}
                type="prompt"
                title="Edge Weight"
                message="Enter a weight for this path:"
                defaultValue=""
                onClose={() => setPendingEdge(null)}
                onConfirm={handleWeightConfirm}
            />
        </div>
    );
};
