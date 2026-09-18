import time
import random
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
        description="Let's sort this array using Bubble Sort!",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )

    engine.record_event(
        type="INFO",
        description=f"The array has {n} elements. We'll need to do up to {n} passes.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=2
    )

    for i in range(n):
        engine.record_event(
            type="INFO",
            description=f"Pass {i} begins. The last {i} elements are fully sorted.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=3,
            pointers={"i": i}
        )

        swapped = False
        engine.record_event(
            type="INFO",
            description="We assume it's sorted until we're forced to swap (swapped = False).",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=4,
            pointers={"i": i}
        )

        for j in range(0, n - i - 1):
            engine.increment_metric("comparisons")
            
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Comparing {arr[j]['value']} and {arr[j+1]['value']}.",
                    f"Is {arr[j]['value']} > {arr[j+1]['value']}?",
                    f"Checking adjacent pair: {arr[j]['value']} & {arr[j+1]['value']}."
                ]),
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
                    description=random.choice([
                        f"Out of order! Swapping {arr[j+1]['value']} and {arr[j]['value']}.",
                        f"Yes, {arr[j+1]['value']} is larger. Let's swap.",
                        f"Moving {arr[j+1]['value']} to the right."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, j+1],
                    line=7,
                    pointers={"i": i, "j": j}
                )
                engine.record_event(
                    type="INFO",
                    description="We made a swap, so we record that (swapped = True).",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=8,
                    pointers={"i": i, "j": j}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=random.choice([
                        f"In order. No swap needed.",
                        f"Good as is! ({arr[j]['value']} <= {arr[j+1]['value']})",
                        f"Leave them be."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, j+1],
                    line=6, # Evaluated false
                    pointers={"i": i, "j": j}
                )
                
        # The element at n-i-1 is now sorted
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"The heaviest element ({arr[n-i-1]['value']}) bubbled to its final spot!",
            state=[a.copy() for a in arr],
            active_elements=[n - i - 1],
            line=3,
            pointers={"i": i}
        )
        
        engine.record_event(
            type="INFO",
            description="Checking if any swaps were made in this pass.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=9,
            pointers={"i": i}
        )
        
        if not swapped:
            engine.record_event(
                type="INFO",
                description="We just did a full pass without making a single swap! That means the entire array is fully sorted. We can stop early!",
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
