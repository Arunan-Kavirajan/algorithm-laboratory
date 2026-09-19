# 📖 Bubble Sort Guide

## 1. What is it?
Bubble Sort is one of the simplest ways to sort a list of items. Imagine a line of people trying to sort themselves by height by constantly turning to the person next to them and swapping places if they are out of order.

## 2. What problem does it solve?
It takes a scrambled, completely random list of items (like numbers or names) and rearranges them into perfect order, from smallest to largest.

## 3. Why do we need it?
Computers are terrible at finding things in messy lists. Sorting data is step zero for almost everything a computer does. Bubble Sort is the most basic, beginner-friendly way to introduce the concept of sorting.

## 4. Core idea 💡
The biggest items "bubble up" to the end of the list. We just walk through the list, compare two adjacent items, and swap them if the left one is bigger than the right one. We keep doing this over and over until we walk through the entire list without needing to make a single swap.

## 5. How does it work?
1. Look at the first two items.
2. If the left item is bigger, swap them.
3. Move one step to the right and repeat.
4. Once you reach the end, the absolute biggest item is now locked into the last position.
5. Start back at the beginning and do it again for the remaining unsorted items!

## 6. Visual intuition
Think of air bubbles in water. The larger the bubble (the bigger the number), the faster it floats up to the surface (the end of the array). In our visualizer, you will literally see the tallest bars slowly inching their way to the right side of the screen, one swap at a time!

## 7. Example / Dry Run

**Input:** `[5, 2, 8, 1]`

**Pass 1:**
- Compare `5` and `2` -> Swap! `[2, 5, 8, 1]`
- Compare `5` and `8` -> Good. `[2, 5, 8, 1]`
- Compare `8` and `1` -> Swap! `[2, 5, 1, 8]`
*(8 is now locked at the end)*

**Pass 2:**
- Compare `2` and `5` -> Good. `[2, 5, 1, 8]`
- Compare `5` and `1` -> Swap! `[2, 1, 5, 8]`
*(5 is now locked)*

**Pass 3:**
- Compare `2` and `1` -> Swap! `[1, 2, 5, 8]`
*(Fully sorted!)*

## 8. Pseudocode
```text
for every item in the list:
    for every pair of adjacent items:
        if left_item > right_item:
            swap(left_item, right_item)
```

## 9. How to implement it
<details>
<summary>Click to view Python Code</summary>

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # We can stop early if we make no swaps!
        swapped = False
        
        # The last 'i' elements are already sorted
        for j in range(0, n - i - 1):
            if arr[j] > arr[j+1]:
                # Swap them
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
                
        if not swapped:
            break
            
    return arr
```
</details>

## 10. Time Complexity ⏱️
- **Best Case (Already sorted):** `O(n)` - We just walk through the list once, realize it's sorted, and stop.
- **Average/Worst Case:** `O(n²)` - We have to compare almost every item against every other item. It gets very slow, very fast.

## 11. Space Complexity 💾
- **O(1) (Constant Space):** We don't need any extra lists or memory to do this. We just swap items exactly where they are.

## 12. When should I use it?
Almost never in real life! It is primarily used in computer science classes as a stepping stone to teach beginners how loops and swapping work. 

## 13. When should I NOT use it?
Anytime you have a large list. If you try to Bubble Sort a million items, it might take hours.

## 14. Advantages & disadvantages
- **Advantages:** Super easy to write. Super easy to understand. Doesn't use extra memory.
- **Disadvantages:** Terribly slow for large amounts of data.

## 15. Important concepts / terminology
- **Adjacent:** Sitting right next to each other.
- **Pass:** One full trip through the list from left to right.
- **In-place:** Modifying the original list without making a copy of it.

## 16. Common mistakes ⚠️
- **Forgetting to subtract `i`:** Beginners often check the *entire* list every single pass. Remember, after Pass 1, the biggest item is already locked at the end, so you don't need to check it again!

## 17. Related algorithms
- **Selection Sort** -> Similar speed, but searches for the smallest item instead of bubbling the biggest.
- **Insertion Sort** -> Faster for mostly-sorted lists.

## 18. Try it yourself 🧪
*[Visualize Bubble Sort ->]*
