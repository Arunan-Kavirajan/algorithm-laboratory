import time
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
        description="Starting Selection Sort",
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
        engine.record_event(
            type="INFO",
            description=f"Starting pass {i}, placing next smallest element at index {i}",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=3,
            pointers={"i": i}
        )

        min_idx = i
        engine.record_event(
            type="INFO",
            description=f"Assume current minimum is at index {min_idx} (value: {arr[min_idx]['value']})",
            state=[a.copy() for a in arr],
            active_elements=[min_idx],
            line=4,
            pointers={"i": i, "min_idx": min_idx}
        )

        for j in range(i + 1, n):
            engine.increment_metric("comparisons")
            
            engine.record_event(
                type="COMPARE",
                description=f"Comparing current min ({arr[min_idx]['value']}) with candidate ({arr[j]['value']})",
                state=[a.copy() for a in arr],
                active_elements=[j, min_idx],
                line=6,
                pointers={"i": i, "j": j, "min_idx": min_idx}
            )

            if arr[j]['value'] < arr[min_idx]['value']:
                min_idx = j
                
                engine.record_event(
                    type="INFO",
                    description=f"Found new minimum: {arr[min_idx]['value']} at index {min_idx}",
                    state=[a.copy() for a in arr],
                    active_elements=[min_idx],
                    line=7,
                    pointers={"i": i, "j": j, "min_idx": min_idx}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=f"Candidate {arr[j]['value']} is not smaller than {arr[min_idx]['value']}",
                    state=[a.copy() for a in arr],
                    active_elements=[j, min_idx],
                    line=6, # Stay on IF to show it didn't enter block
                    pointers={"i": i, "j": j, "min_idx": min_idx}
                )
                
        engine.record_event(
            type="INFO",
            description=f"Scan complete. Minimum is {arr[min_idx]['value']} at index {min_idx}. Checking if swap needed.",
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
                description=f"Swapped minimum ({arr[i]['value']}) into correct position {i}",
                state=[a.copy() for a in arr],
                active_elements=[i, min_idx],
                line=9,
                pointers={"i": i, "min_idx": i} # After swap, the minimum element is now at index i
            )
        else:
            engine.record_event(
                type="INFO",
                description=f"Element {arr[i]['value']} is already the minimum, no swap needed.",
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=8, # IF evaluated false
                pointers={"i": i, "min_idx": min_idx}
            )
            
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[i]['value']} is now sorted.",
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
