package edu.ncsu.csc316.dsa.sorter;

import java.util.Comparator;

/**
 * MergeSorter sorts arrays of comparable elements using the merge sort
 * algorithm. This implementation ensures O(nlogn) worst-case runtime to sort an
 * array of n elements that are comparable.
 * 
 * @author Dr. King
 *
 * @param <E> the type of elements to sort; elements must be {@link Comparable}
 */
public class MergeSorter<E extends Comparable<E>> extends AbstractComparisonSorter<E>{

    /**
     * Constructs a new MergeSorter with a specified custom Comparator
     * 
     * @param comparator a custom Comparator to use when sorting
     */
    public MergeSorter(Comparator<E> comparator) {
        super(comparator);
    }

    /**
     * Constructs a new MergeSorter with comparisons based on the element's natural
     * ordering
     */ 
    public MergeSorter() {
        this(null);
    }
    
    @Override
    public void sort(E[] data) {
        if (data == null || data.length < 2) {
            return;
        }
        mergeSort(data);
    }

    /**
     * The mergeSort method implements the merge sort algorithm recursively.
     * It splits the array into two halves, sorts each half, and then merges them.
     * 
     * @param data the array to be sorted
     */
    private void mergeSort(E[] data) {
        int n = data.length;
        
        if (n < 2) {
            return;
        }
        
        int mid = n / 2;
        E[] left = (E[]) new Comparable[mid];
        E[] right = (E[]) new Comparable[n - mid];

        System.arraycopy(data, 0, left, 0, mid);
        System.arraycopy(data, mid, right, 0, n - mid);

        mergeSort(left);
        mergeSort(right);

        merge(left, right, data);
    }

    /**
     * The merge method combines two sorted sub-arrays into a single sorted array.
     * It iterates through both arrays, comparing elements and placing them into
     * the correct position in the merged array.
     * 
     * @param left the first sorted sub-array
     * @param right the second sorted sub-array
     * @param data the array that will contain the merged and sorted elements
     */
    private void merge(E[] left, E[] right, E[] data) {
        int leftIndex = 0;
        int rightIndex = 0;
        int n = data.length;

        while (leftIndex + rightIndex < n) {
            if (rightIndex == right.length || (leftIndex < left.length && compare(left[leftIndex], right[rightIndex]) < 0)) {
                data[leftIndex + rightIndex] = left[leftIndex];
                
                leftIndex++;
            } 
            else {
                data[leftIndex + rightIndex] = right[rightIndex];
                
                rightIndex++;
            }
        }
    }
}
