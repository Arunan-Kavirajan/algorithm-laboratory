import time
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

def insertion_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = dataset.values.copy()
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Insertion Sort",
        state=arr.copy(),
        active_elements=[]
    )

    if n > 0:
        engine.record_event(
            type="SORTED_ELEMENT",
            description="First element is trivially sorted",
            state=arr.copy(),
            active_elements=[0]
        )

    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        engine.record_event(
            type="HIGHLIGHT",
            description=f"Inserting {key} into the sorted portion",
            state=arr.copy(),
            active_elements=[i]
        )

        while j >= 0:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=f"Comparing {key} and {arr[j]}",
                state=arr.copy(),
                active_elements=[j, j+1]
            )
            
            if arr[j] > key:
                arr[j + 1] = arr[j]
                engine.increment_metric("operations") # Shifting is an operation, though we could call it a swap conceptually for the UI
                engine.record_event(
                    type="SWAP",
                    description=f"Shifting {arr[j]} to the right",
                    state=arr.copy(),
                    active_elements=[j, j+1]
                )
                j -= 1
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=f"{key} is correctly placed relative to {arr[j]}",
                    state=arr.copy(),
                    active_elements=[j, j+1]
                )
                break
                
        arr[j + 1] = key
        
        # We don't mark individual elements as "final sorted position" like Bubble/Selection
        # because Insertion sort maintains a growing "sorted partition" on the left.
        # We can highlight the newly inserted element.
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Inserted {key} into sorted portion",
            state=arr.copy(),
            active_elements=[j + 1]
        )

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Insertion Sort completed",
        state=arr.copy(),
        active_elements=[]
    )

    return ExecutionResult(
        algorithmId="insertion_sort",
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
