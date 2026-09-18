from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..models.dataset import Dataset, ArrayDataset
from ..models.events import ExecutionResult
from ..algorithms.sorting.bubble_sort import bubble_sort
from ..algorithms.sorting.selection_sort import selection_sort
from ..algorithms.sorting.insertion_sort import insertion_sort

router = APIRouter()

class ExecuteRequest(BaseModel):
    algorithmId: str
    dataset: Dataset

@router.post("/execute", response_model=ExecutionResult)
def execute_algorithm(request: ExecuteRequest):
    if not isinstance(request.dataset, ArrayDataset):
        raise HTTPException(status_code=400, detail="Sorting algorithms require an ArrayDataset")
        
    if request.algorithmId == "bubble_sort":
        return bubble_sort(request.dataset)
    elif request.algorithmId == "selection_sort":
        return selection_sort(request.dataset)
    elif request.algorithmId == "insertion_sort":
        return insertion_sort(request.dataset)
    else:
        raise HTTPException(status_code=404, detail="Algorithm not found")
