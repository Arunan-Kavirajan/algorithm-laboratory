from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Union, Optional

class BaseDataset(BaseModel):
    type: str

class ArrayElement(BaseModel):
    id: str
    value: int

class ArrayDataset(BaseDataset):
    type: Literal["ARRAY"] = "ARRAY"
    values: List[ArrayElement]

class Edge(BaseModel):
    source: str
    target: str
    weight: Optional[float] = None

class GraphDataset(BaseDataset):
    type: Literal["GRAPH"] = "GRAPH"
    nodes: List[str]
    edges: List[Edge]
    directed: bool = False

Dataset = Union[ArrayDataset, GraphDataset]