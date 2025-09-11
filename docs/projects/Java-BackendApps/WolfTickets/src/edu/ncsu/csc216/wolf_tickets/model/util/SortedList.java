package edu.ncsu.csc216.wolf_tickets.model.util;

/**
 * The SortedList
 * 
 * @author Nick Gallo
 *
 * @param <E> Generic object
 */
public class SortedList<E extends Comparable<E>> implements ISortedList<E> {

	/** Initial size of the SortedList */
	private int size;
	/** First node in the SortedList */
	private ListNode front;
	
	/**
	 * SortedList constructor 
	 */
	public SortedList() {
		this.size = 0;
	    this.front = null;
	}
	
	/**
	 * Adds the element to the list in sorted order. 
	 * @param element element to add
	 * @throws NullPointerException if element is null
	 * @throws IllegalArgumentException if element cannot be added 
	 */
	@Override
	public void add(E element) {
		// Check if the new data is null
		if (element == null) {
	        throw new NullPointerException("Cannot add null element.");
	    }

		// Create the new node
	    ListNode newNode = new ListNode(element, null);

	    // Check if the list is empty
	    if (front == null) {
	        front = newNode;
	        size++;
	        return;
	    }

	    // Initialize the iterator values
	    ListNode current = front;
	    ListNode previous = null;

	    // Iterator
	    while (current != null) {
	    	// Check if the new element already exists
	        if (current.data.compareTo(element) == 0) {
	            throw new IllegalArgumentException("Cannot add duplicate element.");
	        } 
	        
	        // Iterate until the correct node maintaining sorted order is found
	        else if (current.data.compareTo(element) > 0) {
	            newNode.next = current;
	            
	            // If previous is determined, insert the new node
	            if (previous != null) {
	                previous.next = newNode;
	            } 
	            
	            // Else the new node gets set at the beginning
	            else {
	                front = newNode;
	            }
	            
	            size++;
	            return;
	        } 
	        
	        // Increment the iterator if correct sorted index isn't found
	        else {
	            previous = current;
	            current = current.next;
	        }
	    }

	    // If we get here, the new node should be added at the end of the list
	    previous.next = newNode;
	    size++;
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
		// Check if the index is out of bounds
		checkIndex(idx);

	    // Case 1: removing the first element
	    if (idx == 0) {
	        E removedData = front.data;
	        front = front.next;
	        size--;
	        return removedData;
	    }

	    // Case 2: removing a non-first element
	    ListNode previous = null;
	    ListNode current = front;
	    int count = 0;
	    
	    // Iterate to the correct index
	    while (count < idx) {
	        previous = current;
	        current = current.next;
	        count++;
	    }
	    
	    // Get the removed node
	    E removedData = current.data;
	    // Remove the node
	    previous.next = current.next;
	    
	    size--;
	    return removedData;
	}
	
	/**
	 * Checks the index
	 * @param idx index to be checked
	 * @throws IndexOutOfBoundsException if index is outside the size
	 */
	private void checkIndex(int idx) {
		if (idx < 0 || idx >= size) {
	        throw new IndexOutOfBoundsException("Invalid index.");
	    }
	}
	
	/**
	 * Returns true if the element is in the list.
	 * @param element element to search for
	 * @return true if element is found
	 */
	@Override
	public boolean contains(E element) {
		ListNode current = front;
		
	    while (current != null) {
	        if (current.data.compareTo(element) == 0) {
	            return true;
	        }
	        current = current.next;
	    }
	    
	    return false;
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
		// Check if the index is out of bounds
		checkIndex(idx);
		
		// Iterate to the correct index
		ListNode current = front;
		for (int i = 0; i < idx; i++) {
			current = current.next;
		}
		
		return current.data;
	}
	
	/**
	 * Gets the size of the SortedList
	 * @return the size as an integer
	 */
	@Override
	public int size() {
		return size;
	}
	
	/**
	 * ListNode inner class for construction of list nodes with data
	 * 
	 * @author Nick Gallo
	 */
	private class ListNode {
		
		/** data inside of list node */
		private E data;
		/** reference for next node */
		public ListNode next;

		/**
		 * ListNode constructor with data and ListNode
		 * @param data data
		 * @param next listnode
		 */
		public ListNode(E data, ListNode next) {
			this.data = data;
			this.next = next;
		}
	}
}