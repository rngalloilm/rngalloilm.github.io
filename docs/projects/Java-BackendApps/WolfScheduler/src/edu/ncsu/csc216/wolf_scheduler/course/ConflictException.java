/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.course;

/**
 * Custom exception to be used given an error in checking for an overlap on the schedule
 * @author Nick Gallo
 */
public class ConflictException extends Exception {
	
	/** ID used for serialization. */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Sends the custom message to Exception
	 * @param message the custom message
	 */
	public ConflictException(String message) {
        super(message);
    }
    
	/**
	 * Set the default message
	 */
    public ConflictException() {
        this("Schedule conflict.");
    }

}
