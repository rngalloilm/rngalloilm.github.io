package edu.ncsu.csc316.dsa.map.hashing;

import static org.junit.Assert.*;
import java.util.Iterator;
import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.map.Map;

/**
 * Test class for LinearProbingHashMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * a linear probing hash map data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class LinearProbingHashMapTest {

    // 'Testing' Map used (no randomization) to check placement of entries in the hash table
    private Map<Integer, String> testMap;
    
    // 'Production' Map (with randomization) to check correctness of ADT behaviors
    private Map<Integer, String> prodMap;

    /**
     * Create a new instance of a linear probing hash map before each test case executes
     */     
    @Before
    public void setUp() {
        // Use the "true" flag to indicate we are testing.
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
        testMap = new LinearProbingHashMap<Integer, String>(7, true);
        prodMap = new LinearProbingHashMap<Integer, String>();
    }
    
    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, testMap.size());
        assertTrue(testMap.isEmpty());

        // Inserting values and checking the return value for put()
        assertNull(testMap.put(1, "one")); // Should go at index 2
        assertNull(testMap.put(8, "eight")); // Should go at index 2, but will be probed to the next available slot due to collision with "one"

        assertEquals("one", testMap.get(1));
        assertEquals("eight", testMap.get(8));
        assertEquals(2, testMap.size());
        
        // Updating existing key
        assertEquals("one", testMap.put(1, "newOne")); // Should update "one" and return the old value
        assertEquals("newOne", testMap.get(1));

        // Using prodMap to check put with randomization
        assertNull(prodMap.put(1, "one"));
        assertEquals("one", prodMap.put(1, "newOne"));
        assertEquals("newOne", prodMap.get(1));
    }
    
    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        assertTrue(testMap.isEmpty());
        
        // Testing get on empty map
        assertNull(testMap.get(1));

        // Inserting and getting values
        testMap.put(1, "one");
        assertEquals("one", testMap.get(1));
        
        // Using prodMap
        prodMap.put(1, "one");
        assertEquals("one", prodMap.get(1));
        assertNull(prodMap.get(2)); // Key 2 has not been added
    }
    
    /**
     * Test the output of the remove(k) behavior
     */ 
    @Test
    public void testRemove() {
        assertTrue(testMap.isEmpty());

        // Testing remove on empty map
        assertNull(testMap.remove(1));

        // Removing values
        testMap.put(1, "one");
        assertEquals("one", testMap.remove(1));
        assertNull(testMap.remove(1)); // Already removed, should return null

        // Using prodMap
        prodMap.put(1, "one");
        assertEquals("one", prodMap.remove(1));
        assertNull(prodMap.remove(1)); // Already removed
    }
    
    /**
     * Test the output of the iterator() behavior, including expected exceptions
     */     
    @Test
    public void testIterator() {
        // Adding entries to test iteration order
        testMap.put(1, "one");
        testMap.put(8, "eight"); // Will collide with 1 and should probe to next slot

        Iterator<Integer> it = testMap.iterator();
        assertTrue(it.hasNext());
        assertEquals(Integer.valueOf(1), it.next());
        assertEquals(Integer.valueOf(8), it.next());
        assertFalse(it.hasNext());
    }
    
    /**
     * Test the output of the entrySet() behavior
     */     
    @Test
    public void testEntrySet() {
        // Adding entries to test entrySet
        testMap.put(1, "one");
        testMap.put(8, "eight");

        Iterator<Map.Entry<Integer, String>> it = testMap.entrySet().iterator();
        assertTrue(it.hasNext());
        Map.Entry<Integer, String> entry = it.next();
        assertEquals(Integer.valueOf(1), entry.getKey());
        assertEquals("one", entry.getValue());
        
        entry = it.next();
        assertEquals(Integer.valueOf(8), entry.getKey());
        assertEquals("eight", entry.getValue());
        assertFalse(it.hasNext());
    }
    
    /**
     * Test the output of the values() behavior
     */  
    @Test
    public void testValues() {
     // Adding entries to test values
        testMap.put(1, "one");
        testMap.put(8, "eight");

        Iterator<String> it = testMap.values().iterator();
        assertTrue(it.hasNext());
        assertEquals("one", it.next());
        assertEquals("eight", it.next());
        assertFalse(it.hasNext());
    }
    
    @Test
    public void testPutWithResize() {
        // Assuming default capacity is 17 and load factor threshold is 0.5
        // Need to add more than 8 items to trigger a resize
        for (int i = 0; i < 9; i++) {
            testMap.put(i, "Value" + i);
        }
        assertEquals(9, testMap.size());

        // Now check if the table has been resized
        testMap.put(10, "Value10");
        assertEquals("Value10", testMap.get(10));
        
        // Check the resizing when randomization is used internally
        for (int i = 0; i < 9; i++) {
            prodMap.put(i, "Value" + i);
        }
        assertEquals(9, prodMap.size());
        prodMap.put(10, "Value10");
        assertEquals("Value10", prodMap.get(10));

        assertTrue(((LinearProbingHashMap<Integer, String>)prodMap).capacity() > 17);
    }
}