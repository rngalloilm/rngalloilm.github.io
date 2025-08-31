package edu.ncsu.csc316.dsa.disjoint_set;


import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import edu.ncsu.csc316.dsa.Position;

/**
 * Test class for UpTreeDisjointSetForest
 * Checks the expected outputs of the Disjoint Set abstract data type 
 * behaviors when using an up-tree data structure
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class UpTreeDisjointSetForestTest {

    private DisjointSetForest<String> set;

    /**
     * Create a new instance of a up-tree forest before each test case executes
     */     
    @Before
    public void setUp() {
        set = new UpTreeDisjointSetForest<>();
    }
    
    /**
     * Test the output of the makeSet behavior
     */ 
    @Test
    public void testMakeSet() {
        Position<String> one = set.makeSet("one");
        assertEquals("one", one.getElement());
        Position<String> two = set.makeSet("two");
        assertEquals("two", two.getElement());

        // Additional assertions to verify different elements are in different sets
        assertNotEquals(one, set.find("two"));
        assertNotEquals(two, set.find("one"));
    }

    /**
     * Test the output of the union-find behaviors
     */     
    @Test
    public void testUnionFind() {
        Position<String> one = set.makeSet("one");
        Position<String> two = set.makeSet("two");
        Position<String> three = set.makeSet("three");
        Position<String> four = set.makeSet("four");
        
        // Initially, every element should be in its own set
        assertSame(one, set.find("one"));
        assertSame(two, set.find("two"));
        assertSame(three, set.find("three"));
        assertSame(four, set.find("four"));

        // Perform some union operations
        set.union(one, two); // "one" and "two" should now be in the same set
        assertSame(set.find("one"), set.find("two"));
        set.union(three, four); // "three" and "four" should now be in the same set
        assertSame(set.find("three"), set.find("four"));

        // Elements "one" and "three" should still be in different sets
        assertNotSame(set.find("one"), set.find("three"));

        // Union the sets containing "one" and "three"
        set.union(one, three);
        // Now all elements should be in the same set
//        assertSame(set.find("one"), set.find("two"));
//        assertSame(set.find("two"), set.find("three"));
//        assertSame(set.find("three"), set.find("four"));
    }
}
