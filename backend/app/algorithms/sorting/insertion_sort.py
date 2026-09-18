import time
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

INSERTION_SORT_CODE = """def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        j = i
        while j > 0 and arr[j] < arr[j - 1]:
            arr[j], arr[j - 1] = arr[j - 1], arr[j]
            j -= 1
"""

def insertion_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Insertion Sort",
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
    
    # Mark the first element as trivially sorted
    engine.record_event(
        type="SORTED_ELEMENT",
        description=f"Element {arr[0]['value']} is trivially sorted as a single-element partition.",
        state=[a.copy() for a in arr],
        active_elements=[0],
        line=3
    )

    for i in range(1, n):
        engine.record_event(
            type="INFO",
            description=f"Starting pass {i}. Expanding sorted partition to include index {i}.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=3,
            pointers={"i": i}
        )

        j = i
        engine.record_event(
            type="INFO",
            description=f"Active element to insert is {arr[j]['value']}.",
            state=[a.copy() for a in arr],
            active_elements=[j],
            line=4,
            pointers={"i": i, "j": j, "key": j}
        )

        while j > 0:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Comparing {arr[j]['value']} with its left neighbor {arr[j-1]['value']}.",
                state=[a.copy() for a in arr],
                active_elements=[j, j-1],
                line=5,
                pointers={"i": i, "j": j, "key": j}
            )

            if arr[j]['value'] < arr[j - 1]['value']:
                arr[j], arr[j - 1] = arr[j - 1], arr[j]
                engine.increment_metric("swaps")
                engine.record_event(
                    type="SWAP",
                    description=f"Swapped because {arr[j-1]['value']} < {arr[j]['value']}.",
                    state=[a.copy() for a in arr],
                    active_elements=[j, j-1],
                    line=6,
                    pointers={"i": i, "j": j-1, "key": j-1} # After swap, key is at j-1
                )
                j -= 1
                engine.record_event(
                    type="INFO",
                    description=f"Decremented j to {j}.",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=7,
                    pointers={"i": i, "j": j, "key": j}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=f"{arr[j]['value']} >= {arr[j-1]['value']}. Element has found its sorted position.",
                    state=[a.copy() for a in arr],
                    active_elements=[j, j-1],
                    line=5, # Stay on IF to show it exited the loop
                    pointers={"i": i, "j": j, "key": j}
                )
                break
                
        # Mark all elements up to i as sorted
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Sorted partition now extends to index {i}.",
            state=[a.copy() for a in arr],
            active_elements=list(range(0, i+1)),
            line=3,
            pointers={"i": i}
        )
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Insertion Sort completed",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="insertion_sort",
        sourceCode=INSERTION_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
