import time
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
            description=f"merge_sort(arr, {left}, {right}) called",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=1,
            pointers={"left": left, "right": right}
        )
        
        engine.record_event(
            type="INFO",
            description=f"Checking if left ({left}) < right ({right})",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=2,
            pointers={"left": left, "right": right}
        )

        if left < right:
            mid = (left + right) // 2
            engine.record_event(
                type="INFO",
                description=f"Calculated mid = {mid}",
                state=[a.copy() for a in arr],
                active_elements=[left, mid, right],
                line=3,
                pointers={"left": left, "mid": mid, "right": right}
            )
            
            engine.record_event(
                type="INFO",
                description=f"Recursively sorting left half [{left}..{mid}]",
                state=[a.copy() for a in arr],
                active_elements=list(range(left, mid + 1)),
                line=4,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge_sort(left, mid)
            
            engine.record_event(
                type="INFO",
                description=f"Recursively sorting right half [{mid + 1}..{right}]",
                state=[a.copy() for a in arr],
                active_elements=list(range(mid + 1, right + 1)),
                line=5,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge_sort(mid + 1, right)
            
            engine.record_event(
                type="INFO",
                description=f"Merging sorted halves [{left}..{mid}] and [{mid + 1}..{right}]",
                state=[a.copy() for a in arr],
                active_elements=list(range(left, right + 1)),
                line=6,
                pointers={"left": left, "mid": mid, "right": right}
            )
            do_merge(left, mid, right)
        else:
            engine.record_event(
                type="INFO",
                description=f"Base case reached for single element {left}.",
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
            description=f"Initializing temp array and pointers i={i}, j={j}",
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
                description=f"Comparing arr[{i}] ({arr[i]['value']}) and arr[{j}] ({arr[j]['value']})",
                state=[a.copy() for a in arr],
                active_elements=[i, j],
                line=11,
                pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                auxiliary=[t.copy() for t in temp]
            )

            if arr[i]['value'] <= arr[j]['value']:
                temp.append(arr[i])
                engine.record_event(
                    type="INFO",
                    description=f"Selected {arr[i]['value']} from left half into temp",
                    state=[a.copy() for a in arr],
                    active_elements=[i],
                    line=13,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )
                i += 1
                engine.record_event(
                    type="INFO",
                    description="Advanced left pointer i",
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
                    description=f"Selected {arr[j]['value']} from right half into temp",
                    state=[a.copy() for a in arr],
                    active_elements=[j],
                    line=16,
                    pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                    auxiliary=[t.copy() for t in temp]
                )
                j += 1
                engine.record_event(
                    type="INFO",
                    description="Advanced right pointer j",
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
                description=f"Flushing remaining left half element {arr[i]['value']} into temp",
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
                description=f"Flushing remaining right half element {arr[j]['value']} into temp",
                state=[a.copy() for a in arr],
                active_elements=[j],
                line=21,
                pointers={"left": left, "mid": mid, "right": right, "i": i, "j": j},
                auxiliary=[t.copy() for t in temp]
            )
            j += 1

        engine.record_event(
            type="INFO",
            description="Temp array is fully merged. Writing back to main array.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=22,
            pointers={"left": left, "mid": mid, "right": right},
            auxiliary=[t.copy() for t in temp]
        )

        for k in range(len(temp)):
            arr[left + k] = temp[k]
            engine.increment_metric("swaps") # Track write-backs as "swaps" or operations
            
        engine.record_event(
            type="SWAP",
            description=f"Copied merged elements back into main array [{left}..{right}]",
            state=[a.copy() for a in arr],
            active_elements=list(range(left, right + 1)),
            line=23,
            pointers={"left": left, "mid": mid, "right": right},
            auxiliary=[] # Empty auxiliary after write back
        )
        
        # We don't mark as SORTED_ELEMENT just yet unless it's the final merge, 
        # but to keep visualizer clean, we can emit a generic info event.
        engine.record_event(
            type="INFO",
            description=f"Merge for [{left}..{right}] complete.",
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
