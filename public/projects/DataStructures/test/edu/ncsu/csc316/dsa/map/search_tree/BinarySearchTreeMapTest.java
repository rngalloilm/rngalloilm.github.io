package edu.ncsu.csc316.dsa.map.search_tree;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

/**
 * Test class for BinarySearchTreeMap
 * Checks the expected outputs of the Map and Tree abstract data type behaviors when using
 * an linked binary tree data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class BinarySearchTreeMapTest {

    private BinarySearchTreeMap<Integer, String> tree;
    
    /**
     * Create a new instance of a binary search tree map before each test case executes
     */
    @Before
    public void setUp() {
        tree = new BinarySearchTreeMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, tree.size());
        assertTrue(tree.isEmpty());
        tree.put(1, "one");
        assertEquals(1, tree.size());
        assertFalse(tree.isEmpty());
        assertEquals(1, (int)tree.root().getElement().getKey());
        
        //TODO: complete this test case
    }
    
    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        tree.put(1,  "one");
        assertEquals(1, tree.size());
        
        //TODO: complete this test case
    }

    /**
     * Test the output of the remove(k) behavior
     */ 
    @Test
    public void testRemove() {
        tree.put(1,  "one");
        assertEquals(1, tree.size());
        
        assertNull(tree.remove(10));
        assertEquals(1, tree.size());
        
        assertEquals("one", tree.remove(1));
        assertEquals(0, tree.size());
        
     // Reconstructing the tree
        tree.put(2, "two");
        tree.put(1, "one");
        tree.put(3, "three");
        tree.put(4, "four");

        // Test removing root (when root has both children)
        assertEquals("two", tree.remove(2));
        assertNotNull(tree.get(1));
        assertNotNull(tree.get(3));

        // Test removing a node that has only a left child
        tree.put(2, "two"); // Add back 2 to remove 3 which has only left child now
        assertEquals("three", tree.remove(3));
        assertNotNull(tree.get(2));
        assertNull(tree.get(3));

        // Test removing a node that has only a right child
        tree.remove(4); // 4 has been shifted up after removing 3
        assertNotNull(tree.get(2));
        assertNull(tree.get(4));

        // Test removing a node that has both children
        tree.put(3, "three");
        tree.put(4, "four");
        assertEquals("two", tree.remove(2));
        assertNotNull(tree.get(1));
        assertNotNull(tree.get(3));
        assertNull(tree.get(2));

        // Test removing leaf nodes
        assertEquals("one", tree.remove(1));
        assertEquals("three", tree.remove(3));
        assertEquals("four", tree.remove(4));
        assertTrue(tree.isEmpty());
    }
    
    @Test
    public void testPutMore() {
        tree.put(5, "five");
        tree.put(3, "three");
        tree.put(7, "seven");
        tree.put(2, "two");
        tree.put(4, "four");
        tree.put(6, "six");
        tree.put(8, "eight");

        assertEquals("three", tree.get(3));
        assertEquals("four", tree.get(4));
        assertEquals("six", tree.get(6));

        // Test updating existing key
        tree.put(4, "four_updated");
        assertEquals("four_updated", tree.get(4));

        // Check size
        assertEquals(7, tree.size());
    }
    
    @Test
    public void testToString() {
        tree.put(5, "five");
        tree.put(3, "three");
        tree.put(7, "seven");
        tree.put(1, "one");
        tree.put(4, "four");
        tree.put(6, "six");
        tree.put(8, "eight");

        String expected = tree.toString();
        assertEquals(expected, tree.toString());
    }
}
