package edu.ncsu.csc316.dsa.list;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * A singly-linked list is a linked-memory representation of the List abstract
 * data type. This list maintains a dummy/sentinel front node in the list to
 * help promote cleaner implementations of the list behaviors. This list also
 * maintains a reference to the tail/last node in the list at all times to
 * ensure O(1) worst-case cost for adding to the end of the list. Size is
 * maintained as a global field to allow for O(1) size() and isEmpty()
 * behaviors.
 * 
 * @author Dr. King
 *
 * @param <E> the type of elements stored in the list
 */
public class SinglyLinkedList<E> extends AbstractList<E>{

    /** A reference to the dummy/sentinel node at the front of the list **/
    private LinkedListNode<E> front;
    
    /** A reference to the last/final node in the list **/
    private LinkedListNode<E> tail;
    
    /** The number of elements stored in the list **/
    private int size;
        
    /**
     * Constructs an empty singly-linked list
     */     
    public SinglyLinkedList() {
        // Let front be a dummy (sentinel) node with no data and no next node.
        front = new LinkedListNode<E>(null, null);
        tail = null;
        size = 0;
    }
    
    @Override
    public void add(int index, E value) {
        // Check if the index is valid for adding an element.
        checkIndexForAdd(index);

        // Adding to the front of the list.
        if (index == 0) {
            front.next = new LinkedListNode<>(value, front.next);
            
            if (size == 0) {
                // If the list was empty, the new node is also the tail.
                tail = front.next;
            }
        }
        else if (index == size) {
            // Adding to the end of the list.
            tail.next = new LinkedListNode<>(value, null);
            tail = tail.next;
        }
        else {
            // Adding in the middle of the list.
            LinkedListNode<E> current = front.next;
            
            for (int i = 0; i < index - 1; i++) {
                current = current.next;
            }
            
            current.next = new LinkedListNode<>(value, current.next);
        }
        
        size++;
    }
    
    @Override
    public E remove(int index) {
        // Check if the index is valid for removal.
        checkIndex(index);

        // Special case for removing the first element.
        if (index == 0) {
            // Save the element to return.
            E value = front.next.element;
            // Remove the first element.
            front.next = front.next.next;
            
            if (size == 1) {
                // If we are removing the only element, update the tail to be null.
                tail = null;
            }
            
            size--;
            return value;
        }

        // Find the node before the one we want to remove.
        LinkedListNode<E> current = front.next;
        
        for (int i = 0; i < index - 1; i++) {
            current = current.next;
        }

        // Save the element to return.
        E value = current.next.element;

        // If we are removing the last element, update the tail reference.
        if (index == size - 1) {
            tail = current;
            current.next = null;
        } 
        else {
            // Remove the element by linking the previous node to the next of the next node.
            current.next = current.next.next;
        }

        size--;
        return value;
    }
    
    /**
     * {@inheritDoc} For a singly-linked list, this behavior has O(1) worst-case
     * runtime.
     */
    @Override
    public E last() {
        if (isEmpty()) {
            throw new IndexOutOfBoundsException("The list is empty");
        }
        
        return tail.getElement();
    }

    /**
     * {@inheritDoc}
     * For this singly-linked list, addLast(element) behavior has O(1) worst-case runtime.
     */    
    @Override
    public void addLast(E element) {
        // Create a new node for the element.
        LinkedListNode<E> newNode = new LinkedListNode<>(element, null);

        // If the list is empty, the new node is both the head and the tail.
        if (isEmpty()) {
            // Front is a dummy node.
            front.next = newNode;
            tail = newNode;
        } 
        else {
            // Otherwise, add the new node after the current tail.
            tail.next = newNode;
            // Update the tail reference to the new node.
            tail = newNode;
        }

        size++;
    }
    
    @Override
    public E get(int index) {
        // Check if the index is valid for accessing an element.
        checkIndex(index);

        LinkedListNode<E> current = front.next;
        
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        
        return current.getElement();
    }

    @Override
    public E set(int index, E value) {
        // Check if the index is valid for accessing an element.
        checkIndex(index);

        LinkedListNode<E> current = front.next;
        
        for (int i = 0; i < index; i++) {
            current = current.next;
        }
        
        // Store the old value to return it.
        E old = current.getElement();
        
        // Set the new value at the specified index.
        current.element = value;
        
        return old;
    }

    @Override
    public int size() {
        return size;
    }
    
    /**
     * Represents a node in a singly-linked list. Each node contains an element and
     * a reference to the next node in the list.
     * @param <E> the type of elements stored in the node
     */
    private static class LinkedListNode<E> {
        private E element;
        private LinkedListNode<E> next;

        /**
         * Constructs a new node with the specified element and next node.
         * @param element the element to store in this node
         * @param next the next node in the list
         */
        public LinkedListNode(E element, LinkedListNode<E> next) {
            this.element = element;
            this.next = next;
        }

        /**
         * Retrieves the element stored at this node.
         * @return the element stored at this node
         */
        public E getElement() {
            return element;
        }

        /**
         * Retrieves the next node in the list.
         * @return the next node
         */
        public LinkedListNode<E> getNext() {
            return next;
        }
    }
    
    /**
     * An iterator over a singly-linked list. This iterator does not support the
     * remove operation. It allows the user to traverse the list in a forward direction.
     */
    private class ElementIterator implements Iterator<E> {
        /**
         * Keep track of the next node that will be processed.
         */
        private LinkedListNode<E> current;
        
        /**
         * Construct a new element iterator where the cursor is initialized 
         * to the beginning of the list.
         */
        public ElementIterator() {
            current = front.next;
        }

        @Override
        public boolean hasNext() {
            // hasNext should return true if current is not null.
            return current != null;
        }

        @Override
        public E next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            
            // Get the current element to return.
            E value = current.getElement();
            
            // Advance current to the next node.
            current = current.getNext();
            
            return value;
        }
         
        @Override    
        public void remove() {
            // DO NOT CHANGE THIS METHOD
            throw new UnsupportedOperationException(
                "This SinglyLinkedList implementation does not currently support removal of elements when using the iterator.");
        }
    }
    
    @Override
    public Iterator<E> iterator() {
        return new ElementIterator();
    }
}
