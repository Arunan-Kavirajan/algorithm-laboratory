import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

MERGE_SORT_CODE = """def merge_sort(arr, left, right):
    if left < right:
        mid = (left + right) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        merge(arr, left, mid, right)

def merge(arr, left, mid, right):
    temp = []
    i, j = left, mid + 1
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1
    while i <= mid:
        temp.append(arr[i])
        i += 1
    while j <= right:
        temp.append(arr[j])
        j += 1
    for k in range(len(temp)):
        arr[left + k] = temp[k]
"""

def merge_sort_algorithm(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Starting Merge Sort",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    def do_merge_sort(left, right):
        engine.record_event(
            type="INFO",
            description=f"Our goal is to sort the slice from index {left} to {right}. First, we check if it has more than one element.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=2,
            pointers={"left": left, "right": right}
        )

        if left < right:
            mid = (left + right) // 2
            engine.record_event(
                type="INFO",
                description=f"It does! We split it down the middle at index {mid}.",
                state=[a.copy() for a in arr],
                active_elements=[left, mid, right],
                line=3,
                pointers={"left": left, "mid": mid, "right": right}
            )
            
            engine.record_event(
                type="INFO",
                description=f"Step 1: Recursively sort the LEFT half (indices {left} to {mid}).",
                state=[a.copy() for a in arr],
                active_elements=list(range(left, mid + 1)),
                line=4,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge_sort(left, mid)
            
            engine.record_event(
                type="INFO",
                description=f"Step 2: Recursively sort the RIGHT half (indices {mid + 1} to {right}).",
                state=[a.copy() for a in arr],
                active_elements=list(range(mid + 1, right + 1)),
                line=5,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge_sort(mid + 1, right)
            
            engine.record_event(
                type="INFO",
                description=f"Step 3: Both halves are sorted! Now we MERGE them back together in order.",
                state=[a.copy() for a in arr],
                active_elements=list(range(left, right + 1)),
                line=6,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge(left, mid, right)
        else:
            engine.record_event(
                type="INFO",
                description=f"This slice only has one element (at index {left}). A single element is already sorted!",
                state=[a.copy() for a in arr],
                active_elements=[left],
                line=2,
                pointers={"left": left, "right": right}
            )

    def do_merge(left, mid, right):
        temp = []
        i, j = left, mid + 1
        
        engine.record_event(
            type="INFO",
            description=f"We create an empty auxiliary buffer (temp) to collect elements, and point 'i' to the left half and 'j' to the right half.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=9,
            pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
            auxiliary=[t.copy() for t in temp]
        )

        while i <= mid and j <= right:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Comparing L:{arr[i]['value']} vs R:{arr[j]['value']}.",
                    f"Which is smaller: {arr[i]['value']} or {arr[j]['value']}?",
                    f"Checking front of left and right halves."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[i, j],
                line=12,
                pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                auxiliary=[t.copy() for t in temp]
            )

            if arr[i]['value'] <= arr[j]['value']:
                temp.append(arr[i])
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Left is smaller ({arr[i]['value']}). To buffer!",
                        f"Taking {arr[i]['value']} from the left.",
                        f"Moving {arr[i]['value']} to temp."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[i],
                    line=13,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )
                i += 1
                engine.record_event(
                    type="INFO",
                    description="We shift the left pointer 'i' forward.",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=14,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )
            else:
                temp.append(arr[j])
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Right is smaller ({arr[j]['value']}). To buffer!",
                        f"Taking {arr[j]['value']} from the right.",
                        f"Moving {arr[j]['value']} to temp."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j],
                    line=16,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )
                j += 1
                engine.record_event(
                    type="INFO",
                    description="We shift the right pointer 'j' forward.",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=17,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )

        while i <= mid:
            temp.append(arr[i])
            engine.record_event(
                type="INFO",
                description=f"The right half is empty! We sweep the remaining left element ({arr[i]['value']}) directly into the buffer.",
                state=[a.copy() for a in arr],
                active_elements=[i],
                line=19,
                pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                auxiliary=[t.copy() for t in temp]
            )
            i += 1

        while j <= right:
            temp.append(arr[j])
            engine.record_event(
                type="INFO",
                description=f"The left half is empty! We sweep the remaining right element ({arr[j]['value']}) directly into the buffer.",
                state=[a.copy() for a in arr],
                active_elements=[j],
                line=22,
                pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                auxiliary=[t.copy() for t in temp]
            )
            j += 1

        engine.record_event(
            type="INFO",
            description="The buffer is now fully sorted! We get ready to write it back into the main array.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=24, # updated line number
            pointers={"left": left, "mid": mid, "right": right},
            auxiliary=[t.copy() for t in temp]
        )

        for k in range(len(temp)):
            arr[left + k] = temp[k]
            engine.increment_metric("swaps")
            
        engine.record_event(
            type="SWAP",
            description=f"Success! We copied the sorted buffer back into the main array.",
            state=[a.copy() for a in arr],
            active_elements=list(range(left, right + 1)),
            line=25, # updated line number
            pointers={"left": left, "mid": mid, "right": right},
            auxiliary=[] 
        )
        
        engine.record_event(
            type="INFO",
            description=f"The slice from index {left} to {right} is now sorted.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=8,
            pointers={"left": left, "mid": mid, "right": right}
        )

    # Start recursive sort
    if n > 0:
        do_merge_sort(0, n - 1)
        
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Merge Sort completed",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="merge_sort",
        sourceCode=MERGE_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
