package edu.ncsu.csc316.dsa.map.search_tree;

import static org.junit.Assert.*; 
import org.junit.Before;
import org.junit.Test;

/**
 * Test class for SplayTreeMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * a splay tree data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class SplayTreeMapTest {

    private BinarySearchTreeMap<Integer, String> tree;
    
    /**
     * Create a new instance of a splay tree-based map before each test case executes
     */     
    @Before
    public void setUp() {
        tree = new SplayTreeMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, tree.size());
        assertTrue(tree.isEmpty());

        // Insert and test simple splay operation (zig)
        tree.put(5, "five");
        assertEquals(1, tree.size());
        assertEquals(5, (int)tree.root().getElement().getKey());

        // Insert and test double rotate (zig-zig)
        tree.put(3, "three");
        tree.put(1, "one");
        assertEquals(1, (int)tree.root().getElement().getKey());

        // Insert and test zig-zag operation
        tree.put(4, "four");
        assertEquals(4, (int)tree.root().getElement().getKey());       
    }
    
    /**
     * Test the output of the get(k) behavior
     */ 
    @Test
    public void testGet() {
        tree.put(3, "three");
        tree.put(5, "five");
        tree.put(1, "one");

        assertEquals("five", tree.get(5));
        assertEquals(5, (int)tree.root().getElement().getKey());

        assertNull(tree.get(4)); // Non-existent key, closest parent should be splayed
        assertEquals(3, (int)tree.root().getElement().getKey());
    }
    
    /**
     * Test the output of the remove(k) behavior
     */     
    @Test
    public void testRemove() {
        tree.put(5, "five");
        tree.put(3, "three");
        tree.put(7, "seven");
        tree.put(2, "two");
        tree.put(6, "six");

        // Removing a node and checking splay operation
        assertEquals("three", tree.remove(3));
        assertNotNull(tree.get(2));
        assertEquals(2, (int)tree.root().getElement().getKey());

        // Removing root and checking splay operation
        assertEquals("two", tree.remove(2));
        assertEquals(5, (int)tree.root().getElement().getKey());       
    }
}
