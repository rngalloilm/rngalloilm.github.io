package edu.ncsu.csc316.dsa.map;

import static org.junit.Assert.*;
import java.util.Iterator;
import java.util.NoSuchElementException;

import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.data.Student;
import edu.ncsu.csc316.dsa.data.StudentIDComparator;

/**
 * Test class for SearchTableMap
 * Checks the expected outputs of the Map abstract data type behaviors when using
 * a sorted array-based data structure that uses binary search to locate entries
 * based on the key of the entry
 *
 * @author Dr. King
 *
 */
public class SearchTableMapTest {

    private Map<Integer, String> map;
    private Map<Student, Integer> studentMap;
    
    /**
     * Create a new instance of a search table map before each test case executes
     */     
    @Before
    public void setUp() {
        map = new SearchTableMap<Integer, String>();
        studentMap = new SearchTableMap<Student, Integer>();
    }

    /**
     * Test the output of the put(k,v) behavior
     */     
    @Test
    public void testPut() {
        assertEquals(0, map.size());
        assertTrue(map.isEmpty());
        assertNull(map.put(3, "string3"));
        assertEquals("SearchTableMap[3]", map.toString());
        assertEquals(1, map.size());
        
        //TODO: complete this test case
    }

    /**
     * Test the output of the get(k) behavior
     */     
    @Test
    public void testGet() {
        assertTrue(map.isEmpty());
        assertNull(map.put(3, "string3"));
        assertNull(map.put(5, "string5"));
        assertNull(map.put(2, "string2"));
        assertNull(map.put(4, "string4"));
        assertNull(map.put(1, "string1"));
        assertFalse(map.isEmpty());
        assertEquals("SearchTableMap[1, 2, 3, 4, 5]", map.toString());
        
        assertEquals("string1",map.get(1));
        assertEquals("SearchTableMap[1, 2, 3, 4, 5]", map.toString());
        
        //TODO: complete this test case
    }

    /**
     * Test the output of the remove(k) behavior
     */     
    @Test
    public void testRemove() {
        assertTrue(map.isEmpty());
        assertNull(map.put(3, "string3"));
        assertNull(map.put(5, "string5"));
        assertEquals(2, map.size());

        assertEquals("string3", map.remove(3));
        assertEquals(1, map.size());
        assertNull(map.remove(3));
        assertEquals("string5", map.remove(5));
        assertTrue(map.isEmpty());
    }
    
    /**
     * Tests Map abstract data type behaviors to ensure the behaviors work
     * as expected when using arbitrary objects as keys
     */
//    @Test
//    public void testStudentMap() {
//        Student s1 = new Student("J","K", 1, 0, 0, "jk");
//        Student s2 = new Student("J","S", 2, 0, 0, "js");
//        Student s3 = new Student("S","H", 3, 0, 0, "sh");
//        Student s4 = new Student("J","J", 4, 0, 0, "jj");
//        Student s5 = new Student("L","B", 5, 0, 0, "lb");
//        
//        //TODO: complete this test case
//        // Suggestions: since search table map keys are Comparable,
//        // make sure the search table works with Comparable objects like Students
//    }
    
    /**
     * Test the output of the iterator behavior, including expected exceptions
     */ 
    @Test
    public void testIterator() {
        map.put(1, "string1");
        map.put(2, "string2");
        map.put(3, "string3");

        Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
        assertTrue(it.hasNext());
        assertEquals("string1", it.next().getValue());
        assertEquals("string2", it.next().getValue());
        assertEquals("string3", it.next().getValue());
        assertFalse(it.hasNext());
    }

    /**
     * Test the output of the entrySet() behavior, including expected exceptions
     */     
    @Test
    public void testEntrySet() {
        assertNull(map.put(3, "string3"));
        assertNull(map.put(5, "string5"));
        assertNull(map.put(2, "string2"));
        assertNull(map.put(4, "string4"));
        assertNull(map.put(1, "string1"));
        
        Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
        assertTrue(it.hasNext());
        Map.Entry<Integer, String> entry = it.next();
        assertEquals(1, (int)(entry.getKey()));
        assertEquals("string1", (String)(entry.getValue()));

        //TODO: complete this test case
    }

    /**
     * Test the output of the values() behavior, including expected exceptions
     */  
    @Test
    public void testValues() {
        assertNull(map.put(3, "string3"));
        assertNull(map.put(5, "string5"));
        assertNull(map.put(2, "string2"));
        assertNull(map.put(4, "string4"));
        assertNull(map.put(1, "string1"));
        
        Iterator<String> it = map.values().iterator();
        assertTrue(it.hasNext());
        
        //TODO: complete this test case
    }
    
    @Test
    public void testKeyIterator() {
        // Add some elements to the map
        map.put(1, "string1");
        map.put(2, "string2");
        map.put(3, "string3");

        // Create a key iterator
        Iterator<Integer> keyIterator = map.iterator();

        // Check if the iterator has the next element and get the next key
        assertTrue(keyIterator.hasNext());
        assertEquals(Integer.valueOf(1), keyIterator.next());

        assertTrue(keyIterator.hasNext());
        assertEquals(Integer.valueOf(2), keyIterator.next());

        assertTrue(keyIterator.hasNext());
        assertEquals(Integer.valueOf(3), keyIterator.next());

        // Check if the iterator has no more elements
        assertFalse(keyIterator.hasNext());

        // Verify that calling next() on an empty iterator throws NoSuchElementException
        try {
            keyIterator.next();
            fail("Should have thrown NoSuchElementException");
        } catch (NoSuchElementException e) {
            // Test passed
        }

        // Verify that calling remove() throws UnsupportedOperationException
        try {
            keyIterator.remove();
            fail("Should have thrown UnsupportedOperationException");
        } catch (UnsupportedOperationException e) {
            // Test passed
        }
    }
    
    @Test
    public void testValueIterator() {
        // Add some elements to the map
        map.put(1, "string1");
        map.put(2, "string2");
        map.put(3, "string3");

        // Create a value iterator
        Iterator<String> valueIterator = map.values().iterator();

        // Check if the iterator has the next element and get the next value
        assertTrue(valueIterator.hasNext());
        assertEquals("string1", valueIterator.next());

        assertTrue(valueIterator.hasNext());
        assertEquals("string2", valueIterator.next());

        assertTrue(valueIterator.hasNext());
        assertEquals("string3", valueIterator.next());

        // Check if the iterator has no more elements
        assertFalse(valueIterator.hasNext());

        // Verify that calling next() on an empty iterator throws NoSuchElementException
        try {
            valueIterator.next();
            fail("Should have thrown NoSuchElementException");
        } catch (NoSuchElementException e) {
            // Test passed
        }

        // Verify that calling remove() throws UnsupportedOperationException
        try {
            valueIterator.remove();
            fail("Should have thrown UnsupportedOperationException");
        } catch (UnsupportedOperationException e) {
            // Test passed
        }
    }
}
