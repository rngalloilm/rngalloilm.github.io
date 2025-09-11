package edu.ncsu.csc216.wolf_tickets.model.util;

/**
 * The SwapList class implements the ISwapList interface
 * 
 * @author Nick Gallo
 *
 * @param <E> type for the SwapList
 */
public class SwapList<E> implements ISwapList<E> {

	/** Initial capacity of the SortedList */
	private static final int INITIAL_CAPACITY = 10;
	/** Array with the list */
	private E[] list;
	/** Size of the list */
	private int size;
	/** Capacity of the list */
	private int capacity;
	
	/**
	 * SwapList constructor
	 */
	public SwapList() {
		this.capacity = INITIAL_CAPACITY;
		
		this.list = (E[]) new Object[INITIAL_CAPACITY];
	    this.size = 0;
	}
	
	/**
	 * Adds the element to the end of the list
	 * @param element element to add
	 * @throws NullPointerException if element is null
	 */
	@Override
	public void add(E element) {
		// Check for range
		if (element == null) {
			throw new NullPointerException("Cannot add null element.");
		}
		
		// Check if the list is full and increase the size of the list if necessary
	    if (size == list.length) {
	    	capacity += 10;
	        E[] temp = (E[]) new Object[capacity];
	        
	        for (int i = 0; i < list.length; i++) {
	            temp[i] = list[i];
	        }
	        
	        list = temp;
	    }
	    
	    // Add the element to the end of the list and increment the size
	    list[size++] = element;
	}
	
	/**
	 * Gets the capacity of the list
	 * @return the capacity of the list
	 */
	public int capacity() {
		return capacity;
	}
	
	/**
	 * Returns the element from the given index.  The element is
	 * removed from the list.
	 * @param idx index to remove element from
	 * @return element at given index
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public E remove(int idx) {
		// Check the index
	    checkIndex(idx);
	    
	    // Store the element to be removed
	    E removed = list[idx];
	    
	    // Shift all subsequent elements one position to the left
	    for (int i = idx; i < size - 1; i++) {
	        list[i] = list[i + 1];
	    }
	    
	    // Set the last element to null and decrement the size
	    list[size - 1] = null;
	    size--;
	    
	    return removed;
	}
	
	/**
	 * Check if the index parameter is out of bounds
	 * @param idx index to be checked
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 *         for the list
	 */
	private void checkIndex(int idx) {
	    if (idx < 0 || idx >= size) {
	        throw new IndexOutOfBoundsException("Invalid index.");
	    }
	}
	
	/**
	 * Moves the element at the given index to index-1.  If the element is
	 * already at the front of the list, the list is not changed.
	 * @param idx index of element to move up
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public void moveUp(int idx) {
		// Check the index
	    checkIndex(idx);
	    
	    // If the element is already at the front of the list, do nothing
	    if (idx == 0) {
	        return;
	    }
	    
	    // Swap the element at idx with the element at idx - 1
	    E temp = list[idx];
	    list[idx] = list[idx - 1];
	    list[idx - 1] = temp;
	}
	
	/**
	 * Moves the element at the given index to index+1.  If the element is
	 * already at the end of the list, the list is not changed.
	 * @param idx index of element to move down
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public void moveDown(int idx) {
		// Check the index
	    checkIndex(idx);

	    // If the element is already at the end of the list, do nothing
	    if (idx == size - 1) {
	        return;
	    }

	    // Swap the element at idx with the element at idx + 1
	    E temp = list[idx];
	    list[idx] = list[idx + 1];
	    list[idx + 1] = temp;
	}
	
	/**
	 * Moves the element at the given index to index 0.  If the element is
	 * already at the front of the list, the list is not changed.
	 * @param idx index of element to move to the front
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public void moveToFront(int idx) {
		// Check the index
	    checkIndex(idx);

	    // If the element is already at the front of the list, do nothing
	    if (idx == 0) {
	        return;
	    }

	    // Move the element to the front of the list
	    E temp = list[idx];
	    
	    for (int i = idx; i > 0; i--) {
	        list[i] = list[i - 1];
	    }
	    
	    list[0] = temp;
	}
	
	/**
	 * Moves the element at the given index to size-1.  If the element is
	 * already at the end of the list, the list is not changed.
	 * @param idx index of element to move to the back
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public void moveToBack(int idx) {
		// Check the index
	    checkIndex(idx);

	    // If the element is already at the back of the list, do nothing
	    if (idx == size - 1) {
	        return;
	    }

	    // Swap the element at idx with the subsequent elements until it reaches the end
	    for (int i = idx; i < size - 1; i++) {
	        E temp = list[i];
	        list[i] = list[i + 1];
	        list[i + 1] = temp;
	    }
	}
	
	/**
	 * Returns the element at the given index.
	 * @param idx index of the element to retrieve
	 * @return element at the given index
	 * @throws IndexOutOfBoundsException if the idx is out of bounds
	 * 		for the list
	 */
	@Override
	public E get(int idx) {
		// Check the index
	    checkIndex(idx);
	    
	    // Return the element at the given index
	    return list[idx];
	}
	
	/**
	 * Returns the number of elements in the list.
	 * @return number of elements in the list
	 */
	@Override
	public int size() {
		return size;
	}

	/**
	 * Returns if the list is empty.
	 * @return if the list is empty
	 */
	@Override
	public boolean isEmpty() {
		 return size == 0;
	}
}
