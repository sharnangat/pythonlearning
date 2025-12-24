/**
 * Sorting Algorithms in Java
 * Complete implementations with detailed comments for beginners
 */
public class SortingAlgorithms {
    
    // ==================== BUBBLE SORT ====================
    
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
    
    // ==================== SELECTION SORT ====================
    
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
            int temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    
    // ==================== INSERTION SORT ====================
    
    /**
     * Sort an array using Insertion Sort algorithm.
     * 
     * @param arr Array to be sorted (modified in-place)
     */
    public static void insertionSort(int[] arr) {
        int n = arr.length;  // Get the length of the array
        
        // Start from the second element (index 1)
        for (int i = 1; i < n; i++) {
            // Store the current element to be inserted
            int key = arr[i];
            
            // Start comparing with the previous element
            int j = i - 1;
            
            // Move elements that are greater than key one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];  // Shift element to the right
                j--;  // Move to the previous element
            }
            
            // Insert the key in its correct position
            arr[j + 1] = key;
        }
    }
    
    // ==================== MERGE SORT ====================
    
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
    
    // ==================== QUICK SORT ====================
    
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
        
        // Index of smaller element
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
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Helper method to print array.
     * 
     * @param arr Array to print
     */
    public static void printArray(int[] arr) {
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    /**
     * Helper method to create a copy of an array.
     * 
     * @param arr Original array
     * @return Copy of the array
     */
    public static int[] copyArray(int[] arr) {
        int[] copy = new int[arr.length];
        System.arraycopy(arr, 0, copy, 0, arr.length);
        return copy;
    }
    
    // ==================== MAIN METHOD FOR TESTING ====================
    
    public static void main(String[] args) {
        System.out.println("Sorting Algorithms Test Suite");
        System.out.println("============================================================");
        
        // Test cases
        int[][] testCases = {
            {64, 34, 25, 12, 22, 11, 90},
            {5, 2, 8, 1, 9},
            {1},
            {},
            {3, 3, 3, 3},
            {9, 8, 7, 6, 5, 4, 3, 2, 1}
        };
        
        // Test all algorithms
        for (int i = 0; i < testCases.length; i++) {
            if (testCases[i].length == 0) {
                System.out.println("\nTest Case " + (i + 1) + ": [] (empty array)");
                continue;
            }
            
            System.out.println("\n============================================================");
            System.out.println("Test Case " + (i + 1) + ":");
            printArray(testCases[i]);
            System.out.println("============================================================");
            
            // Bubble Sort
            int[] arr1 = copyArray(testCases[i]);
            bubbleSort(arr1);
            System.out.print("Bubble Sort:    ");
            printArray(arr1);
            
            // Selection Sort
            int[] arr2 = copyArray(testCases[i]);
            selectionSort(arr2);
            System.out.print("Selection Sort: ");
            printArray(arr2);
            
            // Insertion Sort
            int[] arr3 = copyArray(testCases[i]);
            insertionSort(arr3);
            System.out.print("Insertion Sort: ");
            printArray(arr3);
            
            // Merge Sort
            int[] arr4 = copyArray(testCases[i]);
            mergeSort(arr4);
            System.out.print("Merge Sort:     ");
            printArray(arr4);
            
            // Quick Sort
            int[] arr5 = copyArray(testCases[i]);
            quickSort(arr5);
            System.out.print("Quick Sort:     ");
            printArray(arr5);
        }
        
        // Individual examples
        System.out.println("\n\n============================================================");
        System.out.println("Individual Algorithm Examples");
        System.out.println("=".repeat(60));
        
        // Example 1: Bubble Sort
        int[] numbers1 = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("\nBubble Sort:");
        System.out.print("Original: ");
        printArray(numbers1);
        bubbleSort(numbers1);
        System.out.print("Sorted:   ");
        printArray(numbers1);
        
        // Example 2: Selection Sort
        int[] numbers2 = {64, 25, 12, 22, 11};
        System.out.println("\nSelection Sort:");
        System.out.print("Original: ");
        printArray(numbers2);
        selectionSort(numbers2);
        System.out.print("Sorted:   ");
        printArray(numbers2);
        
        // Example 3: Insertion Sort
        int[] numbers3 = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("\nInsertion Sort:");
        System.out.print("Original: ");
        printArray(numbers3);
        insertionSort(numbers3);
        System.out.print("Sorted:   ");
        printArray(numbers3);
        
        // Example 4: Merge Sort
        int[] numbers4 = {38, 27, 43, 3, 9, 82, 10};
        System.out.println("\nMerge Sort:");
        System.out.print("Original: ");
        printArray(numbers4);
        mergeSort(numbers4);
        System.out.print("Sorted:   ");
        printArray(numbers4);
        
        // Example 5: Quick Sort
        int[] numbers5 = {10, 7, 8, 9, 1, 5};
        System.out.println("\nQuick Sort:");
        System.out.print("Original: ");
        printArray(numbers5);
        quickSort(numbers5);
        System.out.print("Sorted:   ");
        printArray(numbers5);
    }
}

