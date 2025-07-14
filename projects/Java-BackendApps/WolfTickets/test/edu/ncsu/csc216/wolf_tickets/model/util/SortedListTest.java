package edu.ncsu.csc216.wolf_tickets.model.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SortedListTest {

	/** A SortedList of type String */
	private SortedList<String> list;
    
    @BeforeEach
    public void setUp() throws Exception {
        list = new SortedList<String>();
    }
    
    @Test
    public void testAdd() {
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        assertEquals(3, list.size());
        assertEquals("apple", list.get(0));
        assertEquals("banana", list.get(1));
        assertEquals("cherry", list.get(2));
        
        // Test adding a duplicate element
        try {
            list.add("banana");
            fail("Expected IllegalArgumentException was not thrown.");
        } catch (IllegalArgumentException e) {
            assertEquals(3, list.size());
        }
        
        // Test adding a null element
        try {
            list.add(null);
            fail("Expected NullPointerException was not thrown.");
        } catch (NullPointerException e) {
            assertEquals(3, list.size());
        }
    }
    
    @Test
    public void testRemove() {
    	// Test removing an element from an empty list
        try {
            list.remove(0);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals(0, list.size());
        }
        
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        assertEquals(3, list.size());
        
        // Test removing the first element
        String removed = list.remove(0);
        assertEquals("apple", removed);
        assertEquals(2, list.size());
        assertEquals("banana", list.get(0));
        assertEquals("cherry", list.get(1));
        
        // Test removing a non-first element
        removed = list.remove(1);
        assertEquals("cherry", removed);
        assertEquals(1, list.size());
        assertEquals("banana", list.get(0));
        
        // Test removing an element with an invalid index
        try {
            list.remove(1);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals(1, list.size());
        }
    }
    
    @Test
    public void testContains() {
        assertFalse(list.contains("apple"));
        assertFalse(list.contains("banana"));
        assertFalse(list.contains("cherry"));
        
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        assertTrue(list.contains("apple"));
        assertTrue(list.contains("banana"));
        assertTrue(list.contains("cherry"));
        assertFalse(list.contains("donut"));
    }
    
    @Test
    public void testGet() {
    	// Test getting an element from an empty list
        try {
            list.get(0);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals(0, list.size());
        }
        
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        assertEquals("apple", list.get(0));
        assertEquals("banana", list.get(1));
        assertEquals("cherry", list.get(2));
        
        // Test getting an element with an invalid index
        try {
            list.get(3);
            fail("Expected IndexOutOfBoundsException was not thrown.");
        } catch (IndexOutOfBoundsException e) {
            assertEquals(3, list.size());
        }
    }

}
