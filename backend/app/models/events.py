from pydantic import BaseModel
from typing import List, Dict, Any, Union, Optional

class EventMetrics(BaseModel):
    comparisons: int = 0
    swaps: int = 0
    operations: int = 0
    time_ms: float = 0.0

class ExecutionEvent(BaseModel):
    step: int
    type: str
    description: str
    state: Any
    activeElements: List[Union[int, str]] = []
    metrics: EventMetrics

class ExecutionSummary(BaseModel):
    totalTimeMs: float
    totalSteps: int

class ExecutionResult(BaseModel):
    algorithmId: str
    summary: ExecutionSummary
    events: List[ExecutionEvent]
