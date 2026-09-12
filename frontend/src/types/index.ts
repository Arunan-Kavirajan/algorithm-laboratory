export type DatasetType = "ARRAY" | "GRAPH" | "TREE";

export interface BaseDataset {
    type: DatasetType;
}

export interface ArrayDataset extends BaseDataset {
    type: "ARRAY";
    values: number[];
}

export interface Edge {
    source: string;
    target: string;
    weight?: number;
}

export interface GraphDataset extends BaseDataset {
    type: "GRAPH";
    nodes: string[];
    edges: Edge[];
    directed: boolean;
}

export type Dataset = ArrayDataset | GraphDataset;

export interface EventMetrics {
    comparisons: number;
    swaps: number;
    operations: number;
    time_ms: number;
}

export interface ExecutionEvent {
    step: number;
    type: string;
    description: string;
    state: any; // Can be typed further depending on dataset type
    activeElements: (number | string)[];
    metrics: EventMetrics;
}

export interface ExecutionSummary {
    totalTimeMs: number;
    totalSteps: number;
}

export interface ExecutionResult {
    algorithmId: string;
    summary: ExecutionSummary;
    events: ExecutionEvent[];
}
