# Depth-First Search (DFS)

### 1. What is it?
Depth-First Search (or DFS) is a fundamental algorithm for exploring or searching through a graph or a tree. As the name suggests, it goes as *deep* as it possibly can down a single path before it hits a dead end and turns back.

### 2. What problem does it solve?
Imagine you're lost in a massive maze. How do you find your way out? You could just wander aimlessly, but you'd likely go in circles. DFS gives you a systematic way to explore the maze: keep hugging the left wall until you hit a dead end, then backtrack to the last intersection and try the next path. It solves the problem of exploring every single nook and cranny of a complex network.

### 3. Why do we need it?
We need DFS because many real-world problems can be represented as graphs or trees—like file directories on your computer, social networks, or puzzle-solving (like Sudoku). DFS provides an elegant, predictable, and memory-efficient way to traverse these structures, answer questions like "Is there a path from A to B?", or visit every single node to process data.

### 4. Core idea 💡
Go deep before going wide. Dive into a branch as far as you can go. Once you can't go any further, take a step back (backtrack) and explore the next available branch. Keep doing this until you've seen everything.

### 5. How does it work?
DFS uses a very simple mechanism to remember where it needs to go next: a **stack** (Last-In, First-Out). You can implement this yourself using an actual stack data structure, or you can use the magic of **recursion**, which uses the computer's built-in call stack.
1. Start at a chosen node (usually the root).
2. Mark it as "visited" so you don't process it again.
3. Look at its neighbors. Pick one that hasn't been visited, and repeat the process from there.
4. If a node has no unvisited neighbors left, you just step backward to the node you came from.

### 6. Visual intuition
Think of a spider crawling across a web, or a detective pursuing a single lead until the trail goes completely cold, before returning to the precinct to pick up the next lead. You're drilling a single deep hole to see if you hit water, rather than digging shallow holes everywhere.

### 7. Example / Dry Run
Let's say we have a tiny family tree graph: A is the parent of B and C. B is the parent of D and E.
Start at **A**.
1. From A, we pick neighbor B. (Path: A -> B)
2. From B, we pick neighbor D. (Path: A -> B -> D)
3. D has no children. It's a dead end! Backtrack to B.
4. From B, we pick the other neighbor E. (Path: A -> B -> E)
5. E has no children. Dead end! Backtrack to B.
6. B has no unvisited children left. Backtrack to A.
7. From A, we pick the other neighbor C. (Path: A -> C)
8. C has no children. Backtrack to A.
9. A has no unvisited children. We're done!
The order of visited nodes: A, B, D, E, C.

### 8. Pseudocode
```text
function DFS(node, visited_set):
    if node is not in visited_set:
        mark node as visited
        print or process node
        
        for each neighbor of node:
            if neighbor is not in visited_set:
                DFS(neighbor, visited_set)
```

### 9. How to implement it (python)
```python
def dfs(graph, start_node, visited=None):
    if visited is None:
        visited = set()
        
    visited.add(start_node)
    print(start_node) # Do whatever you need with the node here
    
    for neighbor in graph[start_node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
            
    return visited

# Example graph represented as an adjacency list
my_graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}

dfs(my_graph, 'A')
```

### 10. Time Complexity ⏱️
**O(V + E)**
Where **V** is the number of Vertices (nodes) and **E** is the number of Edges (connections). You visit every node once, and you look down every edge once. It's as fast as physically possible for exploring a graph!

### 11. Space Complexity 💾
**O(V)**
In the worst-case scenario (like a straight line of nodes), your recursion call stack will go as deep as the total number of nodes. You also need space to store the `visited` set, which at worst holds all V nodes.

### 12. When should I use it?
- **Finding a path** through a maze or puzzle.
- **Topological Sorting** (figuring out what order to do tasks with prerequisites).
- **Cycle detection** (finding out if a graph loops back on itself).
- Exploring a tree structure where you know the answer might be very deep down.

### 13. When should I NOT use it?
- **Finding the shortest path.** DFS does *not* guarantee the shortest path—it just finds *a* path. (Use BFS for shortest path!).
- When your graph is infinitely deep or so massively deep that recursion will crash your program (Stack Overflow!).

### 14. Advantages & disadvantages
**Advantages:**
- Usually uses less memory than Breadth-First Search (BFS) if the graph is very wide but not very deep.
- Super easy to write using recursion.
- Excellent for puzzle games.

**Disadvantages:**
- Can get trapped going down incredibly long (or infinite) paths.
- Does not find the optimal/shortest path.
- Deep recursion can cause stack overflow errors in languages that don't optimize it.

### 15. Important concepts / terminology
- **Graph / Tree:** The structure we are searching.
- **Node / Vertex:** A single point or item in the graph.
- **Edge:** The connection between two nodes.
- **Backtracking:** The act of returning to a previous node when you hit a dead end.
- **Call Stack:** The invisible memory structure your computer uses to keep track of recursive function calls.

### 16. Common mistakes ⚠️
- **Forgetting the "visited" set:** If you don't keep track of where you've been, an infinite loop in your graph will keep your DFS spinning around forever!
- **Modifying the graph while traversing:** Try not to delete or add edges while you're currently looping over them; it can cause weird bugs.
- **Assuming it finds the shortest path:** A classic mistake! Always remember DFS just goes deep, it doesn't care if the path is efficient.

### 17. Related algorithms
- **Breadth-First Search (BFS):** DFS's sibling. Explores layer by layer instead of plunging deep.
- **Dijkstra's Algorithm:** Used for finding the shortest path when edges have "weights" (like distances or costs).
- **A* (A-Star) Search:** A smarter pathfinding algorithm that uses heuristics to find the shortest path efficiently.

### 18. Try it yourself 🧪
[Visualize this algorithm →](/)
