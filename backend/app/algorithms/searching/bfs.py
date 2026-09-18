import time
import random
from typing import List, Dict, Set
from ...engine.execution import ExecutionEngine
from ...models.dataset import GraphDataset, GraphNode
from ...models.events import ExecutionResult, ExecutionSummary

BFS_CODE = """from collections import deque

def bfs(graph, start_node, target):
    queue = deque([start_node])
    visited = {start_node}
    
    while queue:
        curr = queue.popleft()
        
        if curr.value == target:
            return curr
            
        for neighbor in graph.get_neighbors(curr):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return None
"""

def bfs_algorithm(dataset: GraphDataset, target: int) -> ExecutionResult:
    engine = ExecutionEngine()
    
    # Build adjacency list
    adj: Dict[str, List[str]] = {node.id: [] for node in dataset.nodes}
    for edge in dataset.edges:
        adj[edge.source].append(edge.target)
        adj[edge.target].append(edge.source) # Undirected graph
        
    nodes_dict = {node.id: node for node in dataset.nodes}
    
    start_time = time.perf_counter()
    
    # State representation for frontend
    def get_state():
        return {
            "nodes": [n.model_dump() for n in dataset.nodes],
            "edges": [e.model_dump() for e in dataset.edges]
        }
        
    start_node = dataset.nodes[0].id

    engine.record_event(
        type="START",
        description=f"Initiating BFS for target {target} starting at {start_node}...",
        state=get_state(),
        active_elements=[],
        line=1,
        pointers={"target": target}
    )
    
    queue = [start_node]
    visited = {start_node}
    
    engine.record_event(
        type="ENQUEUE",
        description=f"Initializing queue with start node {start_node}.",
        state=get_state(),
        active_elements=[start_node],
        line=4,
        pointers={"target": target},
        auxiliary=list(queue)
    )
    
    found_id = None
    
    while queue:
        curr = queue.pop(0) # popleft
        
        engine.record_event(
            type="DEQUEUE",
            description=f"Dequeued {curr} to process.",
            state=get_state(),
            active_elements=[curr],
            line=8,
            pointers={"target": target, "curr": curr},
            auxiliary=list(queue)
        )
        
        engine.increment_metric("comparisons")
        
        if nodes_dict[curr].value == target:
            engine.record_event(
                type="MATCH",
                description=f"Target {target} found at {curr}!",
                state=get_state(),
                active_elements=[curr],
                line=10,
                pointers={"target": target, "curr": curr},
                auxiliary=list(queue)
            )
            found_id = curr
            break
            
        else:
            engine.record_event(
                type="MISMATCH",
                description=f"Node {curr} ({nodes_dict[curr].value}) != {target}.",
                state=get_state(),
                active_elements=[curr],
                line=11,
                pointers={"target": target, "curr": curr},
                auxiliary=list(queue)
            )
            
        neighbors = adj[curr]
        if neighbors:
            engine.record_event(
                type="INFO",
                description=f"Scanning {len(neighbors)} neighbors of {curr}.",
                state=get_state(),
                active_elements=[curr] + neighbors,
                line=13,
                pointers={"target": target, "curr": curr},
                auxiliary=list(queue)
            )
            
        for nbr in neighbors:
            if nbr not in visited:
                visited.add(nbr)
                queue.append(nbr)
                engine.record_event(
                    type="ENQUEUE",
                    description=f"Discovered {nbr}. Adding to queue.",
                    state=get_state(),
                    active_elements=[curr, nbr],
                    line=16,
                    pointers={"target": target, "curr": curr, "neighbor": nbr},
                    auxiliary=list(queue)
                )

    if not found_id:
        engine.record_event(
            type="COMPLETE",
            description=f"Queue empty. Target {target} not found in the graph.",
            state=get_state(),
            active_elements=[],
            line=18,
            pointers={"target": target},
            auxiliary=[]
        )
    else:
        engine.record_event(
            type="COMPLETE",
            description=f"BFS Complete.",
            state=get_state(),
            active_elements=[found_id],
            line=None,
            pointers={"target": target},
            auxiliary=[]
        )
        
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    return ExecutionResult(
        algorithmId="bfs",
        sourceCode=BFS_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
