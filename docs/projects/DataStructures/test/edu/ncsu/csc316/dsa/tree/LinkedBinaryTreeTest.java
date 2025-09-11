package edu.ncsu.csc316.dsa.tree;

import static org.junit.Assert.*;
import java.util.Iterator;
import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.Position;

/**
 * Test class for LinkedBinaryTree
 * Checks the expected outputs of the BinaryTree abstract data type behaviors when using
 * a linked data structure to store elements
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class LinkedBinaryTreeTest {

    private LinkedBinaryTree<String> tree;
    private Position<String> one;
    private Position<String> two;
    private Position<String> three;
    private Position<String> four;
    private Position<String> five;
    private Position<String> six;
    private Position<String> seven;
    private Position<String> eight;
    private Position<String> nine;
    private Position<String> ten;

    /**
     * Create a new instance of a linked binary tree before each test case executes
     */       
    @Before
    public void setUp() {
        tree = new LinkedBinaryTree<String>(); 
    }
    
    /**
     * Sample tree to help with testing
     *
     * One
     * -> Two
     *   -> Six
     *   -> Ten
     *     -> Seven
     *     -> Five
     * -> Three
     *   -> Four
     *     -> Eight
     *     -> Nine
     * 
     * Or, visually:
     *                    one
     *                /        \
     *             two          three
     *            /   \            /
     *         six   ten          four
     *              /   \        /     \
     *            seven  five  eight nine    
     */  
    private void createTree() {
        one = tree.addRoot("one");
        two = tree.addLeft(one, "two");
        three = tree.addRight(one, "three");
        six = tree.addLeft(two, "six");
        ten = tree.addRight(two, "ten");
        four = tree.addLeft(three, "four");
        seven = tree.addLeft(ten, "seven");
        five = tree.addRight(ten,"five");
        eight = tree.addLeft(four, "eight");
        nine = tree.addRight(four, "nine");
    }
    
    /**
     * Test the output of the set(p,e) behavior
     */     
    @Test
    public void testSet() {
        createTree();
        assertEquals("six", tree.set(six, "SIX"));
        assertEquals("SIX", six.getElement());
    }
    
    /**
     * Test the output of the size() behavior
     */     
    @Test
    public void testSize() {
        assertTrue(tree.isEmpty());
        createTree();
        assertEquals(10, tree.size());
    }
    
    /**
     * Test the output of the numChildren(p) behavior
     */     
    @Test
    public void testNumChildren() {
        assertTrue(tree.isEmpty());
        createTree();
        assertEquals(2, tree.numChildren(one));
        assertEquals(2, tree.numChildren(four));
        assertEquals(0, tree.numChildren(nine));
    }

    /**
     * Test the output of the parent(p) behavior
     */   
    @Test
    public void testParent() {
        createTree();
        assertEquals(one, tree.parent(two));
        assertNull(tree.parent(one));
    }

    /**
     * Test the output of the sibling behavior
     */     
    @Test
    public void testSibling() {
        createTree();
        assertEquals(three, tree.sibling(two));
        assertEquals(two, tree.sibling(three));
        assertNull(tree.sibling(one));
    }

    /**
     * Test the output of the isInternal behavior
     */     
    @Test
    public void testIsInternal() {
        createTree();
        assertTrue(tree.isInternal(two));
        assertFalse(tree.isInternal(nine));
    }

    /**
     * Test the output of the isLeaf behavior
     */     
    @Test
    public void isLeaf() {
        createTree();
        assertFalse(tree.isLeaf(two));
        assertTrue(tree.isLeaf(nine));
    }

    /**
     * Test the output of the isRoot(p)
     */     
    @Test
    public void isRoot() {
        createTree();
        assertTrue(tree.isRoot(one));
        assertFalse(tree.isRoot(two));
    }
    
    /**
     * Test the output of the preOrder traversal behavior
     */     
    @Test
    public void testPreOrder() {
        createTree();
        Iterator<Position<String>> it = tree.preOrder().iterator();
        assertEquals(one, it.next());
        assertEquals(two, it.next());
    }

    /**
     * Test the output of the postOrder traversal behavior
     */     
    @Test
    public void testPostOrder() {
        createTree();
        Iterator<Position<String>> it = tree.postOrder().iterator();
        assertEquals(six, it.next());
    }
    
    /**
     * Test the output of the inOrder traversal behavior
     */     
    @Test
    public void testInOrder() {
        createTree();
        Iterator<Position<String>> it = tree.inOrder().iterator();
        assertEquals(six, it.next());
    }

    /**
     * Test the output of the Binary Tree ADT behaviors on an empty tree
     */     
    @Test
    public void testEmptyTree() {
        assertTrue(tree.isEmpty());
        assertEquals(0, tree.size());
        assertNull(tree.root());
    }
    
    @Test
    public void testLevelOrder() {
        createTree();
        Iterator<Position<String>> it = tree.levelOrder().iterator();
        assertEquals(one, it.next());
    }

    /**
     * Test the output of the addLeft(p,e) behavior, including expected exceptions
     */      
    @Test
    public void testAddLeft() {
        one = tree.addRoot("one");
        two = tree.addLeft(one, "two");
        assertEquals("two", two.getElement());
        try {
            tree.addLeft(one, "new left");
            fail("Should throw IllegalArgumentException as 'one' already has a left child.");
        } catch (IllegalArgumentException e) {
            // Expected exception
        }
    }
    
    /**
     * Test the output of the addRight(p,e) behavior, including expected exceptions
     */      
    @Test
    public void testAddRight() {
        one = tree.addRoot("one");
        three = tree.addRight(one, "three");
        assertEquals("three", three.getElement());
        try {
            tree.addRight(one, "new right");
            fail("Should throw IllegalArgumentException as 'one' already has a right child.");
        } catch (IllegalArgumentException e) {
            // Expected exception
        }
    }   
    
    /**
     * Test the output of the remove(p) behavior, including expected exceptions
     */         
    @Test
    public void testRemove() {
        createTree();
        assertEquals("seven", tree.remove(seven));
        assertEquals(9, tree.size());
        try {
            tree.remove(four); // 'four' has two children and should not be removable.
            fail("Should throw IllegalArgumentException as 'four' has two children.");
        } catch (IllegalArgumentException e) {
            // Expected exception
        }
    }
    
    @Test
    public void testToString() {
        createTree(); // This method should build your tree
        String expected = "LinkedBinaryTree[\n" +
                          "one\n" +
                          " two\n" +
                          "  six\n" +
                          "  ten\n" +
                          "   seven\n" +
                          "   five\n" +
                          " three\n" +
                          "  four\n" +
                          "   eight\n" +
                          "   nine\n" +
                          "]";
        assertEquals(expected, tree.toString().trim());
    }
}
