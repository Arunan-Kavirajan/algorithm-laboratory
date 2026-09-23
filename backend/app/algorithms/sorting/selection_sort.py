import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

SELECTION_SORT_CODE = """def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
"""

def selection_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Let's sort this array using Selection Sort!",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )

    engine.record_event(
        type="INFO",
        description=f"The array has {n} elements. We'll search for the smallest element {n} times.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=2
    )

    for i in range(n):
        engine.record_event(
            type="INFO",
            description=f"Looking for the absolute smallest remaining element to place at index {i}.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=3,
            pointers={"i": i}
        )

        min_idx = i
        engine.record_event(
            type="INFO",
            description=f"Let's assume ({arr[min_idx]['value']}) is the smallest for now.",
            state=[a.copy() for a in arr],
            active_elements=[min_idx],
            line=4,
            pointers={"i": i, "min_idx": min_idx}
        )

        for j in range(i + 1, n):
            engine.increment_metric("comparisons")
            
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Is {arr[j]['value']} < {arr[min_idx]['value']}?",
                    f"Checking if {arr[j]['value']} is a new minimum.",
                    f"Comparing candidate {arr[j]['value']} against min {arr[min_idx]['value']}."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[j, min_idx],
                line=6,
                pointers={"i": i, "j": j, "min_idx": min_idx}
            )

            if arr[j]['value'] < arr[min_idx]['value']:
                min_idx = j
                
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Yes! {arr[min_idx]['value']} is the new minimum.",
                        f"Found a smaller element: {arr[min_idx]['value']}.",
                        f"Updating minimum to {arr[min_idx]['value']}."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[min_idx],
                    line=7,
                    pointers={"i": i, "j": j, "min_idx": min_idx}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=random.choice([
                        f"No, {arr[min_idx]['value']} is still smaller.",
                        f"{arr[j]['value']} is larger. Keep scanning.",
                        f"Not the minimum."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, min_idx],
                    line=6,
                    pointers={"i": i, "j": j, "min_idx": min_idx}
                )
                
        engine.record_event(
            type="INFO",
            description=f"Scan complete! The absolute smallest is {arr[min_idx]['value']}.",
            state=[a.copy() for a in arr],
            active_elements=[min_idx, i],
            line=8,
            pointers={"i": i, "min_idx": min_idx}
        )
                
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            engine.increment_metric("swaps")
            engine.record_event(
                type="SWAP",
                description=random.choice([
                    f"Swapping {arr[min_idx]['value']} with {arr[i]['value']}.",
                    f"Moving minimum {arr[i]['value']} to the sorted boundary.",
                    f"Placing {arr[i]['value']} in its final spot."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i, min_idx],
                line=9,
                pointers={"i": i, "min_idx": i}
            )
        else:
            engine.record_event(
                type="INFO",
                description=f"{arr[i]['value']} is already in place! No swap needed.",
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=8,
                pointers={"i": i, "min_idx": min_idx}
            )
            
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"{arr[i]['value']} is now locked into its final sorted position!",
            state=[a.copy() for a in arr],
            active_elements=[i],
            line=3,
            pointers={"i": i}
        )
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Selection Sort completed",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="selection_sort",
        sourceCode=SELECTION_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
