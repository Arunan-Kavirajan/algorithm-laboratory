# Linear Search

## 1. What is it?
Linear Search is the simplest and most intuitive way to find a specific item in a list. Imagine you have a stack of books and you're looking for a specific title. You start from the top book, check if it's the one you want, and if not, you move to the next one until you either find it or run out of books. That's exactly how a linear search works!

## 2. What problem does it solve?
It solves the foundational problem of **searching**: finding out whether a specific element exists within a collection of data, and if so, identifying its exact position or index. 

## 3. Why do we need it?
Before we can talk about fancy, lightning-fast algorithms, we need a baseline. Linear search is that baseline. We need it because it works on *any* list, no matter how messy or unorganized it is. It makes zero assumptions about your data.

## 4. Core idea 💡
Start at the very beginning, look at every single item one by one, and stop the moment you find what you're looking for.

## 5. How does it work?
1. Start at the first element (index 0) of the list.
2. Compare the current element with the target value you're looking for.
3. If they match, congratulations! You've found it. Return the current position.
4. If they don't match, move on to the next element.
5. Repeat steps 2-4 until you find the target or reach the end of the list.
6. If you reach the end without finding a match, the target isn't in the list.

## 6. Visual intuition
Think of a row of lockers. You need to find the locker containing your friend's gym bag, but you don't know the locker number. What do you do? You open the first locker. Not there. You open the second locker. Not there. You keep going down the line, opening them one by one, until you finally spot the bag. 

## 7. Example / Dry Run
Let's say we have an array: `[4, 2, 9, 7, 1]` and we want to find the number `7`.

- **Step 1:** Look at the first number (index 0). Is `4 == 7`? No. Move on.
- **Step 2:** Look at the second number (index 1). Is `2 == 7`? No. Move on.
- **Step 3:** Look at the third number (index 2). Is `9 == 7`? No. Move on.
- **Step 4:** Look at the fourth number (index 3). Is `7 == 7`? Yes! We found it at index 3. Stop searching.

## 8. Pseudocode
```
function linearSearch(array, target):
    for each index from 0 to length of array - 1:
        if array[index] == target:
            return index
    
    return -1 (meaning not found)
```

## 9. How to implement it (python)
```python
def linear_search(arr, target):
    # Loop through the array, getting both index and value
    for i in range(len(arr)):
        # Check if the current element matches our target
        if arr[i] == target:
            return i  # Found it! Return the index.
            
    # If the loop finishes and we haven't returned, it's not here
    return -1
```

## 10. Time Complexity ⏱️
- **Best Case:** $O(1)$ - You get super lucky and the item is the very first one you check.
- **Worst Case:** $O(n)$ - The item is at the very end of the list, or it's not in the list at all. You had to check every single item.
- **Average Case:** $O(n)$ - On average, you'll have to look through about half the items.

*(Where $n$ is the number of elements in the list).*

## 11. Space Complexity 💾
- **$O(1)$ (Constant Space)** - We only need a tiny bit of extra memory to keep track of our current position in the list. The memory needed doesn't grow as the list gets bigger.

## 12. When should I use it?
- When your list is small (the inefficiency won't matter).
- When your list is **unsorted** (random order) and you only need to search it once or twice.
- When you are searching for a condition rather than a specific value (e.g., finding the first even number).

## 13. When should I NOT use it?
- When you have a massive dataset (like millions of user records). Checking every single one will be painfully slow.
- When your list is already sorted. In that case, there are much faster algorithms available!

## 14. Advantages & disadvantages
**Advantages:**
- Incredibly easy to understand and write.
- Works on unsorted data perfectly fine.
- Doesn't require any extra memory.

**Disadvantages:**
- Very slow for large datasets. It simply doesn't scale well.

## 15. Important concepts / terminology
- **Index:** The position of an element in a list (usually starting at 0).
- **Target / Key:** The specific value you are searching for.
- **Brute Force:** Linear search is a "brute force" approach, meaning it tries every possible option until it succeeds.

## 16. Common mistakes ⚠️
- **Off-by-one errors:** Forgetting that arrays usually start at index 0, not 1, and accidentally skipping the first element or checking past the end of the array.
- **Returning too early:** Inside the loop, making sure you only return when you *find* the item, not mistakenly returning "not found" the first time a check fails.

## 17. Related algorithms
- **Binary Search:** The much faster cousin of linear search, but it *only* works if the data is already sorted.
- **Depth-First Search (DFS) / Breadth-First Search (BFS):** These are essentially ways to do a linear search on more complex data structures like graphs and trees.

## 18. Try it yourself 🧪

[Visualize this algorithm →](/)
