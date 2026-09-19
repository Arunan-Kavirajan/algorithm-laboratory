# Dijkstra's Shortest Path Algorithm

## 1. What is it?
Dijkstra's algorithm is a famous method in computer science used to find the absolute shortest path between two points (or nodes) in a graph. Imagine a map where cities are connected by roads of different lengths—Dijkstra helps you find the fastest route from your starting city to any other city.

## 2. What problem does it solve?
It solves the "Single-Source Shortest Path" problem. Given a starting point, it calculates the shortest distance to all other reachable points in a network, provided that none of the connections have a negative cost (like a road that gives you back time or gas).

## 3. Why do we need it?
We need it because blindly guessing the shortest route is inefficient, especially when networks get huge. It's the backbone behind GPS navigation systems, network routing protocols (like how your internet data travels), and even AI pathfinding in video games.

## 4. Core idea 💡
The core idea is simple: **Explore the cheapest options first.** Starting from your origin, you always look at the closest unvisited place, lock in its distance, and then see if that place offers a better shortcut to its neighbors. By always grabbing the "currently cheapest" node, you guarantee you'll find the shortest path in the end.

## 5. How does it work?
1. **Setup**: Assign a distance of `0` to your starting node and `infinity` to all other nodes. 
2. **Keep track**: Use a priority queue to keep track of the nodes to visit, always pulling the one with the smallest known distance.
3. **Explore**: For the current node, look at all its unvisited neighbors.
4. **Relax**: Calculate the distance to each neighbor *through* the current node. If this new distance is smaller than the neighbor's previously known distance, update it.
5. **Mark as done**: Once all neighbors are checked, mark the current node as visited. Its shortest path is now locked in.
6. **Repeat**: Grab the next unvisited node with the smallest distance and repeat until all nodes are visited.

## 6. Visual intuition
Imagine pouring water onto a network of pipes starting from a single point. If the water travels at a constant speed, the first time it reaches any junction, it must have taken the shortest possible route to get there. Dijkstra's algorithm mimics this "expanding wave," always pushing forward along the shortest known paths.

## 7. Example / Dry Run
Let's say we have nodes A, B, and C.
- A to B costs 4
- A to C costs 2
- C to B costs 1

1. Start at A (distance 0). Neighbors are B (4) and C (2).
2. Smallest is C (distance 2). We lock in C.
3. From C, we can reach B. The cost is C's distance (2) + path C->B (1) = 3.
4. The old known distance to B was 4. The new one is 3. We update B's distance to 3!
5. Next smallest is B (distance 3). We lock it in. We found the shortest paths!

## 8. Pseudocode
```text
function Dijkstra(Graph, source):
    create priority queue Q
    
    for each vertex v in Graph:
        distance[v] = infinity
        add v to Q
        
    distance[source] = 0
    
    while Q is not empty:
        u = vertex in Q with min distance
        remove u from Q
        
        for each neighbor v of u:
            alt = distance[u] + length(u, v)
            if alt < distance[v]:
                distance[v] = alt
                update v in Q
                
    return distance
```

## 9. How to implement it (python)
```python
import heapq

def dijkstra(graph, start):
    # Dictionary to store the shortest paths
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    
    # Priority queue: stores (distance, node)
    pq = [(0, start)]
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        # If we found a longer path, ignore it
        if current_distance > distances[current_node]:
            continue
            
        # Check neighbors
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            
            # If we found a shorter path, update it!
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return distances

# Example usage:
# graph = {
#     'A': {'B': 4, 'C': 2},
#     'B': {},
#     'C': {'B': 1}
# }
# print(dijkstra(graph, 'A'))
```

## 10. Time Complexity ⏱️
- **O((V + E) log V)** where V is the number of vertices (nodes) and E is the number of edges (connections). 
- Using a priority queue (min-heap) makes fetching the minimum distance very fast.

## 11. Space Complexity 💾
- **O(V + E)** for storing the graph, plus **O(V)** for the priority queue and distance dictionary. Overall, it scales linearly with the size of the network.

## 12. When should I use it?
- When you need the absolute shortest path from a single starting point to all other points.
- When your graph has **non-negative** weights (like physical distances or time).

## 13. When should I NOT use it?
- If your graph has **negative weights** (use Bellman-Ford instead).
- If you just need the path between *all* pairs of nodes (use Floyd-Warshall).
- If you know a lot of information about the target's location, like navigating a 2D grid where you know the exact coordinates (use A* Search instead, it's faster!).

## 14. Advantages & disadvantages
**Advantages:**
- Guaranteed to find the optimal shortest path.
- Highly efficient with the right data structures (like a Fibonacci heap, though a standard min-heap is usually fine).

**Disadvantages:**
- Can be slow on massive graphs if you only care about one specific target, because it blindly explores in all directions.
- Totally breaks if there are negative edge weights.

## 15. Important concepts / terminology
- **Vertex / Node**: A point in the graph (e.g., a city).
- **Edge**: A connection between two nodes (e.g., a road).
- **Weight**: The cost of traveling an edge.
- **Priority Queue**: A data structure that helps us quickly grab the unvisited node with the smallest known distance.
- **Relaxation**: The process of updating the distance to a node if a cheaper path is found.

## 16. Common mistakes ⚠️
- Forgetting to use a priority queue and instead scanning all nodes every time, which ruins the time complexity.
- Using it on graphs with negative weights (it will confidently give you the wrong answer).
- Not keeping track of visited nodes properly, leading to infinite loops in cyclic graphs.

## 17. Related algorithms
- **A* Search**: An upgraded Dijkstra that uses a "heuristic" to guess the right direction, making it much faster for point A to point B navigation.
- **Bellman-Ford**: Slower, but can handle negative weights.
- **Prim's Algorithm**: Looks very similar to Dijkstra but is used to find a Minimum Spanning Tree, not shortest paths.

## 18. Try it yourself 🧪
[Visualize this algorithm →](/)
