package edu.ncsu.csc316.dsa.priority_queue;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import edu.ncsu.csc316.dsa.data.Student;
import edu.ncsu.csc316.dsa.data.StudentIDComparator;
import edu.ncsu.csc316.dsa.priority_queue.PriorityQueue.Entry;

/**
 * Test class for HeapPriorityQueue
 * Checks the expected outputs of the Priorty Queue abstract data type behaviors when using
 * a min-heap data structure 
 *
 * @author Dr. King
 * @author // Your Name Here 
 *
 */
public class HeapPriorityQueueTest {

    private PriorityQueue<Integer, String> heap;
    
    /**
     * Create a new instance of a heap before each test case executes
     */     
    @Before
    public void setUp() {
        heap = new HeapPriorityQueue<Integer,String>();
    }
    
    /**
     * Test the output of the insert(k,v) behavior
     */     
    @Test
    public void testInsert() {
        assertTrue(heap.isEmpty());
        assertTrue(heap.size() == 0);
        
        heap.insert(8, "eight");
        assertEquals(1, heap.size());
        assertFalse(heap.isEmpty());
        assertEquals(8, (int)heap.min().getKey());
        
        // Insert more elements and test the min value.
        heap.insert(3, "three");
        heap.insert(5, "five");
        heap.insert(2, "two");
        heap.insert(7, "seven");
        
        // Now the min should be 2.
        assertEquals(Integer.valueOf(2), heap.min().getKey());
        assertEquals(5, heap.size());
    }
    
    /**
     * Test the output of the min behavior
     */ 
    @Test
    public void testMin() {
        assertTrue(heap.isEmpty());
        assertTrue(heap.size() == 0);
        
        assertNull(heap.min());
        
        heap.insert(5, "five");
        assertEquals(Integer.valueOf(5), heap.min().getKey());
        
        heap.insert(3, "three");
        assertEquals(Integer.valueOf(3), heap.min().getKey());
        
        heap.insert(7, "seven");
        // The min should still be 3 after inserting a higher key.
        assertEquals(Integer.valueOf(3), heap.min().getKey());
    }
    
    /**
     * Test the output of the deleteMin behavior
     */     
    @Test 
    public void deleteMin() {
        assertTrue(heap.isEmpty());
        assertEquals(0, heap.size());
        
        assertNull(heap.deleteMin());
        
        heap.insert(5, "five");
        heap.insert(3, "three");
        heap.insert(7, "seven");
        
        assertEquals(Integer.valueOf(3), heap.deleteMin().getKey());
        assertEquals(Integer.valueOf(5), heap.min().getKey());
        assertEquals(Integer.valueOf(5), heap.deleteMin().getKey());
        assertEquals(Integer.valueOf(7), heap.min().getKey());
        assertEquals(Integer.valueOf(7), heap.deleteMin().getKey());
        
        // The heap should be empty now.
        assertTrue(heap.isEmpty());
        assertNull(heap.deleteMin());
    }
    
    /**
     * Test the output of the heap behavior when using arbitrary key objects to
     * represent priorities
     */ 
    @Test
    public void testStudentHeap() {
        PriorityQueue<Student,String> sHeap = new HeapPriorityQueue<Student, String>(new StudentIDComparator());
        Student s1 = new Student("J","K", 1, 1, 1, "jk1");
        Student s2 = new Student("J","S", 2, 1, 2, "js2");
        Student s3 = new Student("S","H", 3, 1, 3, "sh3");
        Student s4 = new Student("J","J", 4, 1, 4, "jj4");
        Student s5 = new Student("L","B", 5, 1, 5, "lb5");
        
        assertTrue(sHeap.isEmpty());
        assertEquals(0, sHeap.size());
        
        // Insert students and check the one with the lowest ID is at the min position.
        sHeap.insert(s1, "s1");
        sHeap.insert(s2, "s2");
        sHeap.insert(s3, "s3");
        sHeap.insert(s4, "s4");
        sHeap.insert(s5, "s5");
        
        assertEquals(s1, sHeap.min().getKey());
        assertEquals(5, sHeap.size());
        
        sHeap.deleteMin();
        assertEquals(s2, sHeap.min().getKey());
    }
}