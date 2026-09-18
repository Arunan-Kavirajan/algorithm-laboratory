from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..models.dataset import Dataset, ArrayDataset
from ..models.events import ExecutionResult
from ..algorithms.sorting.bubble_sort import bubble_sort
from ..algorithms.sorting.selection_sort import selection_sort
from ..algorithms.sorting.insertion_sort import insertion_sort
from ..algorithms.sorting.merge_sort import merge_sort_algorithm
from ..algorithms.sorting.quick_sort import quick_sort_algorithm
from ..algorithms.sorting.heap_sort import heap_sort_algorithm
from ..algorithms.searching.linear_search import linear_search_algorithm

router = APIRouter()

class ExecuteRequest(BaseModel):
    algorithmId: str
    dataset: Dataset
    target: Optional[int] = None

@router.post("/execute", response_model=ExecutionResult)
def execute_algorithm(request: ExecuteRequest):
    is_graph_algo = request.algorithmId in ["bfs"]
    
    if is_graph_algo and request.dataset.type != "GRAPH":
        raise HTTPException(status_code=400, detail="Algorithm requires a GraphDataset")
    if not is_graph_algo and request.dataset.type != "ARRAY":
        raise HTTPException(status_code=400, detail="Algorithm requires an ArrayDataset")
        
    if request.algorithmId == "bubble_sort":
        return bubble_sort(request.dataset)
    elif request.algorithmId == "selection_sort":
        return selection_sort(request.dataset)
    elif request.algorithmId == "insertion_sort":
        return insertion_sort(request.dataset)
    elif request.algorithmId == "merge_sort":
        return merge_sort_algorithm(request.dataset)
    elif request.algorithmId == "quick_sort":
        return quick_sort_algorithm(request.dataset)
    elif request.algorithmId == "heap_sort":
        return heap_sort_algorithm(request.dataset)
    elif request.algorithmId == "linear_search":
        if request.target is None:
            raise HTTPException(status_code=400, detail="Target is required for searching algorithms")
        return linear_search_algorithm(request.dataset, request.target)
    elif request.algorithmId == "binary_search":
        if request.target is None:
            raise HTTPException(status_code=400, detail="Target is required for searching algorithms")
        from ..algorithms.searching.binary_search import binary_search_algorithm
        return binary_search_algorithm(request.dataset, request.target)
    elif request.algorithmId == "bfs":
        if request.target is None:
            raise HTTPException(status_code=400, detail="Target is required for searching algorithms")
        from ..algorithms.searching.bfs import bfs_algorithm
        return bfs_algorithm(request.dataset, request.target)
    else:
        raise HTTPException(status_code=404, detail="Algorithm not found")
