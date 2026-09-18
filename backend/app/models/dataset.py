from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Union, Optional

class BaseDataset(BaseModel):
    type: str

class ArrayItem(BaseModel):
    id: str
    value: int

class ArrayDataset(BaseDataset):
    type: str = "ARRAY"
    values: List[ArrayItem]

class GraphNode(BaseModel):
    id: str
    value: int
    x: float
    y: float

class GraphEdge(BaseModel):
    source: str
    target: str

class GraphDataset(BaseDataset):
    type: str = "GRAPH"
    nodes: List[GraphNode]
    edges: List[GraphEdge]

Dataset = Union[ArrayDataset, GraphDataset]