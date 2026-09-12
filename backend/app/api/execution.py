from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..models.dataset import Dataset, ArrayDataset
from ..models.events import ExecutionResult
from ..algorithms.sorting.bubble_sort import bubble_sort
from ..algorithms.sorting.selection_sort import selection_sort
from ..algorithms.sorting.insertion_sort import insertion_sort
from ..algorithms.sorting.merge_sort import merge_sort_algorithm
from ..algorithms.sorting.quick_sort import quick_sort
from ..algorithms.sorting.heap_sort import heap_sort

router = APIRouter()

class ExecuteRequest(BaseModel):
    algorithmId: str
    dataset: Dataset

@router.post("/execute", response_model=ExecutionResult)
def execute_algorithm(request: ExecuteRequest):
    algo_id = request.algorithmId
    
    # Sorting algorithms mapping
    sorting_algorithms = {
        "bubble_sort": bubble_sort,
        "selection_sort": selection_sort,
        "insertion_sort": insertion_sort,
        "merge_sort": merge_sort_algorithm,
        "quick_sort": quick_sort,
        "heap_sort": heap_sort,
    }

    if algo_id in sorting_algorithms:
        if not isinstance(request.dataset, ArrayDataset):
            raise HTTPException(status_code=400, detail=f"{algo_id} requires an ArrayDataset")
        return sorting_algorithms[algo_id](request.dataset)
    else:
        raise HTTPException(status_code=404, detail="Algorithm not found")
