from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..models.dataset import Dataset, ArrayDataset
from ..models.events import ExecutionResult
from ..algorithms.sorting.bubble_sort import bubble_sort

router = APIRouter()

class ExecuteRequest(BaseModel):
    algorithmId: str
    dataset: Dataset

@router.post("/execute", response_model=ExecutionResult)
def execute_algorithm(request: ExecuteRequest):
    if request.algorithmId == "bubble_sort":
        if not isinstance(request.dataset, ArrayDataset):
            raise HTTPException(status_code=400, detail="Bubble sort requires an ArrayDataset")
        return bubble_sort(request.dataset)
    else:
        raise HTTPException(status_code=404, detail="Algorithm not found")
