package edu.ncsu.csc316.dsa.queue;

import static org.junit.Assert.*;
import java.util.NoSuchElementException;
import org.junit.Before;
import org.junit.Test;

/**
 * Test class for ArrayBasedQueue.
 * Checks the expected outputs of the Queue abstract data type behaviors when using
 * a circular array-based data structure
 *
 * @author Dr. King
 *
 */
public class ArrayBasedQueueTest {

    private Queue<String> queue;
    
    /**
     * Create a new instance of a circular array-based queue before each test case executes
     */ 
    @Before
    public void setUp() {
        queue = new ArrayBasedQueue<String>();
    }

    /**
     * Test the output of the enqueue(e) behavior
     */     
    @Test
    public void testEnqueue() {
        assertEquals(0, queue.size());
        assertTrue(queue.isEmpty());
        
        queue.enqueue("one");
        assertEquals(1, queue.size());
        assertFalse(queue.isEmpty());
        
        //TODO: complete this test case
    }
    
    /**
     * Test the output of the dequeue(e) behavior, including expected exceptions
     */     
    @Test
    public void testDequeue() {
        assertEquals(0, queue.size());
        try {
            queue.dequeue();
            fail("NoSuchElementException should have been thrown.");        
        } catch (Exception e) {
            assertTrue(e instanceof NoSuchElementException);
        }        
        
        queue.enqueue("one");
        queue.enqueue("two");
        queue.enqueue("three");
        
        assertEquals("one", queue.dequeue());
        assertEquals(2, queue.size());
        
        assertEquals("two", queue.dequeue());
        assertEquals(1, queue.size());
        
        queue.enqueue("four");
        assertEquals(2, queue.size()); // size should be 2 now ("three", "four")
        
        assertEquals("three", queue.dequeue());
        assertEquals("four", queue.dequeue());
        
        try {
            queue.dequeue();
            fail("NoSuchElementException should have been thrown after removing all elements.");
        } catch (Exception e) {
            assertTrue(e instanceof NoSuchElementException);
        }
        

    }
    
    /**
     * Test the output of the front() behavior, including expected exceptions
     */     
    @Test
    public void testFront() {
        try {
            queue.front();
            fail("NoSuchElementException should have been thrown on empty queue.");
        } catch (Exception e) {
            assertTrue(e instanceof NoSuchElementException);
        }
        
        queue.enqueue("one");
        assertEquals("one", queue.front());
        
        queue.enqueue("two");
        // The front should still be "one" after enqueuing "two"
        assertEquals("one", queue.front());
        
        queue.dequeue();
        // After dequeuing "one", the front should now be "two"
        assertEquals("two", queue.front());
        
        queue.dequeue();
        try {
            queue.front();
            fail("NoSuchElementException should have been thrown after removing all elements.");
        } catch (Exception e) {
            assertTrue(e instanceof NoSuchElementException);
        }
    }

}
