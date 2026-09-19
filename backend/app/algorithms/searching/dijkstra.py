import time
import random
import math
import heapq
from typing import List, Dict, Set, Tuple
from ...engine.execution import ExecutionEngine
from ...models.dataset import GraphDataset, GraphNode
from ...models.events import ExecutionResult, ExecutionSummary

DIJKSTRA_CODE = """import heapq

def dijkstra(graph, start_node, target):
    distances = {node: float('infinity') for node in graph.nodes}
    distances[start_node] = 0
    pq = [(0, start_node)]
    visited = set()
    
    while pq:
        current_distance, curr = heapq.heappop(pq)
        
        if curr in visited:
            continue
            
        visited.add(curr)
        
        if curr.value == target:
            return curr
            
        for neighbor, weight in graph.get_neighbors(curr):
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return None
"""

def dijkstra_algorithm(dataset: GraphDataset, target: int) -> ExecutionResult:
    engine = ExecutionEngine()
    
    # Build adjacency list with weights
    adj: Dict[str, List[Tuple[str, int]]] = {node.id: [] for node in dataset.nodes}
    for edge in dataset.edges:
        w = edge.weight if edge.weight is not None else 1
        adj[edge.source].append((edge.target, w))
        adj[edge.target].append((edge.source, w)) # Undirected graph
        
    nodes_dict = {node.id: node for node in dataset.nodes}
    
    start_time = time.perf_counter()
    
    # State representation for frontend
    def get_state():
        return {
            "nodes": [n.model_dump() for n in dataset.nodes],
            "edges": [e.model_dump() for e in dataset.edges],
            "distances": distances.copy()
        }
        
    start_node = dataset.nodes[0].id
    start_node_name = start_node.replace('node-', 'Node ')

    distances = {node.id: 999 for node in dataset.nodes} # Use 999 instead of float('inf') for JSON serialization
    distances[start_node] = 0
    start_node_name = start_node.replace('node-', 'Node ')

    engine.record_event(
        type="START",
        description=f"Initiating Dijkstra for target {target} starting at {start_node_name}...",
        state=get_state(),
        active_elements=[],
        line=1,
        pointers={"target": target}
    )
    
    # pq stores (distance, node_id)
    pq = [(0, start_node)]
    visited = set()
    
    def get_pq_nodes():
        # Return sorted list of node IDs in PQ
        return [item[1] for item in sorted(pq)]

    engine.record_event(
        type="ENQUEUE",
        description=f"Starting Dijkstra. Cost to reach {start_node_name} is 0.",
        state=get_state(),
        active_elements=[start_node],
        line=5,
        pointers={"target": target},
        auxiliary=get_pq_nodes()
    )
    
    found_id = None
    
    while pq:
        current_distance, curr = heapq.heappop(pq)
        curr_name = curr.replace('node-', 'Node ')
        curr_val = nodes_dict[curr].value
        
        if curr in visited:
            continue
            
        visited.add(curr)
        
        engine.record_event(
            type="DEQUEUE",
            description=random.choice([
                f"Popped {curr_name} (Cost: {current_distance}) from the priority queue.",
                f"{curr_name} is currently the closest node. Exploring it now.",
                f"Extracting Min: {curr_name} with shortest distance {current_distance}."
            ]),
            state=get_state(),
            active_elements=[curr],
            line=9,
            pointers={"target": target, "curr": curr},
            auxiliary=get_pq_nodes()
        )
        
        engine.increment_metric("comparisons")
        
        if curr_val == target:
            engine.record_event(
                type="MATCH",
                description=random.choice([
                    f"Match! {curr_name} holds the target value {target}. Total cost: {current_distance}.",
                    f"Shortest path found to {curr_name}! Value is {target}.",
                    f"Success! Arrived at {curr_name} with cost {current_distance}."
                ]),
                state=get_state(),
                active_elements=[curr],
                line=16,
                pointers={"target": target, "curr": curr},
                auxiliary=get_pq_nodes()
            )
            found_id = curr
            break
            
        else:
            engine.record_event(
                type="MISMATCH",
                description=random.choice([
                    f"{curr_name} holds {curr_val}, which is not {target}.",
                    f"Not a match. We must continue Dijkstra's expansion.",
                    f"{curr_name} is not the destination."
                ]),
                state=get_state(),
                active_elements=[curr],
                line=18,
                pointers={"target": target, "curr": curr},
                auxiliary=get_pq_nodes()
            )
            
        neighbors = adj[curr]
        if neighbors:
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Calculating costs for {curr_name}'s {len(neighbors)} neighbors.",
                    f"Relaxing edges for {curr_name}.",
                    f"Evaluating paths through {curr_name}."
                ]),
                state=get_state(),
                active_elements=[curr] + [nbr[0] for nbr in neighbors],
                line=19,
                pointers={"target": target, "curr": curr},
                auxiliary=get_pq_nodes()
            )
            
        for nbr, weight in neighbors:
            if nbr in visited:
                continue
                
            distance = current_distance + weight
            nbr_name = nbr.replace('node-', 'Node ')
            
            if distance < distances[nbr]:
                old_dist = distances[nbr]
                distances[nbr] = distance
                heapq.heappush(pq, (distance, nbr))
                
                desc = f"New shortest path to {nbr_name}! Cost {old_dist} -> {distance}." if old_dist != 999 else f"Path to {nbr_name} found! Cost: {distance}."
                
                engine.record_event(
                    type="ENQUEUE",
                    description=desc,
                    state=get_state(),
                    active_elements=[curr, nbr],
                    line=23,
                    pointers={"target": target, "curr": curr, "neighbor": nbr},
                    auxiliary=get_pq_nodes()
                )

    if not found_id:
        engine.record_event(
            type="COMPLETE",
            description=f"Priority Queue empty. Target {target} is unreachable.",
            state=get_state(),
            active_elements=[],
            line=26,
            pointers={"target": target},
            auxiliary=[]
        )
    else:
        engine.record_event(
            type="COMPLETE",
            description=f"Dijkstra Complete.",
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
        algorithmId="dijkstra",
        sourceCode=DIJKSTRA_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
