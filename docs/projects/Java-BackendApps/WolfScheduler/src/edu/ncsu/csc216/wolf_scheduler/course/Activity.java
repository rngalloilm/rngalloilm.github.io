package edu.ncsu.csc216.wolf_scheduler.course;

/**
 * The Activity superclass will structure the common attributes between the Courses and Events
 * @author Nick Gallo
 *
 */
public abstract class Activity implements Conflict {

	/** Activity's title. */
	private String title;
	/** Activity's meeting days */
	private String meetingDays;
	/** Activity's starting time */
	private int startTime;
	/** Activity's ending time */
	private int endTime;

	/**
	 * Constructs an Activity superclass object with values for title, meetingDays, startTime, and endTime.
	 * This will extend to Course and Event
	 * @param title title of activity
	 * @param meetingDays meeting days for activity
	 * @param startTime start time of activity
	 * @param endTime end time of activity
	 */
	public Activity(String title, String meetingDays, int startTime, int endTime) {
        super();
        setTitle(title);
        setMeetingDaysAndTime(meetingDays, startTime, endTime);
    }
	
	/**
	 * Sets up the duplicate checks made by Course and Event
	 * @param activity is the object to be compared with a list
	 * @return whether a duplicate is found within the activity. Overwritten by Course and Event.
	 */
	public abstract boolean isDuplicate(Activity activity);

	/**
	 * Returns the Activity's title.
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * Sets the Activity's title. If the title is null, no terms are in the string, or the length is 0, 
	 * an IllegalArgumentException is thrown
	 * @param title the title to set
	 * @throws IllegalArgumentException if the title parameter is null or nonexistent
	 */
	public void setTitle(String title) {
		//Conditional 1, throw if the title is null or the string literal is null
		if (title == null || "".equals(title)) {
			throw new IllegalArgumentException("Invalid title.");
		}
	
		//Conditional 2, throw if the title is null or the length of the title is 0
		if (title == null || title.length() == 0) {
			throw new IllegalArgumentException("Invalid title.");
		}
		
		this.title = title;
	}

	/**
	 * Returns the Activity's meeting days.
	 * @return the meetingDays
	 */
	public String getMeetingDays() {
		return meetingDays;
	}

	/**
	 * Returns the Activity's start time.
	 * @return the startTime
	 */
	public int getStartTime() {
		return startTime;
	}

	/**
	 * Returns the Activity's end time.
	 * @return the endTime
	 */
	public int getEndTime() {
		return endTime;
	}

	/**
	 * Sets the meeting days, start time, and end time for the Activity. Course and Event 
	 * handle their own checks
	 * @param meetingDays the days of the week for the Activity to be set
	 * @param startTime the start time of the Activity to be set
	 * @param endTime the end time of the Activity to be set
	 */
	public void setMeetingDaysAndTime(String meetingDays, int startTime, int endTime) {
			//set fields for meetingDays, startTime, and endTime
			this.meetingDays = meetingDays;
			this.startTime = startTime;
			this.endTime = endTime;
	}

	/**
	 * Creates a string using meetingDays, startTime, and endTime to create
	 * a formatted line of that information with traditional time-telling
	 * @return the meeting date and time as a string
	 */
	public String getMeetingString() {
		//Initialize the string to return and new variables to store the updated time
		String s = "";
		String startHourStr;
		String startMinStr;
		String endHourStr;
		String endMinStr;
		String periodOfDayStart = "AM";
		String periodOfDayEnd = "AM";
		
		//Apply the meeting days first
		s += meetingDays + " ";
		
		//Break apart startTime and endTime into hours and minutes //several lines of code
		int startHour = startTime / 100;
		int startMin = startTime % 100;
		int endHour = endTime / 100;
		int endMin = endTime % 100;
		
		//Update the start hour and set AM/PM
		//If military hour is afternoon, set PM
		if (startHour >= 12) {
			periodOfDayStart = "PM";
			//If military hour past the 12th hour, subtract 12
			if (startHour > 12) {
				startHour -= 12;
				periodOfDayStart = "PM";
			}
		}
		//If military hour is 0 (12 AM)
		if (startHour == 0) {
			startHour = 12;
		}
		
		//If military minutes are below ten, add a proceeding 0
		startMinStr = "";
		if (startMin < 10) {
			startMinStr += "0";
		}
		
		//Update the end hour and set AM/PM
		//If military hour is afternoon, set PM
		if (endHour >= 12) {
			periodOfDayEnd = "PM";
			//If military hour past the 12th hour, subtract 12
			if (endHour > 12) {
				endHour -= 12;
				periodOfDayEnd = "PM";
			}
		}
		//If military hour is 0 (12 AM)
		if (endHour == 0) {
			endHour = 12;
		}
		
		//If military minutes are below ten, add a proceeding 0
		endMinStr = "";
		if (endMin < 10) {
			endMinStr += "0";
		}
		
		//Convert startHour to a string
		startHourStr = Integer.toString(startHour);
		
		//Convert startMin to a string and append it
		startMinStr += Integer.toString(startMin);
		
		//Convert endHour to a string
		endHourStr = Integer.toString(endHour);
		
		//Convert endMin to a string and append it
		endMinStr += Integer.toString(endMin);
		
		//Construct the string in this format: "TH 12:00PM-1:00PM"
		s += startHourStr + ":" + startMinStr + periodOfDayStart + "-";
		s += endHourStr + ":" + endMinStr + periodOfDayEnd;
		
		//Set the string to "Arranged" if meetingDays determines it
		if ( "A".equals(meetingDays) ) {
			s = "Arranged";
		}
		
		return s;
	}
	
	@Override
	public void checkConflict(Activity possibleConflictingActivity) throws ConflictException {
		//Iterate through the meeting days of the instance Activity
		for (int i = 0; i < meetingDays.length(); i++) {
			//Get the character for the next day
			char day = meetingDays.charAt(i);
			
			//If the Activity is "arranged", skip the check
			//The conflicting Activity must be on the same day, the instance's start time and
			//end time must both lay outside the conflicting Activity's period, and
			//cannot start and end within conflicting Activity's period
			if (!meetingDays.contains(String.valueOf('A')) &&
		    	possibleConflictingActivity.getMeetingDays().indexOf(day) != -1 &&
		        (startTime >= possibleConflictingActivity.startTime && 
		        startTime <= possibleConflictingActivity.endTime ||
		        endTime >= possibleConflictingActivity.startTime && 
		        endTime <= possibleConflictingActivity.endTime ||
		        startTime <= possibleConflictingActivity.startTime &&
		        endTime >= possibleConflictingActivity.endTime)) {
		    	
		    	throw new ConflictException("Schedule conflict.");
		    }
		}
	}

	/**
	 * Used to populate the rows of the course catalog and student schedule
	 * @return array of 4 terms specific to the subclass
	 */
	public abstract String[] getShortDisplayArray();
	
	/**
	 * Used to display the final schedule
	 * @return array of 7 terms specific to the subclass 
	 */
	public abstract String[] getLongDisplayArray();

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + endTime;
		result = prime * result + ((meetingDays == null) ? 0 : meetingDays.hashCode());
		result = prime * result + startTime;
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Activity other = (Activity) obj;
		if (endTime != other.endTime)
			return false;
		if (meetingDays == null) {
			if (other.meetingDays != null)
				return false;
		} else if (!meetingDays.equals(other.meetingDays))
			return false;
		if (startTime != other.startTime)
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}

}