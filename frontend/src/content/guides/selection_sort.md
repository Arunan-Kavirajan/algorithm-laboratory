# Selection Sort

## 1. What is it?
Selection Sort is one of the simplest sorting algorithms out there. Imagine you have a messy deck of cards and you want to order them from smallest to largest. Selection Sort does exactly what you'd probably do instinctively: it scans through all the cards, finds the absolute smallest one, and puts it at the front. Then, it looks through the remaining cards, finds the next smallest, and puts it in the second spot. It keeps doing this until the whole deck is sorted!

## 2. What problem does it solve?
It solves the fundamental problem of putting items in order. Whether it's numbers from lowest to highest, or names from A to Z, Selection Sort takes an unordered list and organizes it into a sorted sequence.

## 3. Why do we need it?
While there are much faster ways to sort data in the real world, we still need Selection Sort as an incredible teaching tool. It helps us understand the basic concepts of how computers search and move data around. It's the perfect stepping stone before jumping into more complex and efficient sorting algorithms.

## 4. Core idea 💡
Find the smallest item in the unsorted part of your list, and swap it into its correct position at the end of the sorted part. Repeat this until everything is sorted!

## 5. How does it work?
The algorithm mentally divides your list into two parts:
1. A **sorted** part at the beginning (which starts out empty).
2. An **unsorted** part covering the rest of the list.

It goes through the unsorted part, finds the minimum value, and swaps it with the first unsorted element. Now, that element becomes part of the sorted section, and the sorted section grows by one. It repeats this process until the unsorted part is empty.

## 6. Visual intuition
Think of it like organizing a bookshelf by height. 
You scan the entire shelf, pick the shortest book, and place it at the far left. Then, you scan the remaining books, find the next shortest one, and place it right next to the first one. You keep moving the shortest remaining book to the end of your neatly organized section until you run out of books.

## 7. Example / Dry Run
Let's sort this list: `[64, 25, 12, 22, 11]`

* **Pass 1:** Look at the whole list. The smallest number is `11`. Swap it with the first number (`64`).
  List is now: `[11, 25, 12, 22, 64]`
* **Pass 2:** Ignore the `11` (it's sorted). Look at `[25, 12, 22, 64]`. The smallest is `12`. Swap it with `25`.
  List is now: `[11, 12, 25, 22, 64]`
* **Pass 3:** Look at `[25, 22, 64]`. The smallest is `22`. Swap it with `25`.
  List is now: `[11, 12, 22, 25, 64]`
* **Pass 4:** Look at `[25, 64]`. The smallest is `25`. It's already in the right place!
  List is now: `[11, 12, 22, 25, 64]`
* Everything is sorted!

## 8. Pseudocode
```text
for i from 0 to length of array - 1:
    minIndex = i
    for j from i + 1 to length of array:
        if array[j] < array[minIndex]:
            minIndex = j
    
    if minIndex != i:
        swap array[i] and array[minIndex]
```

## 9. How to implement it (python)
```python
def selection_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Find the minimum element in remaining unsorted array
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        # Swap the found minimum element with the first element        
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        
    return arr

# Try it out!
numbers = [64, 25, 12, 22, 11]
print("Sorted array:", selection_sort(numbers))
```

## 10. Time Complexity ⏱️
* **Best Case:** O(N²) - Even if the list is already sorted, it still scans the remaining items to ensure nothing is smaller.
* **Average Case:** O(N²)
* **Worst Case:** O(N²) - If the list is in reverse order, it does the same amount of scanning.

*(N represents the number of items in the list. O(N²) means as the list grows, the time it takes grows exponentially!)*

## 11. Space Complexity 💾
* **O(1)** - It's super memory efficient! It only needs a tiny bit of extra memory to store the `min_idx` variable, regardless of how huge the list is. It sorts the array "in-place".

## 12. When should I use it?
* When memory space is extremely limited.
* When you have a very small list (like 10-20 items).
* When you want to minimize the number of swaps (it only swaps at most once per pass).
* When you're first learning about sorting algorithms!

## 13. When should I NOT use it?
* In production code for large datasets. It's simply too slow compared to modern alternatives like Merge Sort or Quick Sort.
* When you need a "stable" sort (a sort that keeps identical items in their original relative order). Standard Selection Sort can sometimes jumble up identical items.

## 14. Advantages & disadvantages
**Advantages:**
* Incredibly easy to understand and code.
* Uses very little extra memory (O(1) space).
* Never makes more than O(N) swaps, which is great if writing data to memory is expensive.

**Disadvantages:**
* Extremely slow for large lists (O(N²) time).
* Usually not stable.

## 15. Important concepts / terminology
* **In-place algorithm:** An algorithm that doesn't need to create a whole new copy of the data structure to do its work. Selection sort is in-place!
* **Stable vs. Unstable:** A stable sort keeps duplicate items in the same order they started in. Selection sort is generally unstable because swapping from far away can mix up the order of duplicates.

## 16. Common mistakes ⚠️
* **Forgetting to update the minimum index:** A classic bug is updating the minimum *value* but forgetting to keep track of the *index* where that value was found. You need the index to perform the swap!
* **Swapping inside the inner loop:** You should only swap once per pass, after the inner loop finishes scanning. Swapping inside the inner loop turns it into a weird, inefficient version of Bubble Sort.

## 17. Related algorithms
* **Bubble Sort:** Another beginner-friendly O(N²) sort, but it repeatedly swaps adjacent elements instead of finding the absolute minimum.
* **Insertion Sort:** Often compared to Selection Sort, but Insertion Sort builds the sorted array by inserting one element at a time into its correct spot, which can be faster for nearly sorted data.
* **Heap Sort:** This is basically Selection Sort on steroids! It uses a clever data structure called a "Heap" to find the minimum element blazingly fast, improving the time to O(N log N).

## 18. Try it yourself 🧪
[Visualize this algorithm →](/)
