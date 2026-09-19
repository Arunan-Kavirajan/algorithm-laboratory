# Insertion Sort

### 1. What is it?
Insertion sort is a simple, intuitive sorting algorithm that builds the final sorted array one item at a time. If you've ever sorted a hand of playing cards by picking up one card at a time and placing it in its correct position among the cards you're already holding, you've used insertion sort!

### 2. What problem does it solve?
It solves the fundamental problem of putting a list of items (like numbers, names, or scores) into a specific order, usually from smallest to largest or vice versa.

### 3. Why do we need it?
While there are faster algorithms out there for huge lists, insertion sort is incredibly useful because it's super easy to understand and write. It also shines in very specific scenarios where other algorithms struggle, such as when dealing with tiny lists or data that is already mostly sorted.

### 4. Core idea 💡
Imagine splitting your list into two parts: a "sorted" section and an "unsorted" section. At first, the sorted section is just the first item. You then take the first item from the unsorted section and *insert* it into its correct spot in the sorted section. Repeat until the unsorted section is empty.

### 5. How does it work?
1. Assume the first element is already sorted.
2. Grab the next element from the unsorted section.
3. Compare it with the elements in the sorted section, moving from right to left.
4. Shift all elements that are larger than our grabbed element one position to the right.
5. Drop the grabbed element into the empty space.
6. Repeat steps 2-5 for the rest of the list.

### 6. Visual intuition
Think of a bookshelf. You have a few books organized alphabetically on the left, and a stack of unorganized books on the right. You pick up the top book from the unorganized stack, scan your organized books from right to left, slide the ones that come *after* it to the right, and slot your new book exactly where it belongs.

### 7. Example / Dry Run
Let's sort the array `[5, 3, 4, 1, 2]`.
- **Start:** `[5 | 3, 4, 1, 2]` (5 is in our sorted section)
- **Take 3:** `5` is bigger than `3`, so shift `5` to the right. Insert `3`. -> `[3, 5 | 4, 1, 2]`
- **Take 4:** `5` is bigger, shift `5`. `3` is smaller, so stop shifting. Insert `4`. -> `[3, 4, 5 | 1, 2]`
- **Take 1:** Shift `5`, then `4`, then `3`. Insert `1` at the start. -> `[1, 3, 4, 5 | 2]`
- **Take 2:** Shift `5`, `4`, `3`. `1` is smaller, so stop. Insert `2`. -> `[1, 2, 3, 4, 5 |]`
All done!

### 8. Pseudocode
```text
for i from 1 to length(array) - 1:
    current_item = array[i]
    j = i - 1
    
    while j >= 0 and array[j] > current_item:
        array[j + 1] = array[j]
        j = j - 1
        
    array[j + 1] = current_item
```

### 9. How to implement it (python)
```python
def insertion_sort(arr):
    # Start from the second element (index 1)
    for i in range(1, len(arr)):
        key = arr[i]
        
        # Compare key with elements to its left
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j] # Shift right
            j -= 1
            
        # Place key in its correct position
        arr[j + 1] = key
        
    return arr
```

### 10. Time Complexity ⏱️
- **Best Case:** O(n) - This happens when the list is already sorted! We just compare each item once and never have to shift anything.
- **Average Case:** O(n²) - When elements are in random order.
- **Worst Case:** O(n²) - When the list is in completely reverse order. We have to shift every single element every single time.

### 11. Space Complexity 💾
- **O(1)**: It sorts the list "in-place". This means it doesn't need any extra memory (like creating a whole new copy of the list) to do its job.

### 12. When should I use it?
- The list is very small (usually less than 10-20 elements).
- The list is almost sorted (only a few elements are out of place).
- You are writing a more complex algorithm (like Timsort, used in Python) and need a fast way to sort small chunks of data.
- Memory space is extremely tight.

### 13. When should I NOT use it?
- When dealing with large datasets. An O(n²) algorithm will crawl to a halt if you try to sort thousands or millions of items. Use algorithms like Merge Sort or Quick Sort instead.

### 14. Advantages & disadvantages
**Advantages:**
- Dead simple to code and understand.
- Extremely efficient for small lists.
- Adaptive (gets faster if the list is already partially sorted).
- Stable (doesn't mess up the order of identical elements).
- In-place (saves memory).

**Disadvantages:**
- Terrible performance on large, randomly ordered lists.
- Lots of writing and shifting in memory, which can be slow on some systems.

### 15. Important concepts / terminology
- **In-place:** Sorting without needing extra arrays or lists.
- **Stable Sort:** If you have two identical items, a stable sort guarantees they will stay in the exact same order relative to each other. Insertion sort is stable!
- **Adaptive:** An algorithm that performs better when given data that is already partially sorted.

### 16. Common mistakes ⚠️
- **Off-by-one errors:** Accidentally starting the loop at index 0 instead of 1, or messing up the `j >= 0` condition.
- **Forgetting to save the current item:** You must save `array[i]` into a temporary variable (like `key` or `current_item`) before shifting elements. Otherwise, it gets overwritten and lost!
- **Swapping instead of shifting:** While repeatedly swapping the adjacent elements works, it does unnecessary work. Shifting elements to the right and doing one final insertion is the correct and faster way.

### 17. Related algorithms
- **Selection Sort:** Another simple O(n²) sort, but it doesn't adapt to already sorted data.
- **Bubble Sort:** The classic beginner sort, but generally slower than insertion sort in practice.
- **Shell Sort:** A highly optimized version of insertion sort that compares items far apart before comparing items close together.

### 18. Try it yourself 🧪

[Visualize this algorithm →](/)
