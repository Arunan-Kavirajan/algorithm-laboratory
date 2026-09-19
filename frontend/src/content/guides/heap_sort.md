# Heap Sort

### 1. What is it?
Heap Sort is a highly efficient, comparison-based sorting algorithm. Think of it as an improved version of selection sort. Instead of scanning the entire unsorted part of your data to find the biggest (or smallest) item, it uses a specialized data structure called a "heap" to find it instantly.

### 2. What problem does it solve?
It solves the problem of organizing a chaotic collection of items (like a list of numbers, names, or tasks) into a specific order—usually ascending or descending—without needing a bunch of extra memory to do it.

### 3. Why do we need it?
We need it because while some sorting algorithms like Quick Sort are fast in practice, they can occasionally be extremely slow if you're unlucky with your data. Heap Sort gives us a **guarantee**: it will always run fast, no matter how messy or partially sorted your data is, and it does this while barely using any extra memory.

### 4. Core idea 💡
The core idea is all about organization. First, you rearrange your list into a "Max Heap" (a special tree shape where the biggest item is always at the top). Then, you swap that biggest item to the very end of your list (where it belongs), pretend the list is one item shorter, and quickly fix the tree so the *next* biggest item floats to the top. Repeat this until the whole list is sorted!

### 5. How does it work?
Heap Sort works in two main phases:
1.  **Build the Heap (The Setup):** We take our regular list and turn it into a Max Heap. Now, the absolute largest number is sitting pretty at the very front of our list.
2.  **Sort the Heap (The Takedown):**
    *   We take that largest number from the front and swap it with the very last number in our list. Now the largest number is locked in its final sorted position at the end.
    *   We temporarily shrink our "active" list size by one (ignoring the sorted number).
    *   The new number at the front is probably small and in the wrong place, so we push it down the tree (a process called "heapify") until a new largest number bubbles up to the front.
    *   We keep swapping the front item to the end and fixing the heap until we're out of items.

### 6. Visual intuition
Imagine you have a company hierarchy where every boss must be older than their direct employees (a Max Heap). The CEO (the oldest person) is at the very top.
To sort everyone by age:
1.  You ask the CEO to step down and take the last available seat in the auditorium (sorted!).
2.  You promote a random entry-level employee to CEO temporarily.
3.  Chaos! You fix this by having the fake CEO step down, promoting the older of their two managers, and repeating this until the fake CEO is in a valid spot. Now the *next* oldest person is the true CEO.
4.  You ask the new CEO to take the second-to-last seat, and repeat.

### 7. Example / Dry Run
Let's sort: `[4, 10, 3, 5, 1]`

**Phase 1: Build Max Heap**
*   Rearrange it so every "parent" is bigger than its "children".
*   Heapified list: `[10, 5, 3, 4, 1]` (Notice 10 is at the top/front).

**Phase 2: Sort**
*   **Swap 10 and 1:** List becomes `[1, 5, 3, 4 | 10]`. (10 is locked).
*   **Fix heap:** 1 is too small. It swaps with 5, then 4. Heap is now `[5, 4, 3, 1]`.
*   **Swap 5 and 1:** List becomes `[1, 4, 3 | 5, 10]`. (5 and 10 are locked).
*   **Fix heap:** 1 swaps with 4. Heap is now `[4, 1, 3]`.
*   **Swap 4 and 3:** List becomes `[3, 1 | 4, 5, 10]`. (4, 5, 10 locked).
*   **Fix heap:** 3 is fine where it is.
*   **Swap 3 and 1:** List becomes `[1 | 3, 4, 5, 10]`. (3, 4, 5, 10 locked).
*   **Done!** Final list: `[1, 3, 4, 5, 10]`.

### 8. Pseudocode
```text
function heapSort(array):
    # Step 1: Build a Max Heap
    n = length(array)
    for i from (n / 2) - 1 down to 0:
        heapify(array, n, i)

    # Step 2: Extract elements one by one
    for i from n - 1 down to 1:
        swap array[0] and array[i]  # Move current root to end
        heapify(array, i, 0)        # Fix the reduced heap

function heapify(array, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and array[left] > array[largest]:
        largest = left
    if right < n and array[right] > array[largest]:
        largest = right

    if largest != i:
        swap array[i] and array[largest]
        heapify(array, n, largest)
```

### 9. How to implement it (python)
```python
def heapify(arr, n, i):
    largest = i
    left_child = 2 * i + 1
    right_child = 2 * i + 2

    # See if left child exists and is greater than root
    if left_child < n and arr[left_child] > arr[largest]:
        largest = left_child

    # See if right child exists and is greater than root
    if right_child < n and arr[right_child] > arr[largest]:
        largest = right_child

    # Change root if needed
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]  # Swap
        # Heapify the root.
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)

    # Build a maxheap.
    # Since last parent will be at (n//2 - 1), we start there
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]  # Swap
        heapify(arr, i, 0)

# Try it out!
my_list = [12, 11, 13, 5, 6, 7]
heap_sort(my_list)
print("Sorted array is:", my_list)
```

### 10. Time Complexity ⏱️
*   **Best Case:** $O(n \log n)$
*   **Average Case:** $O(n \log n)$
*   **Worst Case:** $O(n \log n)$
Heap sort is incredibly consistent. It always takes about the same amount of time, regardless of whether the array is already sorted, completely reversed, or scrambled.

### 11. Space Complexity 💾
*   **Space Complexity:** $O(1)$ (Constant space)
This is one of Heap Sort's superpowers! It sorts the array "in-place", meaning it doesn't need to create a whole new copy of the array to do its job.

### 12. When should I use it?
*   When you have a massive amount of data and you absolutely cannot afford for your sorting algorithm to have a "bad day" and slow down drastically (like Quick Sort sometimes does).
*   When you are building systems with strict memory limits (like embedded systems or microcontrollers) and need an in-place sort.

### 13. When should I NOT use it?
*   When you need a "stable" sort. If you have two items that are equal, Heap Sort might flip their original order.
*   For very small lists. The overhead of constantly fixing the heap makes it slower than simpler algorithms like Insertion Sort for tiny amounts of data.
*   In modern applications where raw speed is the only metric, a well-implemented Quick Sort or Merge Sort is usually slightly faster in the real world due to how computer hardware (caching) works.

### 14. Advantages & disadvantages
**Advantages:**
*   **Memory Efficient:** Barely uses any extra memory.
*   **Guaranteed Performance:** No matter how bad the input is, it finishes in $O(n \log n)$ time.

**Disadvantages:**
*   **Unstable:** Doesn't preserve the original relative order of equal elements.
*   **Cache Unfriendly:** It jumps around memory quite a bit while fixing the heap, which hardware caches don't like. This often makes it slower in practice than Quick Sort.

### 15. Important concepts / terminology
*   **Heap:** A special tree-based data structure that satisfies the heap property.
*   **Max Heap:** A heap where the parent node is always greater than or equal to its children. The biggest element is at the root.
*   **Min Heap:** A heap where the parent is always less than or equal to its children.
*   **Heapify:** The process of moving a node down the tree until the heap property is restored.
*   **In-place Sorting:** Sorting an array without needing to allocate a significant amount of extra memory.

### 16. Common mistakes ⚠️
*   **Off-by-one errors:** Calculating the children (`2*i + 1` and `2*i + 2`) or the parent (`(i-1)//2`) incorrectly. Remember, arrays are 0-indexed!
*   **Forgetting to shrink the heap:** During the sorting phase, you must pass the reduced size (`i`) into the `heapify` function, otherwise, you'll just mix the sorted elements right back into the heap.
*   **Building the heap wrong:** You must build the heap from the bottom up, starting at the last parent node (`n//2 - 1`), not from the top down.

### 17. Related algorithms
*   **Quick Sort:** Another fast, in-place sort, but with a worse worst-case time complexity.
*   **Merge Sort:** Has the same time complexity but requires extra memory. It *is* stable, unlike Heap Sort.
*   **Selection Sort:** The slow ($O(n^2)$) cousin of Heap Sort. Heap Sort is basically Selection Sort but using a clever data structure to find the largest element fast.

### 18. Try it yourself 🧪

[Visualize this algorithm →](/)
