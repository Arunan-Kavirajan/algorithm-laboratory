import time
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def merge_sort_algorithm(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Merge Sort",
        state=arr.copy(),
        active_elements=[]
    )

    def merge(left: int, mid: int, right: int):
        L = arr[left:mid + 1]
        R = arr[mid + 1:right + 1]
        
        i = 0
        j = 0
        k = left
        
        engine.record_event(
            type="HIGHLIGHT",
            description=f"Merging subarrays [{left}..{mid}] and [{mid+1}..{right}]",
            state=arr.copy(),
            active_elements=list(range(left, right + 1))
        )

        while i < len(L) and j < len(R):
            engine.increment_metric("comparisons")
            
            # Note: We are comparing L[i] and R[j] but they originate from specific indices
            # For visualization, it's a bit tricky to highlight the exact original elements
            # when they are in temporary arrays, but we can highlight the insertion point 'k'
            
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
                
            engine.increment_metric("operations") # write operation
            engine.record_event(
                type="SET", # We introduce SET for merge sort overwrites
                description=f"Wrote {arr[k]} into position {k}",
                state=arr.copy(),
                active_elements=[k]
            )
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
            engine.increment_metric("operations")
            engine.record_event(
                type="SET",
                description=f"Copied remaining element {arr[k-1]} to position {k-1}",
                state=arr.copy(),
                active_elements=[k-1]
            )

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
            engine.increment_metric("operations")
            engine.record_event(
                type="SET",
                description=f"Copied remaining element {arr[k-1]} to position {k-1}",
                state=arr.copy(),
                active_elements=[k-1]
            )

    def merge_sort(left: int, right: int):
        if left < right:
            mid = (left + right) // 2
            merge_sort(left, mid)
            merge_sort(mid + 1, right)
            merge(left, mid, right)

    merge_sort(0, len(arr) - 1)

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Merge Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="merge_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
