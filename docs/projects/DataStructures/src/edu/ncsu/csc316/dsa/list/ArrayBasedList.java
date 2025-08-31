package edu.ncsu.csc316.dsa.list;

import java.util.Arrays;
import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * An array-based list is a contiguous-memory representation of the List
 * abstract data type. This array-based list dynamically resizes to ensure O(1)
 * amortized cost for adding to the end of the list. Size is maintained as a
 * global field to allow for O(1) size() and isEmpty() behaviors.
 * 
 * @author Dr. King
 *
 * @param <E> the type of elements stored in the list
 */
public class ArrayBasedList<E> extends AbstractList<E> {

    /**
     * The initial capacity of the list if the client does not provide a capacity
     * when constructing an instance of the array-based list
     **/
    private final static int DEFAULT_CAPACITY = 0;

    /** The array in which elements will be stored **/
    private E[] data;

    /** The number of elements stored in the array-based list data structure **/
    private int size;

    /**
     * Constructs a new instance of an array-based list data structure with the
     * default initial capacity of the internal array
     */
    public ArrayBasedList() {
        this(DEFAULT_CAPACITY);
    }

    /**
     * Constructs a new instance of an array-based list data structure with the
     * provided initial capacity
     * 
     * @param capacity the initial capacity of the internal array used to store the
     *                 list elements
     */
    @SuppressWarnings("unchecked")
    public ArrayBasedList(int capacity) {
        data = (E[]) (new Object[capacity]);
        size = 0;
    }
    
    /**
     * To ensure amortized O(1) cost for adding to the end of the array-based list,
     * use the doubling strategy on each resize. Here, we add +1 after doubling to
     * handle the special case where the initial capacity is 0 (otherwise, 0*2 would
     * still produce a capacity of 0).
     * 
     * @param minCapacity the minimium capacity that must be supported by the
     *                    internal array
     */
    private void ensureCapacity(int minCapacity) {
        int oldCapacity = data.length;
        if (minCapacity > oldCapacity) {
            int newCapacity = (oldCapacity * 2) + 1;
            if (newCapacity < minCapacity) {
                newCapacity = minCapacity;
            }
            data = Arrays.copyOf(data, newCapacity);
        }
    }
    
    @Override
    public void add(int index, E value) {
        // Check index validity.
        checkIndexForAdd(index);

        // Ensure there is enough capacity. Size + 1 because we're adding an element.
        ensureCapacity(size + 1);

        // Shift elements to the right.
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }

        // Insert new element.
        data[index] = value;

        // Increment size.
        size++;
    }
    
    @Override
    public E remove(int index) {
        // Check index validity.
        checkIndex(index);

        // Store the element to be removed.
        E element = data[index];

        // Shift elements to the left.
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }

        // Null out the unused element.
        data[size - 1] = null;

        // Decrement size.
        size--;

        // Return the removed element.
        return element;
    }
    
    @Override
    public E get(int index) {
        // Check index validity.
        checkIndex(index);
        
        // Return the element at the specified index.
        return data[index];
    }

    @Override
    public E set(int index, E value) {
        // Check index validity.
        checkIndex(index);
        
        // Store the old value to return it.
        E old = data[index];
        
        // Set the new value at the specified index.
        data[index] = value;
        
        // Return the old value.
        return old;
    }

    @Override
    public int size() {
        // Return the size of the list.
        return size;
    }
    
    /**
     * Iterator which allows visitation to each element in a data structure.
     */
    private class ElementIterator implements Iterator<E> {
        // The position of the iterator.
        private int position;
        // This flag is true if remove() is allowed. Set to false by default.
        private boolean removeOK;

        /**
         * Construct a new element iterator where the cursor is initialized 
         * to the beginning of the list.
         */
        public ElementIterator() {
            position = 0;
            removeOK = false;
        }

        @Override
        public boolean hasNext() {
            // There is a next element if the position is less than the size of the list.
            return position < size;
        }

        @Override
        public E next() {
            // If there are no more elements, throw a NoSuchElementException.
            if (!hasNext()) {
                throw new NoSuchElementException("There are no elements left in the list to iterate over.");
            }
            
            // Set the flag to allow remove() since we are about to return an element.
            removeOK = true;
            // Return the element at the current position and increment the position.
            return data[position++];
        }
            
        @Override
        public void remove() {
            // If remove() is called before next() or it has been already called after the last next(),
            // throw an IllegalStateException.
            if (!removeOK) {
                throw new IllegalStateException("Can't remove an element before calling next() or after having called remove() already for the current element.");
            }
            
            // Remove the element at the last returned position by next().
            ArrayBasedList.this.remove(--position);
            // Reset the flag to prevent remove from being called again until next() is called.
            removeOK = false;
        }
    }
    
    @Override
    public Iterator<E> iterator() {
        return new ElementIterator();
    }
}
