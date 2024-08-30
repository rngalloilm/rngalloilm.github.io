/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.scheduler;

import edu.ncsu.csc216.wolf_scheduler.course.Activity;
import edu.ncsu.csc216.wolf_scheduler.course.ConflictException;
//import edu.ncsu.csc216.wolf_scheduler.course.ConflictException;
//import java.util.function.BooleanSupplier;
import edu.ncsu.csc216.wolf_scheduler.course.Course;
import edu.ncsu.csc216.wolf_scheduler.course.Event;
import edu.ncsu.csc216.wolf_scheduler.io.ActivityRecordIO;
import edu.ncsu.csc216.wolf_scheduler.io.CourseRecordIO;

//import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

/**
 * This class will manage how the entire schedule runs
 * @author Nick Gallo
 */
public class WolfScheduler {
	/** Number of columns for a half-sized 2D array */
	private static final int ARR_COL_SIZE_SHORT = 3;
	/** Number of columns for a full-sized 2D array */
	private static final int ARR_COL_SIZE_FULL = 6;
	/** An ArrayList of a course catalog */
	private ArrayList<Course> catalog = new ArrayList<Course>();
	/** An ArrayList of a schedule */
	private ArrayList<Activity> schedule = new ArrayList<Activity>();
	/** A String holding the title */
	private String title;

	/**
	 * Constructs a WolfScheduler object with values for the field.
	 * @param fileName is the file that stores the schedule information
	 */
	public WolfScheduler(String fileName) {
		//Populate the catalog
		this.catalog = new ArrayList<Course>();
		//Create the schedule
		this.schedule = new ArrayList<Activity>();
		//Set the default title
		this.title = "My Schedule";
		
		//Use CourseRecordIO method readCourseRecords() to read the file
		try {
			this.catalog = CourseRecordIO.readCourseRecords(fileName);
		} catch (Exception e) {
			throw new IllegalArgumentException("Cannot find file.");
		}
	}

	/**
	 * Gets a table of catalog's name, section, and title information
	 * @return a 2D array holding catalog's information
	 */
	public String[][] getCourseCatalog() {
		//Set the number of courses to an integer
		int catalogSize = catalog.size();
		//Initialize a 2D array to hold the name, section, and title for each course
		String[][] catalogTable = new String[catalogSize][ARR_COL_SIZE_SHORT];
		
		//Fill catalogTable with catalog's information
		for (int i = 0; i < catalogSize; i++) {
			Course c = catalog.get(i);
			catalogTable[i] = c.getShortDisplayArray();
		}
		
		return catalogTable;
	}
	
	/**
	 * Gets a table of schedule's name, section, and title information
	 * @return a 2D array holding schedule's information
	 */
	public String[][] getScheduledActivities() {
		//Set the number of items on the schedule to an integer
		int scheduleSize = schedule.size();
		//Initialize a 2D array to hold the name, section, and title for each course
		String[][] scheduleTable = new String[scheduleSize][ARR_COL_SIZE_SHORT];
		
		//Fill scheduleTable with schedule's information
		for (int i = 0; i < scheduleSize; i++) {
			scheduleTable[i] = schedule.get(i).getShortDisplayArray();
		}
		
		return scheduleTable;
	}

	/**
	 * Gets a table of schedule's name, section, title, credits, 
	 * instructorId, and the meeting days string information
	 * @return a 2D array holding schedule's information
	 */
	public String[][] getFullScheduledActivities() {
		//Set the number of items on the schedule to an integer
		int scheduleSize = schedule.size();
		//Initialize a 2D array to hold the name, section, title, credits, 
		//instructorId, and the meeting days string  for each course
		String[][] scheduleTable = new String[scheduleSize][ARR_COL_SIZE_FULL];
		
		//Fill scheduleTable with schedule's information
		for (int i = 0; i < scheduleSize; i++) {
			scheduleTable[i] = schedule.get(i).getLongDisplayArray();
		}
		
		return scheduleTable;
	}
	
	/**
	 * Input a course name and section number to return the course if found and
	 * null otherwise
	 * @param name the course's name input
	 * @param section the course's section input
	 * @return the course, if found. Null if it doesn't exist
	 */
	public Course getCourseFromCatalog(String name, String section) {
		//Set the number of courses to an integer
		int catalogSize = catalog.size();
		//Initialize where the result of the search is stored
		Course foundCourse = null;
		
		//Iterate through the catalog
		for (int i = 0; i < catalogSize; i++) {
			//Check if the current name matches the input and the current section matches the input
		    if (catalog.get(i).getName().equals(name) && catalog.get(i).getSection().equals(section)) {
		    	//Return the course
		    	foundCourse = catalog.get(i);
		    }
		}
		return foundCourse;
	}
	
	/**
	 * Adds a course to schedule and if the course is null, exists in the catalog, 
	 * or has a conflict with an Activity on the schedule it returns false
	 * @param name the course's name input
	 * @param section the course's section input
	 * @return if the conditions are met it will return true, false otherwise
	 */
	public boolean addCourseToSchedule(String name, String section) {
		//Set the number of courses to an integer
		int scheduleSize = schedule.size();
		//Initialize the boolean to determine if the conditions are met. Prove otherwise
		boolean conditionsMet = true;
		//Assign the input Course
		Course c = getCourseFromCatalog(name, section);
		
		//Condition 1: if the course doesn't exist, return false
		if (c == null) {
			conditionsMet = false;
		}
		//Check condition 2 and 3
		else {
			//Iterate through the schedule
			for (int i = 0; i < scheduleSize; i++) {
				//Condition 2: if the course is already on the schedule, return false
				//Check if the course input matches any schedule courses
			    if (c.isDuplicate(schedule.get(i))) {
			    	conditionsMet = false;
			    	throw new IllegalArgumentException("You are already enrolled in " + name);
			    }
			    
			    //Condition 3: if there is a time conflict on the schedule, return false
			    try {
			    	c.checkConflict(schedule.get(i));
			    } catch (ConflictException e) {
			    	conditionsMet = false;
					throw new IllegalArgumentException("The course cannot be added due to a conflict.");
				}
			}
		}
		
		//If all conditions are met, the course will be added to schedule
		if (conditionsMet) {
			schedule.add(getCourseFromCatalog(name, section));
		}
		
		return conditionsMet;
	}
	
	/**
	 * Adds an Event to schedule if the event doesn't exist in the catalog or conflict with an
	 * exitsting Activity
	 * @param eventTitle the title of the event
	 * @param eventMeetingDays the meeting days
	 * @param eventStartTime the start time
	 * @param eventEndTime the end time
	 * @param eventDetails the event detailsS
	 */
	public void addEventToSchedule(String eventTitle, String eventMeetingDays, int eventStartTime, int eventEndTime, String eventDetails) {
		//Set the number of courses to an integer
		int scheduleSize = schedule.size();
		//Initialize the boolean to determine if the conditions are met. Prove otherwise
		boolean conditionsMet = true;
		//Assign the input Event
		Event e = new Event(eventTitle, eventMeetingDays, eventStartTime, eventEndTime, eventDetails);
		
		//Iterate through the schedule
		for (int i = 0; i < scheduleSize; i++) {
			//Check if the course input matches any schedule courses
		    if (e.isDuplicate(schedule.get(i))) {
		    	conditionsMet = false;
		    	throw new IllegalArgumentException("You have already created an event called " + eventTitle);
		    }
		    
		    //If there is a time conflict on the schedule, return false
		    try {
		    	e.checkConflict(schedule.get(i));
		    } catch (ConflictException ex) {
		    	conditionsMet = false;
				throw new IllegalArgumentException("The event cannot be added due to a conflict.");
			}
		}
		
		//If both conditions are met, the course will be added to schedule
		if (conditionsMet) {
			schedule.add(e);
		}
	}
	
	/**
	 * Removes a course from schedule if the course is found within
	 * @param idx the index to be removed from the ArrayList
	 * @return if the condition is met it will return true, false otherwise
	 */
	public boolean removeActivityFromSchedule(int idx) {
		//Initialize the boolean to determine if the condition is met. Prove otherwise
		boolean conditionMet = true;
		
		//Try and remove the index from the array list. Method returns 
		//false if invalid index is given
		try {
			schedule.remove(idx);
		} catch (IndexOutOfBoundsException e) {
			conditionMet = false;
		}
		
		return conditionMet;
	}

	/**
	 * Will clear schedule of entries
	 */
	public void resetSchedule() {
		schedule.clear();
	}

	/**
	 * Gets the schedule's title
	 * @return the title
	 */
	public String getScheduleTitle() {
		return title;
	}

	/**
	 * Sets the new title
	 * @param title is the new title
	 */
	public void setScheduleTitle(String title) {
		if (title == null) {
			throw new IllegalArgumentException("Title cannot be null.");
		}
		
		this.title = title;
	}

	/**
	 * Will send the schedule to CourseRecordIO.writeCourseRecords
	 * @param filename is the file being used
	 */
	public void exportSchedule(String filename) {
		try {
			ActivityRecordIO.writeActivityRecords(filename, schedule);
		} catch (IOException e) {
			throw new IllegalArgumentException("The file cannot be saved.");
		}
	}
}
