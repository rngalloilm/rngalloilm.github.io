package edu.ncsu.csc316.dsa.sorter;

import java.util.Comparator;

/**
 * SelectionSorter uses the selection sort algorithm to sort data.
 * @author Dr. King
 * @author Nick Gallo
 *
 * @param <E> the generic type of data to sort.
 */
public class SelectionSorter<E extends Comparable<E>> extends AbstractComparisonSorter<E> {
    
    public SelectionSorter(Comparator<E> comparator) {
        super(comparator);
    }
    
    public SelectionSorter() {
        super(null);
    }

    public void sort(E[] data) {
        // Get the length of the array to be sorted.
        int n = data.length;
        
        // Start iterating over the array. This loop represents the sorted-unsorted boundary.
        // 'i' marks the start of the unsorted section of the array.
        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in the unsorted part of the array.
            int min = i;
            
            // Iterate over the unsorted part of the array starting from the element next to 'i'.
            for (int j = i + 1; j < n; j++) {
                // If the current element data[j] is less than the current minimum data[min],
                // update min to the index of this new minimum element.
                if (compare(data[j], data[min]) < 0) {
                    min = j;
                }
            }

            // Swap the found minimum element with the first element of the unsorted section.
            // This grows the sorted section of the array by one.
            // Only swap if the minimum element is not already in the correct position.
            if (i != min) {
                // Temporarily store the element at 'i'.
                E temp = data[i];
                // Move the minimum element to the start of the unsorted section.
                data[i] = data[min];
                // Move the element originally at 'i' to the position of the minimum.
                data[min] = temp;
            }
        }
    }
}