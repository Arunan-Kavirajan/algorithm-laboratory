import time
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

BUBBLE_SORT_CODE = """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
"""

def bubble_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    # Convert Pydantic models to dicts for easy JSON serialization in state
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Bubble Sort",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )

    engine.record_event(
        type="INFO",
        description=f"Array length n = {n}",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=2
    )

    for i in range(n):
        swapped = False
        engine.record_event(
            type="INFO",
            description=f"Outer loop i = {i}, initialized swapped = False",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=4,
            pointers={"i": i}
        )

        for j in range(0, n - i - 1):
            engine.increment_metric("comparisons")
            
            engine.record_event(
                type="COMPARE",
                description=f"Comparing arr[{j}] ({arr[j]['value']}) and arr[{j+1}] ({arr[j+1]['value']})",
                state=[a.copy() for a in arr],
                active_elements=[j, j+1],
                line=6,
                pointers={"i": i, "j": j}
            )

            if arr[j]['value'] > arr[j + 1]['value']:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                engine.increment_metric("swaps")
                
                engine.record_event(
                    type="SWAP",
                    description=f"Swapped because {arr[j+1]['value']} < {arr[j]['value']}",
                    state=[a.copy() for a in arr],
                    active_elements=[j, j+1],
                    line=7,
                    pointers={"i": i, "j": j}
                )
                engine.record_event(
                    type="INFO",
                    description="Set swapped = True",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=8,
                    pointers={"i": i, "j": j}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=f"No swap needed. {arr[j]['value']} <= {arr[j+1]['value']}",
                    state=[a.copy() for a in arr],
                    active_elements=[j, j+1],
                    line=6,
                    pointers={"i": i, "j": j}
                )
                
        # The element at n-i-1 is now sorted
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[n - i - 1]['value']} is in its final position",
            state=[a.copy() for a in arr],
            active_elements=[n - i - 1],
            line=3,
            pointers={"i": i}
        )
        
        engine.record_event(
            type="INFO",
            description="Checking if any swaps occurred in this pass",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=9,
            pointers={"i": i}
        )
        
        if not swapped:
            engine.record_event(
                type="COMPLETE",
                description="No swaps occurred, array is sorted. Breaking early.",
                state=[a.copy() for a in arr],
                active_elements=[],
                line=10,
                pointers={"i": i}
            )
            break
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    if swapped or i == n-1:
        engine.record_event(
            type="COMPLETE",
            description="Bubble Sort completed",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=None
        )

    return ExecutionResult(
        algorithmId="bubble_sort",
        sourceCode=BUBBLE_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
