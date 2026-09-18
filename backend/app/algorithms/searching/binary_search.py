import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

BINARY_SEARCH_CODE = """def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
            
        elif arr[mid] < target:
            left = mid + 1
            
        else:
            right = mid - 1
            
    return -1
"""

def binary_search_algorithm(dataset: ArrayDataset, target: int) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description=f"Initiating Binary Search for target {target}...",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1,
        pointers={"target": target}
    )
    
    left = 0
    right = n - 1
    found_idx = -1
    
    engine.record_event(
        type="INFO",
        description="Setting initial boundaries: left at 0, right at the end.",
        state=[a.copy() for a in arr],
        active_elements=list(range(left, right + 1)),
        line=2,
        pointers={"left": left, "right": right, "target": target}
    )

    while left <= right:
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Search space is between index {left} and {right}.",
                f"Narrowing focus to the active partition.",
                f"Valid boundary: left <= right."
            ]),
            state=[a.copy() for a in arr],
            active_elements=list(range(left, right + 1)),
            line=4,
            pointers={"left": left, "right": right, "target": target}
        )
        
        mid = left + (right - left) // 2
        
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Calculating middle point: {mid}.",
                f"We select the middle element {arr[mid]['value']} at index {mid}.",
                f"Probing the center of the partition."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[mid],
            line=5,
            pointers={"left": left, "right": right, "mid": mid, "target": target}
        )
        
        engine.increment_metric("comparisons")
        engine.record_event(
            type="COMPARE",
            description=random.choice([
                f"Is middle element ({arr[mid]['value']}) == target ({target})?",
                f"Checking if {arr[mid]['value']} is the one we want.",
                f"Does {arr[mid]['value']} match {target}?"
            ]),
            state=[a.copy() for a in arr],
            active_elements=[mid],
            line=7,
            pointers={"left": left, "right": right, "mid": mid, "target": target}
        )
        
        if arr[mid]['value'] == target:
            engine.record_event(
                type="MATCH",
                description=random.choice([
                    f"Bullseye! Found {target} at index {mid}.",
                    f"Match! {arr[mid]['value']} equals our target.",
                    f"Success! The middle element is the target."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[mid],
                line=8,
                pointers={"left": left, "right": right, "mid": mid, "target": target}
            )
            found_idx = mid
            break
            
        elif arr[mid]['value'] < target:
            engine.record_event(
                type="MISMATCH",
                description=random.choice([
                    f"Too small. {arr[mid]['value']} < {target}.",
                    f"{arr[mid]['value']} is less than the target.",
                    f"Not a match. Value is too low."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[mid],
                line=10,
                pointers={"left": left, "right": right, "mid": mid, "target": target}
            )
            
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Target must be in the right half! Moving 'left' past mid.",
                    f"Discarding the left half. Updating left boundary.",
                    f"Searching the higher numbers."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[],
                line=11,
                pointers={"left": left, "right": right, "mid": mid, "target": target}
            )
            left = mid + 1
            
        else:
            engine.record_event(
                type="MISMATCH",
                description=random.choice([
                    f"Too big. {arr[mid]['value']} > {target}.",
                    f"{arr[mid]['value']} is greater than the target.",
                    f"Not a match. Value is too high."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[mid],
                line=13,
                pointers={"left": left, "right": right, "mid": mid, "target": target}
            )
            
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Target must be in the left half! Moving 'right' before mid.",
                    f"Discarding the right half. Updating right boundary.",
                    f"Searching the lower numbers."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[],
                line=14,
                pointers={"left": left, "right": right, "mid": mid, "target": target}
            )
            right = mid - 1

    if found_idx == -1:
        engine.record_event(
            type="INFO",
            description=f"left ({left}) > right ({right}). Search space exhausted.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=4, # Loop breaks
            pointers={"target": target}
        )
        engine.record_event(
            type="COMPLETE",
            description=f"Target {target} is not in the array.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=16,
            pointers={"target": target}
        )
    else:
        engine.record_event(
            type="COMPLETE",
            description=f"Binary Search complete. Found {target} at index {found_idx}.",
            state=[a.copy() for a in arr],
            active_elements=[found_idx],
            line=None,
            pointers={"target": target, "mid": found_idx}
        )

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    return ExecutionResult(
        algorithmId="binary_search",
        sourceCode=BINARY_SEARCH_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
