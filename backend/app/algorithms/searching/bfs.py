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
    start_node_name = start_node.replace('node-', 'Node ')

    engine.record_event(
        type="START",
        description=f"Initiating BFS for target {target} starting at {start_node_name}...",
        state=get_state(),
        active_elements=[],
        line=1,
        pointers={"target": target}
    )
    
    queue = [start_node]
    visited = {start_node}
    
    engine.record_event(
        type="ENQUEUE",
        description=f"Starting BFS. Added {start_node.replace('node-', 'Node ')} to the queue.",
        state=get_state(),
        active_elements=[start_node],
        line=4,
        pointers={"target": target},
        auxiliary=list(queue)
    )
    
    found_id = None
    
    while queue:
        curr = queue.pop(0) # popleft
        curr_name = curr.replace('node-', 'Node ')
        curr_val = nodes_dict[curr].value
        
        engine.record_event(
            type="DEQUEUE",
            description=random.choice([
                f"Popped {curr_name} from the front of the queue to process.",
                f"It's {curr_name}'s turn. Popping it from the queue.",
                f"Taking {curr_name} out of the queue to check its value."
            ]),
            state=get_state(),
            active_elements=[curr],
            line=8,
            pointers={"target": target, "curr": curr},
            auxiliary=list(queue)
        )
        
        engine.increment_metric("comparisons")
        
        if curr_val == target:
            engine.record_event(
                type="MATCH",
                description=random.choice([
                    f"Match! {curr_name} holds the target value {target}.",
                    f"Found it! {curr_name}'s value is {target}.",
                    f"Success! {curr_name} matches our target."
                ]),
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
                description=random.choice([
                    f"{curr_name} holds {curr_val}, which is not {target}.",
                    f"No match here. {curr_val} != {target}.",
                    f"{curr_name} is a miss."
                ]),
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
                description=random.choice([
                    f"Now scanning {curr_name}'s neighbors to add to the queue.",
                    f"Let's look at the {len(neighbors)} nodes connected to {curr_name}.",
                    f"Finding all unvisited neighbors of {curr_name}."
                ]),
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
                nbr_name = nbr.replace('node-', 'Node ')
                engine.record_event(
                    type="ENQUEUE",
                    description=random.choice([
                        f"Discovered {nbr_name}! Adding it to the back of the queue.",
                        f"{nbr_name} hasn't been visited yet. Enqueueing it.",
                        f"Found new neighbor {nbr_name}. Dropping it in the queue."
                    ]),
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
