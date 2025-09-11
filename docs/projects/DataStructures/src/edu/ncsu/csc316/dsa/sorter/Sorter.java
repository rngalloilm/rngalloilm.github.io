package edu.ncsu.csc316.dsa.sorter;

/**
 * Interface that defines the sorting behavior.
 * @author Dr. King
 * @author Nick Gallo
 */
public interface Sorter<E> {
    
	/**
	 * Provides the sorting functionality of a specific sorting method.
	 * Code used for this method is based on the sorting algorithms outlined in chapter 3 
	 * of the course textbook, "Data Structures and Algorithms" by Goodrich, Tamassia, Goldwasser.
	 * @param data Integer array for input.
	 */
	void sort(E[] data);
}
