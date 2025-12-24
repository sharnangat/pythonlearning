# Sorting Algorithms Guide for Beginners

## Table of Contents
1. [Introduction to Sorting](#introduction-to-sorting)
2. [Bubble Sort](#1-bubble-sort)
3. [Selection Sort](#2-selection-sort)
4. [Insertion Sort](#3-insertion-sort)
5. [Merge Sort](#4-merge-sort)
5. [Quick Sort](#5-quick-sort)
6. [Comparison Summary](#comparison-summary)

---

## Introduction to Sorting

**What is Sorting?**
Sorting means arranging items in a particular order (ascending or descending). For example:
- Numbers: [5, 2, 8, 1, 9] → [1, 2, 5, 8, 9] (ascending)
- Names: ["Bob", "Alice", "Charlie"] → ["Alice", "Bob", "Charlie"] (alphabetical)

**Why Learn Sorting?**
- Fundamental computer science concept
- Used in many real-world applications (searching, data analysis, etc.)
- Helps understand algorithm efficiency
- Common interview topic

**Key Terms:**
- **Time Complexity**: How long an algorithm takes (Big O notation)
- **Space Complexity**: How much memory an algorithm uses
- **Stable Sort**: Maintains relative order of equal elements
- **In-place**: Uses constant extra memory

---

## 1. Bubble Sort

### Concept
Bubble Sort is like bubbles rising to the surface. It repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. The largest element "bubbles up" to the end in each pass.

### How It Works (Step by Step)
1. Start from the first element
2. Compare it with the next element
3. If they're in wrong order, swap them
4. Move to the next pair
5. Repeat until no more swaps are needed

**Example:**
```
Initial: [64, 34, 25, 12, 22, 11, 90]

Pass 1:
- Compare 64 and 34 → Swap → [34, 64, 25, 12, 22, 11, 90]
- Compare 64 and 25 → Swap → [34, 25, 64, 12, 22, 11, 90]
- Compare 64 and 12 → Swap → [34, 25, 12, 64, 22, 11, 90]
- Compare 64 and 22 → Swap → [34, 25, 12, 22, 64, 11, 90]
- Compare 64 and 11 → Swap → [34, 25, 12, 22, 11, 64, 90]
- Compare 64 and 90 → No swap → [34, 25, 12, 22, 11, 64, 90]
(90 is now in correct position)

Pass 2: (repeat for remaining elements)
... and so on
```

### Python Implementation

```python
def bubble_sort(arr):
    """
    Sort an array using Bubble Sort algorithm.
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list (in-place modification)
    """
    n = len(arr)  # Get the length of the array
    
    # Outer loop: number of passes needed
    # We need n-1 passes because after n-1 passes, 
    # the smallest element will be in its correct position
    for i in range(n):
        # Flag to optimize: if no swaps occur, array is sorted
        swapped = False
        
        # Inner loop: compare adjacent elements
        # After each pass, the largest element is at the end,
        # so we reduce the range by i (already sorted elements)
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if they're in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swaps occurred, array is already sorted
        if not swapped:
            break
    
    return arr


# Example usage
if __name__ == "__main__":
    # Test with numbers
    numbers = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", numbers)
    bubble_sort(numbers)
    print("Sorted array:", numbers)
    
    # Test with strings
    names = ["banana", "apple", "cherry", "date"]
    print("\nOriginal array:", names)
    bubble_sort(names)
    print("Sorted array:", names)
```

### Java Implementation

```java
public class BubbleSort {
    /**
     * Sort an array using Bubble Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void bubbleSort(int[] arr) {
        int n = arr.length;  // Get the length of the array
        
        // Outer loop: number of passes needed
        for (int i = 0; i < n; i++) {
            // Flag to optimize: if no swaps occur, array is sorted
            boolean swapped = false;
            
            // Inner loop: compare adjacent elements
            // After each pass, largest element is at the end
            for (int j = 0; j < n - i - 1; j++) {
                // Compare adjacent elements
                if (arr[j] > arr[j + 1]) {
                    // Swap if they're in wrong order
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            // If no swaps occurred, array is already sorted
            if (!swapped) {
                break;
            }
        }
    }
    
    // Generic version for any comparable type
    public static <T extends Comparable<T>> void bubbleSortGeneric(T[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j].compareTo(arr[j + 1]) > 0) {
                    T temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            
            if (!swapped) {
                break;
            }
        }
    }
    
    // Helper method to print array
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Test with integers
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        System.out.print("Original array: ");
        printArray(numbers);
        
        bubbleSort(numbers);
        System.out.print("Sorted array: ");
        printArray(numbers);
        
        // Test with strings
        String[] names = {"banana", "apple", "cherry", "date"};
        System.out.print("\nOriginal array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
        
        bubbleSortGeneric(names);
        System.out.print("Sorted array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
    }
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best case: O(n) - when array is already sorted
  - Average case: O(n²)
  - Worst case: O(n²)
- **Space Complexity**: O(1) - uses constant extra space
- **Stable**: Yes
- **In-place**: Yes

---

## 2. Selection Sort

### Concept
Selection Sort works by repeatedly finding the minimum (or maximum) element from the unsorted portion and placing it at the beginning. It's like sorting cards by repeatedly picking the smallest card.

### How It Works (Step by Step)
1. Find the minimum element in the unsorted portion
2. Swap it with the first element of the unsorted portion
3. Move the boundary of sorted/unsorted one position to the right
4. Repeat until the entire array is sorted

**Example:**
```
Initial: [64, 25, 12, 22, 11]

Pass 1: Find minimum in [64, 25, 12, 22, 11] → 11
        Swap 11 with 64 → [11, 25, 12, 22, 64]
        Sorted: [11], Unsorted: [25, 12, 22, 64]

Pass 2: Find minimum in [25, 12, 22, 64] → 12
        Swap 12 with 25 → [11, 12, 25, 22, 64]
        Sorted: [11, 12], Unsorted: [25, 22, 64]

Pass 3: Find minimum in [25, 22, 64] → 22
        Swap 22 with 25 → [11, 12, 22, 25, 64]
        Sorted: [11, 12, 22], Unsorted: [25, 64]

Pass 4: Find minimum in [25, 64] → 25
        Already in place → [11, 12, 22, 25, 64]
        Done!
```

### Python Implementation

```python
def selection_sort(arr):
    """
    Sort an array using Selection Sort algorithm.
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list (in-place modification)
    """
    n = len(arr)  # Get the length of the array
    
    # Outer loop: traverse through all array elements
    # After i iterations, first i elements are sorted
    for i in range(n):
        # Assume the current position has the minimum element
        min_index = i
        
        # Inner loop: find the minimum element in remaining unsorted array
        # Start from i+1 because elements before i are already sorted
        for j in range(i + 1, n):
            # If we find an element smaller than current minimum
            if arr[j] < arr[min_index]:
                # Update the index of minimum element
                min_index = j
        
        # Swap the found minimum element with the first element
        # of the unsorted portion (at position i)
        arr[i], arr[min_index] = arr[min_index], arr[i]
    
    return arr


# Example usage
if __name__ == "__main__":
    # Test with numbers
    numbers = [64, 25, 12, 22, 11]
    print("Original array:", numbers)
    selection_sort(numbers)
    print("Sorted array:", numbers)
    
    # Test with strings
    names = ["banana", "apple", "cherry", "date"]
    print("\nOriginal array:", names)
    selection_sort(names)
    print("Sorted array:", names)
```

### Java Implementation

```java
public class SelectionSort {
    /**
     * Sort an array using Selection Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void selectionSort(int[] arr) {
        int n = arr.length;  // Get the length of the array
        
        // Outer loop: traverse through all array elements
        for (int i = 0; i < n; i++) {
            // Assume the current position has the minimum element
            int minIndex = i;
            
            // Inner loop: find the minimum element in remaining unsorted array
            for (int j = i + 1; j < n; j++) {
                // If we find an element smaller than current minimum
                if (arr[j] < arr[minIndex]) {
                    // Update the index of minimum element
                    minIndex = j;
                }
            }
            
            // Swap the found minimum element with the first element
            // of the unsorted portion (at position i)
            int temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    
    // Generic version for any comparable type
    public static <T extends Comparable<T>> void selectionSortGeneric(T[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n; i++) {
            int minIndex = i;
            
            for (int j = i + 1; j < n; j++) {
                if (arr[j].compareTo(arr[minIndex]) < 0) {
                    minIndex = j;
                }
            }
            
            T temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    
    // Helper method to print array
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Test with integers
        int[] numbers = {64, 25, 12, 22, 11};
        System.out.print("Original array: ");
        printArray(numbers);
        
        selectionSort(numbers);
        System.out.print("Sorted array: ");
        printArray(numbers);
        
        // Test with strings
        String[] names = {"banana", "apple", "cherry", "date"};
        System.out.print("\nOriginal array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
        
        selectionSortGeneric(names);
        System.out.print("Sorted array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
    }
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best case: O(n²)
  - Average case: O(n²)
  - Worst case: O(n²)
- **Space Complexity**: O(1) - uses constant extra space
- **Stable**: No (can be made stable with extra space)
- **In-place**: Yes

---

## 3. Insertion Sort

### Concept
Insertion Sort is like sorting playing cards in your hand. You pick one card and insert it into its correct position among the already sorted cards. It builds the sorted array one element at a time.

### How It Works (Step by Step)
1. Start with the second element (first element is considered sorted)
2. Compare it with elements in the sorted portion
3. Shift larger elements to the right
4. Insert the current element in its correct position
5. Repeat for all remaining elements

**Example:**
```
Initial: [64, 34, 25, 12, 22, 11, 90]

Pass 1: [64] is sorted, insert 34
        Compare 34 with 64 → 34 < 64, shift 64 → [34, 64, 25, 12, 22, 11, 90]

Pass 2: [34, 64] is sorted, insert 25
        Compare 25 with 64 → 25 < 64, shift 64
        Compare 25 with 34 → 25 < 34, shift 34 → [25, 34, 64, 12, 22, 11, 90]

Pass 3: [25, 34, 64] is sorted, insert 12
        ... → [12, 25, 34, 64, 22, 11, 90]

And so on...
```

### Python Implementation

```python
def insertion_sort(arr):
    """
    Sort an array using Insertion Sort algorithm.
    
    Args:
        arr: List of comparable elements
    
    Returns:
        Sorted list (in-place modification)
    """
    n = len(arr)  # Get the length of the array
    
    # Start from the second element (index 1)
    # The first element (index 0) is considered already sorted
    for i in range(1, n):
        # Store the current element to be inserted
        key = arr[i]
        
        # Start comparing with the previous element
        j = i - 1
        
        # Move elements of arr[0..i-1] that are greater than key
        # one position ahead of their current position
        # This loop shifts elements to the right to make space for key
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]  # Shift element to the right
            j -= 1  # Move to the previous element
        
        # Insert the key in its correct position
        arr[j + 1] = key
    
    return arr


# Example usage
if __name__ == "__main__":
    # Test with numbers
    numbers = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", numbers)
    insertion_sort(numbers)
    print("Sorted array:", numbers)
    
    # Test with strings
    names = ["banana", "apple", "cherry", "date"]
    print("\nOriginal array:", names)
    insertion_sort(names)
    print("Sorted array:", names)
```

### Java Implementation

```java
public class InsertionSort {
    /**
     * Sort an array using Insertion Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void insertionSort(int[] arr) {
        int n = arr.length;  // Get the length of the array
        
        // Start from the second element (index 1)
        // The first element (index 0) is considered already sorted
        for (int i = 1; i < n; i++) {
            // Store the current element to be inserted
            int key = arr[i];
            
            // Start comparing with the previous element
            int j = i - 1;
            
            // Move elements of arr[0..i-1] that are greater than key
            // one position ahead of their current position
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];  // Shift element to the right
                j--;  // Move to the previous element
            }
            
            // Insert the key in its correct position
            arr[j + 1] = key;
        }
    }
    
    // Generic version for any comparable type
    public static <T extends Comparable<T>> void insertionSortGeneric(T[] arr) {
        int n = arr.length;
        
        for (int i = 1; i < n; i++) {
            T key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j].compareTo(key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            arr[j + 1] = key;
        }
    }
    
    // Helper method to print array
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Test with integers
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        System.out.print("Original array: ");
        printArray(numbers);
        
        insertionSort(numbers);
        System.out.print("Sorted array: ");
        printArray(numbers);
        
        // Test with strings
        String[] names = {"banana", "apple", "cherry", "date"};
        System.out.print("\nOriginal array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
        
        insertionSortGeneric(names);
        System.out.print("Sorted array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
    }
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best case: O(n) - when array is already sorted
  - Average case: O(n²)
  - Worst case: O(n²)
- **Space Complexity**: O(1) - uses constant extra space
- **Stable**: Yes
- **In-place**: Yes

**Why Insertion Sort is Good:**
- Efficient for small datasets
- Efficient for nearly sorted arrays
- Simple to implement
- Adaptive (performs well on partially sorted data)

---

## 4. Merge Sort

### Concept
Merge Sort uses the "divide and conquer" strategy. It divides the array into two halves, sorts each half recursively, and then merges the sorted halves back together.

### How It Works (Step by Step)
1. **Divide**: Split the array into two halves
2. **Conquer**: Recursively sort both halves
3. **Combine**: Merge the two sorted halves into a single sorted array

**Example:**
```
Initial: [38, 27, 43, 3, 9, 82, 10]

Divide:
[38, 27, 43, 3]  [9, 82, 10]

Divide again:
[38, 27] [43, 3]  [9, 82] [10]

Divide until single elements:
[38] [27] [43] [3] [9] [82] [10]

Now merge:
[27, 38] [3, 43]  [9, 82] [10]
[3, 27, 38, 43]  [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

### Python Implementation

```python
def merge_sort(arr):
    """
    Sort an array using Merge Sort algorithm.
    
    Args:
        arr: List of comparable elements
    
    Returns:
        New sorted list (does not modify original)
    """
    # Base case: if array has 0 or 1 element, it's already sorted
    if len(arr) <= 1:
        return arr
    
    # Divide: find the middle point
    mid = len(arr) // 2
    
    # Conquer: recursively sort the two halves
    left_half = merge_sort(arr[:mid])      # Left half: from start to mid
    right_half = merge_sort(arr[mid:])     # Right half: from mid to end
    
    # Combine: merge the sorted halves
    return merge(left_half, right_half)


def merge(left, right):
    """
    Merge two sorted arrays into a single sorted array.
    
    Args:
        left: Sorted left array
        right: Sorted right array
    
    Returns:
        Merged sorted array
    """
    result = []  # Result array to store merged elements
    i = 0        # Index for left array
    j = 0        # Index for right array
    
    # Compare elements from both arrays and add smaller one to result
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements from left array (if any)
    while i < len(left):
        result.append(left[i])
        i += 1
    
    # Add remaining elements from right array (if any)
    while j < len(right):
        result.append(right[j])
        j += 1
    
    return result


# In-place version (modifies original array)
def merge_sort_inplace(arr, left=0, right=None):
    """
    Sort an array using Merge Sort (in-place version).
    
    Args:
        arr: List to be sorted
        left: Starting index (default: 0)
        right: Ending index (default: length of array)
    """
    if right is None:
        right = len(arr) - 1
    
    if left < right:
        # Find the middle point
        mid = (left + right) // 2
        
        # Recursively sort first and second halves
        merge_sort_inplace(arr, left, mid)
        merge_sort_inplace(arr, mid + 1, right)
        
        # Merge the sorted halves
        merge_inplace(arr, left, mid, right)


def merge_inplace(arr, left, mid, right):
    """
    Merge two sorted subarrays arr[left..mid] and arr[mid+1..right].
    """
    # Create temporary arrays for left and right subarrays
    n1 = mid - left + 1
    n2 = right - mid
    
    left_arr = [0] * n1
    right_arr = [0] * n2
    
    # Copy data to temporary arrays
    for i in range(n1):
        left_arr[i] = arr[left + i]
    for j in range(n2):
        right_arr[j] = arr[mid + 1 + j]
    
    # Merge the temporary arrays back into arr[left..right]
    i = 0  # Initial index of left subarray
    j = 0  # Initial index of right subarray
    k = left  # Initial index of merged subarray
    
    while i < n1 and j < n2:
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]
            i += 1
        else:
            arr[k] = right_arr[j]
            j += 1
        k += 1
    
    # Copy remaining elements of left_arr (if any)
    while i < n1:
        arr[k] = left_arr[i]
        i += 1
        k += 1
    
    # Copy remaining elements of right_arr (if any)
    while j < n2:
        arr[k] = right_arr[j]
        j += 1
        k += 1


# Example usage
if __name__ == "__main__":
    # Test with numbers (creates new array)
    numbers = [38, 27, 43, 3, 9, 82, 10]
    print("Original array:", numbers)
    sorted_numbers = merge_sort(numbers)
    print("Sorted array (new):", sorted_numbers)
    print("Original array (unchanged):", numbers)
    
    # Test in-place version
    numbers2 = [38, 27, 43, 3, 9, 82, 10]
    print("\nOriginal array:", numbers2)
    merge_sort_inplace(numbers2)
    print("Sorted array (in-place):", numbers2)
```

### Java Implementation

```java
public class MergeSort {
    /**
     * Sort an array using Merge Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void mergeSort(int[] arr) {
        if (arr.length <= 1) {
            return;  // Base case: array with 0 or 1 element is already sorted
        }
        
        mergeSort(arr, 0, arr.length - 1);
    }
    
    /**
     * Recursive helper method for merge sort.
     * 
     * @param arr Array to be sorted
     * @param left Starting index
     * @param right Ending index
     */
    private static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            // Find the middle point
            int mid = left + (right - left) / 2;
            
            // Recursively sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            
            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }
    
    /**
     * Merge two sorted subarrays arr[left..mid] and arr[mid+1..right].
     * 
     * @param arr Array containing the subarrays
     * @param left Starting index of first subarray
     * @param mid Ending index of first subarray
     * @param right Ending index of second subarray
     */
    private static void merge(int[] arr, int left, int mid, int right) {
        // Find sizes of two subarrays to be merged
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        // Create temporary arrays
        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];
        
        // Copy data to temporary arrays
        for (int i = 0; i < n1; i++) {
            leftArr[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            rightArr[j] = arr[mid + 1 + j];
        }
        
        // Merge the temporary arrays back into arr[left..right]
        int i = 0;  // Initial index of left subarray
        int j = 0;  // Initial index of right subarray
        int k = left;  // Initial index of merged subarray
        
        while (i < n1 && j < n2) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements of leftArr (if any)
        while (i < n1) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        // Copy remaining elements of rightArr (if any)
        while (j < n2) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
    
    // Generic version for any comparable type
    public static <T extends Comparable<T>> void mergeSortGeneric(T[] arr) {
        if (arr.length <= 1) {
            return;
        }
        mergeSortGeneric(arr, 0, arr.length - 1);
    }
    
    private static <T extends Comparable<T>> void mergeSortGeneric(
            T[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSortGeneric(arr, left, mid);
            mergeSortGeneric(arr, mid + 1, right);
            mergeGeneric(arr, left, mid, right);
        }
    }
    
    private static <T extends Comparable<T>> void mergeGeneric(
            T[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        @SuppressWarnings("unchecked")
        T[] leftArr = (T[]) new Comparable[n1];
        T[] rightArr = (T[]) new Comparable[n2];
        
        for (int i = 0; i < n1; i++) {
            leftArr[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            rightArr[j] = arr[mid + 1 + j];
        }
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (leftArr[i].compareTo(rightArr[j]) <= 0) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
    
    // Helper method to print array
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Test with integers
        int[] numbers = {38, 27, 43, 3, 9, 82, 10};
        System.out.print("Original array: ");
        printArray(numbers);
        
        mergeSort(numbers);
        System.out.print("Sorted array: ");
        printArray(numbers);
        
        // Test with strings
        String[] names = {"banana", "apple", "cherry", "date"};
        System.out.print("\nOriginal array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
        
        mergeSortGeneric(names);
        System.out.print("Sorted array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
    }
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best case: O(n log n)
  - Average case: O(n log n)
  - Worst case: O(n log n)
- **Space Complexity**: O(n) - requires additional space for temporary arrays
- **Stable**: Yes
- **In-place**: No (can be made in-place but with performance trade-off)

**Why Merge Sort is Good:**
- Consistent O(n log n) performance
- Stable sort
- Good for large datasets
- Predictable performance

---

## 5. Quick Sort

### Concept
Quick Sort also uses "divide and conquer". It picks a "pivot" element and partitions the array so that all elements smaller than the pivot are on the left, and all elements greater are on the right. Then it recursively sorts the sub-arrays.

### How It Works (Step by Step)
1. **Choose Pivot**: Select an element as pivot (commonly last or first element)
2. **Partition**: Rearrange array so elements < pivot are left, > pivot are right
3. **Recurse**: Recursively sort the left and right sub-arrays

**Example:**
```
Initial: [10, 7, 8, 9, 1, 5]

Choose pivot = 5 (last element)
Partition:
- Elements < 5: [1]
- Pivot: [5]
- Elements > 5: [10, 7, 8, 9]
Result: [1, 5, 10, 7, 8, 9]

Now sort left [1] and right [10, 7, 8, 9]
Right side: pivot = 9
- < 9: [7, 8]
- Pivot: [9]
- > 9: [10]
Result: [7, 8, 9, 10]

Final: [1, 5, 7, 8, 9, 10]
```

### Python Implementation

```python
def quick_sort(arr, low=0, high=None):
    """
    Sort an array using Quick Sort algorithm.
    
    Args:
        arr: List to be sorted (modified in-place)
        low: Starting index (default: 0)
        high: Ending index (default: length - 1)
    """
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array and get the pivot index
        # After partitioning, pivot is in its correct position
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)   # Sort left subarray
        quick_sort(arr, pivot_index + 1, high)  # Sort right subarray


def partition(arr, low, high):
    """
    Partition the array around a pivot element.
    Elements smaller than pivot go to the left,
    elements greater go to the right.
    
    Args:
        arr: Array to partition
        low: Starting index
        high: Ending index
    
    Returns:
        Index of the pivot after partitioning
    """
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element (indicates right position of pivot)
    i = low - 1
    
    # Traverse through all elements
    # Compare each element with pivot
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            # Increment index of smaller element
            i += 1
            # Swap current element with element at index i
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    # (swap pivot with element at index i+1)
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    # Return the position of pivot
    return i + 1


# Alternative: Simple version that creates new arrays (easier to understand)
def quick_sort_simple(arr):
    """
    Simple version of Quick Sort that creates new arrays.
    Easier to understand but uses more memory.
    
    Args:
        arr: List to be sorted
    
    Returns:
        New sorted list
    """
    # Base case: arrays with 0 or 1 element are already sorted
    if len(arr) <= 1:
        return arr
    
    # Choose pivot (middle element)
    pivot = arr[len(arr) // 2]
    
    # Partition into three lists
    less = [x for x in arr if x < pivot]      # Elements less than pivot
    equal = [x for x in arr if x == pivot]    # Elements equal to pivot
    greater = [x for x in arr if x > pivot]    # Elements greater than pivot
    
    # Recursively sort and combine
    return quick_sort_simple(less) + equal + quick_sort_simple(greater)


# Example usage
if __name__ == "__main__":
    # Test with numbers (in-place version)
    numbers = [10, 7, 8, 9, 1, 5]
    print("Original array:", numbers)
    quick_sort(numbers)
    print("Sorted array (in-place):", numbers)
    
    # Test simple version
    numbers2 = [10, 7, 8, 9, 1, 5]
    print("\nOriginal array:", numbers2)
    sorted_numbers = quick_sort_simple(numbers2)
    print("Sorted array (simple):", sorted_numbers)
    
    # Test with strings
    names = ["banana", "apple", "cherry", "date"]
    print("\nOriginal array:", names)
    quick_sort(names)
    print("Sorted array:", names)
```

### Java Implementation

```java
public class QuickSort {
    /**
     * Sort an array using Quick Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void quickSort(int[] arr) {
        if (arr.length <= 1) {
            return;  // Base case: array with 0 or 1 element is already sorted
        }
        quickSort(arr, 0, arr.length - 1);
    }
    
    /**
     * Recursive helper method for quick sort.
     * 
     * @param arr Array to be sorted
     * @param low Starting index
     * @param high Ending index
     */
    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // Partition the array and get the pivot index
            int pivotIndex = partition(arr, low, high);
            
            // Recursively sort elements before and after partition
            quickSort(arr, low, pivotIndex - 1);   // Sort left subarray
            quickSort(arr, pivotIndex + 1, high);  // Sort right subarray
        }
    }
    
    /**
     * Partition the array around a pivot element.
     * 
     * @param arr Array to partition
     * @param low Starting index
     * @param high Ending index
     * @return Index of the pivot after partitioning
     */
    private static int partition(int[] arr, int low, int high) {
        // Choose the rightmost element as pivot
        int pivot = arr[high];
        
        // Index of smaller element (indicates right position of pivot)
        int i = low - 1;
        
        // Traverse through all elements
        for (int j = low; j < high; j++) {
            // If current element is smaller than or equal to pivot
            if (arr[j] <= pivot) {
                // Increment index of smaller element
                i++;
                // Swap current element with element at index i
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        // Place pivot in its correct position
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        // Return the position of pivot
        return i + 1;
    }
    
    // Generic version for any comparable type
    public static <T extends Comparable<T>> void quickSortGeneric(T[] arr) {
        if (arr.length <= 1) {
            return;
        }
        quickSortGeneric(arr, 0, arr.length - 1);
    }
    
    private static <T extends Comparable<T>> void quickSortGeneric(
            T[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partitionGeneric(arr, low, high);
            quickSortGeneric(arr, low, pivotIndex - 1);
            quickSortGeneric(arr, pivotIndex + 1, high);
        }
    }
    
    private static <T extends Comparable<T>> int partitionGeneric(
            T[] arr, int low, int high) {
        T pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j].compareTo(pivot) <= 0) {
                i++;
                T temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        T temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
    
    // Helper method to print array
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Test with integers
        int[] numbers = {10, 7, 8, 9, 1, 5};
        System.out.print("Original array: ");
        printArray(numbers);
        
        quickSort(numbers);
        System.out.print("Sorted array: ");
        printArray(numbers);
        
        // Test with strings
        String[] names = {"banana", "apple", "cherry", "date"};
        System.out.print("\nOriginal array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
        
        quickSortGeneric(names);
        System.out.print("Sorted array: ");
        for (String name : names) {
            System.out.print(name + " ");
        }
        System.out.println();
    }
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best case: O(n log n)
  - Average case: O(n log n)
  - Worst case: O(n²) - when pivot is always smallest or largest
- **Space Complexity**: O(log n) - for recursion stack
- **Stable**: No (can be made stable with extra space)
- **In-place**: Yes

**Why Quick Sort is Good:**
- Very fast in practice (often faster than Merge Sort)
- In-place sorting
- Cache-friendly
- Good average-case performance

**Pivot Selection Strategies:**
- Last element (simple, shown above)
- First element
- Middle element
- Random element (reduces worst-case probability)
- Median of three (first, middle, last)

---

## Comparison Summary

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable | In-place |
|-----------|-----------|--------------|------------|-------|--------|----------|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes | Yes |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | No | Yes |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | Yes | Yes |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | No |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Yes |

### When to Use Which?

1. **Bubble Sort**: 
   - Educational purposes only
   - Very small datasets (< 10 elements)
   - Already nearly sorted data

2. **Selection Sort**: 
   - Small datasets
   - When memory writes are expensive
   - Simple implementation needed

3. **Insertion Sort**: 
   - Small datasets (< 50 elements)
   - Nearly sorted data
   - Part of more complex algorithms (like Timsort)

4. **Merge Sort**: 
   - Large datasets
   - When stability is important
   - When worst-case O(n log n) is required
   - External sorting (sorting data that doesn't fit in memory)

5. **Quick Sort**: 
   - General-purpose sorting
   - Large datasets
   - When average performance matters more than worst-case
   - Most common choice in practice

---

## Practice Exercises

1. **Implement all algorithms** and test with different inputs
2. **Count comparisons** - modify each algorithm to count how many comparisons it makes
3. **Visualize** - add print statements to see how arrays change during sorting
4. **Time them** - measure execution time for different array sizes
5. **Test edge cases**:
   - Empty array
   - Single element
   - Already sorted array
   - Reverse sorted array
   - Array with duplicates
   - Array with all same elements

---

## Key Takeaways

1. **Simple algorithms** (Bubble, Selection, Insertion) are O(n²) but easy to understand
2. **Efficient algorithms** (Merge, Quick) are O(n log n) but more complex
3. **No single algorithm is best** for all situations
4. **Practice** implementing these to understand how they work
5. **Understanding time complexity** helps choose the right algorithm

---

## Additional Resources

- Visualize sorting: https://visualgo.net/en/sorting
- Practice problems: LeetCode, HackerRank
- Learn more: "Introduction to Algorithms" by Cormen et al.

---

**Happy Learning! 🚀**

