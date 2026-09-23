import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

LINEAR_SEARCH_CODE = """def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
"""

def linear_search_algorithm(dataset: ArrayDataset, target: int) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description=f"Initiating Linear Search for target: {target}...",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1,
        pointers={"target": target} # Pass target here if needed by frontend
    )
    
    found_idx = -1

    for i in range(n):
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Checking index {i}.",
                f"Moving pointer to index {i}.",
                f"Examining {arr[i]['value']} at position {i}."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[i],
            line=2,
            pointers={"curr": i, "target": target}
        )
        
        engine.increment_metric("comparisons")
        engine.record_event(
            type="COMPARE",
            description=random.choice([
                f"Is {arr[i]['value']} == {target}?",
                f"Comparing {arr[i]['value']} with our target {target}.",
                f"Does {arr[i]['value']} match {target}?"
            ]),
            state=[a.copy() for a in arr],
            active_elements=[i],
            line=3,
            pointers={"curr": i, "target": target}
        )
        
        if arr[i]['value'] == target:
            engine.record_event(
                type="MATCH",
                description=random.choice([
                    f"Match found at index {i}!",
                    f"Target {target} located at position {i}!",
                    f"Success! {arr[i]['value']} equals {target}."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=4,
                pointers={"curr": i, "target": target}
            )
            found_idx = i
            break
        else:
            engine.record_event(
                type="MISMATCH",
                description=random.choice([
                    f"No match. {arr[i]['value']} != {target}.",
                    f"{arr[i]['value']} is not what we're looking for.",
                    f"Mismatch. Continuing search."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=3, # Evaluated false
                pointers={"curr": i, "target": target}
            )

    if found_idx == -1:
        engine.record_event(
            type="COMPLETE",
            description=f"Reached end of array. Target {target} not found.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=5,
            pointers={"target": target}
        )
    else:
        engine.record_event(
            type="COMPLETE",
            description=f"Search complete. Target {target} found at index {found_idx}.",
            state=[a.copy() for a in arr],
            active_elements=[found_idx],
            line=None,
            pointers={"target": target, "curr": found_idx}
        )

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    return ExecutionResult(
        algorithmId="linear_search",
        sourceCode=LINEAR_SEARCH_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
