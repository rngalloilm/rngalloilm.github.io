package edu.ncsu.csc316.dsa.sorter;

import java.util.Comparator;

/**
 * InsertionSorter uses the insertion sort algorithm to sort data.
 * @author Dr. King
 * @author Nick Gallo
 * 
 * @param <E> the generic type of data to sort.
 */
public class InsertionSorter<E extends Comparable<E>> extends AbstractComparisonSorter<E> {
    
    /**
     * Pass the comparator to the superclass constructor.
     * @param comparator
     */
    public InsertionSorter(Comparator<E> comparator) {
        super(comparator);
    }
    
    /**
     * Pass null to use the default NaturalOrder comparator from the superclass.
     */
    public InsertionSorter() {
        super(null);
    }
    
    public void sort(E[] data) {
	    int len = data.length;
	    
	    // Begin with idx 1.
	    for (int i = 1; i < len; i++) {
	        // Grab the current idx.
	        E current = data[i];
	        // Use temp to iterate backwards through data[].
	        int temp = i;
	        
	        // Slide current back until correct idx is found.
	        while (temp > 0 && compare(data[temp - 1], current) > 0) {
	            data[temp] = data[temp - 1];
	            temp--;
	        }
	        data[temp] = current;
	    }
    }
}
