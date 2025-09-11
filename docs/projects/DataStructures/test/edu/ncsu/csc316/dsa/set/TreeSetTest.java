package edu.ncsu.csc316.dsa.set;

import static org.junit.Assert.*;
import java.util.Iterator;
import org.junit.Before;
import org.junit.Test;

/**
 * Test class for TreeSet
 * Checks the expected outputs of the Set abstract data type behaviors when using
 * a balanced search tree data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class TreeSetTest {

    private Set<Integer> set;

    /**
     * Create a new instance of a tree-based set before each test case executes
     */      
    @Before
    public void setUp() {
        set = new TreeSet<Integer>();
    }

    /**
     * Test the output of the add behavior
     */     
    @Test
    public void testAdd() {
        set.add(5);
        
        assertTrue(set.contains(5));
        
        set.add(10);
        set.add(15);
        
        assertTrue(set.contains(10));
        assertTrue(set.contains(15));
        assertFalse(set.contains(20));
        
        set.add(20); // Add a duplicate to see if the size changes
        
        assertEquals(4, set.size());
    }

    /**
     * Test the output of the contains behavior
     */ 
    @Test
    public void testContains() {
        set.add(5);
        set.add(10);
        
        assertTrue(set.contains(5));
        assertTrue(set.contains(10));
        assertFalse(set.contains(15));
    }

    /**
     * Test the output of the remove behavior
     */ 
    @Test
    public void testRemove() {
        set.add(5);
        set.add(10);
        set.add(15);
        
        assertTrue(set.contains(15));
        
        set.remove(15);
        
        assertFalse(set.contains(15));
        assertEquals(2, set.size());
    }
    
    /**
     * Test the output of the retainAll behavior
     */ 
    @Test
    public void testRetainAll() {
        set.add(5);
        set.add(10);
        set.add(15);
        
        Set<Integer> other = new TreeSet<Integer>();
        
        other.add(10);
        other.add(15);
        other.add(20);
        
        set.retainAll(other);
        
        assertTrue(set.contains(10));
        assertTrue(set.contains(15));
        assertFalse(set.contains(5));
        assertEquals(2, set.size());
    }

    /**
     * Test the output of the removeAll behavior
     */     
    @Test
    public void testRemoveAll() {
        set.add(5);
        set.add(10);
        set.add(15);
        
        Set<Integer> other = new TreeSet<Integer>();
        
        other.add(10);
        other.add(15);
        
        set.removeAll(other);
        
        assertTrue(set.contains(5));
        assertFalse(set.contains(10));
        assertFalse(set.contains(15));
        assertEquals(1, set.size());
    }

    /**
     * Test the output of the addAll behavior
     */     
    @Test
    public void testAddAll() {
        set.add(5);
        set.add(10);
        
        Set<Integer> other = new TreeSet<Integer>();
        
        other.add(15);
        other.add(20);
        
        set.addAll(other);
        
        assertTrue(set.contains(5));
        assertTrue(set.contains(10));
        assertTrue(set.contains(15));
        assertTrue(set.contains(20));
        assertEquals(4, set.size());
    }

    /**
     * Test the output of the iterator behavior
     */ 
    @Test
    public void testIterator() {
        set.add(25);
        set.add(20);
        set.add(15);        
        set.add(10);        
        set.add(5);
        
        Iterator<Integer> it = set.iterator();
        
        assertTrue(it.hasNext());
        assertEquals(Integer.valueOf(5), it.next());
        assertEquals(Integer.valueOf(10), it.next());
        assertEquals(Integer.valueOf(15), it.next());
        assertEquals(Integer.valueOf(20), it.next());
        assertEquals(Integer.valueOf(25), it.next());
        assertFalse(it.hasNext());
    }
}
