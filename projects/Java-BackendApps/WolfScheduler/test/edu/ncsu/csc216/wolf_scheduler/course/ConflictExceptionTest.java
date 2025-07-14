/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.course;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

/**
 * Testing of all ConflictException methods
 * @author Nick Gallo
 */
class ConflictExceptionTest {

	/**
	 * Checks the functionality of the ConflictException subclass constructor
	 */
	@Test
	public void testConflictExceptionString() {
	    ConflictException ce = new ConflictException("Custom exception message");
	    assertEquals("Custom exception message", ce.getMessage());
	}

	/**
	 * Checks to determine if the default message is correct
	 */
	@Test
	void testConflictException() {
		try {
			throw new ConflictException();
        } catch (ConflictException e) {
            //Check if the default message
            assertEquals("Schedule conflict.", e.getMessage());
        }
	}

}
