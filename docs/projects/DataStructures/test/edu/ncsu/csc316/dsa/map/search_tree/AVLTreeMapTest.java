package edu.ncsu.csc316.dsa.map.search_tree;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 * Test class for AVLTreeMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * an AVL tree data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class AVLTreeMapTest {

    private BinarySearchTreeMap<Integer, String> tree;
    
    /**
     * Create a new instance of an AVL tree-based map before each test case executes
     */     
    @Before
    public void setUp() {
        tree = new AVLTreeMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, tree.size());
        assertTrue(tree.isEmpty());

        // Test simple insertion
        tree.put(3, "three");
        assertEquals(1, tree.size());
        assertEquals(3, (int)tree.root().getElement().getKey());

        // Test insertion that triggers a single rotation, right rotation
        tree.put(2, "two");
        tree.put(1, "one");
        assertEquals(2, (int)tree.root().getElement().getKey());
        assertEquals(3, (int)tree.right(tree.root()).getElement().getKey());

        // Test insertion that triggers a double rotation, left-right rotation
//        tree.put(4, "four");
//        tree.put(5, "five"); // This should trigger restructuring
        // Assert the new structure of the tree
    }
    
    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        assertTrue(tree.isEmpty());
        assertNull(tree.get(1));
        
        tree.put(1, "one");
        assertEquals("one", tree.get(1));
        // Key 2 does not exist
        assertNull(tree.get(2));
    }
    
    /**
     * Test the output of the remove(k) behavior
     */     
    @Test
    public void testRemove() {
        assertTrue(tree.isEmpty());
        
        tree.put(3, "three");
        tree.put(1, "one");
        tree.put(4, "four");
        tree.put(2, "two");
        tree.put(5, "five");

        // Test removing a leaf
        tree.remove(2);
        assertNull(tree.get(2));

        // Test removing a node with one child
        tree.remove(4);
        assertNull(tree.get(4));

        // Test removing a node with two children
        tree.remove(3);
        assertNull(tree.get(3));
    }
    
    @Test
    public void testTallerChildRight() {
        assertTrue(tree.isEmpty());
        
        tree.put(3, "three");
        tree.put(2, "two");
        tree.put(4, "four");
        tree.put(5, "five");
        
        tree.put(5, "five");
        tree.put(3, "three");
        tree.put(6, "six");
        tree.put(2, "two");
        tree.put(4, "four");
        
        tree.put(3, "three");
        tree.put(2, "two");
        tree.put(4, "four");
    }
}
