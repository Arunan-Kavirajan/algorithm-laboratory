import time
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def selection_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Selection Sort",
        state=arr.copy(),
        active_elements=[]
    )

    for i in range(n):
        min_idx = i
        
        for j in range(i + 1, n):
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Finding minimum: comparing {arr[j]} and current minimum {arr[min_idx]}",
                state=arr.copy(),
                active_elements=[j, min_idx]
            )
            
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            engine.increment_metric("swaps")
            engine.record_event(
                type="SWAP",
                description=f"Swapped minimum {arr[i]} into correct position",
                state=arr.copy(),
                active_elements=[i, min_idx]
            )
            
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[i]} is sorted",
            state=arr.copy(),
            active_elements=[i]
        )
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Selection Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="selection_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
