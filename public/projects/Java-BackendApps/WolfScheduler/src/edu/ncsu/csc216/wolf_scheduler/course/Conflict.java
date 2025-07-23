/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.course;

/**
 * Used to check Courses and Events for overlap in their scheduled time periods
 * @author Nick Gallo
 */
public interface Conflict {

	/**
	 * Compares the current instance with the parameter possibleConflictingActivity to 
	 * see if there is any conflict in their days and times.If there is a conflict, 
	 * the checked ConflictException is thrown
	 * @param possibleConflictingActivity the prompted Activity
	 * @throws ConflictException custom checked exception specifically for conflicts
	 */
	void checkConflict(Activity possibleConflictingActivity) throws ConflictException;

}
