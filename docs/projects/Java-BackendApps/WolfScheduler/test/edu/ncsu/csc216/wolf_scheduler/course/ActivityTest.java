/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.course;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

/**
 * Test Activity Class
 * @author Nick Gallo
 */
class ActivityTest {
	
	/**
	 * Must not throw an error in each order, given two non-conflicting activities
	 */
	@Test
	public void testCheckConflict() {
	    Activity a1 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "MW", 1330, 1445);
	    Activity a2 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "TH", 1330, 1445);
	    
	    assertDoesNotThrow(() -> a1.checkConflict(a2));
	    assertDoesNotThrow(() -> a2.checkConflict(a1));
	}
	
	/**
	 * Must throw an error, given two conflicting activities
	 */
	@Test
	public void testCheckConflictWithConflict() {
	    //Activities conflict in each order, same times on Monday
	    Activity a1 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "MW", 1330, 1445);
	    Activity a2 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "M", 1330, 1445);
		
	    Exception e1 = assertThrows(ConflictException.class, () -> a1.checkConflict(a2));
	    assertEquals("Schedule conflict.", e1.getMessage());
		
	    Exception e2 = assertThrows(ConflictException.class, () -> a2.checkConflict(a1));
	    assertEquals("Schedule conflict.", e2.getMessage());
	}
	
	/**
	 * Must throw an error, given two conflicting activities. The endTime for 
	 * instance is the same as the startTime for possiblyConflictingActivity
	 */
	@Test
	public void testCheckConflictWithConflictSameStartandEnd() {
	
		//Activities conflict, endTime for instance is the same as the startTime for possiblyConflictingActivity
	    //Instance
	    Activity a1 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "MW", 1330, 1445);
	    //possiblyConflictingActivity
	    Activity a2 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "M", 1445, 1600);
	    
	    Exception e1 = assertThrows(ConflictException.class, () -> a1.checkConflict(a2));
	    assertEquals("Schedule conflict.", e1.getMessage());
	}
	
	/**
	 * Must throw an error, given two conflicting activities. The possiblyConflictingActivity period starts and
	 * ends within the instance period. The reverse of the Activities is checked as well.
	 */
	@Test
	public void testCheckConflictWithConflictWrappedPeriod() {
	
		//Activities conflict, possiblyConflictingActivity period starts and ends within the instance period
	    //Instance
	    Activity a1 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "MW", 1200, 1500);
	    //possiblyConflictingActivity
	    Activity a2 = new Course("CSC 216", "Software Development Fundamentals", "001", 3, "sesmith5", "M", 1300, 1400);
	    
	    Exception e1 = assertThrows(ConflictException.class, () -> a1.checkConflict(a2));
	    assertEquals("Schedule conflict.", e1.getMessage());
	    
	    Exception e2 = assertThrows(ConflictException.class, () -> a2.checkConflict(a1));
	    assertEquals("Schedule conflict.", e2.getMessage());
	}
}