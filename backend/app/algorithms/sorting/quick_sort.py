import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

QUICK_SORT_CODE = """def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
"""

def quick_sort_algorithm(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Let's sort this array using Quick Sort!",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )

    def do_quick_sort(low, high):
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Checking partition [{low}..{high}].",
                f"Are there multiple elements between {low} and {high}?",
                f"Validating boundaries: low={low}, high={high}."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[],
            line=2,
            pointers={"low": low, "high": high}
        )
        
        if low < high:
            engine.record_event(
                type="INFO",
                description=f"Yes, partition [{low}..{high}] needs sorting. Let's partition it!",
                state=[a.copy() for a in arr],
                active_elements=list(range(low, high + 1)),
                line=3,
                pointers={"low": low, "high": high}
            )
            pi = do_partition(low, high)
            
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Pivot is locked at index {pi}. Now sorting the left partition.",
                    f"Time to conquer the left side: [{low}..{pi-1}].",
                    f"Left branch activated!"
                ]),
                state=[a.copy() for a in arr],
                active_elements=list(range(low, pi)),
                line=4,
                pointers={"low": low, "high": pi - 1}
            )
            do_quick_sort(low, pi - 1)
            
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Left side done! Now sorting the right partition [{pi+1}..{high}].",
                    f"Moving on to the right side of the pivot.",
                    f"Right branch activated!"
                ]),
                state=[a.copy() for a in arr],
                active_elements=list(range(pi + 1, high + 1)),
                line=5,
                pointers={"low": pi + 1, "high": high}
            )
            do_quick_sort(pi + 1, high)
        else:
            engine.record_event(
                type="INFO",
                description=random.choice([
                    f"Base case! Slice [{low}..{high}] is too small to sort.",
                    f"Index {low} >= {high}. Nothing to sort here.",
                    f"This single element is already sorted."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[low] if low >= 0 and low < len(arr) else [],
                line=2,
                pointers={"low": low, "high": high}
            )
            
            # If it's a valid single element base case, mark it as sorted visually
            if low == high and low >= 0 and low < len(arr):
                engine.record_event(
                    type="SORTED_ELEMENT",
                    description=f"Element {arr[low]['value']} is trivially sorted.",
                    state=[a.copy() for a in arr],
                    active_elements=[low],
                    line=2,
                    pointers={"low": low, "high": high}
                )

    def do_partition(low, high):
        pivot_val = arr[high]['value']
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"We select the last element ({pivot_val}) as our pivot.",
                f"Pivot chosen: {pivot_val} at index {high}.",
                f"Using {pivot_val} as our pivot benchmark."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[high],
            line=8,
            pointers={"low": low, "high": high, "pivot": high}
        )

        i = low - 1
        engine.record_event(
            type="INFO",
            description="We set 'i' to track the boundary of smaller elements.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=9,
            pointers={"low": low, "high": high, "pivot": high, "i": i}
        )

        for j in range(low, high):
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Is {arr[j]['value']} < pivot ({pivot_val})?",
                    f"Comparing {arr[j]['value']} with pivot {pivot_val}.",
                    f"Checking if {arr[j]['value']} belongs to the left of the pivot."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[j, high],
                line=11,
                pointers={"low": low, "high": high, "pivot": high, "i": i, "j": j}
            )

            if arr[j]['value'] < pivot_val:
                i += 1
                engine.record_event(
                    type="INFO",
                    description=random.choice([
                        f"Yes! {arr[j]['value']} is smaller. Advancing boundary 'i'.",
                        f"{arr[j]['value']} belongs on the left. Expanding boundary.",
                        f"Found a smaller element. Moving 'i' forward."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j],
                    line=12,
                    pointers={"low": low, "high": high, "pivot": high, "i": i, "j": j}
                )
                
                arr[i], arr[j] = arr[j], arr[i]
                engine.increment_metric("swaps")
                engine.record_event(
                    type="SWAP",
                    description=random.choice([
                        f"Swapping {arr[j]['value']} and {arr[i]['value']} to group smaller elements.",
                        f"Moving smaller element {arr[i]['value']} into the left partition.", # arr[i] has the new smaller element now
                        f"Exchanging elements at 'i' and 'j'."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[i, j],
                    line=13,
                    pointers={"low": low, "high": high, "pivot": high, "i": i, "j": j}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=random.choice([
                        f"No, {arr[j]['value']} >= {pivot_val}. It stays on the right.",
                        f"{arr[j]['value']} is larger than the pivot. Moving on.",
                        f"Leave it. It belongs on the right."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, high],
                    line=11, # Evaluated false
                    pointers={"low": low, "high": high, "pivot": high, "i": i, "j": j}
                )
                
        engine.record_event(
            type="INFO",
            description=random.choice([
                f"Scan complete. Now we place the pivot in its final spot.",
                f"Partitioning done. Swapping pivot to index {i+1}.",
                f"Time to move the pivot between the left and right groups."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[high, i + 1],
            line=14,
            pointers={"low": low, "high": high, "pivot": high, "i": i}
        )

        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        engine.increment_metric("swaps")
        engine.record_event(
            type="SWAP",
            description=random.choice([
                f"Placing pivot {pivot_val} into its final sorted position at index {i+1}!",
                f"Pivot {pivot_val} is now in its permanent spot!",
                f"The pivot divides the array exactly here."
            ]),
            state=[a.copy() for a in arr],
            active_elements=[i + 1, high],
            line=14,
            pointers={"low": low, "high": high, "pivot": i + 1, "i": i} # Pivot is now at i+1
        )
        
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Pivot {pivot_val} is locked in place.",
            state=[a.copy() for a in arr],
            active_elements=[i + 1],
            line=15,
            pointers={"low": low, "high": high, "pivot": i + 1, "i": i}
        )

        return i + 1

    # Start recursive sort
    if n > 0:
        do_quick_sort(0, n - 1)
        
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Quick Sort completed successfully!",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="quick_sort",
        sourceCode=QUICK_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
