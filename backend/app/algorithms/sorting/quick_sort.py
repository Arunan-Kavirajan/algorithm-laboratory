import time
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def quick_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Quick Sort",
        state=arr.copy(),
        active_elements=[]
    )

    def partition(low: int, high: int) -> int:
        pivot = arr[high]
        engine.record_event(
            type="HIGHLIGHT",
            description=f"Partitioning subarray [{low}..{high}] with pivot {pivot}",
            state=arr.copy(),
            active_elements=[high]
        )
        
        i = low - 1
        for j in range(low, high):
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Comparing {arr[j]} with pivot {pivot}",
                state=arr.copy(),
                active_elements=[j, high]
            )
            
            if arr[j] <= pivot:
                i += 1
                if i != j:
                    arr[i], arr[j] = arr[j], arr[i]
                    engine.increment_metric("swaps")
                    engine.record_event(
                        type="SWAP",
                        description=f"Swapped {arr[i]} and {arr[j]}",
                        state=arr.copy(),
                        active_elements=[i, j]
                    )
                else:
                    engine.record_event(
                        type="NO_SWAP",
                        description=f"{arr[j]} is <= pivot, leaving in place",
                        state=arr.copy(),
                        active_elements=[j]
                    )
                    
        # Swap pivot into correct position
        if i + 1 != high:
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            engine.increment_metric("swaps")
            engine.record_event(
                type="SWAP",
                description=f"Placed pivot {pivot} into final sorted position",
                state=arr.copy(),
                active_elements=[i + 1, high]
            )
            
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Pivot {pivot} is in its final position",
            state=arr.copy(),
            active_elements=[i + 1]
        )
            
        return i + 1

    def _quick_sort(low: int, high: int):
        if low < high:
            pi = partition(low, high)
            _quick_sort(low, pi - 1)
            _quick_sort(pi + 1, high)
        elif low == high:
            # Single element is trivially sorted
            engine.record_event(
                type="SORTED_ELEMENT",
                description=f"Element {arr[low]} is sorted",
                state=arr.copy(),
                active_elements=[low]
            )

    _quick_sort(0, len(arr) - 1)

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Quick Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="quick_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
