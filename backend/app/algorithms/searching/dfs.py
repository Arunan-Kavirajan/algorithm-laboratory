import time
import random
from typing import List, Dict, Set
from ...engine.execution import ExecutionEngine
from ...models.dataset import GraphDataset, GraphNode
from ...models.events import ExecutionResult, ExecutionSummary

DFS_CODE = """def dfs(graph, start_node, target):
    stack = [start_node]
    visited = {start_node}
    
    while stack:
        curr = stack.pop()
        
        if curr.value == target:
            return curr
            
        for neighbor in reversed(graph.get_neighbors(curr)):
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
                
    return None
"""

def dfs_algorithm(dataset: GraphDataset, target: int) -> ExecutionResult:
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
        description=f"Initiating DFS for target {target} starting at {start_node_name}...",
        state=get_state(),
        active_elements=[],
        line=1,
        pointers={"target": target}
    )
    
    stack = [start_node]
    visited = {start_node}
    
    engine.record_event(
        type="ENQUEUE",
        description=f"Starting DFS. Pushed {start_node_name} onto the stack.",
        state=get_state(),
        active_elements=[start_node],
        line=2,
        pointers={"target": target},
        auxiliary=list(stack)
    )
    
    found_id = None
    
    while stack:
        curr = stack.pop() # pop from end
        curr_name = curr.replace('node-', 'Node ')
        curr_val = nodes_dict[curr].value
        
        engine.record_event(
            type="DEQUEUE",
            description=random.choice([
                f"Popped {curr_name} from the top of the stack to process.",
                f"Diving into {curr_name}. Popping it off the stack.",
                f"Taking {curr_name} off the stack to inspect."
            ]),
            state=get_state(),
            active_elements=[curr],
            line=6,
            pointers={"target": target, "curr": curr},
            auxiliary=list(stack)
        )
        
        engine.increment_metric("comparisons")
        
        if curr_val == target:
            engine.record_event(
                type="MATCH",
                description=random.choice([
                    f"Match! {curr_name} holds the target value {target}.",
                    f"Deep search successful! {curr_name}'s value is {target}.",
                    f"Found the target {target} at {curr_name}!"
                ]),
                state=get_state(),
                active_elements=[curr],
                line=8,
                pointers={"target": target, "curr": curr},
                auxiliary=list(stack)
            )
            found_id = curr
            break
            
        else:
            engine.record_event(
                type="MISMATCH",
                description=random.choice([
                    f"{curr_name} holds {curr_val}, which is not {target}.",
                    f"Not a match. {curr_val} != {target}.",
                    f"{curr_name} is a miss. Must keep going deeper."
                ]),
                state=get_state(),
                active_elements=[curr],
                line=11,
                pointers={"target": target, "curr": curr},
                auxiliary=list(stack)
            )
            
        neighbors = adj[curr]
        if neighbors:
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Scanning {curr_name}'s {len(neighbors)} neighbors to push to the stack.",
                    f"Looking for unvisited paths extending from {curr_name}.",
                    f"Finding all connections for {curr_name}."
                ]),
                state=get_state(),
                active_elements=[curr] + neighbors,
                line=11,
                pointers={"target": target, "curr": curr},
                auxiliary=list(stack)
            )
            
        # Reverse neighbors so the left-most branch is pushed last (and popped first)
        for nbr in reversed(neighbors):
            if nbr not in visited:
                visited.add(nbr)
                stack.append(nbr)
                nbr_name = nbr.replace('node-', 'Node ')
                engine.record_event(
                    type="ENQUEUE",
                    description=random.choice([
                        f"Discovered {nbr_name}! Pushing it to the top of the stack.",
                        f"{nbr_name} is unvisited. Pushing to stack.",
                        f"Found new path at {nbr_name}. Adding to stack."
                    ]),
                    state=get_state(),
                    active_elements=[curr, nbr],
                    line=14,
                    pointers={"target": target, "curr": curr, "neighbor": nbr},
                    auxiliary=list(stack)
                )

    if not found_id:
        engine.record_event(
            type="COMPLETE",
            description=f"Stack is empty. Target {target} not found in the graph.",
            state=get_state(),
            active_elements=[],
            line=16,
            pointers={"target": target},
            auxiliary=[]
        )
    else:
        engine.record_event(
            type="COMPLETE",
            description=f"DFS Complete.",
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
        algorithmId="dfs",
        sourceCode=DFS_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
