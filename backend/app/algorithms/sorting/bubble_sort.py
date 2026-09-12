import time
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def bubble_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    n = len(arr)
    
    start_time = time.perf_counter()

    # Initial state
    engine.record_event(
        type="START",
        description="Starting Bubble Sort",
        state=arr.copy(),
        active_elements=[]
    )

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            engine.increment_metric("comparisons")
            
            # Record comparison
            engine.record_event(
                type="COMPARE",
                description=f"Comparing elements {arr[j]} and {arr[j+1]}",
                state=arr.copy(),
                active_elements=[j, j+1]
            )

            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                engine.increment_metric("swaps")
                
                engine.record_event(
                    type="SWAP",
                    description=f"Swapped {arr[j+1]} and {arr[j]}",
                    state=arr.copy(),
                    active_elements=[j, j+1]
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=f"No swap needed. {arr[j]} <= {arr[j+1]}",
                    state=arr.copy(),
                    active_elements=[j, j+1]
                )
                
        # The element at n-i-1 is now sorted
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[n - i - 1]} is in its final position",
            state=arr.copy(),
            active_elements=[n - i - 1]
        )
        
        if not swapped:
            break
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Bubble Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="bubble_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
