package edu.ncsu.csc316.dsa.sorter;

import edu.ncsu.csc316.dsa.data.Identifiable;

/**
 * RadixSorter uses the radix sort algorithm to sort data.
 * @param <E> the generic type of data to sort.
 */
public class RadixSorter<E extends Identifiable> implements Sorter<E> {
    
    @Override
    public void sort(E[] array) {
        // Find the maximum number to know the number of digits.
        int max = getMax(array);
        
        // Determine how many digits are in the largest value.
        int x = (int) Math.ceil(Math.log10(max + 1));

        // Perform counting sort for each digit.
        int p = 1;
        
        for (int j = 1; j <= x; j++) {
            countSort(array, p);
            // Increase the place value.
            p *= 10;
        }
    }
    
    private int getMax(E[] array) {
        int max = array[0].getId();
        
        for (E element : array) {
            if (element.getId() > max) {
                max = element.getId();
            }
        }
        
        return max;
    }
    
    private void countSort(E[] array, int exponent) {
        // Initialize count array.
        int[] count = new int[10];
        for (E element : array) {
            count[(element.getId() / exponent) % 10]++;
        }
        
        // Change count[i] so that count[i] now contains the actual position.
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Build the output array.
        E[] output = array.clone();
        
        for (int i = array.length - 1; i >= 0; i--) {
            int index = (array[i].getId() / exponent) % 10;
            output[count[index] - 1] = array[i];
            
            count[index]--;
        }
        
        // Copy the output array to the original array.
        for (int i = 0; i < array.length; i++) {
            array[i] = output[i];
        }
    }
}