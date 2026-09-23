import time
import random
from typing import List
from ...engine.execution import ExecutionEngine
from ...models.dataset import ArrayDataset
from ...models.events import ExecutionResult, ExecutionSummary

INSERTION_SORT_CODE = """def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        j = i
        while j > 0 and arr[j] < arr[j - 1]:
            arr[j], arr[j - 1] = arr[j - 1], arr[j]
            j -= 1
"""

def insertion_sort(dataset: ArrayDataset) -> ExecutionResult:
    engine = ExecutionEngine()
    arr = [item.model_dump() for item in dataset.values]
    n = len(arr)
    
    start_time = time.perf_counter()

    engine.record_event(
        type="START",
        description="Let's sort this array using Insertion Sort! Think of it like sorting a hand of playing cards.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=1
    )

    engine.record_event(
        type="INFO",
        description=f"We have {n} cards to sort.",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=2
    )
    
    engine.record_event(
        type="SORTED_ELEMENT",
        description=f"The first card ({arr[0]['value']}) is already 'sorted' because it's the only one in our hand so far!",
        state=[a.copy() for a in arr],
        active_elements=[0],
        line=3
    )

    for i in range(1, n):
        engine.record_event(
            type="INFO",
            description=f"Let's pick up the next card at index {i} and insert it into our sorted hand on the left.",
            state=[a.copy() for a in arr],
            active_elements=[],
            line=3,
            pointers={"i": i}
        )

        j = i
        engine.record_event(
            type="INFO",
            description=f"Our active card is {arr[j]['value']}.",
            state=[a.copy() for a in arr],
            active_elements=[j],
            line=4,
            pointers={"i": i, "j": j, "key": j}
        )

        while j > 0:
            engine.increment_metric("comparisons")
            engine.record_event(
                type="COMPARE",
                description=random.choice([
                    f"Comparing active {arr[j]['value']} with left {arr[j-1]['value']}.",
                    f"Does {arr[j]['value']} need to move left?",
                    f"Checking if {arr[j-1]['value']} > {arr[j]['value']}."
                ]),
                state=[a.copy() for a in arr],
                active_elements=[j, j-1],
                line=5,
                pointers={"i": i, "j": j, "key": j}
            )

            if arr[j]['value'] < arr[j - 1]['value']:
                arr[j], arr[j - 1] = arr[j - 1], arr[j]
                engine.increment_metric("swaps")
                engine.record_event(
                    type="SWAP",
                    description=random.choice([
                        f"Yes! Sliding {arr[j-1]['value']} left.",
                        f"{arr[j]['value']} is larger, swapping them.",
                        f"Moving active card leftward."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, j-1],
                    line=6,
                    pointers={"i": i, "j": j-1, "key": j-1}
                )
                j -= 1
                engine.record_event(
                    type="INFO",
                    description=f"We keep tracking our active card as it moves backward.",
                    state=[a.copy() for a in arr],
                    active_elements=[],
                    line=7,
                    pointers={"i": i, "j": j, "key": j}
                )
            else:
                engine.record_event(
                    type="NO_SWAP",
                    description=random.choice([
                        f"Found its spot! {arr[j]['value']} >= {arr[j-1]['value']}.",
                        f"Stops here. Left is smaller.",
                        f"Done moving this card."
                    ]),
                    state=[a.copy() for a in arr],
                    active_elements=[j, j-1],
                    line=5,
                    pointers={"i": i, "j": j, "key": j}
                )
                break
                
        engine.record_event(
            type="SORTED_ELEMENT",
            description=f"Our sorted hand now contains {i + 1} cards.",
            state=[a.copy() for a in arr],
            active_elements=list(range(0, i+1)),
            line=3,
            pointers={"i": i}
        )
            
    end_time = time.perf_counter()
    time_ms = (end_time - start_time) * 1000
    engine.metrics.time_ms = time_ms

    engine.record_event(
        type="COMPLETE",
        description="Insertion Sort completed",
        state=[a.copy() for a in arr],
        active_elements=[],
        line=None
    )

    return ExecutionResult(
        algorithmId="insertion_sort",
        sourceCode=INSERTION_SORT_CODE,
        summary=ExecutionSummary(totalTimeMs=time_ms, totalSteps=engine.step_counter),
        events=engine.get_events()
    )
