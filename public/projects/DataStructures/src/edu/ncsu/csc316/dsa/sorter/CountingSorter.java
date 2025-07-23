package edu.ncsu.csc316.dsa.sorter;

import edu.ncsu.csc316.dsa.data.Identifiable;

/**
 * CountingSorter uses the counting sort algorithm to sort data
 * @author Dr. King
 *
 * @param <E> the generic type of data to sort
 */
public class CountingSorter<E extends Identifiable> implements Sorter<E> {
    
    @Override
    public void sort(E[] data) {
        // Find the maximum ID to determine the range of the count array.
        int maxId = findMaxId(data);

        // Create the count array and the array for the sorted elements.
        int[] count = new int[maxId + 1];
        
        @SuppressWarnings("unchecked")
        E[] sorted = (E[]) new Identifiable[data.length];

        // Count the occurrences of each ID.
        for (E element : data) {
            count[element.getId()]++;
        }

        // Accumulate the counts.
        for (int i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        // Sort the elements.
        for (int i = data.length - 1; i >= 0; i--) {
            sorted[count[data[i].getId()] - 1] = data[i];
            count[data[i].getId()]--;
        }

        // Copy back to the original array.
        System.arraycopy(sorted, 0, data, 0, data.length);
    }

    private int findMaxId(E[] data) {
        int maxId = 0;
        
        for (E element : data) {
            if (element.getId() > maxId) {
                maxId = element.getId();
            }
        }
        
        return maxId;
    }
}   