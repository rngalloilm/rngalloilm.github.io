/**
 * 
 */
package edu.ncsu.csc216.wolf_scheduler.course;

/**
 * This class will create the events for the scheduler,
 * using Activity as a superclass
 * @author Nick Gallo
 */
public class Event extends Activity {
	
	/** Course's name. */
	private String eventDetails;
	/** GUI short display array length */
	private static final int SHORT_DISPLAY = 4;
	/** GUI long display array length */
	private static final int LONG_DISPLAY = 7;
	/** Activity's upper hour limit */
	private static final int UPPER_HOUR = 23;
	/** Activity's upper minute limit */
	private static final int UPPER_MINUTE = 59;

	/**
	 * Constructs an Event object with values for all related fields.
	 * @param title title of event
	 * @param meetingDays meeting days for event
	 * @param startTime start time of event
	 * @param endTime end time of event
	 * @param eventDetails details of the event
	 */
	public Event(String title, String meetingDays, int startTime, int endTime, String eventDetails) {
        super(title, meetingDays, startTime, endTime);
        setEventDetails(eventDetails);
    }

	/**
	 * Returns the event's details
	 * @return the eventDetails
	 */
	public String getEventDetails() {
		return eventDetails;
	}

	/**
	 * Sets the event details. Input to this field is optional
	 * @param eventDetails the eventDetails to set
	 * @throws IllegalArgumentException if setEventDetails is null
	 */
	public void setEventDetails(String eventDetails) {
		if (eventDetails == null) {
			throw new IllegalArgumentException("Invalid event details.");
		}
		
		this.eventDetails = eventDetails;
	}
	
	@Override
    public boolean isDuplicate(Activity activity) {
        if (!(activity instanceof Event)) {
            return false;
        }
        Event other = (Event) activity;
        return this.getTitle().equals(other.getTitle());
    }

	/**
	 * Checks meeting days, start time, and end time for Activity to set them
	 * Throws IllegalArgumentException if the meetingDays parameter is null or empty, 
	 * if meetingDays has an invalid character, if there are duplicates in meetingDays, 
	 * or if startTime or endTime are outside the bounds of military
	 * time (0000 to 2359)
	 */
	@Override
	public void setMeetingDaysAndTime(String meetingDays, int startTime, int endTime) {
		//if meetingDays is null or empty string
		if (meetingDays == null || "".equals(meetingDays)) {
		    //throw IAE("Invalid meeting days and times.") // IAE = IllegalArgumentException
		    throw new IllegalArgumentException("Invalid meeting days and times.");
		}
		
	    //otherwise
		else {
			//create local variables to hold the counts for each weekday letter
			int monCount = 0;
			int tueCount = 0;
			int wedCount = 0;
			int thuCount = 0;
			int friCount = 0;
			int satCount = 0;
			int sunCount = 0;
			
			//for all characters in meetingDays
			for (int i = 0; i < meetingDays.length(); i++) {
				char currentChar = meetingDays.charAt(i);
				
				//increment weekday letter counter if you find the letter // this will take several lines of code
				if (currentChar == 'M' || currentChar == 'T' || currentChar == 'W' || currentChar == 'H' || 
					currentChar == 'F' || currentChar == 'S' || currentChar == 'U') {
					
					switch (currentChar) {
						case 'M':
							monCount++;
							break;
						case 'T':
							tueCount++;
							break;
						case 'W':
							wedCount++;
							break;
						case 'H':
							thuCount++;
							break;
						case 'F':
							friCount++;
							break;
						case 'S':
							satCount++;
							break;
						case 'U':
							sunCount++;
							break;
						default:
							throw new IllegalArgumentException("Invalid meeting days and times.");
					}
				}
				//if any invalid letters
				else {
					throw new IllegalArgumentException("Invalid meeting days and times.");
				}
			}
			
			//if any weekday letter counts are more than one, checks for duplicates
			if (monCount > 1 || tueCount > 1 || wedCount > 1 || thuCount > 1 || 
				friCount > 1 || satCount > 1 || sunCount > 1) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
		 
			//break apart startTime and endTime into hours and minutes //several lines of code
			int startHour = startTime / 100;
			int startMin = startTime % 100;
			int endHour = endTime / 100;
			int endMin = endTime % 100;
			
			if (startTime >= endTime) {
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if startHour is invalid // not between 0 and 23, inclusive
			if (startHour < 0 || startHour >= UPPER_HOUR) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
			
			//if startMin is invalid // not between 0 and 59, inclusive
			if (startMin < 0 || startMin >= UPPER_MINUTE) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if endHour is invalid // not between 0 and 23, inclusive
			if (endHour < 0 || endHour >= UPPER_HOUR) {
				//throw IAE("Invalid meeting days and times.")
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//if endMin is invalid // not between 0 and 59, inclusive
			if (endMin < 0 || endMin >= UPPER_MINUTE) {
				//throw IAE("Invalid meeting days and times.")\
				throw new IllegalArgumentException("Invalid meeting days and times.");
			}
	
			//set fields for meetingDays, startTime, and endTime
			super.setMeetingDaysAndTime(meetingDays, startTime, endTime);
		}
	}

	/**
	 * A shorter version of the array to hold Event title and 
	 * meeting string. First two indexes are empty.
	 */
	@Override
	public String[] getShortDisplayArray() {
		//Initialize the array to hold Event title, and meeting string.
		//First two indexes are empty
		String[] shortArray = new String[SHORT_DISPLAY];
		//Fill with items
		shortArray[0] = "";
		shortArray[1] = "";
		shortArray[2] = getTitle();
		shortArray[3] = getMeetingString();
		
		return shortArray;
	}

	/**
	 * An array to hold two empty strings, title, 
	 * two empty strings, meeting string, and eventDetails
	 */
	@Override
	public String[] getLongDisplayArray() {
		//Initialize the array to hold two empty strings, title, two empty strings,
		//meeting string, and eventDetails
		String[] longArray = new String[LONG_DISPLAY];
		
		//Fill with items
		longArray[0] = "";
		longArray[1] = "";
		longArray[2] = getTitle();
		longArray[3] = "";
		longArray[4] = "";
		longArray[5] = getMeetingString();
		longArray[6] = getEventDetails();
		
		return longArray;
	}

	/**
	 * Returns a comma separated value String of all Event fields.
	 * Event only has a title, meeting days, start time, end time, and details
	 * @return String representation of Event
	 */
	@Override
	public String toString() {
		return getTitle() + "," + getMeetingDays() + "," + getStartTime() + 
				"," + getEndTime() + "," + getEventDetails();
	}
}
