package edu.ncsu.csc316.dsa.map.hashing;

import static org.junit.Assert.*;
import java.util.Iterator;
import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.map.Map;

/**
 * Test class for SeparateChainingHashMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * a separate chaining hash map data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class SeparateChainingHashMapTest {

    // 'Testing' Map used (no randomization) to check ordering of contents
    private Map<Integer, String> testMap;
    
    // 'Production' Map (with randomization) to check correctness of ADT behaviors
    private Map<Integer, String> prodMap;
    
    /**
     * Create a new instance of a separate chaining hash map before each test case executes
     */     
    @Before
    public void setUp() {
        // Use the "true" flag to indicate we are TESTING.
        // Remember that (when testing) alpha = 1, beta = 1, and prime = 7
        // based on our AbstractHashMap constructor.
        // That means you can draw the hash table by hand
        // if you use integer keys, since Integer.hashCode() = the integer value, itself
        // Finally, apply compression. For example:
        // for key = 1: h(1) = ( (1 * 1 + 1) % 7) % 7 = 2
        // for key = 2: h(2) = ( (1 * 2 + 1) % 7) % 7 = 3
        // for key = 3: h(3) = ( (1 * 3 + 1) % 7) % 7 = 4
        // for key = 4: h(4) = ( (1 * 4 + 1) % 7) % 7 = 5
        // for key = 5: h(5) = ( (1 * 5 + 1) % 7) % 7 = 6
        // for key = 6: h(6) = ( (1 * 6 + 1) % 7) % 7 = 0
        // etc.
        // Remember that our secondary map (an AVL tree) is a search
        // tree, which means the entries should be sorted in order within
        // that tree
        testMap = new SeparateChainingHashMap<Integer, String>(7, true);
        prodMap = new SeparateChainingHashMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, testMap.size());
        assertTrue(testMap.isEmpty());
        assertNull(testMap.put(3, "string3"));

        // Since our entrySet method returns the entries in the table
        // from left to right, we can use the entrySet to check
        // that our values are in the correct order in the hash table.
        // Alternatively, you could implement a toString() method if you
        // want to check that the exact index/map of each bucket is correct
        Iterator<Map.Entry<Integer,String>> it = testMap.entrySet().iterator();
        assertEquals(3, (int)it.next().getKey()); // should be in a map in index 4
        
        
        assertNull(testMap.put(4, "string4"));
        assertEquals(2, testMap.size());
        assertFalse(testMap.isEmpty());
        it = testMap.entrySet().iterator();
        assertEquals(3, (int)it.next().getKey()); // should be in a map in index 4
        assertEquals(4, (int)it.next().getKey()); // should be in a map in index 5
        
        //TODO: complete this test case
        // You should create some collisions to check that entries
        // are placed in the correct buckets.
        //
        // You should also use the prodMap to check that put works
        // as expected when randomization is used internally. You can't
        // check the placement of entries within the hash table,
        // but you can still check that put gives the correct outputs when
        // randomization is used internally.
    }
    
    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        assertTrue(testMap.isEmpty());
        testMap.put(3, "string3");
        assertEquals("string3", testMap.get(3));
        
        // Test for a non-existing key
        assertNull(testMap.get(99));
        
        // Using prodMap
        assertNull(prodMap.get(99));
        prodMap.put(3, "string3");
        assertEquals("string3", prodMap.get(3));    }
    
    /**
     * Test the output of the remove(k) behavior
     */     
    @Test
    public void testRemove() {
        assertTrue(testMap.isEmpty());
        testMap.put(3, "string3");
        assertEquals("string3", testMap.remove(3));
        assertNull(testMap.remove(3)); // Should return null as key 3 should be removed already
        
        // Using prodMap
        prodMap.put(3, "string3");
        assertEquals("string3", prodMap.remove(3));
        assertNull(prodMap.remove(3)); // Should return null as key 3 should be removed already
    }
    
    /**
     * Test the output of the iterator() behavior, including expected exceptions
     */   
    @Test
    public void testIterator() {
        testMap.put(3, "string3");
        testMap.put(4, "string4");
        
        Iterator<Integer> it = testMap.iterator();
        assertTrue(it.hasNext());
        assertEquals(Integer.valueOf(3), it.next());
        assertEquals(Integer.valueOf(4), it.next());
        assertFalse(it.hasNext());
    }
    
    /**
     * Test the output of the entrySet() behavior
     */   
    @Test
    public void testEntrySet() {
        testMap.put(3, "string3");
        testMap.put(4, "string4");
        
        Iterator<Map.Entry<Integer, String>> it = testMap.entrySet().iterator(); 
        assertTrue(it.hasNext());
        Map.Entry<Integer, String> entry = it.next();
        assertEquals(Integer.valueOf(3), entry.getKey());
        assertEquals("string3", entry.getValue());
        
        entry = it.next();
        assertEquals(Integer.valueOf(4), entry.getKey());
        assertEquals("string4", entry.getValue());
        assertFalse(it.hasNext());
    }
    
    /**
     * Test the output of the values() behavior
     */   
    @Test
    public void testValues() {
        testMap.put(3, "string3");
        testMap.put(4, "string4");
        
        Iterator<String> it = testMap.values().iterator();
        assertTrue(it.hasNext());
        assertEquals("string3", it.next());
        assertEquals("string4", it.next());
        assertFalse(it.hasNext());
    }
}
