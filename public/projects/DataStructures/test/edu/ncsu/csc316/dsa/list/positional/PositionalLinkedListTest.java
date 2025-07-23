package edu.ncsu.csc316.dsa.list.positional;

import static org.junit.Assert.*;

import java.util.Iterator;
import java.util.NoSuchElementException;

import org.junit.Before;
import org.junit.Test;

import edu.ncsu.csc316.dsa.Position;

/**
 * Test class for PositionalLinkedList.
 * Checks the expected outputs of the Positional List abstract data type behaviors when using
 * an doubly-linked positional list data structure
 *
 * @author Dr. King
 *
 */
public class PositionalLinkedListTest {

    private PositionalList<String> list;
    
    /**
     * Create a new instance of an positional linked list before each test case executes
     */ 
    @Before
    public void setUp() {
        list = new PositionalLinkedList<String>();
    }
    
    /**
     * Test the output of the first() behavior, including expected exceptions
     */
    @Test
    public void testFirst() {
        assertEquals(0, list.size());
        assertTrue(list.isEmpty());
        
        assertNull(list.first());
        
        Position<String> first = list.addFirst("one");
        assertEquals(1, list.size());
        assertEquals(first, list.first());
        
        //TODO: complete this test case
    }
    
    /**
     * Test the output of the last() behavior, including expected exceptions
     */
    @Test
    public void testLast() {
        assertEquals(0, list.size());
        assertTrue(list.isEmpty());

        assertNull(list.last());

        Position<String> last = list.addLast("one");
        assertEquals(1, list.size());
        assertEquals(last, list.last());

        list.addFirst("zero");
        assertEquals(2, list.size());
        assertEquals(last, list.last());

        // Add more elements and validate
        list.addLast("two");
        Position<String> newLast = list.last();
        assertNotNull(newLast);
        assertEquals("two", newLast.getElement());
    }
    
    /**
     * Test the output of the addFirst(element) behavior
     */ 
    @Test
    public void testAddFirst() {
        assertEquals(0, list.size());
        assertTrue(list.isEmpty());
        Position<String> first = list.addFirst("one");
        assertEquals(1, list.size());
        assertFalse(list.isEmpty());
        
        //TODO: complete this test case
    }
    
    /**
     * Test the output of the addLast(element) behavior
     */ 
    @Test
    public void testAddLast() {
        assertEquals(0, list.size());
        assertTrue(list.isEmpty());
        Position<String> first = list.addLast("one");
        assertEquals(1, list.size());
        
        //TODO: complete this test case
    }
    
    /**
     * Test the output of the before(position) behavior, including expected exceptions
     */ 
    @Test
    public void testBefore() {
        list.addFirst("one");
        list.addLast("two");
        Position<String> middle = list.addAfter(list.first(), "middle");

        assertEquals("one", list.before(middle).getElement());

        assertEquals(null, list.before(list.first()));
    }
    
    /**
     * Test the output of the after(position) behavior, including expected exceptions
     */     
    @Test
    public void testAfter() {
        list.addFirst("one");
        list.addLast("two");
        Position<String> middle = list.addBefore(list.last(), "middle");

        assertEquals("two", list.after(middle).getElement());

        assertEquals(null, list.after(list.last()));
    }
    
    /**
     * Test the output of the addBefore(position, element) behavior, including expected exceptions
     */     
    @Test
    public void testAddBefore() {
        Position<String> first = list.addFirst("one");
        list.addBefore(first, "zero");
        assertEquals(2, list.size());
        assertEquals("zero", list.first().getElement());

        // Test adding before in the middle
        Position<String> middle = list.addBefore(first, "middle");
        assertEquals("middle", list.before(first).getElement());
    }
    
    /**
     * Test the output of the addAfter(position, element) behavior, including expected exceptions
     */     
    @Test
    public void testAddAfter() {
        Position<String> first = list.addFirst("one");
        list.addAfter(first, "two");
        assertEquals(2, list.size());
        assertEquals("two", list.last().getElement());

        // Test adding after in the middle
        Position<String> middle = list.addAfter(first, "middle");
        assertEquals("middle", list.after(first).getElement());
    }
    
    /**
     * Test the output of the set(position, element) behavior, including expected exceptions
     */     
    @Test
    public void testSet() {
        Position<String> first = list.addFirst("one");
        String oldVal = list.set(first, "newOne");
        assertEquals("one", oldVal);
        assertEquals("newOne", first.getElement());

        // Test setting in a non-empty list
        list.addLast("two");
        Position<String> middle = list.addAfter(first, "middle");
        oldVal = list.set(middle, "newMiddle");
        assertEquals("middle", oldVal);
        assertEquals("newMiddle", middle.getElement());
    }
    
    /**
     * Test the output of the remove(position) behavior, including expected exceptions
     */     
    @Test
    public void testRemove() {
        Position<String> first = list.addFirst("one");
        list.addLast("two");

        String removed = list.remove(first);
        assertEquals("one", removed);
        assertEquals(1, list.size());

        // Test removing the last element
        Position<String> last = list.last();
        removed = list.remove(last);
        assertEquals("two", removed);
        assertTrue(list.isEmpty());
    }
    
    /**
     * Test the output of the iterator behavior for elements in the list, 
     * including expected exceptions
     */     
    @Test
    public void testIterator() {
        list.addFirst("one");
        list.addLast("two");
        list.addLast("three");

        Iterator<String> it = list.iterator();
        assertTrue(it.hasNext());
        assertEquals("one", it.next());
        assertEquals("two", it.next());
        assertEquals("three", it.next());
        assertFalse(it.hasNext());

        try {
            it.next();
            fail("NoSuchElementException expected");
        } catch (NoSuchElementException e) {
            // Expected exception
        }
        
        // Remove the element and check if the list updates correctly
        it.remove();
        assertEquals(2, list.size());
    }
    
    /**
     * Test the output of the positions() behavior to iterate through positions
     * in the list, including expected exceptions
     */     
    @Test
    public void testPositions() {
        assertEquals(0, list.size());
        Position<String> first = list.addFirst("one");
        Position<String> second = list.addLast("two");
        Position<String> third = list.addLast("three");
        assertEquals(3, list.size());
        
        Iterator<Position<String>> it = list.positions().iterator();
        assertTrue(it.hasNext());
        assertEquals(first, it.next());
        assertEquals(second, it.next());
        assertEquals(third, it.next());
        
        //TODO: complete this test case
    }

}
