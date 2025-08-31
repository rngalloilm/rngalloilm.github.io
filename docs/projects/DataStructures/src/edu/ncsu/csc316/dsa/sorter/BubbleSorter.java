package edu.ncsu.csc316.dsa.sorter;

import java.util.Comparator;

/**
 * The BubbleSorter class extends the AbstractComparisonSorter to implement
 * the bubble sort algorithm. This sorter can sort any type of elements (E)
 * that are comparable, based on the comparator provided.
 * 
 * @param <E> the type of elements to be sorted, which must be comparable.
 */
public class BubbleSorter<E extends Comparable<E>> extends AbstractComparisonSorter<E> {

    /**
     * Constructs a new BubbleSorter with the specified comparator.
     * 
     * @param comparator the Comparator to be used for comparing elements.
     */
    public BubbleSorter(Comparator<E> comparator) {
        // Calls the parent class constructor with the comparator.
        super(comparator);
    }
    
    public BubbleSorter() {
        // Calls the parent class constructor with the comparator.
        super(null);
    }

    /**
     * Sorts the provided array using the bubble sort algorithm.
     * 
     * @param data the array of elements to be sorted.
     */
    @Override
    public void sort(E[] data) {
        // A flag to keep track of whether any swaps have occurred.
        boolean swapped = true;
        // The number of elements in the array.
        int n = data.length;
        
        // Continue looping until no swaps occur.
        while (swapped) {
            swapped = false;
            
            // Iterate over the array, excluding the last sorted elements.
            for (int i = 1; i < n; i++) {
                // If the current element is less than the previous, swap them.
                if (compare(data[i], data[i - 1]) < 0) {
                    // Swap data[i] and data[i - 1].
                    E temp = data[i - 1];
                    
                    // Move the current element to the previous position.
                    data[i - 1] = data[i];
                    // Move the previous element to the current position.
                    data[i] = temp;
                    
                    // Set the flag to true, as a swap occurred.
                    swapped = true;
                }
            }
        }
    }
}
