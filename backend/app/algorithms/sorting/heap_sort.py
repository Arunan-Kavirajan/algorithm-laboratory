import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

HEAP_SORT_CODE = """def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
"""

def heap_sort_algorithm(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Let's sort this array using Heap Sort! First, we build a Max Heap.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )
    
    engine.record_event(
        type="INFO",
        description=f"Array size n = {n}.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=2
    )

    def do_heapify(n_heap, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        active_nodes = [i]
        if left < n_heap: active_nodes.append(left)
        if right < n_heap: active_nodes.append(right)
        
        pointers = {"curr": i, "largest": largest}
        if left < n_heap: pointers["left"] = left
        if right < n_heap: pointers["right"] = right

        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Sifting down node at index {i}.",
                f"Checking parent node {arr[i]['value']} against its children.",
                f"Heapifying subtree at index {i}."
            ]),
            state=[a.copy() for a in arr],
            active_elements=active_nodes,
            line=10,
            pointers=pointers
        )

        engine.record_event(
            type="INFO",
            description=f"We assume the parent ({arr[largest]['value']}) is the largest.",
            state=[a.copy() for a in arr],
            active_elements=[largest],
            line=10,
            pointers=pointers
        )

        engine.record_event(
            type="INFO",
            description=f"Calculated children: left at {left}, right at {right}.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=12,
            pointers=pointers
        )

        if left < n_heap:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Is left child ({arr[left]['value']}) > largest ({arr[largest]['value']})?",
                    f"Comparing left child with the current largest.",
                    f"Checking if left branch is heavier."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[left, largest],
                line=13,
                pointers=pointers
            )
            if arr[left]['value'] > arr[largest]['value']:
                largest = left
                pointers["largest"] = largest
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Yes! Left child ({arr[left]['value']}) is larger.",
                        f"Updating largest to left child.",
                        f"Left is heavier!"
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[largest],
                    line=14,
                    pointers=pointers
                )

        if right < n_heap:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Is right child ({arr[right]['value']}) > largest ({arr[largest]['value']})?",
                    f"Comparing right child with the current largest.",
                    f"Checking if right branch is heavier."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[right, largest],
                line=15,
                pointers=pointers
            )
            if arr[right]['value'] > arr[largest]['value']:
                largest = right
                pointers["largest"] = largest
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Yes! Right child ({arr[right]['value']}) is larger.",
                        f"Updating largest to right child.",
                        f"Right is heavier!"
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[largest],
                    line=16,
                    pointers=pointers
                )
                
        engine.record_event(
            type="INFO",
            description="Checking if the parent needs to swap.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=17,
            pointers=pointers
        )

        if largest != i:
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Parent is not the largest. Swapping with {arr[largest]['value']}.",
                    f"Max-heap property violated. Let's swap down.",
                    f"Sinking the parent node!"
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i, largest],
                line=17,
                pointers=pointers
            )
            
            arr[i], arr[largest] = arr[largest], arr[i]
            engine.increment_metric("swaps")
            
            # After swap, the pointer 'largest' now contains the OLD parent element!
            engine.record_event(
                type="SWAP",
                description=f"Swapped elements to restore max-heap.",
                state=[a.copy() for a in arr],
                active_elements=[i, largest],
                line=18,
                pointers={"curr": i, "largest": largest} 
            )
            
            # Recursively heapify the affected sub-tree
            do_heapify(n_heap, largest)
        else:
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Parent is the largest. Max-heap property holds for this subtree.",
                    f"No swap needed here.",
                    f"Subtree is a valid heap."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=17, # Evaluated false
                pointers=pointers
            )

    # Phase 1: Build Max Heap
    engine.record_event(
        type="INFO",
        description="Phase 1: Building the Max Heap from the bottom up.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=3
    )
    for i in range(n // 2 - 1, -1, -1):
        do_heapify(n, i)
        
    engine.record_event(
        type="INFO",
        description="Max Heap built! The absolute maximum element is now at the root (index 0).",
        state=[a.copy() for a in arr],
        active_elements=[0],
        line=5
    )

    # Phase 2: Extract elements
    engine.record_event(
        type="INFO",
        description="Phase 2: Extracting elements one by one from the root.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=5
    )
    
    for i in range(n - 1, 0, -1):
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Extracting the root ({arr[0]['value']}) and moving it to the end (index {i}).",
                f"Swapping the max element {arr[0]['value']} to the sorted partition.",
                f"The heaviest element drops to the end!"
            ]),
            state=[a.copy() for a in arr],
            active_elements=[0, i],
            line=6,
            pointers={"i": i}
        )
        
        arr[i], arr[0] = arr[0], arr[i]
        engine.increment_metric("swaps")
        
        engine.record_event(
            type="SWAP",
            description=f"Swapped {arr[i]['value']} and {arr[0]['value']}.",
            state=[a.copy() for a in arr],
            active_elements=[0, i],
            line=6,
            pointers={"i": i}
        )
        
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Element {arr[i]['value']} is fully sorted!",
            state=[a.copy() for a in arr],
            active_elements=[i],
            line=6,
            pointers={"i": i}
        )
        
        engine.record_event(
            type="INFO",
            description=f"The new root ({arr[0]['value']}) needs to sink down to restore the heap.",
            state=[a.copy() for a in arr],
            active_elements=[0],
            line=7,
            pointers={"i": i}
        )
        do_heapify(i, 0)
        
    # Mark index 0 as sorted
    if n > 0:
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"The last element ({arr[0]['value']}) is fully sorted!",
            state=[a.copy() for a in arr],
            active_elements=[0],
            line=5
        )

    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Heap Sort completed successfully!",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="heap_sort",
        sourceCode=HEAP_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
