package edu.ncsu.csc316.dsa.list.positional;

import java.util.Iterator;
import java.util.NoSuchElementException;

import edu.ncsu.csc316.dsa.Position;

/**
 * The Positional Linked List is implemented as a doubly-linked list data
 * structure to support efficient, O(1) worst-case Positional List abstract data
 * type behaviors.
 * 
 * Size is maintained as a global field to ensure O(1) worst-case runtime of
 * size() and isEmpty().
 * 
 * The PositionalLinkedList class is based on the implementation developed for
 * use with the textbook:
 *
 * Data Structures and Algorithms in Java, Sixth Edition Michael T. Goodrich,
 * Roberto Tamassia, and Michael H. Goldwasser John Wiley & Sons, 2014
 * 
 * @author Dr. King
 *
 * @param <E> the type of elements stored in the positional list
 */
public class PositionalLinkedList<E> implements PositionalList<E> {

    /** A dummy/sentinel node representing at the front of the list **/
    private PositionalNode<E> front;

    /** A dummy/sentinel node representing at the end/tail of the list **/
    private PositionalNode<E> tail;

    /** The number of elements in the list **/
    private int size;

    /**
     * Constructs an empty positional linked list
     */
    public PositionalLinkedList() {
        front = new PositionalNode<E>(null);
        tail = new PositionalNode<E>(null, null, front);
        front.setNext(tail);
        size = 0;
    }

    private static class PositionalNode<E> implements Position<E> {

        private E element;
        private PositionalNode<E> next;
        private PositionalNode<E> previous;

        public PositionalNode(E value) {
            this(value, null);
        }

        public PositionalNode(E value, PositionalNode<E> next) {
            this(value, next, null);
        }

        public PositionalNode(E value, PositionalNode<E> next, PositionalNode<E> prev) {
            setElement(value);
            setNext(next);
            setPrevious(prev);
        }

        public void setPrevious(PositionalNode<E> prev) {
            previous = prev;
        }

        public PositionalNode<E> getPrevious() {
            return previous;
        }
        
        public void setNext(PositionalNode<E> next) {
            this.next = next;
        }

        public PositionalNode<E> getNext() {
            return next;
        }

        @Override
        public E getElement() {
            return element;
        }
        
        public void setElement(E element) {
            this.element = element;
        }
    }

    /**
     * Safely casts a Position, p, to be a PositionalNode.
     * @param p the position to cast to a PositionalNode
     * @return a reference to the PositionalNode
     * @throws IllegalArgumentException if p is null, or if p is not a valid
     *                                  PositionalNode
     */
    private PositionalNode<E> validate(Position<E> p) {
        if (p instanceof PositionalNode) {
            return (PositionalNode<E>) p;
        }
        throw new IllegalArgumentException("Position is not a valid positional list node.");
    }
    
    /**
     * Adds an element between the given previous and next nodes in the list.
     * The new element is inserted into a new positional node, which is linked
     * between the provided previous and next nodes.
     * @param element the element to insert
     * @param prev the node that should come before the new node
     * @param next the node that should come after the new node
     * @return the position containing the new element
     */
    private Position<E> addBetween(E element, PositionalNode<E> prev, PositionalNode<E> next) {
        PositionalNode<E> newNode = new PositionalNode<>(element, next, prev);
        
        prev.setNext(newNode);
        next.setPrevious(newNode);
        
        size++;
        
        return newNode;
    }
    
    /**
     * Adds an element to the front of the list. This method creates a new node
     * and links it after the sentinel front node.
     * @param element the element to add
     * @return the position containing the new element at the front of the list
     */
    public Position<E> addFirst(E element) {
        return addBetween(element, front, front.getNext());
    }

    /**
     * Adds an element to the end of the list. This method creates a new node
     * and links it before the sentinel tail node.
     * @param element the element to add
     * @return the position containing the new element at the end of the list
     */
    public Position<E> addLast(E element) {
        return addBetween(element, tail.getPrevious(), tail);
    }

    /**
     * Inserts an element immediately before the position `p` in the list.
     * @param p the position before which the element is to be inserted
     * @param element the element to insert
     * @return the position containing the newly inserted element
     * @throws IllegalArgumentException if the position `p` is not valid
     */
    public Position<E> addBefore(Position<E> p, E element) {
        PositionalNode<E> node = validate(p);
        return addBetween(element, node.getPrevious(), node);
    }

    /**
     * Inserts an element immediately after the position `p` in the list.
     * @param p the position after which the element is to be inserted
     * @param element the element to insert
     * @return the position containing the newly inserted element
     * @throws IllegalArgumentException if the position `p` is not valid
     */
    public Position<E> addAfter(Position<E> p, E element) {
        PositionalNode<E> node = validate(p);
        return addBetween(element, node, node.getNext());
    }
    
    @Override
    public Position<E> after(Position<E> p) {
        PositionalNode<E> node = validate(p);
        PositionalNode<E> successor = node.getNext();
        
        if (successor == tail) {
            // The tail sentinel node does not have a valid position after it.
            return null;
        }
        
        return successor;
    }

    @Override
    public Position<E> before(Position<E> p) {
        PositionalNode<E> node = validate(p);
        PositionalNode<E> predecessor = node.getPrevious();
        
        if (predecessor == front) {
            // The front sentinel node does not have a valid position before it.
            return null;
        }
        
        return predecessor;
    }

    @Override
    public Position<E> first() {
        if (isEmpty()) {
            return null;
        }
        
        return front.getNext();
    }

    @Override
    public Position<E> last() {
        if (isEmpty()) {
            return null;
        }
        
        return tail.getPrevious();
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public E remove(Position<E> p) {
        PositionalNode<E> node = validate(p);
        PositionalNode<E> predecessor = node.getPrevious();
        PositionalNode<E> successor = node.getNext();
        
        // Link the predecessor and successor directly to each other, 
        // removing the current node from the chain.
        predecessor.setNext(successor);
        successor.setPrevious(predecessor);
        
        size--;
        
        E result = node.getElement();
        
        // Null out the element and the next/previous references.
        node.setElement(null);
        node.setNext(null);
        node.setPrevious(null);
        
        return result;
    }

    @Override
    public E set(Position<E> p, E e) {
        PositionalNode<E> node = validate(p);
        E oldElement = node.getElement();
        
        node.setElement(e);
        
        return oldElement;
    }
    
    /**
     * This inner class provides an iterator to iterate over positions in the list.
     */
    private class PositionIterator implements Iterator<Position<E>> {

        private PositionalNode<E> current;
        private boolean removeOK;

        public PositionIterator() {
            current = front.getNext();
            removeOK = false;
        }

        @Override
        public boolean hasNext() {
            return current != tail;
        }

        @Override
        public Position<E> next() {
            // If cursor is at the end of the list, no next position.
            if (current == tail) {
                throw new NoSuchElementException("There are no more positions.");
            }
            
            // The current position to return.
            PositionalNode<E> here = current;
            // Move current forward.
            current = current.getNext();
            
            removeOK = true;
            
            return here;
        }

        @Override
        public void remove() {
            // If next() hasn't been called or remove() has already been called after last next().
            if (!removeOK) {
                throw new IllegalStateException("Cannot remove a position without calling next().");
            }
            
            // Get the node before current.
            PositionalNode<E> node = (PositionalNode<E>) before(current);
            // Use outer class's remove method.
            PositionalLinkedList.this.remove(node);
            
            removeOK = false;
        }
    }
    
    /**
     * This inner class provides an iterator to iterate over elements in the list.
     */
    private class ElementIterator implements Iterator<E> {

        private Iterator<Position<E>> it;

        public ElementIterator() {
            it = new PositionIterator();
        }

        @Override
        public boolean hasNext() {
            return it.hasNext();
        }

        @Override
        public E next() {
            return it.next().getElement();
        }

        @Override
        public void remove() {
            it.remove();
        }
    }
    
    /**
     * Wrapper class to help adapt our existing PositionIterator so that we can return an Iterable object.
     */
    private class PositionIterable implements Iterable<Position<E>> {
        
        @Override
        public Iterator<Position<E>> iterator() {
            return new PositionIterator();
        }
    }
    
    @Override
    public Iterator<E> iterator() {
        return new ElementIterator();
    }
    
    @Override
    public Iterable<Position<E>> positions() {
        // The PositionIterable class is an iterable over positions.
        return new PositionIterable();
    }
}
