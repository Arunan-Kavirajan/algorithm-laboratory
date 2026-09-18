export type DatasetType = "ARRAY" | "GRAPH" | "TREE";

export interface BaseDataset {
    type: DatasetType;
}

export interface ArrayElement {
    id: string;
    value: number;
}

export interface ArrayDataset extends BaseDataset {
    type: "ARRAY";
    values: ArrayElement[];
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
    line: number | null;
    pointers: Record<string, number>;
    state: any; // Can be typed further depending on dataset type
    auxiliary?: ArrayElement[];
    activeElements: (number | string)[];
    metrics: EventMetrics;
}

export interface ExecutionSummary {
    totalTimeMs: number;
    totalSteps: number;
}

export interface ExecutionResult {
    algorithmId: string;
    sourceCode: string;
    summary: ExecutionSummary;
    events: ExecutionEvent[];
}
