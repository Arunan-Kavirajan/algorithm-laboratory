from typing import List, Any, Union
from ..models.events import ExecutionEvent, EventMetrics

class ExecutionEngine:
    def __init__(self):
        self.events: List[ExecutionEvent] = []
        self.metrics = EventMetrics()
        self.step_counter = 0

    def record_event(self, type: str, description: str, state: Any, active_elements: List[Union[int, str]] = None, line: int = None, pointers: dict = None):
        """Records a new execution event."""
        if active_elements is None:
            active_elements = []
        if pointers is None:
            pointers = {}

        # We copy the state and metrics so they represent the exact point in time
        # This assumes state is deep copyable or we construct a new state object before calling this
        self.events.append(ExecutionEvent(
            step=self.step_counter,
            type=type,
            description=description,
            line=line,
            pointers=pointers,
            state=state,
            activeElements=active_elements,
            metrics=EventMetrics(**self.metrics.model_dump())
        ))
        self.step_counter += 1

    def increment_metric(self, name: str, amount: int = 1):
        """Helper to increment specific metrics."""
        if hasattr(self.metrics, name):
            setattr(self.metrics, name, getattr(self.metrics, name) + amount)
            # Implicitly increment operations for any metric change except time
            if name != "time_ms" and name != "operations":
                self.metrics.operations += amount

    def get_events(self) -> List[ExecutionEvent]:
        return self.events
