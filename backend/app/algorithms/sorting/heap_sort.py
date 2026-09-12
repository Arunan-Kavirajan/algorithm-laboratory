import time
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def heap_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Heap Sort",
        state=arr.copy(),
        active_elements=[]
    )

    def heapify(n_heap: int, i: int):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2

        if l < n_heap:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Comparing left child {arr[l]} with parent {arr[largest]}",
                state=arr.copy(),
                active_elements=[l, largest]
            )
            if arr[l] > arr[largest]:
                largest = l

        if r < n_heap:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Comparing right child {arr[r]} with current largest {arr[largest]}",
                state=arr.copy(),
                active_elements=[r, largest]
            )
            if arr[r] > arr[largest]:
                largest = r

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            engine.increment_metric("swaps")
            engine.record_event(
                type="SWAP",
                description=f"Swapped {arr[i]} and {arr[largest]} to maintain heap property",
                state=arr.copy(),
                active_elements=[i, largest]
            )
            heapify(n_heap, largest)

    # Build max heap
    engine.record_event(
        type="HIGHLIGHT",
        description="Building initial Max Heap",
        state=arr.copy(),
        active_elements=[]
    )
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        engine.increment_metric("swaps")
        engine.record_event(
            type="SWAP",
            description=f"Moved current max {arr[i]} to the end of the array",
            state=arr.copy(),
            active_elements=[0, i]
        )
        
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[i]} is in its final position",
            state=arr.copy(),
            active_elements=[i]
        )
        
        heapify(i, 0)

    if n > 0:
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[0]} is in its final position",
            state=arr.copy(),
            active_elements=[0]
        )

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Heap Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="heap_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
