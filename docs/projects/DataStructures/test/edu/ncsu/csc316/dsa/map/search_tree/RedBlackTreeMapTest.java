package edu.ncsu.csc316.dsa.map.search_tree;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 * Test class for RedBlackTreeMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * a red-black tree data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class RedBlackTreeMapTest {

    private BinarySearchTreeMap<Integer, String> tree;
    
    /**
     * Create a new instance of a red-black tree-based map before each test case executes
     */  
    @Before
    public void setUp() {
        tree = new RedBlackTreeMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, tree.size());
        assertTrue(tree.isEmpty());

        // Insert nodes and check the red-black properties
        tree.put(10, "ten");
        tree.put(15, "fifteen");
        tree.put(5, "five");

        assertEquals(10, (int)tree.root().getElement().getKey());
//        assertTrue(isBlack(tree.root()));

        assertEquals(5, (int)tree.left(tree.root()).getElement().getKey());
        assertEquals(15, (int)tree.right(tree.root()).getElement().getKey());

        // Check colors of the nodes
//        assertTrue(isRed(tree.left(tree.root())));
//        assertTrue(isRed(tree.right(tree.root())));   
    }
    
    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        assertNull(tree.get(10));
        tree.put(10, "ten");
        assertEquals("ten", tree.get(10));

        // Further test get operation with more nodes added
        tree.put(20, "twenty");
        tree.put(5, "five");
        assertEquals("twenty", tree.get(20));
        assertEquals("five", tree.get(5));
    }
    
    /**
     * Test the output of the remove(k) behavior
     */     
    @Test
    public void testRemove() {
        tree.put(10, "ten");
        tree.put(20, "twenty");
        tree.put(5, "five");

        // Removing a leaf node
        assertEquals("five", tree.remove(5));
        assertNull(tree.get(5));
        // Check if the tree structure and properties are maintained

        // Removing a node with one child
        assertEquals("twenty", tree.remove(20));
        assertNull(tree.get(20));
        // Check if the tree structure and properties are maintained

        // Removing a node with two children
        tree.put(15, "fifteen");
        assertEquals("ten", tree.remove(10));
        assertNull(tree.get(10)); 
    }
    
    @Test
    public void testResolveRed() {
        // Insert nodes to create a double-red condition
        tree.put(30, "thirty");
        tree.put(20, "twenty");
        tree.put(10, "ten"); // This should cause a double-red problem

        // Check if tree structure is correct after resolution
        assertEquals(20, (int)tree.root().getElement().getKey());
//        assertTrue(isBlack(tree.root()));

        assertEquals(10, (int)tree.left(tree.root()).getElement().getKey());
//        assertTrue(isRed(tree.left(tree.root())));

        assertEquals(30, (int)tree.right(tree.root()).getElement().getKey());
//        assertTrue(isRed(tree.right(tree.root())));
    }
    
    @Test
    public void testRemedyDoubleBlack() {
        // Insert nodes and ensure tree balance
        tree.put(3, "three");
        tree.put(7, "seven");
        tree.put(4, "four");
        tree.put(5, "five");
        tree.put(12, "twelve");
        tree.put(17, "seventeen");
        tree.put(18, "eighteen");
        tree.put(15, "fifteen");
        tree.put(16, "sixteen");
        tree.put(14, "fourteen");

        // Removing a black node with a black child, which should trigger remedyDoubleBlack
        assertEquals("three", tree.remove(3));
        assertEquals("twelve", tree.remove(12));
        assertEquals("seventeen", tree.remove(17));
        assertEquals("eighteen", tree.remove(18));
    }
}
