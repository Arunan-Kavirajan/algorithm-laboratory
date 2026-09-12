from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Union, Optional

class BaseDataset(BaseModel):
    type: str

class ArrayDataset(BaseDataset):
    type: Literal["ARRAY"] = "ARRAY"
    values: List[int]

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