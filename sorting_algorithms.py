"""
Sorting Algorithms in Python
Complete implementations with detailed comments for beginners
"""


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
    for i in range(n):
        # Flag to optimize: if no swaps occur, array is sorted
        swapped = False
        
        # Inner loop: compare adjacent elements
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
    for i in range(n):
        # Assume the current position has the minimum element
        min_index = i
        
        # Inner loop: find the minimum element in remaining unsorted array
        for j in range(i + 1, n):
            # If we find an element smaller than current minimum
            if arr[j] < arr[min_index]:
                # Update the index of minimum element
                min_index = j
        
        # Swap the found minimum element with the first element
        arr[i], arr[min_index] = arr[min_index], arr[i]
    
    return arr


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
    for i in range(1, n):
        # Store the current element to be inserted
        key = arr[i]
        
        # Start comparing with the previous element
        j = i - 1
        
        # Move elements that are greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]  # Shift element to the right
            j -= 1  # Move to the previous element
        
        # Insert the key in its correct position
        arr[j + 1] = key
    
    return arr


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
    left_half = merge_sort(arr[:mid])      # Left half
    right_half = merge_sort(arr[mid:])     # Right half
    
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
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)   # Sort left subarray
        quick_sort(arr, pivot_index + 1, high)  # Sort right subarray


def partition(arr, low, high):
    """
    Partition the array around a pivot element.
    
    Args:
        arr: Array to partition
        low: Starting index
        high: Ending index
    
    Returns:
        Index of the pivot after partitioning
    """
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element
    i = low - 1
    
    # Traverse through all elements
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            # Increment index of smaller element
            i += 1
            # Swap current element with element at index i
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    
    # Return the position of pivot
    return i + 1


# Simple version of Quick Sort (easier to understand)
def quick_sort_simple(arr):
    """
    Simple version of Quick Sort that creates new arrays.
    Easier to understand but uses more memory.
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


# Test function
def test_all_algorithms():
    """Test all sorting algorithms with sample data."""
    
    test_cases = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 8, 1, 9],
        [1],
        [],
        [3, 3, 3, 3],
        [9, 8, 7, 6, 5, 4, 3, 2, 1],  # Reverse sorted
    ]
    
    algorithms = {
        "Bubble Sort": bubble_sort,
        "Selection Sort": selection_sort,
        "Insertion Sort": insertion_sort,
        "Merge Sort": merge_sort,
        "Quick Sort": quick_sort,
    }
    
    for i, test_arr in enumerate(test_cases, 1):
        print(f"\n{'='*60}")
        print(f"Test Case {i}: {test_arr}")
        print('='*60)
        
        for name, func in algorithms.items():
            # Create a copy for testing (except merge_sort which returns new array)
            if name == "Merge Sort":
                result = func(test_arr.copy())
                print(f"{name:20s}: {result}")
            elif name == "Quick Sort":
                arr_copy = test_arr.copy()
                func(arr_copy)
                print(f"{name:20s}: {arr_copy}")
            else:
                arr_copy = test_arr.copy()
                func(arr_copy)
                print(f"{name:20s}: {arr_copy}")


if __name__ == "__main__":
    print("Sorting Algorithms Test Suite")
    print("="*60)
    test_all_algorithms()
    
    print("\n\n" + "="*60)
    print("Individual Algorithm Examples")
    print("="*60)
    
    # Example 1: Bubble Sort
    numbers1 = [64, 34, 25, 12, 22, 11, 90]
    print(f"\nBubble Sort:")
    print(f"Original: {numbers1}")
    bubble_sort(numbers1)
    print(f"Sorted:   {numbers1}")
    
    # Example 2: Selection Sort
    numbers2 = [64, 25, 12, 22, 11]
    print(f"\nSelection Sort:")
    print(f"Original: {numbers2}")
    selection_sort(numbers2)
    print(f"Sorted:   {numbers2}")
    
    # Example 3: Insertion Sort
    numbers3 = [64, 34, 25, 12, 22, 11, 90]
    print(f"\nInsertion Sort:")
    print(f"Original: {numbers3}")
    insertion_sort(numbers3)
    print(f"Sorted:   {numbers3}")
    
    # Example 4: Merge Sort
    numbers4 = [38, 27, 43, 3, 9, 82, 10]
    print(f"\nMerge Sort:")
    print(f"Original: {numbers4}")
    sorted4 = merge_sort(numbers4)
    print(f"Sorted:   {sorted4}")
    print(f"Original unchanged: {numbers4}")
    
    # Example 5: Quick Sort
    numbers5 = [10, 7, 8, 9, 1, 5]
    print(f"\nQuick Sort:")
    print(f"Original: {numbers5}")
    quick_sort(numbers5)
    print(f"Sorted:   {numbers5}")
    
    # Example 6: Quick Sort Simple
    numbers6 = [10, 7, 8, 9, 1, 5]
    print(f"\nQuick Sort (Simple):")
    print(f"Original: {numbers6}")
    sorted6 = quick_sort_simple(numbers6)
    print(f"Sorted:   {sorted6}")

